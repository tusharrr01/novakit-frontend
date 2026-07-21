import { baseApi } from './baseApi';

export const testimonialApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTestimonials: builder.query({
      query: () => '/catalog/testimonials',
      providesTags: ['Testimonials'],
    }),
    createAdminTestimonial: builder.mutation({
      query: (body) => ({
        url: '/admin/catalog/testimonials',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Testimonials'],
    }),
    updateAdminTestimonial: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/catalog/testimonials/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Testimonials'],
    }),
    deleteAdminTestimonial: builder.mutation({
      query: (id) => ({
        url: `/admin/catalog/testimonials/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Testimonials'],
    }),
  }),
});

export const {
  useGetTestimonialsQuery,
  useCreateAdminTestimonialMutation,
  useUpdateAdminTestimonialMutation,
  useDeleteAdminTestimonialMutation,
} = testimonialApi;
export default testimonialApi;
