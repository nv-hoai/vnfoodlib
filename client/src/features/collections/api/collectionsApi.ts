import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Collection {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  dishes: string[];
  isPublic: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCollectionPayload {
  name: string;
  description?: string;
  isPublic?: boolean;
  tags?: string[];
}

export interface UpdateCollectionPayload {
  name?: string;
  description?: string;
  isPublic?: boolean;
  tags?: string[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const collectionsApi = createApi({
  reducerPath: 'collectionsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/collections`,
    credentials: 'include'
  }),
  tagTypes: ['Collection'],
  endpoints: (builder) => ({
    createCollection: builder.mutation<Collection, CreateCollectionPayload>({
      query: (payload) => ({
        url: '/',
        method: 'POST',
        body: payload
      }),
      invalidatesTags: ['Collection']
    }),

    getUserCollections: builder.query<Collection[], void>({
      query: () => ({
        url: '/'
      }),
      providesTags: ['Collection']
    }),

    getPublicCollections: builder.query<Collection[], void>({
      query: () => ({
        url: '/public'
      }),
      providesTags: ['Collection']
    }),

    getCollectionById: builder.query<Collection, string>({
      query: (id) => ({
        url: `/${id}`
      }),
      providesTags: ['Collection']
    }),

    updateCollection: builder.mutation<
      Collection,
      { id: string; payload: UpdateCollectionPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: payload
      }),
      invalidatesTags: ['Collection']
    }),

    deleteCollection: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Collection']
    }),

    addDishToCollection: builder.mutation<
      Collection,
      { collectionId: string; dishId: string }
    >({
      query: (payload) => ({
        url: '/dish/add',
        method: 'POST',
        body: payload
      }),
      invalidatesTags: ['Collection']
    }),

    removeDishFromCollection: builder.mutation<
      Collection,
      { collectionId: string; dishId: string }
    >({
      query: (payload) => ({
        url: '/dish/remove',
        method: 'POST',
        body: payload
      }),
      invalidatesTags: ['Collection']
    }),

    searchCollections: builder.query<Collection[], string>({
      query: (keyword) => ({
        url: '/search',
        params: { keyword }
      }),
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
