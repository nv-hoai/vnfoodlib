import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '../features/auth';
import { userReducer } from '../features/users';
import { authApi } from '../features/auth/api/authApi';
import { userApi } from '../features/users/api/userApi';
import { mealSchedulingApi } from '../features/mealScheduling/api/mealSchedulingApi';
import mealSchedulingReducer from '../features/mealScheduling/slices/mealSchedulingSlice';
import { collectionsApi } from '../features/collections/api/collectionsApi';
import collectionsReducer from '../features/collections/slices/collectionsSlice';
import { foodApi } from '../features/foods/api/foodApi';
import { contributionsApi } from '../features/contributions/api/contributionsApi';
import { adminApi } from '../features/admin/api/adminApi';
import { notificationsApi } from '../features/notifications/api/notificationsApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    mealScheduling: mealSchedulingReducer,
    collections: collectionsReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [mealSchedulingApi.reducerPath]: mealSchedulingApi.reducer,
    [collectionsApi.reducerPath]: collectionsApi.reducer,
    [foodApi.reducerPath]: foodApi.reducer,
    [contributionsApi.reducerPath]: contributionsApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      mealSchedulingApi.middleware,
      collectionsApi.middleware,
      foodApi.middleware,
      contributionsApi.middleware,
      adminApi.middleware,
      notificationsApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
