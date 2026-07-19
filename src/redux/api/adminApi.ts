import { baseApi } from './baseApi';

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminSettings: builder.query({
      query: () => '/admin/settings',
      providesTags: ['Settings'],
    }),
    updateAdminSettings: builder.mutation({
      query: (body) => ({
        url: '/admin/settings',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Settings'],
    }),
    updateLandingPageSettings: builder.mutation({
      query: (body) => ({
        url: '/admin/catalog/landing',
        method: 'PUT',
        body,
      }),
    }),
    getAdminOrders: builder.query({
      query: (params) => ({
        url: '/admin/orders',
        params,
      }),
      providesTags: ['Orders'],
    }),
    getAdminOrderStats: builder.query({
      query: () => '/admin/orders/stats',
      providesTags: ['Orders'],
    }),
    getAdminRoles: builder.query({
      query: () => '/admin/roles',
      providesTags: ['Roles'],
    }),
    createAdminRole: builder.mutation({
      query: (body) => ({
        url: '/admin/roles',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Roles'],
    }),
    updateAdminRole: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/roles/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Roles'],
    }),
    deleteAdminRole: builder.mutation({
      query: (id) => ({
        url: `/admin/roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Roles'],
    }),
    getAdminPermissions: builder.query({
      query: () => '/admin/permissions',
    }),
    getUserOverrides: builder.query({
      query: (userId) => `/admin/users/${userId}/overrides`,
      providesTags: ['UserOverrides'],
    }),
    updateUserOverrides: builder.mutation({
      query: ({ userId, ...body }) => ({
        url: `/admin/users/${userId}/overrides`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['UserOverrides'],
    }),
    createAdminTemplate: builder.mutation({
      query: (body) => ({
        url: '/admin/catalog/templates',
        method: 'POST',
        body,
      }),
    }),
    updateAdminTemplate: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/catalog/templates/${id}`,
        method: 'PUT',
        body,
      }),
    }),
    deleteAdminTemplate: builder.mutation({
      query: (id) => ({
        url: `/admin/catalog/templates/${id}`,
        method: 'DELETE',
      }),
    }),
    createAdminDesign: builder.mutation({
      query: (body) => ({
        url: '/admin/catalog/designs',
        method: 'POST',
        body,
      }),
    }),
    updateAdminDesign: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/catalog/designs/${id}`,
        method: 'PUT',
        body,
      }),
    }),
    deleteAdminDesign: builder.mutation({
      query: (id) => ({
        url: `/admin/catalog/designs/${id}`,
        method: 'DELETE',
      }),
    }),
    createAdminService: builder.mutation({
      query: (body) => ({
        url: '/admin/catalog/services',
        method: 'POST',
        body,
      }),
    }),
    updateAdminService: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/catalog/services/${id}`,
        method: 'PUT',
        body,
      }),
    }),
    deleteAdminService: builder.mutation({
      query: (id) => ({
        url: `/admin/catalog/services/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetAdminSettingsQuery,
  useUpdateAdminSettingsMutation,
  useUpdateLandingPageSettingsMutation,
  useGetAdminOrdersQuery,
  useGetAdminOrderStatsQuery,
  useGetAdminRolesQuery,
  useCreateAdminRoleMutation,
  useUpdateAdminRoleMutation,
  useDeleteAdminRoleMutation,
  useGetAdminPermissionsQuery,
  useGetUserOverridesQuery,
  useUpdateUserOverridesMutation,
  useCreateAdminTemplateMutation,
  useUpdateAdminTemplateMutation,
  useDeleteAdminTemplateMutation,
  useCreateAdminDesignMutation,
  useUpdateAdminDesignMutation,
  useDeleteAdminDesignMutation,
  useCreateAdminServiceMutation,
  useUpdateAdminServiceMutation,
  useDeleteAdminServiceMutation,
} = adminApi;
export default adminApi;
