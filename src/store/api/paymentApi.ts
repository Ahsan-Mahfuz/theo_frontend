import { baseApi } from './baseApi';
import type { ApiEnvelope, Paginated } from '../types';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Payment {
  _id: string;
  schedule: string;
  host: any;
  cleaner: any;
  accommodation: any;
  amount: number;
  currency: string;
  platformFee: number;
  cleanerAmount: number;
  status: 'pending' | 'paid_held' | 'released' | 'refunded' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface PayIntent {
  paymentId: string;
  paymentIntentClientSecret: string;
  ephemeralKey: string;
  customerId: string;
  publishableKey: string;
  amount: number;
  currency: string;
}

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Host: create a PaymentIntent for an accepted schedule.
    payForSchedule: builder.mutation<PayIntent, string>({
      query: (scheduleId) => ({
        url: `/payment/schedule/${scheduleId}/pay`,
        method: 'POST',
      }),
      transformResponse: (res: ApiEnvelope<PayIntent>) => res.data,
      invalidatesTags: ['Payment', 'Schedule', 'Calendar'],
    }),

    // Host/cleaner: my payments (?status & page & limit).
    getMyPayments: builder.query<
      Paginated<Payment>,
      { status?: string; page?: number; limit?: number } | void
    >({
      query: (params) => ({ url: '/payment/my', params: params ?? {} }),
      transformResponse: (res: ApiEnvelope<Paginated<Payment>>) => res.data,
      providesTags: ['Payment'],
    }),
  }),
});

export const { usePayForScheduleMutation, useGetMyPaymentsQuery } = paymentApi;
