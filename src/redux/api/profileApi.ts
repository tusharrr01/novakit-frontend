import { baseApi } from './baseApi';

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => '/profile',
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation({
      query: (body) => ({
        url: '/profile',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
    changePassword: builder.mutation({
      query: (body) => ({
        url: '/profile/change-password',
        method: 'PUT',
        body,
      }),
    }),
    toggleTwoFactor: builder.mutation({
      query: () => ({
        url: '/profile/2fa',
        method: 'PUT',
      }),
      invalidatesTags: ['Profile'],
    }),
    deleteAccount: builder.mutation({
      query: () => ({
        url: '/profile/account',
        method: 'DELETE',
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useToggleTwoFactorMutation,
  useDeleteAccountMutation,
} = profileApi;
export default profileApi;
