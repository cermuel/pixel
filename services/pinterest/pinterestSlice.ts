import {
  ExploreData,
  GetSinglePhotoResponse,
  SearchParams,
  SearchResponse,
} from '@/types/slices/search';
import { apiSlice } from '../api/apiSlice';

const pinterestSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    search: builder.query<SearchResponse['data'], SearchParams>({
      query: (params) => ({
        url: `/search/photos`,
        method: 'GET',
        params: { ...params, trimmed: false },
      }),
      providesTags: ['Search'],
    }),

    infiniteSearch: builder.query<SearchResponse['data'], Omit<SearchParams, 'query'>>({
      query: (params) => ({
        url: `/search/photos`,
        method: 'GET',
        params: { ...params, trimmed: false },
      }),
      providesTags: ['Explore'],

      serializeQueryArgs: ({ queryArgs }) => {
        const { page, ...rest } = queryArgs;
        return rest;
      },

      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          return newItems;
        }
        const existingIds = new Set(currentCache.results.map((item) => item.id));
        const uniqueNewResults = newItems.results.filter((item) => !existingIds.has(item.id));

        return {
          ...currentCache,
          results: [...currentCache.results, ...uniqueNewResults],
          total_pages: newItems.total_pages,
        };
      },
      keepUnusedDataFor: 60,
    }),

    explore: builder.query<ExploreData[], Omit<SearchParams, 'query'>>({
      query: (params) => ({
        url: `/photos`,
        method: 'GET',
        params: { ...params, trimmed: false },
      }),
      providesTags: ['Explore'],
    }),
    singlePhoto: builder.query<GetSinglePhotoResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/photos/${id}`,
        method: 'GET',
      }),
      providesTags: ['Photo'],
    }),
  }),
});

export const {
  useSearchQuery,
  useLazySearchQuery,
  useExploreQuery,
  useLazyExploreQuery,
  useSinglePhotoQuery,
  useInfiniteSearchQuery,
} = pinterestSlice;
