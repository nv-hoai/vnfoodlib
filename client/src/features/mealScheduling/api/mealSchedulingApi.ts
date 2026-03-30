import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const mealSchedulingApi = createApi({
  reducerPath: 'mealSchedulingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/meal-schedules`,
    credentials: 'include'
  }),
  tagTypes: ['MealSchedule'],
  endpoints: (builder) => ({
    createMealSchedule: builder.mutation<MealSchedule, CreateMealSchedulePayload>({
      query: (payload) => ({
        url: '/',
        method: 'POST',
        body: payload
      }),
      invalidatesTags: ['MealSchedule']
    }),

    getMealScheduleByDate: builder.query<MealSchedule, string>({
      query: (date) => ({
        url: '/date',
        params: { date }
      }),
      providesTags: ['MealSchedule']
    }),

    getMealSchedulesByDateRange: builder.query<
      MealSchedule[],
      { startDate: string; endDate: string }
    >({
      query: ({ startDate, endDate }) => ({
        url: '/range',
        params: { startDate, endDate }
      }),
      providesTags: ['MealSchedule']
    }),

    getMealSchedulesForMonth: builder.query<
      MealSchedule[],
      { year: number; month: number }
    >({
      query: ({ year, month }) => ({
        url: '/month',
        params: { year, month }
      }),
      providesTags: ['MealSchedule']
    }),

    updateMealSchedule: builder.mutation<
      MealSchedule,
      { id: string; payload: Partial<CreateMealSchedulePayload> }
    >({
      query: ({ id, payload }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: payload
      }),
      invalidatesTags: ['MealSchedule']
    }),

    deleteMealSchedule: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
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
