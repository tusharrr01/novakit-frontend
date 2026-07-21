import { baseApi } from './baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (params) => {
        const q = new URLSearchParams();
        if (params?.page) q.append('page', String(params.page));
        if (params?.limit) q.append('limit', String(params.limit));
        if (params?.search) q.append('search', params.search);
        if (params?.role) q.append('role', params.role);
        if (params?.status) q.append('status', params.status);
        if (params?.plan) q.append('plan', params.plan);
        if (params?.sort_by) q.append('sort_by', params.sort_by);
        if (params?.sort_order) q.append('sort_order', params.sort_order);
        const queryStr = q.toString();
        return queryStr ? `/users?${queryStr}` : '/users';
      },
      providesTags: ['Users'],
    }),

    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Users', id }],
    }),

    createUser: builder.mutation({
      query: (body) => ({
        url: '/users/admin/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Users'],
    }),

    updateUser: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/users/admin/edit/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Users'],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/admin/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),

    bulkDeleteUsers: builder.mutation({
      query: (ids) => ({
        url: '/users/admin/bulk-delete',
        method: 'POST',
        body: { ids },
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useBulkDeleteUsersMutation,
} = userApi;

export default userApi;
