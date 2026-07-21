import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
    }),
    verifyOTP: builder.mutation({
      query: (data) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: data,
      }),
    }),
    getProfile: builder.query({
      query: () => '/auth/profile',
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation({
      query: (body) => ({
        url: '/auth/profile',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
    changePassword: builder.mutation({
      query: (body) => ({
        url: '/auth/change-password',
        method: 'PUT',
        body,
      }),
    }),
    toggleTwoFactor: builder.mutation({
      query: () => ({
        url: '/auth/2fa',
        method: 'PUT',
      }),
      invalidatesTags: ['Profile'],
    }),
    deleteAccount: builder.mutation({
      query: () => ({
        url: '/auth/account',
        method: 'DELETE',
      }),
      invalidatesTags: ['Profile'],
    }),
    getMyPermissions: builder.query({
      query: () => '/auth/my-permissions',
      providesTags: ['Permissions'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyOTPMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useToggleTwoFactorMutation,
  useDeleteAccountMutation,
  useGetMyPermissionsQuery,
} = authApi;
