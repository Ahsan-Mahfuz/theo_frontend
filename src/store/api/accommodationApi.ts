import { baseApi } from './baseApi';
import type { ApiEnvelope, Accommodation, Paginated } from '../types';

// Common list query params for the host listing endpoints.
export interface AccommodationListParams {
  status?: 'scheduled' | 'not_scheduled';
  accommodationType?: string;
  city?: string;
  search?: string;
  cleanerStage?: 'new' | 'assigned' | 'accepted';
  isCleanerAssigned?: boolean;
  page?: number;
  limit?: number;
}

export interface HostDashboard {
  recommended_schedule: unknown[];
  to_do: Paginated<unknown>;
}

export const accommodationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create — multipart/form-data with optional photos[]. Pass a ready FormData.
    createAccommodation: builder.mutation<Accommodation, FormData>({
      query: (body) => ({ url: '/accommodation', method: 'POST', body }),
      transformResponse: (res: ApiEnvelope<Accommodation>) => res.data,
      invalidatesTags: ['Accommodation', 'HostDashboard'],
    }),

    // Generic list (honours ?status, ?search, etc.).
    getAccommodations: builder.query<
      Paginated<Accommodation>,
      AccommodationListParams | void
    >({
      query: (params) => ({ url: '/accommodation', params: params ?? {} }),
      transformResponse: (res: ApiEnvelope<Paginated<Accommodation>>) => res.data,
      providesTags: ['Accommodation'],
    }),

    // Housing view — created + cleaner-assignment stage (status = not_scheduled).
    getHousing: builder.query<
      Paginated<Accommodation>,
      AccommodationListParams | void
    >({
      query: (params) => ({ url: '/accommodation/housing', params: params ?? {} }),
      transformResponse: (res: ApiEnvelope<Paginated<Accommodation>>) => res.data,
      providesTags: ['Accommodation'],
    }),

    // Planning view — from cleaner acceptance → completion (status = scheduled).
    getPlanning: builder.query<
      Paginated<Accommodation>,
      AccommodationListParams | void
    >({
      query: (params) => ({ url: '/accommodation/planning', params: params ?? {} }),
      transformResponse: (res: ApiEnvelope<Paginated<Accommodation>>) => res.data,
      providesTags: ['Accommodation'],
    }),

    // Host home — recommended schedule + to-do activity feed.
    getHostDashboard: builder.query<
      HostDashboard,
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: '/accommodation/dashboard',
        params: params ?? {},
      }),
      transformResponse: (res: ApiEnvelope<HostDashboard>) => res.data,
      providesTags: ['HostDashboard'],
    }),

    getAccommodationById: builder.query<Accommodation, string>({
      query: (id) => `/accommodation/${id}`,
      transformResponse: (res: ApiEnvelope<Accommodation>) => res.data,
      providesTags: (_r, _e, id) => [{ type: 'Accommodation', id }],
    }),

    updateAccommodation: builder.mutation<
      Accommodation,
      { id: string; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `/accommodation/${id}`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (res: ApiEnvelope<Accommodation>) => res.data,
      invalidatesTags: ['Accommodation', 'HostDashboard'],
    }),

    deleteAccommodation: builder.mutation<ApiEnvelope<null>, string>({
      query: (id) => ({ url: `/accommodation/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Accommodation', 'HostDashboard'],
    }),
  }),
});

export const {
  useCreateAccommodationMutation,
  useGetAccommodationsQuery,
  useGetHousingQuery,
  useGetPlanningQuery,
  useGetHostDashboardQuery,
  useGetAccommodationByIdQuery,
  useUpdateAccommodationMutation,
  useDeleteAccommodationMutation,
} = accommodationApi;
