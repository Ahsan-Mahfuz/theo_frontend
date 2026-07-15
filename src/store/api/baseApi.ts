import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@/lib/config';
import type { RootState } from '../index';
import { logout } from '../authSlice';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    // Tell the backend the viewer's timezone so server-computed day
    // grouping/labels/ranges are rendered in the viewer's local time.
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) headers.set('x-timezone', tz);
    } catch {
      /* ignore — backend defaults to UTC */
    }
    return headers;
  },
});

// Wrap so an expired/invalid token clears the session automatically.
const baseQueryWithAuth: typeof rawBaseQuery = async (args, api, extra) => {
  const result = await rawBaseQuery(args, api, extra);
  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    'Me',
    'Accommodation',
    'HostDashboard',
    'Assignment',
    'Housekeeper',
    'Schedule',
    'Calendar',
    'Payment',
    'Notification',
    'Support',
    'Content',
    'Chat',
    'Message',
  ],
  endpoints: () => ({}),
});
