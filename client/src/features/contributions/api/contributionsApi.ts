import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../../app/api';
import type { IContribution, IContributionData } from '../../../types';

export type { IContribution, IContributionData };

export interface ContributionResponse {
  success: boolean;
  message: string;
  data: {
    contribution?: IContribution;
    contributions?: IContribution[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export const contributionsApi = createApi({
  reducerPath: 'contributionsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Contribution'],
  endpoints: (builder) => ({
    // Submit new food contribution
    submitNewFood: builder.mutation<ContributionResponse, IContributionData>({
      query: (data) => ({
        url: '/contributions/foods',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Contribution']
    }),

    // Submit edit suggestion for existing food
    submitFoodEdit: builder.mutation<
      ContributionResponse,
      { foodId: string; changes: Partial<IContributionData> }
    >({
      query: ({ foodId, changes }) => ({
        url: `/contributions/foods/${foodId}`,
        method: 'PATCH',
        body: changes
      }),
      invalidatesTags: ['Contribution']
    }),

    // Get user's own contributions
    getMyContributions: builder.query<
      ContributionResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: '/contributions/my',
        params: { page, limit }
      }),
      providesTags: ['Contribution']
    }),

    // Get single contribution
    getContributionById: builder.query<ContributionResponse, string>({
      query: (id) => ({
        url: `/contributions/${id}`
      }),
      providesTags: ['Contribution']
    })
  })
});

export const {
  useSubmitNewFoodMutation,
  useSubmitFoodEditMutation,
  useGetMyContributionsQuery,
  useGetContributionByIdQuery
} = contributionsApi;
