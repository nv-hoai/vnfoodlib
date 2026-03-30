import { fetchBaseQuery, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { refresh, logout } from '../features/auth/slices/authSlice';
import { RootState } from './store';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const baseQuery = fetchBaseQuery({
  baseUrl: `${API_BASE_URL}/`,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const accessToken = state.auth.accessToken;
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return headers;
  }
});

export const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && (result.error as any).status === 401) {
    const refreshResult = await baseQuery({
      url: 'auth/refresh',
      method: 'POST'
    }, api, extraOptions);

    if (refreshResult.data) {
      const { accessToken } = (refreshResult.data as any).data;
      api.dispatch(refresh({ accessToken }));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};