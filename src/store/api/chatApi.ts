import { baseApi } from './baseApi';
import type { ApiEnvelope, Paginated } from '../types';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Conversation {
  _id: string;
  participants: any[];
  otherParticipant: any | null;
  unreadCount: number;
  lastMessage?: string;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  conversation: string;
  sender: any;
  content?: string;
  messageType: 'text' | 'image' | 'pdf' | 'file';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  status: 'sent' | 'delivered' | 'read';
  isRead: boolean;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  /** Client-only: set on optimistic messages awaiting server confirmation. */
  pending?: boolean;
  /** Client-only: correlation id used to reconcile the optimistic message. */
  tempId?: string;
}

export interface UploadedFile {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  messageType: 'image' | 'pdf' | 'file';
}

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    startConversation: builder.mutation<Conversation, { receiverId: string }>({
      query: (body) => ({ url: '/chat/conversation', method: 'POST', body }),
      transformResponse: (res: ApiEnvelope<Conversation>) => res.data,
      invalidatesTags: ['Chat'],
    }),

    getConversations: builder.query<
      Paginated<Conversation>,
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({ url: '/chat/conversations', params: params ?? {} }),
      transformResponse: (res: ApiEnvelope<Paginated<Conversation>>) => res.data,
      providesTags: ['Chat'],
    }),

    getMessages: builder.query<
      Paginated<Message>,
      { conversationId: string; page?: number; limit?: number }
    >({
      query: ({ conversationId, ...params }) => ({
        url: `/chat/${conversationId}/messages`,
        params,
      }),
      transformResponse: (res: ApiEnvelope<Paginated<Message>>) => res.data,
      providesTags: (_r, _e, { conversationId }) => [{ type: 'Message', id: conversationId }],
    }),

    sendMessage: builder.mutation<
      Message,
      { conversationId: string; text?: string; file?: File }
    >({
      query: ({ conversationId, text, file }) => {
        const fd = new FormData();
        if (text) fd.append('text', text);
        if (file) fd.append('file', file);
        return { url: `/chat/${conversationId}/messages`, method: 'POST', body: fd };
      },
      transformResponse: (res: ApiEnvelope<Message>) => res.data,
      invalidatesTags: (_r, _e, { conversationId }) => [
        { type: 'Message', id: conversationId },
        'Chat',
      ],
    }),

    markConversationRead: builder.mutation<ApiEnvelope<null>, string>({
      query: (conversationId) => ({ url: `/chat/${conversationId}/read`, method: 'PATCH' }),
      invalidatesTags: ['Chat'],
    }),

    // Upload an attachment; returns the fileUrl to send via socket message:send.
    uploadChatFile: builder.mutation<UploadedFile, File>({
      query: (file) => {
        const fd = new FormData();
        fd.append('file', file);
        return { url: '/chat/upload', method: 'POST', body: fd };
      },
      transformResponse: (res: ApiEnvelope<UploadedFile>) => res.data,
    }),
  }),
});

export const {
  useStartConversationMutation,
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkConversationReadMutation,
  useUploadChatFileMutation,
} = chatApi;
