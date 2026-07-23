import { baseApi } from './baseApi';

export const announcementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnnouncements: builder.query({
      query: () => '/announcements',
      providesTags: ['Announcements'],
    }),
    updateAnnouncements: builder.mutation({
      query: (body) => ({
        url: '/announcements/edit',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Announcements'],
    }),
    updateMarquee: builder.mutation({
      query: (body) => ({
        url: '/announcements/marquee/edit',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Announcements'],
    }),
    updatePopup: builder.mutation({
      query: (body) => ({
        url: '/announcements/popup/edit',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Announcements'],
    }),
  }),
});

export const {
  useGetAnnouncementsQuery,
  useUpdateAnnouncementsMutation,
  useUpdateMarqueeMutation,
  useUpdatePopupMutation,
} = announcementApi;
export default announcementApi;
