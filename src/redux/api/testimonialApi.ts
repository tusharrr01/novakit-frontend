import { baseApi } from './baseApi';

export const testimonialApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTestimonials: builder.query({
      query: () => '/testimonials',
      providesTags: ['Testimonials'],
    }),
    createAdminTestimonial: builder.mutation({
      query: (body) => ({
        url: '/admin/testimonials/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Testimonials'],
    }),
    updateAdminTestimonial: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/testimonials/edit/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Testimonials'],
    }),
    deleteAdminTestimonial: builder.mutation({
      query: (id) => ({
        url: `/admin/testimonials/delete/${id}`,
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
