import { baseApi } from './baseApi';
import { setCredentials } from '../authSlice';
import type { ApiEnvelope, User } from '../types';

interface AuthPayload {
  token: string;
  user: User;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Step 1 — send the verification OTP to the email.
    signup: builder.mutation<ApiEnvelope<null>, { email: string }>({
      query: (body) => ({ url: '/auth/signup', method: 'POST', body }),
    }),

    resendOtp: builder.mutation<ApiEnvelope<null>, { email: string }>({
      query: (body) => ({ url: '/auth/resend-otp', method: 'POST', body }),
    }),

    // Step 2 — verify OTP → returns a (roleless) token used for onboarding.
    verifyOtp: builder.mutation<AuthPayload, { email: string; otp: string }>({
      query: (body) => ({ url: '/auth/verify-otp', method: 'POST', body }),
      transformResponse: (res: ApiEnvelope<User>) => ({
        token: res.token!,
        user: res.data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setCredentials({ token: data.token, user: data.user }));
      },
    }),

    // Step 3 — set name + password (requires onboarding token).
    completeProfile: builder.mutation<
      User,
      { firstName: string; lastName: string; password: string }
    >({
      query: (body) => ({
        url: '/auth/complete-profile',
        method: 'POST',
        body,
      }),
      transformResponse: (res: ApiEnvelope<User>) => res.data,
    }),

    // Step 4 — choose host/cleaner (requires onboarding token).
    selectRole: builder.mutation<User, { role: 'host' | 'cleaner' }>({
      query: (body) => ({ url: '/auth/select-role', method: 'POST', body }),
      transformResponse: (res: ApiEnvelope<User>) => res.data,
    }),

    // Sign in — issues a role-bearing token (used both for login and to refresh
    // the token after role selection during signup).
    signin: builder.mutation<AuthPayload, { email: string; password: string }>({
      query: (body) => ({ url: '/auth/signin', method: 'POST', body }),
      transformResponse: (res: ApiEnvelope<User>) => ({
        token: res.token!,
        user: res.data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setCredentials({ token: data.token, user: data.user }));
      },
      invalidatesTags: ['Me'],
    }),

    // ─── Forgot / reset password ──────────────────────────────────────────────
    forgotPassword: builder.mutation<ApiEnvelope<null>, { email: string }>({
      query: (body) => ({ url: '/auth/forgot-password', method: 'POST', body }),
    }),
    verifyResetOtp: builder.mutation<
      { resetToken: string },
      { email: string; otp: string }
    >({
      query: (body) => ({ url: '/auth/verify-reset-otp', method: 'POST', body }),
      transformResponse: (res: ApiEnvelope<{ resetToken: string }>) => res.data,
    }),
    resetPassword: builder.mutation<
      ApiEnvelope<null>,
      { email: string; newPassword: string; confirmPassword: string }
    >({
      query: (body) => ({ url: '/auth/reset-password', method: 'POST', body }),
    }),

    changePassword: builder.mutation<
      ApiEnvelope<null>,
      { currentPassword: string; newPassword: string; confirmPassword: string }
    >({
      query: (body) => ({ url: '/auth/change-password', method: 'POST', body }),
    }),

    deleteMyAccount: builder.mutation<ApiEnvelope<null>, { password: string }>({
      query: (body) => ({ url: '/auth/delete-me', method: 'DELETE', body }),
    }),

    // ─── Profile ──────────────────────────────────────────────────────────────
    getMe: builder.query<User, void>({
      query: () => '/auth/me',
      transformResponse: (res: ApiEnvelope<User>) => res.data,
      providesTags: ['Me'],
    }),
    updateMe: builder.mutation<User, FormData>({
      query: (body) => ({ url: '/auth/update-me', method: 'PATCH', body }),
      transformResponse: (res: ApiEnvelope<User>) => res.data,
      invalidatesTags: ['Me'],
    }),
  }),
});

export const {
  useSignupMutation,
  useResendOtpMutation,
  useVerifyOtpMutation,
  useCompleteProfileMutation,
  useSelectRoleMutation,
  useSigninMutation,
  useForgotPasswordMutation,
  useVerifyResetOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useDeleteMyAccountMutation,
  useGetMeQuery,
  useUpdateMeMutation,
} = authApi;
