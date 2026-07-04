import { baseApi } from './baseApi';
import type { ApiEnvelope, CalendarConnection } from '../types';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const calendarApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConnections: builder.query<CalendarConnection[], string>({
      query: (accommodationId) => `/calendar/${accommodationId}/connections`,
      transformResponse: (res: ApiEnvelope<CalendarConnection[]>) => res.data,
      providesTags: ['Calendar'],
    }),

    addConnection: builder.mutation<
      CalendarConnection,
      { accommodationId: string; platform?: string; label?: string; icalUrl: string }
    >({
      query: ({ accommodationId, ...body }) => ({
        url: `/calendar/${accommodationId}/connections`,
        method: 'POST',
        body,
      }),
      transformResponse: (res: ApiEnvelope<CalendarConnection>) => res.data,
      invalidatesTags: ['Calendar'],
    }),

    removeConnection: builder.mutation<ApiEnvelope<null>, string>({
      query: (connectionId) => ({
        url: `/calendar/connections/${connectionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Calendar'],
    }),

    syncCalendars: builder.mutation<{ message: string; connections: number }, string>({
      query: (accommodationId) => ({ url: `/calendar/${accommodationId}/sync`, method: 'POST' }),
      transformResponse: (res: ApiEnvelope<{ message: string; connections: number }>) => res.data,
      invalidatesTags: ['Calendar'],
    }),

    getCalendarMonth: builder.query<
      any,
      { accommodationId: string; year?: number; month?: number }
    >({
      query: ({ accommodationId, ...params }) => ({
        url: `/calendar/${accommodationId}/month`,
        params,
      }),
      transformResponse: (res: ApiEnvelope<any>) => res.data,
      providesTags: ['Calendar'],
    }),

    getCalendarList: builder.query<
      any,
      { accommodationId: string; year?: number; month?: number }
    >({
      query: ({ accommodationId, ...params }) => ({
        url: `/calendar/${accommodationId}/list`,
        params,
      }),
      transformResponse: (res: ApiEnvelope<any>) => res.data,
      providesTags: ['Calendar'],
    }),
  }),
});

export const {
  useGetConnectionsQuery,
  useAddConnectionMutation,
  useRemoveConnectionMutation,
  useSyncCalendarsMutation,
  useGetCalendarMonthQuery,
  useGetCalendarListQuery,
} = calendarApi;
