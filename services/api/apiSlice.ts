import AsyncStorage from '@react-native-async-storage/async-storage';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Constants from 'expo-constants';
import { RootState } from '../store';

const BASE_URI: string = 'https://api.unsplash.com';

const API_KEY: string = Constants.expoConfig?.extra?.SPLASH_ACCESS_KEY;
// const API_KEY: string = Constants.expoConfig?.extra?.SPLASH_BACKUP_KEY;

const customBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URI,
  prepareHeaders: async (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.authState.token || (await AsyncStorage.getItem('token'));

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithClientId = async (args: any, api: any, extraOptions: any) => {
  let newArgs;

  if (typeof args === 'string') {
    newArgs = {
      url: args,
      params: {
        client_id: API_KEY,
      },
    };
  } else {
    newArgs = {
      ...args,
      params: {
        ...(args.params ?? {}),
        client_id: API_KEY,
      },
    };
  }

  return customBaseQuery(newArgs, api, extraOptions);
};

export const apiSlice = createApi({
  keepUnusedDataFor: 60 * 10,
  reducerPath: 'api',
  baseQuery: baseQueryWithClientId,
  endpoints: () => ({}),
  tagTypes: ['Explore', 'Photo', 'Search', 'User'],
});
