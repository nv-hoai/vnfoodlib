import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

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
