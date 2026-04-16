import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../../app/api';
import type { INotification, NotificationResponse, CreateNotificationPayload } from '../../../types';

export type { INotification, NotificationResponse };

export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Notification'],
  endpoints: (builder) => ({
    // Get user's notifications
    getNotifications: builder.query<
      NotificationResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 20 }) => ({
        url: '/notifications',
        params: { page, limit }
      }),
      providesTags: ['Notification']
    }),

    // Get unread count
    getUnreadCount: builder.query<NotificationResponse, void>({
      query: () => ({
        url: '/notifications/unread-count'
      }),
      providesTags: ['Notification']
    }),

    // Mark notification as read
    markAsRead: builder.mutation<NotificationResponse, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH'
      }),
      invalidatesTags: ['Notification']
    }),

    // Mark all as read
    markAllAsRead: builder.mutation<NotificationResponse, void>({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PATCH'
      }),
      invalidatesTags: ['Notification']
    }),

    // Delete notification
    deleteNotification: builder.mutation<NotificationResponse, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Notification']
    }),

    // Clear all notifications
    clearAllNotifications: builder.mutation<NotificationResponse, void>({
      query: () => ({
        url: '/notifications',
        method: 'DELETE'
      }),
      invalidatesTags: ['Notification']
    }),

    // Admin: Create and send notification
    sendNotification: builder.mutation<
      NotificationResponse,
      {
        type: 'system' | 'contribution' | 'admin' | 'achievement';
        title: string;
        message: string;
        link?: string;
        targetUsers?: string[];
      }
    >({
      query: (payload) => ({
        url: '/admin/notifications/send',
        method: 'POST',
        body: payload
      }),
      invalidatesTags: ['Notification']
    }),

    // Admin: Get all notifications
    getAllNotifications: builder.query<
      NotificationResponse,
      { page?: number; limit?: number; type?: string }
    >({
      query: ({ page = 1, limit = 20, type }) => ({
        url: '/admin/notifications',
        params: { page, limit, ...(type && { type }) }
      }),
      providesTags: ['Notification']
    })
  })
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useClearAllNotificationsMutation,
  useSendNotificationMutation,
  useGetAllNotificationsQuery
} = notificationsApi;
