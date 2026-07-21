import { baseApi } from './baseApi';

export const designApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDesigns: builder.query({
      query: (params) => ({
        url: '/catalog/designs',
        params,
      }),
      providesTags: ['Designs'],
    }),
    getDesignBySlug: builder.query({
      query: (slug) => `/catalog/designs/${slug}`,
      providesTags: ['Designs'],
    }),
    createAdminDesign: builder.mutation({
      query: (body) => ({
        url: '/admin/catalog/designs',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Designs'],
    }),
    updateAdminDesign: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/catalog/designs/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Designs'],
    }),
    deleteAdminDesign: builder.mutation({
      query: (id) => ({
        url: `/admin/catalog/designs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Designs'],
    }),
  }),
});

export const {
  useGetDesignsQuery,
  useGetDesignBySlugQuery,
  useCreateAdminDesignMutation,
  useUpdateAdminDesignMutation,
  useDeleteAdminDesignMutation,
} = designApi;
export default designApi;
