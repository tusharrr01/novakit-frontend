import { baseApi } from './baseApi';

export const landingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLandingPage: builder.query({
      query: () => '/landing',
      providesTags: ['Landing'],
    }),
    updateLandingPageSettings: builder.mutation({
      query: (body) => ({
        url: '/admin/landing/edit',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Landing'],
    }),
  }),
});

export const {
  useGetLandingPageQuery,
  useUpdateLandingPageSettingsMutation,
} = landingApi;
export default landingApi;
