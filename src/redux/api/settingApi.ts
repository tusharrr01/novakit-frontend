import { baseApi } from './baseApi';

export const settingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminSettings: builder.query({
      query: () => '/settings',
      providesTags: ['Settings'],
    }),
    updateAdminSettings: builder.mutation({
      query: (body) => ({
        url: '/settings',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Settings'],
    }),
  }),
});

export const {
  useGetAdminSettingsQuery,
  useUpdateAdminSettingsMutation,
} = settingApi;
export default settingApi;
