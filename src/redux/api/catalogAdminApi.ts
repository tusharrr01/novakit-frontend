import { baseApi } from './baseApi';

export const catalogAdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateLandingPageSettings: builder.mutation({
      query: (body) => ({
        url: '/admin/catalog/landing',
        method: 'PUT',
        body,
      }),
    }),
    createAdminTemplate: builder.mutation({
      query: (body) => ({
        url: '/admin/catalog/templates',
        method: 'POST',
        body,
      }),
    }),
    updateAdminTemplate: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/catalog/templates/${id}`,
        method: 'PUT',
        body,
      }),
    }),
    deleteAdminTemplate: builder.mutation({
      query: (id) => ({
        url: `/admin/catalog/templates/${id}`,
        method: 'DELETE',
      }),
    }),
    createAdminDesign: builder.mutation({
      query: (body) => ({
        url: '/admin/catalog/designs',
        method: 'POST',
        body,
      }),
    }),
    updateAdminDesign: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/catalog/designs/${id}`,
        method: 'PUT',
        body,
      }),
    }),
    deleteAdminDesign: builder.mutation({
      query: (id) => ({
        url: `/admin/catalog/designs/${id}`,
        method: 'DELETE',
      }),
    }),
    createAdminService: builder.mutation({
      query: (body) => ({
        url: '/admin/catalog/services',
        method: 'POST',
        body,
      }),
    }),
    updateAdminService: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/catalog/services/${id}`,
        method: 'PUT',
        body,
      }),
    }),
    deleteAdminService: builder.mutation({
      query: (id) => ({
        url: `/admin/catalog/services/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useUpdateLandingPageSettingsMutation,
  useCreateAdminTemplateMutation,
  useUpdateAdminTemplateMutation,
  useDeleteAdminTemplateMutation,
  useCreateAdminDesignMutation,
  useUpdateAdminDesignMutation,
  useDeleteAdminDesignMutation,
  useCreateAdminServiceMutation,
  useUpdateAdminServiceMutation,
  useDeleteAdminServiceMutation,
} = catalogAdminApi;
export default catalogAdminApi;
