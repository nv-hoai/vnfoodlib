import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState } from '../../../types';

const initialState: AuthState = {
  accessToken: localStorage.getItem('accessToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ accessToken: string }>) => {
      const { accessToken } = action.payload;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }
    },
    refresh: (state, action: PayloadAction<{ accessToken: string }>) => {
      const { accessToken } = action.payload;
      state.accessToken = accessToken;
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }
    },
    logout: (state) => {
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  }
});

export const { setCredentials, refresh, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;