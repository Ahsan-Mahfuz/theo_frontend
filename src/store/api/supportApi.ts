import { baseApi } from './baseApi';
import type { ApiEnvelope } from '../types';

export interface SupportTicket {
  _id: string;
  subject: string;
  email: string;
  message: string;
  status: 'open' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

export const supportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSupportTicket: builder.mutation<
      SupportTicket,
      { subject: string; email: string; message: string }
    >({
      query: (body) => ({ url: '/support', method: 'POST', body }),
      transformResponse: (res: ApiEnvelope<SupportTicket>) => res.data,
      invalidatesTags: ['Support'],
    }),
  }),
});

export const { useCreateSupportTicketMutation } = supportApi;
