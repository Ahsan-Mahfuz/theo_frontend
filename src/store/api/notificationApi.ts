import { baseApi } from './baseApi';
import type { ApiEnvelope } from '../types';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AppNotification {
  _id: string;
  user: string;
  title: string;
  message: string;
  type: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NotificationList {
  data: AppNotification[];
  unreadCount: number;
  meta: { page: number; limit: number; total: number; totalPage: number };
}

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      NotificationList,
      { page?: number; limit?: number; isRead?: boolean } | void
    >({
      query: (params) => ({ url: '/notification', params: params ?? {} }),
      transformResponse: (res: ApiEnvelope<NotificationList>) => res.data,
      providesTags: ['Notification'],
    }),

    markNotificationRead: builder.mutation<ApiEnvelope<null>, string>({
      query: (id) => ({ url: `/notification/${id}/read`, method: 'PATCH' }),
      invalidatesTags: ['Notification'],
    }),

    markAllNotificationsRead: builder.mutation<ApiEnvelope<null>, void>({
      query: () => ({ url: '/notification/read-all', method: 'PATCH' }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationApi;
