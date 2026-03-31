import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:5000/api';

export interface Tags {
  category?: string[];
  ingredient?: string[];
  meal_time?: string[];
  cooking_method?: string[];
  taste?: string[];
  purpose?: string[];
  diet?: string[];
}

export interface Food {
  _id: string;
  name: string;
  intro: string;
  ingredients: string;
  cooking: string;
  tags: Tags;
  image: string;
  likes: string[];
  likeCount: number;
  recommendations: Array<{
    userId: string;
    count: number;
    monthResetCount: number;
    lastResetDate: string;
  }>;
  recommendationCount: number;
  recommendationAllTime: number;
  inCollections: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FoodResponse {
  success: boolean;
  message: string;
  data: {
    food?: Food;
    foods?: Food[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages?: number;
    };
    hasLiked?: boolean;
    imageUrl?: string;
  };
}

export const foodApi = createApi({
  reducerPath: 'foodApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/`,
    credentials: 'include'
  }),
  tagTypes: ['Food', 'Ranking'],
  endpoints: (builder) => ({
    // Get all foods
    getAllFoods: builder.query<FoodResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => `foods?page=${page}&limit=${limit}`,
      providesTags: ['Food']
    }),

    // Get food by ID
    getFoodById: builder.query<FoodResponse, string>({
      query: (id) => `foods/${id}`,
      providesTags: ['Food']
    }),

    // Search foods
    searchFoods: builder.query<FoodResponse, { q: string; page?: number; limit?: number }>({
      query: ({ q, page = 1, limit = 10 }) =>
        `foods/search?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`
    }),

    // Filter foods by tags
    filterFoods: builder.query<
      FoodResponse,
      {
        categories?: string[];
        ingredients?: string[];
        mealTimes?: string[];
        cookingMethods?: string[];
        tastes?: string[];
        purposes?: string[];
        diets?: string[];
        page?: number;
        limit?: number;
      }
    >({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.categories?.length) params.append('categories', filters.categories.join(','));
        if (filters.ingredients?.length) params.append('ingredients', filters.ingredients.join(','));
        if (filters.mealTimes?.length) params.append('mealTimes', filters.mealTimes.join(','));
        if (filters.cookingMethods?.length)
          params.append('cookingMethods', filters.cookingMethods.join(','));
        if (filters.tastes?.length) params.append('tastes', filters.tastes.join(','));
        if (filters.purposes?.length) params.append('purposes', filters.purposes.join(','));
        if (filters.diets?.length) params.append('diets', filters.diets.join(','));
        params.append('page', String(filters.page || 1));
        params.append('limit', String(filters.limit || 10));

        return `foods/filter?${params.toString()}`;
      },
      providesTags: ['Food']
    }),

    // Get food ranking
    getFoodRanking: builder.query<
      FoodResponse,
      { limit?: number; sortBy?: 'likes' | 'recommendations' | 'combined' }
    >({
      query: ({ limit = 10, sortBy = 'combined' }) => `foods/ranking?limit=${limit}&sortBy=${sortBy}`,
      providesTags: ['Ranking']
    }),

    // Create food
    createFood: builder.mutation<FoodResponse, FormData>({
      query: (formData) => ({
        url: 'foods',
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['Food', 'Ranking']
    }),

    // Update food
    updateFood: builder.mutation<FoodResponse, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `foods/${id}`,
        method: 'PUT',
        body: formData
      }),
      invalidatesTags: ['Food']
    }),

    // Delete food
    deleteFood: builder.mutation<FoodResponse, string>({
      query: (id) => ({
        url: `foods/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Food']
    }),

    // Like food
    likeFood: builder.mutation<FoodResponse, string>({
      query: (foodId) => ({
        url: `foods/${foodId}/like`,
        method: 'POST'
      }),
      invalidatesTags: ['Food', 'Ranking']
    }),

    // Unlike food
    unlikeFood: builder.mutation<FoodResponse, string>({
      query: (foodId) => ({
        url: `foods/${foodId}/like`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Food', 'Ranking']
    }),

    // Check if user liked food
    checkIfLiked: builder.query<FoodResponse, string>({
      query: (foodId) => `foods/${foodId}/like/check`
    }),

    // Recommend food
    recommendFood: builder.mutation<FoodResponse, string>({
      query: (foodId) => ({
        url: `foods/${foodId}/recommend`,
        method: 'POST'
      }),
      invalidatesTags: ['Food', 'Ranking']
    }),

    // Add food to collection
    addToCollection: builder.mutation<FoodResponse, { foodId: string; collectionId: string }>({
      query: ({ foodId, collectionId }) => ({
        url: `foods/${foodId}/collections/add`,
        method: 'POST',
        body: { collectionId }
      }),
      invalidatesTags: ['Food']
    }),

    // Remove food from collection
    removeFromCollection: builder.mutation<FoodResponse, { foodId: string; collectionId: string }>({
      query: ({ foodId, collectionId }) => ({
        url: `foods/${foodId}/collections/remove`,
        method: 'POST',
        body: { collectionId }
      }),
      invalidatesTags: ['Food']
    }),

    // Upload food image (separate endpoint for testing)
    uploadFoodImage: builder.mutation<FoodResponse, FormData>({
      query: (formData) => ({
        url: 'foods/upload',
        method: 'POST',
        body: formData
      })
    })
  })
});

export const {
  useGetAllFoodsQuery,
  useGetFoodByIdQuery,
  useSearchFoodsQuery,
  useFilterFoodsQuery,
  useGetFoodRankingQuery,
  useCreateFoodMutation,
  useUpdateFoodMutation,
  useDeleteFoodMutation,
  useLikeFoodMutation,
  useUnlikeFoodMutation,
  useCheckIfLikedQuery,
  useRecommendFoodMutation,
  useAddToCollectionMutation,
  useRemoveFromCollectionMutation,
  useUploadFoodImageMutation
} = foodApi;
