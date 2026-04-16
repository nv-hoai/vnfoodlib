/**
 * Redux Store Types
 */

import type { User, MealSchedule } from './domain';

// ===== AUTH STATE =====
export interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ===== USER STATE =====
export interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// ===== COLLECTIONS STATE =====
export interface CollectionsState {
  collections: any[];
  isLoading: boolean;
  error: string | null;
}

// ===== MEAL SCHEDULE STATE =====
export interface MealScheduleState {
  schedules: MealSchedule[];
  currentSchedule: MealSchedule | null;
  isLoading: boolean;
  error: string | null;
}

// ===== ROOT STATE =====
export interface RootState {
  auth: AuthState;
  user: UserState;
  collections: CollectionsState;
  mealSchedule: MealScheduleState;
  // RTK Query cache is added separately
  authApi: any;
  foodApi: any;
  collectionsApi: any;
  notificationsApi: any;
  adminApi: any;
  userApi: any;
  contributionsApi: any;
  mealSchedulingApi: any;
}

// RTK Query Tags
export type ApiTag = 
  | 'User'
  | 'Food'
  | 'Collection'
  | 'Notification'
  | 'Contribution'
  | 'Admin'
  | 'ActivityLog'
  | 'MealSchedule'
  | 'Ranking';

// Generic Redux Slice State
export interface SliceState<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
}

// Generic List State
export interface ListState<T> {
  items: T[];
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}
