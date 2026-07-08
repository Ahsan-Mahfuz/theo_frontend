'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search01Icon, Add01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AppImage, AVATAR_PLACEHOLDER } from '@/components/ui/app-image';
import { Skeleton, SkeletonCircle } from '@/components/ui/skeleton';
import {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useMarkConversationReadMutation,
  type Message,
} from '@/store/api/chatApi';
import { useGetMeQuery } from '@/store/api/authApi';
import { resolveAssetUrl } from '@/lib/config';
import { useChat } from '@/hooks/useChat';

/* eslint-disable @typescript-eslint/no-explicit-any */
const participantName = (p: any): string =>
  p?.name || [p?.firstName, p?.lastName].filter(Boolean).join(' ') || 'User';

const participantId = (p: any): string | undefined =>
  typeof p === 'object' ? p?._id : p;

const participantAvatar = (p: any): string =>
  resolveAssetUrl(p?.profileImage) ||
  `https://ui-avatars.com/api/?background=E5E7EB&color=6B7280&name=${encodeURIComponent(participantName(p))}`;

const senderIdOf = (m: Message): string | undefined =>
  typeof m.sender === 'object' ? (m.sender as any)?._id : (m.sender as any);

const formatSize = (bytes?: number): string => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatTime = (iso?: string): string => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function MessagePage() {
  const searchParams = useSearchParams();
  const requestedConversationId = searchParams.get('conversationId');

  const { data: me } = useGetMeQuery();
  const { data: conversationsData, isLoading: isLoadingConversations } = useGetConversationsQuery({});
  const conversations = conversationsData?.data ?? [];

  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    requestedConversationId,
  );
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<{ id: string; messageType: string; hasFile: boolean } | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [markConversationRead] = useMarkConversationReadMutation();

  const activeConversation = conversations.find((c) => c._id === activeConversationId);
  const otherUserId = participantId(activeConversation?.otherParticipant);

  // Stable list of all my conversation ids — passed to useChat so it can join
  // every conversation room and keep background threads live. Keyed by the joined
  // ids so the reference only changes when a conversation is added/removed.
  const conversationIdsKey = conversations.map((c) => c._id).join(',');
  const conversationIds = useMemo(
    () => (conversationIdsKey ? conversationIdsKey.split(',') : []),
    [conversationIdsKey],
  );

  const {
    isOtherOnline,
    isOtherTyping,
    onlineUserIds,
    isUploading,
    sendText,
    sendFile,
    editMessage,
    deleteMessage,
    markRead,
    notifyTyping,
  } = useChat({
    conversationId: activeConversationId,
    meId: me?._id,
    otherUserId,
    conversationIds,
  });

  // Open the conversation requested via ?conversationId= (e.g. a "Message" button).
  useEffect(() => {
    if (requestedConversationId) setActiveConversationId(requestedConversationId);
  }, [requestedConversationId]);

  // Otherwise default to the first conversation once loaded.
  useEffect(() => {
    if (!activeConversationId && conversations.length > 0) {
      setActiveConversationId(conversations[0]._id);
    }
  }, [activeConversationId, conversations]);

  // Filter the sidebar by participant name.
  const filteredConversations = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) =>
      participantName(c.otherParticipant).toLowerCase().includes(q),
    );
  }, [conversations, search]);

  const { data: messagesData, isLoading: isLoadingMessages } = useGetMessagesQuery(
    { conversationId: activeConversationId as string },
    // Always reload when opening/switching a thread so a background conversation
    // that received new messages (while we weren't subscribed to it) never shows
    // a stale cached list. Realtime patches keep the active thread live on top.
    { skip: !activeConversationId, refetchOnMountOrArgChange: true },
  );

  const messages = useMemo(
    () =>
      [...(messagesData?.data ?? [])]
        .reverse()
        // Drop empty ghost messages (no text, no attachment, not a deletion tombstone).
        .filter((m) => m.isDeleted || (m.content && m.content.trim()) || m.fileUrl),
    [messagesData],
  );

  // Index of my most recent message — where the read receipt shows.
  const lastMineIndex = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (senderIdOf(messages[i]) === me?._id) return i;
    }
    return -1;
  }, [messages, me?._id]);

  // Mark read (REST for the unread badge + socket for the other side's receipt)
  // whenever the thread opens or a new message arrives while viewing.
  useEffect(() => {
    if (!activeConversationId) return;
    markConversationRead(activeConversationId);
    markRead();
  }, [activeConversationId, messages.length, markConversationRead, markRead]);

  // Auto-scroll to the newest message.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, isOtherTyping, activeConversationId]);

  // Build/tear down an object URL for the staged image preview.
  useEffect(() => {
    if (pendingFile && pendingFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(pendingFile);
      setPendingPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPendingPreview(null);
  }, [pendingFile]);

  const clearPendingFile = () => setPendingFile(null);

  // Reset composer when switching conversations.
  useEffect(() => {
    setEditing(null);
    setText('');
    setMenuOpenId(null);
    setPendingFile(null);
  }, [activeConversationId]);

  const submitComposer = async () => {
    const value = text.trim();
    if (!activeConversationId) return;

    // Editing an existing message — optionally replacing its attachment.
    if (editing) {
      // A text message must keep some text; a file message may lose its caption.
      if (editing.messageType === 'text' && !pendingFile && !value) return;
      const replacement = pendingFile ?? undefined;
      const id = editing.id;
      setEditing(null);
      setPendingFile(null);
      setText('');
      await editMessage(id, value, replacement);
      return;
    }

    // A staged file sends (optionally with the text as its caption).
    if (pendingFile) {
      const file = pendingFile;
      setPendingFile(null);
      setText('');
      await sendFile(file, value);
      return;
    }

    if (!value) return;
    sendText(value);
    setText('');
  };

  // Stage the picked file. When editing, it becomes the replacement attachment;
  // otherwise it is a new message. Either way it is only sent on submit.
  const onPickFile = (file?: File) => {
    if (!file || !activeConversationId) return;
    setPendingFile(file);
  };

  const startEdit = (m: Message) => {
    setEditing({ id: m._id, messageType: m.messageType, hasFile: !!m.fileUrl });
    setText(m.content ?? '');
    setPendingFile(null);
    setMenuOpenId(null);
  };

  const cancelEdit = () => {
    setEditing(null);
    setText('');
    setPendingFile(null);
  };

  const statusLine = isOtherTyping
    ? { text: 'typing…', className: 'text-[#0084FF]' }
    : isOtherOnline
      ? { text: 'Online', className: 'text-[#48C79D]' }
      : { text: 'Offline', className: 'text-gray-400' };

  return (
    <main
      className="w-full px-8 py-10 animate-in fade-in duration-500 h-[calc(100vh-80px)] flex flex-col"
      onClick={() => setMenuOpenId(null)}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 shrink-0">
        <h1 className="text-[32px] font-bold text-gray-900">Message</h1>
        <div className="flex items-center w-full md:w-[280px] h-11 bg-white border border-gray-200 rounded-xl px-4 gap-2 shadow-sm focus-within:border-[#0084FF] transition-colors">
          <HugeiconsIcon icon={Search01Icon} className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-[13px] text-gray-800 placeholder-gray-400 outline-none w-full h-full"
          />
        </div>
      </div>

      {/* Messaging Layout */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">

        {/* Left Sidebar (Chat List) */}
        <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
          {isLoadingConversations ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-full p-4 rounded-2xl flex justify-between items-start border border-gray-100 bg-white">
                <div className="flex items-center gap-3">
                  <SkeletonCircle size={40} />
                  <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-3 w-24 rounded" />
                    <Skeleton className="h-3 w-40 rounded" />
                  </div>
                </div>
              </div>
            ))
          ) : conversations.length === 0 ? (
            <div className="text-[13px] text-gray-400 p-4">No conversations yet.</div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-[13px] text-gray-400 p-4">No conversations match “{search}”.</div>
          ) : (
            filteredConversations.map((conversation) => {
              const participant = conversation.otherParticipant;
              const isActive = conversation._id === activeConversationId;
              const online = !!participantId(participant) && onlineUserIds.includes(participantId(participant) as string);
              return (
                <div
                  key={conversation._id}
                  onClick={() => setActiveConversationId(conversation._id)}
                  className={`w-full p-4 rounded-2xl flex justify-between items-start cursor-pointer border ${isActive ? 'bg-[#F2F2F2] border-transparent' : 'bg-white border-gray-100 hover:border-gray-200'} transition-colors`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full overflow-hidden relative">
                        <AppImage src={participantAvatar(participant)} alt={participantName(participant)} fill sizes="40px" className="object-cover" placeholderSrc={AVATAR_PLACEHOLDER} />
                      </div>
                      {online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#48C79D] border-2 border-white" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-gray-900">{participantName(participant)}</span>
                      <span className="text-[12px] text-gray-500 line-clamp-1 max-w-[160px]">{conversation.lastMessage || 'Sent you a message'}</span>
                    </div>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <span className="text-[11px] text-white bg-[#0084FF] rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center mt-1">{conversation.unreadCount}</span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right Area (Active Chat) */}
        <div className="flex-1 bg-white border border-gray-100 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">

          {/* Chat Header */}
          <div className="h-20 border-b border-gray-100 px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden relative">
                  {activeConversation && (
                    <AppImage src={participantAvatar(activeConversation.otherParticipant)} alt={participantName(activeConversation.otherParticipant)} fill sizes="48px" className="object-cover" placeholderSrc={AVATAR_PLACEHOLDER} />
                  )}
                </div>
                {activeConversation && isOtherOnline && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#48C79D] border-2 border-white" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-bold text-gray-900">{activeConversation ? participantName(activeConversation.otherParticipant) : 'Select a conversation'}</span>
                {activeConversation && (
                  <span className={`text-[12px] font-medium ${statusLine.className}`}>{statusLine.text}</span>
                )}
              </div>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 bg-white flex flex-col gap-1.5 custom-scrollbar">
            {!activeConversationId ? (
              <div className="text-[13px] text-gray-400 m-auto">Select a conversation to start chatting.</div>
            ) : isLoadingMessages ? (
              <>
                <div className="flex justify-start"><Skeleton className="h-9 w-40 rounded-2xl rounded-bl-sm" /></div>
                <div className="flex justify-end"><Skeleton className="h-9 w-52 rounded-2xl rounded-br-sm" /></div>
                <div className="flex justify-start"><Skeleton className="h-9 w-32 rounded-2xl rounded-bl-sm" /></div>
                <div className="flex justify-end"><Skeleton className="h-9 w-44 rounded-2xl rounded-br-sm" /></div>
              </>
            ) : messages.length === 0 ? (
              <div className="text-[13px] text-gray-400 m-auto">No messages yet. Say hello!</div>
            ) : (
              messages.map((message, index) => {
                const isMine = senderIdOf(message) === me?._id;
                const fileUrl = message.fileUrl ? resolveAssetUrl(message.fileUrl) : '';
                const isImage = message.messageType === 'image' && !!fileUrl && !message.isDeleted;
                const isFile = !!fileUrl && !isImage && !message.isDeleted;
                const tone = isMine ? 'bg-[#0084FF] text-white rounded-br-sm' : 'bg-[#F2F2F2] text-gray-800 rounded-bl-sm';
                const pad = isImage && !message.content ? 'p-1' : 'px-4 py-2.5';
                const canEdit = isMine && !message.isDeleted && !message.pending;
                const canDelete = isMine && !message.isDeleted && !message.pending;
                const showReceipt = isMine && index === lastMineIndex && !message.isDeleted;

                return (
                  <div key={message._id} className={`group flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                    <div className={`flex items-center gap-1.5 max-w-[85%] ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`min-w-0 ${pad} rounded-2xl text-[13px] [overflow-wrap:anywhere] ${tone} ${message.pending ? 'opacity-60' : ''}`}>
                        {message.isDeleted ? (
                          <span className="italic opacity-70">This message was deleted</span>
                        ) : (
                          <>
                            {isImage && (
                              <a href={fileUrl} target="_blank" rel="noreferrer" className="block">
                                <span className="block relative w-[220px] max-w-full aspect-square rounded-xl overflow-hidden bg-black/5">
                                  <AppImage src={fileUrl} alt={message.fileName || 'Image'} fill sizes="220px" className="object-cover" />
                                </span>
                              </a>
                            )}
                            {isFile && (
                              <a href={fileUrl} target="_blank" rel="noreferrer" download className="flex items-center gap-2.5">
                                <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isMine ? 'bg-white/20' : 'bg-white'}`}>
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                  </svg>
                                </span>
                                <span className="flex flex-col min-w-0">
                                  <span className="font-medium truncate max-w-[160px]">{message.fileName || 'Attachment'}</span>
                                  {message.fileSize ? (
                                    <span className={`text-[11px] ${isMine ? 'text-white/70' : 'text-gray-400'}`}>{formatSize(message.fileSize)}</span>
                                  ) : null}
                                </span>
                              </a>
                            )}
                            {message.content && (
                              <span className={`whitespace-pre-wrap ${isImage || isFile ? 'block mt-1.5' : ''}`}>{message.content}</span>
                            )}
                            {message.isEdited && (
                              <span className={`ml-1.5 text-[10px] align-baseline ${isMine ? 'text-white/60' : 'text-gray-400'}`}>· edited</span>
                            )}
                          </>
                        )}
                      </div>

                      {/* Actions menu (own, non-deleted messages) */}
                      {(canEdit || canDelete) && (
                        <div className="relative shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === message._id ? null : message._id); }}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"
                            title="Message options"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></svg>
                          </button>
                          {menuOpenId === message._id && (
                            <div className="absolute z-20 top-7 right-0 w-40 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-gray-100 py-1.5 flex flex-col overflow-hidden">
                              {canEdit && (
                                <button onClick={(e) => { e.stopPropagation(); startEdit(message); }} className="w-full text-left px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-50">Edit</button>
                              )}
                              {canDelete && (
                                <>
                                  <button onClick={(e) => { e.stopPropagation(); deleteMessage(message._id, 'everyone'); setMenuOpenId(null); }} className="w-full text-left px-4 py-2 text-[12px] text-red-600 hover:bg-red-50">Delete for everyone</button>
                                  <button onClick={(e) => { e.stopPropagation(); deleteMessage(message._id, 'me'); setMenuOpenId(null); }} className="w-full text-left px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-50">Delete for me</button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Timestamp + read receipt */}
                    <div className={`flex items-center gap-1.5 mt-0.5 px-1 ${isMine ? 'flex-row-reverse' : ''}`}>
                      <span className="text-[10px] text-gray-300">{formatTime(message.createdAt)}</span>
                      {showReceipt && (
                        <span className="text-[10px] text-gray-400">
                          {message.pending ? 'Sending…' : message.status === 'read' || message.isRead ? 'Seen' : 'Sent'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {/* Typing indicator */}
            {activeConversationId && isOtherTyping && (
              <div className="flex justify-start">
                <div className="bg-[#F2F2F2] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-6 bg-white shrink-0">
            {editing && (
              <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 mb-2">
                <span className="text-[12px] text-[#0084FF] font-medium truncate">
                  {editing.hasFile ? 'Editing message — attach a file to replace the current one' : 'Editing message'}
                </span>
                <button onClick={cancelEdit} className="text-[12px] text-gray-500 hover:text-gray-800 shrink-0 ml-3">Cancel</button>
              </div>
            )}
            {pendingFile && (
              <div className="flex items-center gap-3 bg-[#F2F2F2] border border-gray-200 rounded-xl px-3 py-2 mb-2">
                {pendingPreview ? (
                  <img src={pendingPreview} alt={pendingFile.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                ) : (
                  <span className="w-12 h-12 rounded-lg bg-white flex items-center justify-center shrink-0 text-gray-500">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                  </span>
                )}
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[12px] font-medium text-gray-800 truncate">{pendingFile.name}</span>
                  <span className="text-[11px] text-gray-400">{formatSize(pendingFile.size)} · {editing ? 'replacement — press send to save' : 'add a caption or press send'}</span>
                </div>
                <button onClick={clearPendingFile} title="Remove file" className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-200 shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
            )}
            <div className="w-full bg-[#F2F2F2] rounded-[32px] p-2 pr-2.5 flex items-center gap-4 h-16">
              <input
                type="text"
                placeholder={editing ? 'Edit your message…' : pendingFile ? 'Add a caption…' : 'Type Message'}
                value={text}
                onChange={(e) => { setText(e.target.value); notifyTyping(); }}
                onKeyDown={(e) => { if (e.key === 'Enter') submitComposer(); if (e.key === 'Escape') { if (editing) cancelEdit(); else if (pendingFile) clearPendingFile(); } }}
                disabled={!activeConversationId}
                className="flex-1 bg-transparent border-none outline-none text-[14px] text-gray-800 placeholder-gray-500 pl-6"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={(e) => { onPickFile(e.target.files?.[0]); e.target.value = ''; }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || !activeConversationId || !!pendingFile}
                title={editing ? 'Replace the attachment' : 'Attach a file or image'}
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <HugeiconsIcon icon={Add01Icon} className="w-5 h-5 text-gray-800" />
              </button>
              <button
                onClick={submitComposer}
                disabled={
                  !activeConversationId || isUploading ||
                  (editing
                    ? editing.messageType === 'text' && !text.trim() && !pendingFile
                    : !text.trim() && !pendingFile)
                }
                className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 hover:shadow-md transition-shadow disabled:opacity-60"
                title={editing ? 'Save edit' : 'Send'}
              >
                <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4 text-[#0084FF]" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </main>
  );
}
