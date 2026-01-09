import {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from '@/types/slices/auth';
import { apiSlice } from '../api/apiSlice';

const BASE_URI =
  // 'http://192.168.100.152:4444';
  'https://pixel-server-pule.onrender.com';

const authSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (body) => ({
        url: `${BASE_URI}/auth/`,
        method: 'POST',
        body,
      }),
    }),
    register: builder.mutation<RegisterResponse, RegisterPayload>({
      query: (body) => ({
        url: `${BASE_URI}/auth/register`,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authSlice;
