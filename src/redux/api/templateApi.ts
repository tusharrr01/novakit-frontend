import { baseApi } from './baseApi';

export const templateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTemplates: builder.query({
      query: (params) => ({
        url: '/templates',
        params,
      }),
      providesTags: ['Templates'],
    }),
    getTemplateBySlug: builder.query({
      query: (slug) => `/templates/${slug}`,
      providesTags: ['Templates'],
    }),
    createAdminTemplate: builder.mutation({
      query: (body) => ({
        url: '/admin/templates/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Templates'],
    }),
    updateAdminTemplate: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/templates/edit/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Templates'],
    }),
    deleteAdminTemplate: builder.mutation({
      query: (id) => ({
        url: `/admin/templates/delete/${id}`,
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
