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

export interface RevenueTransaction {
  _id: string;
  amount: number;
  currency: string;
  status: string;
  scheduleStatus: string | null;
  date: string | null;
  checkInTime: string | null;
  checkOutTime: string | null;
  accommodation: {
    _id: string;
    name: string;
    city: string;
    address: string;
    photo: string | null;
  } | null;
  releasedAt: string;
}

export interface RevenueGraphPoint {
  year: number;
  month: number;
  label: string;
  total: number;
}

export interface Revenue {
  currency: string;
  thisMonth: { year: number; month: number; revenue: number };
  upcoming: number;
  graph: RevenueGraphPoint[];
  transactions: RevenueTransaction[];
  meta: { page: number; limit: number; total: number; totalPage: number };
}

export interface TransactionDetail {
  _id: string;
  status: string;
  currency: string;
  amount: number;
  platformFee: number;
  cleanerAmount: number;
  yourAmount: number;
  releasedAt: string | null;
  createdAt: string;
  accommodation: any;
  schedule: any;
  host: any;
  cleaner: any;
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

    // Host/cleaner: revenue summary + monthly graph + paginated transactions.
    getRevenue: builder.query<
      Revenue,
      { year?: number; month?: number; page?: number; limit?: number } | void
    >({
      query: (params) => ({ url: '/payment/revenue', params: params ?? {} }),
      transformResponse: (res: ApiEnvelope<Revenue>) => res.data,
      providesTags: ['Payment'],
    }),

    // Host/cleaner: full detail for one transaction (accommodation + schedule).
    getTransactionDetail: builder.query<TransactionDetail, string>({
      query: (id) => ({ url: `/payment/transaction/${id}` }),
      transformResponse: (res: ApiEnvelope<TransactionDetail>) => res.data,
      providesTags: ['Payment'],
    }),
  }),
});

export const {
  usePayForScheduleMutation,
  useGetMyPaymentsQuery,
  useGetRevenueQuery,
  useGetTransactionDetailQuery,
} = paymentApi;
