import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { getSession, signOut } from 'next-auth/react';
import { setLogout } from '../reducers/authSlice';
import { setRTL } from '../reducers/layoutSlice';
import { resetSetting } from '../reducers/settingSlice';

const API_BASE_URL = typeof window === 'undefined'
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api')
  : (process.env.NEXT_PUBLIC_API_BASE_URL || '/api');

const EXPIRATION_MESSAGES = [
  'session expired or logged out',
  'token is invalid or expired',
  'session expired',
  'token expired',
  'please log in again',
  'invalid token: user not found',
];

let sessionPromise: Promise<any> | null = null;

const getCachedSession = async () => {
  if (typeof window === 'undefined') return null;
  if (sessionPromise) return sessionPromise;

  sessionPromise = getSession().finally(() => {
    setTimeout(() => {
      sessionPromise = null;
    }, 2000);
  });

  return sessionPromise;
};

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: async (headers) => {
    const session: any = await getCachedSession();
    if (session?.accessToken) {
      headers.set('Authorization', `Bearer ${session.accessToken}`);
    }
    return headers;
  },
});

const isSessionExpired = (message: unknown): boolean => {
  if (typeof message !== 'string') return false;
  const msgLower = message.toLowerCase();
  return EXPIRATION_MESSAGES.some((expMsg) => msgLower.includes(expMsg));
};

const baseQueryWithLogout: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const data = result.error.data as any;
    const message = data?.message || data?.error || '';

    if (isSessionExpired(message)) {
      console.warn('[baseApi] Token session expired. Logging out user...');
      api.dispatch(setLogout());
      api.dispatch(resetSetting());
      api.dispatch(setRTL(false));

      // Force NextAuth session cleanup
      signOut({ redirect: true, callbackUrl: '/auth/login' });
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  tagTypes: [
    'Roles',
    'Permissions',
    'Settings',
    'Profile',
    'Orders',
    'UserOverrides',
    'Faqs',
    'Testimonials',
    'Templates',
    'Designs',
    'Services',
    'Landing',
    'Languages',
    'Pages',
    'Users',
  ],
  baseQuery: baseQueryWithLogout,
  endpoints: () => ({}),
});
