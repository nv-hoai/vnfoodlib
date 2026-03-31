import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../../app/api';

export interface MealSchedule {
  _id: string;
  userId: string;
  date: string;
  meals: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
    snacks?: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMealSchedulePayload {
  date: string;
  meals: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
    snacks?: string;
  };
  notes?: string;
}

export interface MealScheduleResponse {
  status: string;
  data: {
    schedule?: MealSchedule;
    schedules?: MealSchedule[];
  };
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const mealSchedulingApi = createApi({
  reducerPath: 'mealSchedulingApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['MealSchedule'],
  endpoints: (builder) => ({
    createMealSchedule: builder.mutation<MealSchedule, CreateMealSchedulePayload>({
      query: (payload) => ({
        url: '/meal-schedules/',
        method: 'POST',
        body: payload
      }),
      transformResponse: (response: MealScheduleResponse) => response.data.schedule!,
      invalidatesTags: ['MealSchedule']
    }),

    getMealScheduleByDate: builder.query<MealSchedule | null, string>({
      query: (date) => ({
        url: '/meal-schedules/date',
        params: { date }
      }),
      transformResponse: (response: MealScheduleResponse) => response.data.schedule || null,
      providesTags: ['MealSchedule']
    }),

    getMealSchedulesByDateRange: builder.query<
      MealSchedule[],
      { startDate: string; endDate: string }
    >({
      query: ({ startDate, endDate }) => ({
        url: '/meal-schedules/range',
        params: { startDate, endDate }
      }),
      transformResponse: (response: MealScheduleResponse) => response.data.schedules || [],
      providesTags: ['MealSchedule']
    }),

    getMealSchedulesForMonth: builder.query<
      MealSchedule[],
      { year: number; month: number }
    >({
      query: ({ year, month }) => ({
        url: '/meal-schedules/month',
        params: { year, month }
      }),
      transformResponse: (response: MealScheduleResponse) => response.data.schedules || [],
      providesTags: ['MealSchedule']
    }),

    updateMealSchedule: builder.mutation<
      MealSchedule,
      { id: string; payload: Partial<CreateMealSchedulePayload> }
    >({
      query: ({ id, payload }) => ({
        url: `/meal-schedules/${id}`,
        method: 'PATCH',
        body: payload
      }),
      transformResponse: (response: MealScheduleResponse) => response.data.schedule!,
      invalidatesTags: ['MealSchedule']
    }),

    deleteMealSchedule: builder.mutation<void, string>({
      query: (id) => ({
        url: `/meal-schedules/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['MealSchedule']
    })
  })
});

export const {
  useCreateMealScheduleMutation,
  useGetMealScheduleByDateQuery,
  useGetMealSchedulesByDateRangeQuery,
  useGetMealSchedulesForMonthQuery,
  useUpdateMealScheduleMutation,
  useDeleteMealScheduleMutation
} = mealSchedulingApi;
