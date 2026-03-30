import { createApi } from '@reduxjs/toolkit/query/react';
import { setCredentials, logout, refresh } from '../slices/authSlice';
import { setUser, clearUser } from '../../users';
import { baseQueryWithReauth } from '../../../app/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface RefreshResponse {
  accessToken: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterPayload>({
      query: (userData) => ({
        url: 'auth/register',
        method: 'POST',
        body: userData
      }),
      transformResponse: (response: any) => response.data,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ accessToken: data.accessToken }));
          dispatch(setUser(data.user));
        } catch (error) {
          console.error('Đăng ký thất bại:', error);
        }
      },
      invalidatesTags: ['User']
    }),
    
    login: builder.mutation<AuthResponse, LoginPayload>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials
      }),
      transformResponse: (response: any) => response.data,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ accessToken: data.accessToken }));
          dispatch(setUser(data.user));
        } catch (error) {
          console.error('Đăng nhập thất bại:', error);
        }
      },
      invalidatesTags: ['User']
    }),
    refresh: builder.mutation<RefreshResponse, void>({
      query: () => ({
        url: 'auth/refresh',
        method: 'POST'
      }),
      transformResponse: (response: any) => response.data,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(refresh({ accessToken: data.accessToken }));
        } catch (error) {
          console.error('Làm mới token thất bại:', error);
          dispatch(logout());
        }
      },
    }),
    logout: builder.mutation<any, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST'
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(logout());
          dispatch(clearUser());
        }
      },
      invalidatesTags: ['User']
    })
  })
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshMutation,
  useLogoutMutation
} = authApi;