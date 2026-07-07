import { baseApi } from './baseApi';
import type { ApiEnvelope, Paginated, Housekeeper, CleanerAssignment } from '../types';

export const assignmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Host: discover housekeepers (?search & interventionZone & page & limit).
    findHousekeepers: builder.query<
      Paginated<Housekeeper>,
      { search?: string; interventionZone?: string; page?: number; limit?: number } | void
    >({
      query: (params) => ({ url: '/assignment/housekeepers', params: params ?? {} }),
      transformResponse: (res: ApiEnvelope<Paginated<Housekeeper>>) => res.data,
      providesTags: ['Housekeeper'],
    }),

    getHousekeeperProfile: builder.query<Housekeeper, string>({
      query: (cleanerId) => `/assignment/housekeepers/${cleanerId}`,
      transformResponse: (res: ApiEnvelope<Housekeeper>) => res.data,
      providesTags: (_r, _e, id) => [{ type: 'Housekeeper', id }],
    }),

    // Host: this cleaner's request/assignment status across the host's own
    // accommodations (drives the "already requested / already added" badges).
    getCleanerAssignments: builder.query<
      Array<{
        _id: string;
        accommodation: string;
        role: 'primary' | 'substitute';
        status: 'pending' | 'accepted' | 'refused';
        createdAt: string;
      }>,
      string
    >({
      query: (cleanerId) => `/assignment/housekeepers/${cleanerId}/assignments`,
      transformResponse: (res: ApiEnvelope<any[]>) => res.data,
      providesTags: ['Assignment'],
    }),

    // Host: assign a cleaner to an accommodation.
    assignCleaner: builder.mutation<
      CleanerAssignment,
      {
        accommodationId: string;
        cleanerId: string;
        role?: 'primary' | 'substitute';
        pricePerCleaning?: number;
        message?: string;
      }
    >({
      query: ({ accommodationId, ...body }) => ({
        url: `/assignment/${accommodationId}/assign`,
        method: 'POST',
        body,
      }),
      transformResponse: (res: ApiEnvelope<CleanerAssignment>) => res.data,
      invalidatesTags: ['Assignment', 'Accommodation'],
    }),

    // Host: all cleaners assigned to an accommodation (primary first).
    getAccommodationCleaners: builder.query<CleanerAssignment[], string>({
      query: (accommodationId) => `/assignment/${accommodationId}/cleaners`,
      transformResponse: (res: ApiEnvelope<CleanerAssignment[]>) => res.data,
      providesTags: ['Assignment'],
    }),

    changeAssignmentRole: builder.mutation<
      CleanerAssignment,
      { assignmentId: string; role: 'primary' | 'substitute' }
    >({
      query: ({ assignmentId, role }) => ({
        url: `/assignment/${assignmentId}/role`,
        method: 'PATCH',
        body: { role },
      }),
      transformResponse: (res: ApiEnvelope<CleanerAssignment>) => res.data,
      invalidatesTags: ['Assignment', 'Accommodation'],
    }),

    removeAssignment: builder.mutation<ApiEnvelope<null>, string>({
      query: (assignmentId) => ({ url: `/assignment/${assignmentId}`, method: 'DELETE' }),
      invalidatesTags: ['Assignment', 'Accommodation'],
    }),
  }),
});

export const {
  useFindHousekeepersQuery,
  useGetHousekeeperProfileQuery,
  useGetCleanerAssignmentsQuery,
  useAssignCleanerMutation,
  useGetAccommodationCleanersQuery,
  useChangeAssignmentRoleMutation,
  useRemoveAssignmentMutation,
} = assignmentApi;
