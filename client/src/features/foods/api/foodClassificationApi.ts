import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// AI Server base URL
const AI_API_BASE_URL = (import.meta.env.VITE_AI_API_BASE_URL as string) || 'http://localhost:5001';

interface ClassificationPrediction {
  class_id: number;
  class_slug: string;
  class_name: string;
  confidence: number;
  score: number;
}

interface ClassificationResponse {
  success: boolean;
  prediction: ClassificationPrediction;
  top_5: ClassificationPrediction[];
  filename: string;
}

interface LabelsResponse {
  total_classes: number;
  labels: Record<string, string>;
}

interface LabelsAllResponse {
  total_classes: number;
  labels: Record<
    string,
    {
      slug: string;
      name_vn: string;
    }
  >;
}

export const foodClassificationApi = createApi({
  reducerPath: 'foodClassificationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${AI_API_BASE_URL}/`,
  }),
  endpoints: (builder) => ({
    // Classify single image
    classifyImage: builder.mutation<ClassificationResponse, FormData>({
      query: (formData) => ({
        url: 'classify',
        method: 'POST',
        body: formData,
      }),
    }),

    // Batch classify multiple images
    batchClassifyImages: builder.mutation<
      {
        total: number;
        successful: number;
        results: Array<{
          filename: string;
          success: boolean;
          prediction?: ClassificationPrediction;
          error?: string;
        }>;
      },
      FormData
    >({
      query: (formData) => ({
        url: 'batch-classify',
        method: 'POST',
        body: formData,
      }),
    }),

    // Get AI labels (slug format)
    getLabels: builder.query<LabelsResponse, void>({
      query: () => 'labels',
    }),

    // Get Vietnamese labels
    getLabelsVN: builder.query<LabelsResponse, void>({
      query: () => 'labels-vn',
    }),

    // Get all labels (both formats)
    getAllLabels: builder.query<LabelsAllResponse, void>({
      query: () => 'labels-all',
    }),

    // Health check
    healthCheck: builder.query<{ status: string }, void>({
      query: () => 'health',
    }),
  }),
});

export const {
  useClassifyImageMutation,
  useBatchClassifyImagesMutation,
  useGetLabelsQuery,
  useGetLabelsVNQuery,
  useGetAllLabelsQuery,
  useHealthCheckQuery,
} = foodClassificationApi;
