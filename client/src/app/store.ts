import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '../features/auth';
import { userReducer } from '../features/users';
import { authApi } from '../features/auth/api/authApi';
import { userApi } from '../features/users/api/userApi';
import { mealSchedulingApi } from '../features/mealScheduling/api/mealSchedulingApi';
import mealSchedulingReducer from '../features/mealScheduling/slices/mealSchedulingSlice';
import { collectionsApi } from '../features/collections/api/collectionsApi';
import collectionsReducer from '../features/collections/slices/collectionsSlice';

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
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      mealSchedulingApi.middleware,
      collectionsApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
