import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../../app/api';

export interface IContributionData {
  name?: string;
  intro?: string;
  ingredients?: string;
  cooking?: string;
  tags?: {
    category?: string[];
    ingredient?: string[];
    meal_time?: string[];
    cooking_method?: string[];
    taste?: string[];
    purpose?: string[];
    diet?: string[];
  };
  image?: string;
}

export interface IContributionChange {
  field: string;
  oldValue: any;
  newValue: any;
}

export interface IContribution {
  _id: string;
  type: 'new_food' | 'edit_food';
  status: 'pending' | 'approved' | 'rejected' | 'archived';
  submittedBy: string;
  foodId?: string;
  data: IContributionData;
  changes?: IContributionChange[];
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

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
