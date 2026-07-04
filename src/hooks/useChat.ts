'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { getSocket } from '@/lib/socket';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { chatApi, type Message } from '@/store/api/chatApi';
import { useUploadChatFileMutation } from '@/store/api/chatApi';

const senderIdOf = (m: any): string =>
  typeof m?.sender === 'object' ? m?.sender?._id : m?.sender;

const conversationIdOf = (m: any): string =>
  typeof m?.conversation === 'object' ? m?.conversation?._id : String(m?.conversation ?? '');

const newTempId = (): string => {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return `temp-${crypto.randomUUID()}`;
  } catch {
    /* ignore */
  }
  return `temp-${Date.now()}-${Math.round(Math.random() * 1e6)}`;
};

type UseChatArgs = {
  conversationId: string | null;
  meId?: string;
  otherUserId?: string;
};

/**
 * Wires the full backend chat socket surface for one active conversation:
 * presence, typing, live delivery, read receipts, edit and delete — keeping the
 * RTK Query `getMessages` cache in sync so the UI updates in real time.
 */
export function useChat({ conversationId, meId, otherUserId }: UseChatArgs) {
  const token = useAppSelector((s) => s.auth.token);
  const dispatch = useAppDispatch();
  const [uploadChatFile, { isLoading: isUploading }] = useUploadChatFileMutation();

  const [connected, setConnected] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);
  const [isOtherTyping, setIsOtherTyping] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const convIdRef = useRef<string | null>(conversationId);
  convIdRef.current = conversationId;
  const meIdRef = useRef<string | undefined>(meId);
  meIdRef.current = meId;

  // Mutate the cached message list for the active conversation.
  const patchMessages = useCallback(
    (cid: string, recipe: (data: Message[]) => void) => {
      dispatch(
        chatApi.util.updateQueryData('getMessages', { conversationId: cid }, (draft: any) => {
          if (draft?.data) recipe(draft.data as Message[]);
        }),
      );
    },
    [dispatch],
  );

  // ── Connection + global presence ────────────────────────────────────────────
  useEffect(() => {
    if (!token) return;
    const socket = getSocket(token);
    socketRef.current = socket;

    const onConnect = () => {
      setConnected(true);
      socket.emit('user:online');
      if (convIdRef.current) socket.emit('conversation:join', { conversationId: convIdRef.current });
    };
    const onDisconnect = () => setConnected(false);
    const onOnline = (ids: string[]) => setOnlineUserIds(Array.isArray(ids) ? ids : []);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('users:online', onOnline);
    if (socket.connected) onConnect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('users:online', onOnline);
    };
  }, [token]);

  // ── Per-conversation events ──────────────────────────────────────────────────
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !conversationId) return;

    socket.emit('conversation:join', { conversationId });

    const onNew = (msg: any) => {
      const cid = conversationIdOf(msg);
      if (cid !== conversationId) {
        // Message for another thread — refresh the sidebar preview/unread.
        dispatch(chatApi.util.invalidateTags(['Chat']));
        return;
      }
      patchMessages(conversationId, (data) => {
        const clean: Message = { ...msg, pending: false };
        // Reconcile an optimistic message by its tempId.
        if (msg.tempId) {
          const i = data.findIndex((m) => m._id === msg.tempId || m.tempId === msg.tempId);
          if (i !== -1) {
            data[i] = clean;
            return;
          }
        }
        if (!data.some((m) => m._id === msg._id)) data.unshift(clean);
      });
      dispatch(chatApi.util.invalidateTags(['Chat']));
    };

    const onEdited = (p: any) => {
      patchMessages(conversationId, (data) => {
        const m = data.find((x) => x._id === p._id);
        if (!m) return;
        if (p.content !== undefined) m.content = p.content;
        if (p.messageType) m.messageType = p.messageType;
        if (p.fileUrl !== undefined) {
          m.fileUrl = p.fileUrl;
          m.fileName = p.fileName;
          m.fileSize = p.fileSize;
        }
        m.isEdited = true;
      });
    };

    const onDeleted = ({ messageId, deleteFor }: { messageId: string; deleteFor: string }) => {
      patchMessages(conversationId, (data) => {
        if (deleteFor === 'everyone') {
          const m = data.find((x) => x._id === messageId);
          if (m) {
            m.isDeleted = true;
            m.content = '';
            m.fileUrl = undefined;
          }
        } else {
          const i = data.findIndex((x) => x._id === messageId);
          if (i !== -1) data.splice(i, 1);
        }
      });
    };

    const onRead = ({ conversationId: cid, userId }: { conversationId: string; userId: string }) => {
      if (cid !== conversationId || userId === meIdRef.current) return;
      // The other participant read the thread — mark my messages as seen.
      patchMessages(conversationId, (data) => {
        data.forEach((m) => {
          if (senderIdOf(m) === meIdRef.current) {
            m.isRead = true;
            m.status = 'read';
          }
        });
      });
    };

    const onTypingStart = ({ userId }: { userId: string }) => {
      if (userId !== meIdRef.current) setIsOtherTyping(true);
    };
    const onTypingStop = ({ userId }: { userId: string }) => {
      if (userId !== meIdRef.current) setIsOtherTyping(false);
    };

    socket.on('message:new', onNew);
    socket.on('message:edited', onEdited);
    socket.on('message:deleted', onDeleted);
    socket.on('messages:read', onRead);
    socket.on('typing:start', onTypingStart);
    socket.on('typing:stop', onTypingStop);

    return () => {
      socket.emit('conversation:leave', { conversationId });
      socket.off('message:new', onNew);
      socket.off('message:edited', onEdited);
      socket.off('message:deleted', onDeleted);
      socket.off('messages:read', onRead);
      socket.off('typing:start', onTypingStart);
      socket.off('typing:stop', onTypingStop);
      setIsOtherTyping(false);
    };
  }, [conversationId, dispatch, patchMessages]);

  // ── Actions ──────────────────────────────────────────────────────────────────
  const optimistic = useCallback(
    (cid: string, partial: Partial<Message>): string => {
      const tempId = newTempId();
      patchMessages(cid, (data) => {
        data.unshift({
          _id: tempId,
          tempId,
          conversation: cid,
          sender: meIdRef.current as any,
          messageType: 'text',
          status: 'sent',
          isRead: false,
          isEdited: false,
          isDeleted: false,
          pending: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...partial,
        } as Message);
      });
      return tempId;
    },
    [patchMessages],
  );

  const sendText = useCallback(
    (text: string) => {
      const socket = socketRef.current;
      const cid = convIdRef.current;
      const value = text.trim();
      if (!socket || !cid || !value) return;
      const tempId = optimistic(cid, { content: value, messageType: 'text' });
      socket.emit('message:send', { conversationId: cid, content: value, messageType: 'text', tempId });
      socket.emit('typing:stop', { conversationId: cid });
    },
    [optimistic],
  );

  const sendFile = useCallback(
    async (file: File, caption?: string) => {
      const socket = socketRef.current;
      const cid = convIdRef.current;
      if (!socket || !cid || !file) return;
      const uploaded = await uploadChatFile(file).unwrap();
      const tempId = optimistic(cid, {
        content: caption?.trim() || undefined,
        messageType: uploaded.messageType,
        fileUrl: uploaded.fileUrl,
        fileName: uploaded.fileName,
        fileSize: uploaded.fileSize,
      });
      socket.emit('message:send', {
        conversationId: cid,
        content: caption?.trim() || undefined,
        messageType: uploaded.messageType,
        fileUrl: uploaded.fileUrl,
        fileName: uploaded.fileName,
        fileSize: uploaded.fileSize,
        tempId,
      });
    },
    [optimistic, uploadChatFile],
  );

  const editMessage = useCallback(
    async (messageId: string, content: string, file?: File) => {
      const socket = socketRef.current;
      const cid = convIdRef.current;
      if (!socket || !cid) return;
      const value = content.trim();

      // Upload a replacement attachment first, if one was chosen.
      let filePayload:
        | { fileUrl: string; fileName: string; fileSize: number; messageType: 'image' | 'pdf' | 'file' }
        | undefined;
      if (file) {
        const uploaded = await uploadChatFile(file).unwrap();
        filePayload = {
          fileUrl: uploaded.fileUrl,
          fileName: uploaded.fileName,
          fileSize: uploaded.fileSize,
          messageType: uploaded.messageType,
        };
      }

      // Optimistic edit.
      patchMessages(cid, (data) => {
        const m = data.find((x) => x._id === messageId);
        if (!m) return;
        m.content = value || undefined;
        m.isEdited = true;
        if (filePayload) Object.assign(m, filePayload);
      });

      socket.emit('message:edit', { messageId, content: value, ...(filePayload ?? {}) });
    },
    [patchMessages, uploadChatFile],
  );

  const deleteMessage = useCallback(
    (messageId: string, deleteFor: 'me' | 'everyone') => {
      const socket = socketRef.current;
      const cid = convIdRef.current;
      if (!socket || !cid) return;
      patchMessages(cid, (data) => {
        if (deleteFor === 'everyone') {
          const m = data.find((x) => x._id === messageId);
          if (m) {
            m.isDeleted = true;
            m.content = '';
            m.fileUrl = undefined;
          }
        } else {
          const i = data.findIndex((x) => x._id === messageId);
          if (i !== -1) data.splice(i, 1);
        }
      });
      socket.emit('message:delete', { messageId, deleteFor });
    },
    [patchMessages],
  );

  const markRead = useCallback(() => {
    const socket = socketRef.current;
    const cid = convIdRef.current;
    if (socket && cid) socket.emit('messages:read', { conversationId: cid });
  }, []);

  // Typing: emit start, auto-stop after a short idle.
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notifyTyping = useCallback(() => {
    const socket = socketRef.current;
    const cid = convIdRef.current;
    if (!socket || !cid) return;
    socket.emit('typing:start', { conversationId: cid });
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit('typing:stop', { conversationId: cid });
    }, 1500);
  }, []);

  const isOtherOnline = !!otherUserId && onlineUserIds.includes(otherUserId);

  return {
    connected,
    onlineUserIds,
    isOtherOnline,
    isOtherTyping,
    isUploading,
    sendText,
    sendFile,
    editMessage,
    deleteMessage,
    markRead,
    notifyTyping,
  };
}
