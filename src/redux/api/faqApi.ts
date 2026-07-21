import { baseApi } from './baseApi';

export const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFaqs: builder.query({
      query: () => '/faqs',
      providesTags: ['Faqs'],
    }),
    createAdminFaq: builder.mutation({
      query: (body) => ({
        url: '/admin/faqs/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Faqs'],
    }),
    updateAdminFaq: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/faqs/edit/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Faqs'],
    }),
    deleteAdminFaq: builder.mutation({
      query: (id) => ({
        url: `/admin/faqs/delete/${id}`,
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
