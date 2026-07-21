import { baseApi } from './baseApi';

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOrders: builder.query({
      query: (params) => ({
        url: '/orders',
        params,
      }),
      providesTags: ['Orders'],
    }),
    getAdminOrderStats: builder.query({
      query: () => '/orders/stats',
      providesTags: ['Orders'],
    }),
    getMyOrders: builder.query({
      query: () => '/orders/my-orders',
      providesTags: ['Orders'],
    }),
  }),
});

export const {
  useGetAdminOrdersQuery,
  useGetAdminOrderStatsQuery,
  useGetMyOrdersQuery,
} = orderApi;
export default orderApi;
