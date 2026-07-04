import { baseApi } from './baseApi';
import type { ApiEnvelope } from '../types';

export type ContentType = 'about_us' | 'terms_of_use' | 'privacy_policy' | 'legal_notice';

export interface ContentPage {
  type: ContentType;
  content: string;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const contentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllContent: builder.query<ContentPage[], void>({
      query: () => '/content',
      transformResponse: (res: ApiEnvelope<ContentPage[]>) => res.data,
      providesTags: ['Content'],
    }),
    getContent: builder.query<ContentPage, ContentType>({
      query: (type) => `/content/${type}`,
      transformResponse: (res: ApiEnvelope<ContentPage>) => res.data,
      providesTags: (_r, _e, type) => [{ type: 'Content', id: type }],
    }),
  }),
});

export const { useGetAllContentQuery, useGetContentQuery } = contentApi;
