import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../../types';

type UserState = User | null;

const initialState: UserState = JSON.parse(localStorage.getItem('user') || 'null');

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      const updatedUser = action.payload;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    },
    clearUser: (state) => {
      localStorage.removeItem('user');
      return null;
    }
  }
});

export const { setUser, clearUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
