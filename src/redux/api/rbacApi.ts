import { baseApi } from './baseApi';

export const rbacApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminRoles: builder.query({
      query: () => '/rbac/roles',
      providesTags: ['Roles'],
    }),
    createAdminRole: builder.mutation({
      query: (body) => ({
        url: '/rbac/roles',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Roles'],
    }),
    updateAdminRole: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/rbac/roles/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Roles'],
    }),
    deleteAdminRole: builder.mutation({
      query: (id) => ({
        url: `/rbac/roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Roles'],
    }),
    getAdminPermissions: builder.query({
      query: () => '/rbac/permissions',
    }),
    getUserOverrides: builder.query({
      query: (userId) => `/rbac/users/${userId}/overrides`,
      providesTags: ['UserOverrides'],
    }),
    updateUserOverrides: builder.mutation({
      query: ({ userId, ...body }) => ({
        url: `/rbac/users/${userId}/overrides`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['UserOverrides'],
    }),
  }),
});

export const {
  useGetAdminRolesQuery,
  useCreateAdminRoleMutation,
  useUpdateAdminRoleMutation,
  useDeleteAdminRoleMutation,
  useGetAdminPermissionsQuery,
  useGetUserOverridesQuery,
  useUpdateUserOverridesMutation,
} = rbacApi;
export default rbacApi;
