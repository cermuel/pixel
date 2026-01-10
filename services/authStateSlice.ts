import { LoginResponse } from '@/types/slices/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  user: LoginResponse['data'] | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
};

const authStateSlice = createSlice({
  name: 'authState',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: LoginResponse['data'] }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      AsyncStorage.setItem('token', action.payload.token);
      AsyncStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('user');
    },
  },
});

export const { setCredentials, logout } = authStateSlice.actions;
export default authStateSlice.reducer;
