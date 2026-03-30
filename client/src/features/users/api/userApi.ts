import { baseQueryWithReauth } from '../../../app/api';
import { createApi } from '@reduxjs/toolkit/query/react';
import { setUser } from '../slices/userSlice';
import { setCredentials } from '../../auth';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GetMeResponse {
  user: User;
}

interface UpdateProfilePayload {
  name?: string;
  email?: string;
}

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

interface ChangePasswordResponse {
  accessToken: string;
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getMe: builder.query<GetMeResponse, void>({
      query: () => 'users/me',
      transformResponse: (response: any) => response.data,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.user));
        } catch (error) {
          console.error('Lấy thông tin người dùng thất bại:', error);
        }
      },
      providesTags: ['User']
    }),
    updateProfile: builder.mutation<GetMeResponse, UpdateProfilePayload>({
      query: (profileData) => ({
        url: 'users/update-profile',
        method: 'PUT',
        body: profileData
      }),
      transformResponse: (response: any) => response.data,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.user));
        } catch (error) {
          console.error('Cập nhật thông tin thất bại:', error);
        }
      },
      invalidatesTags: ['User']
    }),
    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordPayload>({
      query: (passwordData) => ({
        url: 'users/change-password',
        method: 'PUT',
        body: passwordData
      }),
      transformResponse: (response: any) => response.data,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ accessToken: data.accessToken }));
        } catch (error) {
          console.error('Đổi mật khẩu thất bại:', error);
        }
      }
    })
  })
});

export const {
  useGetMeQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation
} = userApi;