import { apiClient } from "./client";
import {
  CompareModelsRequest,
  CompareModelsResponse,
  ModelRouterRequest,
  ModelRouterResponse,
} from "@/types/model-comparison";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export const modelComparisonApi = {
  compareModels: async (
    data: CompareModelsRequest
  ): Promise<CompareModelsResponse> => {
    const response = await apiClient.post<ApiResponse<CompareModelsResponse>>(
      "/api/v1/model-comparison/compare",
      data
    );
    return response.data.data;
  },

  modelRouter: async (
    data: ModelRouterRequest
  ): Promise<ModelRouterResponse> => {
    const response = await apiClient.post<ApiResponse<ModelRouterResponse>>(
      "/api/v1/model-comparison/router",
      data
    );
    return response.data.data;
  },
};









