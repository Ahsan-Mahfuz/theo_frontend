import { baseApi } from './baseApi';
import type { ApiEnvelope, Paginated, CleaningSchedule } from '../types';

export interface CreateSchedulePayload {
  accommodationId: string;
  cleanerId: string;
  date: string;
  checkInTime: string; // HH:mm
  checkOutTime: string; // HH:mm
  notes?: string;
  bookingId?: string;
}

export const scheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Host: create a cleaning schedule for an accommodation.
    createSchedule: builder.mutation<CleaningSchedule, CreateSchedulePayload>({
      query: ({ accommodationId, ...body }) => ({
        url: `/schedule/${accommodationId}`,
        method: 'POST',
        body,
      }),
      transformResponse: (res: ApiEnvelope<CleaningSchedule>) => res.data,
      invalidatesTags: ['Schedule', 'Calendar', 'Accommodation', 'HostDashboard'],
    }),

    // Host: list schedules (?status & accommodationId & page & limit).
    getHostSchedules: builder.query<
      Paginated<CleaningSchedule>,
      {
        status?: string;
        // Named lifecycle bucket for the planning-list tabs.
        view?: 'awaiting' | 'accepted' | 'pay_now' | 'paid';
        accommodationId?: string;
        page?: number;
        limit?: number;
      } | void
    >({
      query: (params) => ({ url: '/schedule/host', params: params ?? {} }),
      transformResponse: (res: ApiEnvelope<Paginated<CleaningSchedule>>) => res.data,
      providesTags: ['Schedule'],
    }),

    getScheduleById: builder.query<CleaningSchedule, string>({
      query: (id) => `/schedule/${id}`,
      transformResponse: (res: ApiEnvelope<CleaningSchedule>) => res.data,
      // Also provide the generic 'Schedule' tag so list-level invalidations
      // (complete / invalidate / pay) refetch this detail view too.
      providesTags: (_r, _e, id) => [{ type: 'Schedule', id }, 'Schedule'],
    }),

    // Host: mark a paid schedule as complete (releases the payout).
    completeSchedule: builder.mutation<CleaningSchedule, string>({
      query: (id) => ({ url: `/schedule/${id}/complete`, method: 'PATCH' }),
      transformResponse: (res: ApiEnvelope<CleaningSchedule>) => res.data,
      invalidatesTags: ['Schedule', 'Calendar', 'Payment', 'HostDashboard'],
    }),

    // Host: reject the submitted proof — sends the job back to the cleaner.
    invalidateProof: builder.mutation<CleaningSchedule, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/schedule/${id}/invalidate`,
        method: 'PATCH',
        body: { reason },
      }),
      transformResponse: (res: ApiEnvelope<CleaningSchedule>) => res.data,
      invalidatesTags: ['Schedule', 'Calendar', 'HostDashboard'],
    }),

    // Host: edit a schedule (only while still "scheduled").
    updateSchedule: builder.mutation<
      CleaningSchedule,
      {
        id: string;
        cleanerId?: string;
        date?: string;
        checkInTime?: string;
        checkOutTime?: string;
        notes?: string;
      }
    >({
      query: ({ id, ...body }) => ({ url: `/schedule/${id}`, method: 'PATCH', body }),
      transformResponse: (res: ApiEnvelope<CleaningSchedule>) => res.data,
      invalidatesTags: ['Schedule', 'Calendar'],
    }),

    deleteSchedule: builder.mutation<ApiEnvelope<null>, string>({
      query: (id) => ({ url: `/schedule/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Schedule', 'Calendar', 'Accommodation', 'HostDashboard'],
    }),

    initiateHandCash: builder.mutation<CleaningSchedule, string>({
      query: (id) => ({ url: `/schedule/${id}/handcash`, method: 'POST' }),
      transformResponse: (res: ApiEnvelope<CleaningSchedule>) => res.data,
      invalidatesTags: ['Schedule', 'Calendar', 'HostDashboard'],
    }),

    approveHandCash: builder.mutation<CleaningSchedule, string>({
      query: (id) => ({ url: `/schedule/${id}/handcash/approve`, method: 'POST' }),
      transformResponse: (res: ApiEnvelope<CleaningSchedule>) => res.data,
      invalidatesTags: ['Schedule', 'Calendar'],
    }),
  }),
});

export const {
  useCreateScheduleMutation,
  useGetHostSchedulesQuery,
  useGetScheduleByIdQuery,
  useCompleteScheduleMutation,
  useInvalidateProofMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
  useInitiateHandCashMutation,
  useApproveHandCashMutation,
} = scheduleApi;
