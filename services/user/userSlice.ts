import { apiSlice } from '../api/apiSlice';
import {
  ChatResponse,
  CreateGroupchatPayload,
  CreateGroupResponse,
  GetGroupResponse,
  GetSingleGroupResponse,
  ProfileResponse,
  UserResponse,
} from '@/types/slices/user';

const BASE_URI = 'http://192.168.1.22:4444';
// 'https://pixel-server-pule.onrender.com';

const authSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    profile: builder.query<ProfileResponse, unknown>({
      query: () => ({
        url: `${BASE_URI}/account/`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    users: builder.query<UserResponse, { query: string }>({
      query: (params) => ({
        url: `${BASE_URI}/account/users`,
        method: 'GET',
        params,
      }),
      providesTags: ['User'],
    }),
    chats: builder.query<ChatResponse, { query: string }>({
      query: (params) => ({
        url: `${BASE_URI}/account/chats`,
        method: 'GET',
        params,
      }),
      providesTags: ['User'],
    }),
    groups: builder.query<GetGroupResponse, { query: string }>({
      query: (params) => ({
        url: `${BASE_URI}/groupchat`,
        method: 'GET',
        params,
      }),
      providesTags: ['User'],
    }),
    singleGroup: builder.query<GetSingleGroupResponse, { id: string | number }>({
      query: ({ id }) => ({
        url: `${BASE_URI}/groupchat/${id}`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    createGroup: builder.mutation<CreateGroupResponse, CreateGroupchatPayload>({
      query: (body) => ({
        url: `${BASE_URI}/groupchat`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useProfileQuery,
  useUsersQuery,
  useChatsQuery,
  useCreateGroupMutation,
  useGroupsQuery,
  useSingleGroupQuery,
} = authSlice;
