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
  }),
});

export const {
  useGetAdminOrdersQuery,
  useGetAdminOrderStatsQuery,
} = orderApi;
export default orderApi;
