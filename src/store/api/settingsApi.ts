import { baseApi } from './baseApi';
import type { ApiEnvelope } from '../types';
import { PLATFORM_FEE_PERCENT } from '@/lib/pricing';

export interface PublicSettings {
  /** Platform commission %, charged to the host on top of the cleaner's rate. */
  platformCommission: number;
}

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // The commission an admin set in the dashboard, so every price breakdown
    // matches what Stripe actually charges at checkout.
    getPublicSettings: builder.query<PublicSettings, void>({
      query: () => ({ url: '/settings/public' }),
      transformResponse: (res: ApiEnvelope<PublicSettings>) => res.data,
      providesTags: ['Settings'],
    }),
  }),
});

export const { useGetPublicSettingsQuery } = settingsApi;

/**
 * Fee percentage to price with. Falls back to the backend's default while the
 * request is in flight (or if it fails), so totals never render as 0% fee.
 */
export const usePlatformFeePercent = (): number => {
  const { data } = useGetPublicSettingsQuery();
  const pct = data?.platformCommission;
  return typeof pct === 'number' && Number.isFinite(pct) ? pct : PLATFORM_FEE_PERCENT;
};
