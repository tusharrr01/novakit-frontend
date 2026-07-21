import { baseApi } from './baseApi';

export const pageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── Public ───────────────────────────────────────────────────────────────
    /** List all active pages (public, no auth) */
    getPages: builder.query({
      query: () => '/pages',
      providesTags: ['Pages'],
    }),

    /** Fetch a single active page by slug (public, no auth) */
    getPageBySlug: builder.query<any, string>({
      query: (slug) => `/pages/${slug}`,
      providesTags: (_r, _e, slug) => [{ type: 'Pages', id: slug }],
    }),

    // ─── Admin ────────────────────────────────────────────────────────────────
    /** Admin: list ALL pages including inactive */
    adminGetPages: builder.query({
      query: () => '/pages/admin/list',
      providesTags: ['Pages'],
    }),

    /** Admin: get single page by ID (for edit form) */
    adminGetPageById: builder.query<any, string>({
      query: (id) => `/pages/admin/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Pages', id }],
    }),

    /** Admin: create a new page */
    createPage: builder.mutation({
      query: (body) => ({
        url: '/pages/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Pages'],
    }),

    /** Admin: update an existing page */
    updatePage: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/pages/edit/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Pages'],
    }),

    /** Admin: delete a page */
    deletePage: builder.mutation<any, string>({
      query: (id) => ({
        url: `/pages/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Pages'],
    }),
  }),
});

export const {
  useGetPagesQuery,
  useGetPageBySlugQuery,
  useAdminGetPagesQuery,
  useAdminGetPageByIdQuery,
  useCreatePageMutation,
  useUpdatePageMutation,
  useDeletePageMutation,
} = pageApi;

export default pageApi;
