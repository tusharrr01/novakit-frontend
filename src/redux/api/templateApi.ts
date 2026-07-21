import { baseApi } from './baseApi';

export const templateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTemplates: builder.query({
      query: (params) => ({
        url: '/catalog/templates',
        params,
      }),
      providesTags: ['Templates'],
    }),
    getTemplateBySlug: builder.query({
      query: (slug) => `/catalog/templates/${slug}`,
      providesTags: ['Templates'],
    }),
    createAdminTemplate: builder.mutation({
      query: (body) => ({
        url: '/admin/catalog/templates',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Templates'],
    }),
    updateAdminTemplate: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/catalog/templates/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Templates'],
    }),
    deleteAdminTemplate: builder.mutation({
      query: (id) => ({
        url: `/admin/catalog/templates/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Templates'],
    }),
  }),
});

export const {
  useGetTemplatesQuery,
  useGetTemplateBySlugQuery,
  useCreateAdminTemplateMutation,
  useUpdateAdminTemplateMutation,
  useDeleteAdminTemplateMutation,
} = templateApi;
export default templateApi;
