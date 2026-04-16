import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../../app/api';
import type { 
  Collection, 
  CollectionResponse, 
  CreateCollectionPayload, 
  UpdateCollectionPayload 
} from '../../../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const collectionsApi = createApi({
  reducerPath: 'collectionsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Collection'],
  endpoints: (builder) => ({
    createCollection: builder.mutation<Collection, CreateCollectionPayload>({
      query: (payload) => ({
        url: '/collections/',
        method: 'POST',
        body: payload
      }),
      transformResponse: (response: CollectionResponse) => response.data.collection!,
      invalidatesTags: ['Collection']
    }),

    getUserCollections: builder.query<Collection[], void>({
      query: () => ({
        url: '/collections/'
      }),
      transformResponse: (response: CollectionResponse) => response.data.collections || [],
      providesTags: ['Collection']
    }),

    getPublicCollections: builder.query<Collection[], void>({
      query: () => ({
        url: '/collections/public'
      }),
      transformResponse: (response: CollectionResponse) => response.data.collections || [],
      providesTags: ['Collection']
    }),

    getCollectionById: builder.query<Collection, string>({
      query: (id) => ({
        url: `/collections/${id}`
      }),
      transformResponse: (response: CollectionResponse) => response.data.collection!,
      providesTags: ['Collection']
    }),

    updateCollection: builder.mutation<
      Collection,
      { id: string; payload: UpdateCollectionPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/collections/${id}`,
        method: 'PATCH',
        body: payload
      }),
      transformResponse: (response: CollectionResponse) => response.data.collection!,
      invalidatesTags: ['Collection']
    }),

    deleteCollection: builder.mutation<void, string>({
      query: (id) => ({
        url: `/collections/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Collection']
    }),

    addDishToCollection: builder.mutation<
      Collection,
      { collectionId: string; dishId: string }
    >({
      query: (payload) => ({
        url: '/collections/dish/add',
        method: 'POST',
        body: payload
      }),
      transformResponse: (response: CollectionResponse) => response.data.collection!,
      invalidatesTags: ['Collection']
    }),

    removeDishFromCollection: builder.mutation<
      Collection,
      { collectionId: string; dishId: string }
    >({
      query: (payload) => ({
        url: '/collections/dish/remove',
        method: 'POST',
        body: payload
      }),
      transformResponse: (response: CollectionResponse) => response.data.collection!,
      invalidatesTags: ['Collection']
    }),

    searchCollections: builder.query<Collection[], string>({
      query: (keyword) => ({
        url: '/collections/search',
        params: { keyword }
      }),
      transformResponse: (response: CollectionResponse) => response.data.collections || [],
      providesTags: ['Collection']
    })
  })
});

export const {
  useCreateCollectionMutation,
  useGetUserCollectionsQuery,
  useGetPublicCollectionsQuery,
  useGetCollectionByIdQuery,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
  useAddDishToCollectionMutation,
  useRemoveDishFromCollectionMutation,
  useSearchCollectionsQuery
} = collectionsApi;
