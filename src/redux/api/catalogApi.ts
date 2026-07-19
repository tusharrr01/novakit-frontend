import { baseApi } from './baseApi';

export const catalogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLandingPage: builder.query({
      query: () => '/catalog/landing',
    }),
    getFaqs: builder.query({
      query: () => '/catalog/faqs',
    }),
    getTestimonials: builder.query({
      query: () => '/catalog/testimonials',
    }),
    getLanguages: builder.query({
      query: () => '/catalog/languages',
    }),
    getTemplates: builder.query({
      query: (params) => ({
        url: '/catalog/templates',
        params,
      }),
    }),
    getTemplateBySlug: builder.query({
      query: (slug) => `/catalog/templates/${slug}`,
    }),
    getDesigns: builder.query({
      query: (params) => ({
        url: '/catalog/designs',
        params,
      }),
    }),
    getDesignBySlug: builder.query({
      query: (slug) => `/catalog/designs/${slug}`,
    }),
    getServices: builder.query({
      query: (params) => ({
        url: '/catalog/services',
        params,
      }),
    }),
    getServiceBySlug: builder.query({
      query: (slug) => `/catalog/services/${slug}`,
    }),
  }),
});

export const {
  useGetLandingPageQuery,
  useGetFaqsQuery,
  useGetTestimonialsQuery,
  useGetLanguagesQuery,
  useGetTemplatesQuery,
  useGetTemplateBySlugQuery,
  useGetDesignsQuery,
  useGetDesignBySlugQuery,
  useGetServicesQuery,
  useGetServiceBySlugQuery,
} = catalogApi;
export default catalogApi;
