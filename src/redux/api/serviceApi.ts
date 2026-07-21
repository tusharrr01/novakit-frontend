import { baseApi } from './baseApi';

export const serviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query({
      query: (params) => ({
        url: '/catalog/services',
        params,
      }),
      providesTags: ['Services'],
    }),
    getServiceBySlug: builder.query({
      query: (slug) => `/catalog/services/${slug}`,
      providesTags: ['Services'],
    }),
    createAdminService: builder.mutation({
      query: (body) => ({
        url: '/admin/catalog/services',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Services'],
    }),
    updateAdminService: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/catalog/services/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Services'],
    }),
    deleteAdminService: builder.mutation({
      query: (id) => ({
        url: `/admin/catalog/services/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Services'],
    }),
  }),
});

export const {
  useGetServicesQuery,
  useGetServiceBySlugQuery,
  useCreateAdminServiceMutation,
  useUpdateAdminServiceMutation,
  useDeleteAdminServiceMutation,
} = serviceApi;
export default serviceApi;
