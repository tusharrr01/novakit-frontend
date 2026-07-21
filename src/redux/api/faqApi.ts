import { baseApi } from './baseApi';

export const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFaqs: builder.query({
      query: () => '/catalog/faqs',
      providesTags: ['Faqs'],
    }),
    createAdminFaq: builder.mutation({
      query: (body) => ({
        url: '/admin/catalog/faqs',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Faqs'],
    }),
    updateAdminFaq: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/catalog/faqs/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Faqs'],
    }),
    deleteAdminFaq: builder.mutation({
      query: (id) => ({
        url: `/admin/catalog/faqs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Faqs'],
    }),
  }),
});

export const {
  useGetFaqsQuery,
  useCreateAdminFaqMutation,
  useUpdateAdminFaqMutation,
  useDeleteAdminFaqMutation,
} = faqApi;
export default faqApi;
