import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MealSchedule } from '../api/mealSchedulingApi';

// Hàm helper để lấy local date string (YYYY-MM-DD) thay vì UTC
const getLocalDateString = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

interface MealSchedulingState {
  selectedDate: string; // ISO date string for serialization
  selectedSchedule: MealSchedule | null;
  viewMode: 'day' | 'week' | 'month';
  loading: boolean;
}

const initialState: MealSchedulingState = {
  selectedDate: getLocalDateString(new Date()),
  selectedSchedule: null,
  viewMode: 'month',
  loading: false
};

const mealSchedulingSlice = createSlice({
  name: 'mealScheduling',
  initialState,
  reducers: {
    setSelectedDate: (state, action: PayloadAction<Date | string>) => {
      if (action.payload instanceof Date) {
        state.selectedDate = getLocalDateString(action.payload);
      } else {
        state.selectedDate = action.payload;
      }
    },
    setSelectedSchedule: (state, action: PayloadAction<MealSchedule | null>) => {
      state.selectedSchedule = action.payload;
    },
    setViewMode: (state, action: PayloadAction<'day' | 'week' | 'month'>) => {
      state.viewMode = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    goToPreviousMonth: (state) => {
      const [year, month, day] = state.selectedDate.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      date.setMonth(date.getMonth() - 1);
      state.selectedDate = getLocalDateString(date);
    },
    goToNextMonth: (state) => {
      const [year, month, day] = state.selectedDate.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      date.setMonth(date.getMonth() + 1);
      state.selectedDate = getLocalDateString(date);
    },
    goToToday: (state) => {
      state.selectedDate = getLocalDateString(new Date());
    }
  }
});

export const {
  setSelectedDate,
  setSelectedSchedule,
  setViewMode,
  setLoading,
  goToPreviousMonth,
  goToNextMonth,
  goToToday
} = mealSchedulingSlice.actions;

export default mealSchedulingSlice.reducer;
