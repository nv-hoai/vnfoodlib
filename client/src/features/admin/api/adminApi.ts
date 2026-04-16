import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../../app/api';
import type { 
  IActivityLog, 
  IUserInfo,
  DashboardStats,
  DashboardStatsResponse,
  AdminResponse,
  PendingContributionsResponse,
  SuspendUserPayload
} from '../../../types';
import type { IContribution } from '../../contributions/api/contributionsApi';

export type { IActivityLog, IUserInfo, DashboardStats, IContribution };

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['AdminContribution', 'AdminUser', 'AdminStats'],
  endpoints: (builder) => ({
    // ===== CONTRIBUTION MANAGEMENT =====
    getPendingContributions: builder.query<
      AdminResponse,
      { page?: number; limit?: number; type?: 'new_food' | 'edit_food' }
    >({
      query: ({ page = 1, limit = 20, type }) => ({
        url: '/admin/contributions',
        params: { page, limit, ...(type && { type }) }
      }),
      providesTags: ['AdminContribution']
    }),

    approveContribution: builder.mutation<
      AdminResponse,
      { id: string; notes?: string }
    >({
      query: ({ id, notes }) => ({
        url: `/admin/contributions/${id}/approve`,
        method: 'PATCH',
        body: { notes }
      }),
      invalidatesTags: ['AdminContribution', 'AdminStats']
    }),

    rejectContribution: builder.mutation<
      AdminResponse,
      { id: string; reason: string }
    >({
      query: ({ id, reason }) => ({
        url: `/admin/contributions/${id}/reject`,
        method: 'PATCH',
        body: { reason }
      }),
      invalidatesTags: ['AdminContribution', 'AdminStats']
    }),

    archiveContribution: builder.mutation<AdminResponse, string>({
      query: (id) => ({
        url: `/admin/contributions/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['AdminContribution']
    }),

    // ===== USER MANAGEMENT =====
    getUserList: builder.query<
      AdminResponse,
      {
        page?: number;
        limit?: number;
        status?: string;
        role?: string;
        search?: string;
      }
    >({
      query: ({ page = 1, limit = 20, status, role, search }) => ({
        url: '/admin/users',
        params: {
          page,
          limit,
          ...(status && { status }),
          ...(role && { role }),
          ...(search && { search })
        }
      }),
      providesTags: ['AdminUser']
    }),

    suspendUser: builder.mutation<
      AdminResponse,
      { id: string; durationDays?: number; reason: string }
    >({
      query: ({ id, durationDays = 7, reason }) => ({
        url: `/admin/users/${id}/suspend`,
        method: 'PATCH',
        body: { durationDays, reason }
      }),
      invalidatesTags: ['AdminUser', 'AdminStats']
    }),

    unsuspendUser: builder.mutation<AdminResponse, string>({
      query: (id) => ({
        url: `/admin/users/${id}/activate`,
        method: 'PATCH'
      }),
      invalidatesTags: ['AdminUser', 'AdminStats']
    }),

    banUser: builder.mutation<
      AdminResponse,
      { id: string; reason: string }
    >({
      query: ({ id, reason }) => ({
        url: `/admin/users/${id}/ban`,
        method: 'PATCH',
        body: { reason }
      }),
      invalidatesTags: ['AdminUser', 'AdminStats']
    }),

    changeUserRole: builder.mutation<
      AdminResponse,
      { id: string; role: 'user' | 'admin' | 'moderator' }
    >({
      query: ({ id, role }) => ({
        url: `/admin/users/${id}/role`,
        method: 'PATCH',
        body: { role }
      }),
      invalidatesTags: ['AdminUser']
    }),

    deleteUser: builder.mutation<AdminResponse, string>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['AdminUser', 'AdminStats']
    }),

    // ===== ACTIVITY & AUDIT =====
    getActivities: builder.query<
      AdminResponse,
      { page?: number; limit?: number; action?: string; actor?: string }
    >({
      query: ({ page = 1, limit = 50, action, actor }) => ({
        url: '/admin/activities',
        params: { page, limit, ...(action && { action }), ...(actor && { actor }) }
      })
    }),

    // ===== DASHBOARD =====
    getDashboardStats: builder.query<DashboardStatsResponse, void>({
      query: () => ({
        url: '/admin/stats'
      }),
      providesTags: ['AdminStats']
    }),

    // ===== NOTIFICATIONS =====
    sendNotification: builder.mutation<
      AdminResponse,
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
      invalidatesTags: ['AdminStats']
    })
  })
});

export const {
  useGetPendingContributionsQuery,
  useApproveContributionMutation,
  useRejectContributionMutation,
  useArchiveContributionMutation,
  useGetUserListQuery,
  useSuspendUserMutation,
  useUnsuspendUserMutation,
  useBanUserMutation,
  useChangeUserRoleMutation,
  useDeleteUserMutation,
  useGetActivitiesQuery,
  useGetDashboardStatsQuery,
  useSendNotificationMutation
} = adminApi;
