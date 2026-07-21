import { baseApi } from './baseApi';

export const languageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLanguages: builder.query({
      query: () => '/catalog/languages',
      providesTags: ['Languages'],
    }),
  }),
});

export const {
  useGetLanguagesQuery,
} = languageApi;
export default languageApi;
