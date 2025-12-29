import { apiClient } from './client';
import {
  CountTokensRequest,
  CountTokensResponse,
  CheckCacheRequest,
  CheckCacheResponse,
  StoreCacheRequest,
  StoreCacheResponse,
  CacheStats,
  AnalyzeCostRequest,
  AnalyzeCostResponse,
  ModelPricing,
  SelectModelRequest,
  SelectModelResponse,
} from '@/types/cost-optimization';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export const costOptimizationApi = {
  countTokens: async (
    data: CountTokensRequest,
  ): Promise<CountTokensResponse> => {
    const response = await apiClient.post<ApiResponse<CountTokensResponse>>(
      '/api/v1/cost-optimization/count-tokens',
      data,
    );
    return response.data.data;
  },

  checkSemanticCache: async (
    data: CheckCacheRequest,
  ): Promise<CheckCacheResponse> => {
    const response = await apiClient.post<ApiResponse<CheckCacheResponse>>(
      '/api/v1/cost-optimization/semantic-cache/check',
      data,
    );
    return response.data.data;
  },

  storeSemanticCache: async (
    data: StoreCacheRequest,
  ): Promise<StoreCacheResponse> => {
    const response = await apiClient.post<ApiResponse<StoreCacheResponse>>(
      '/api/v1/cost-optimization/semantic-cache/store',
      data,
    );
    return response.data.data;
  },

  getCacheStats: async (): Promise<CacheStats> => {
    const response = await apiClient.get<ApiResponse<CacheStats>>(
      '/api/v1/cost-optimization/semantic-cache/stats',
    );
    return response.data.data;
  },

  analyzeCost: async (data: AnalyzeCostRequest): Promise<AnalyzeCostResponse> => {
    const response = await apiClient.post<ApiResponse<AnalyzeCostResponse>>(
      '/api/v1/cost-optimization/analyze',
      data,
    );
    return response.data.data;
  },

  getModelPricing: async (): Promise<ModelPricing> => {
    const response = await apiClient.get<ApiResponse<ModelPricing>>(
      '/api/v1/cost-optimization/model-pricing',
    );
    return response.data.data;
  },

  selectModel: async (
    data: SelectModelRequest,
  ): Promise<SelectModelResponse> => {
    const response = await apiClient.post<ApiResponse<SelectModelResponse>>(
      '/api/v1/cost-optimization/select-model',
      data,
    );
    return response.data.data;
  },
};




