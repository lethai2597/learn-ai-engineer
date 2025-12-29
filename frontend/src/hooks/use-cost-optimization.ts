import { useMutation, useQuery } from '@tanstack/react-query';
import { costOptimizationApi } from '@/lib/api/cost-optimization.api';
import {
  CountTokensRequest,
  CheckCacheRequest,
  StoreCacheRequest,
  AnalyzeCostRequest,
  SelectModelRequest,
} from '@/types/cost-optimization';

export const useCountTokens = () => {
  return useMutation({
    mutationFn: (data: CountTokensRequest) =>
      costOptimizationApi.countTokens(data),
  });
};

export const useSemanticCache = () => {
  return {
    check: useMutation({
      mutationFn: (data: CheckCacheRequest) =>
        costOptimizationApi.checkSemanticCache(data),
    }),
    store: useMutation({
      mutationFn: (data: StoreCacheRequest) =>
        costOptimizationApi.storeSemanticCache(data),
    }),
    stats: useQuery({
      queryKey: ['cost-optimization', 'cache-stats'],
      queryFn: () => costOptimizationApi.getCacheStats(),
    }),
  };
};

export const useCostAnalysis = () => {
  return useMutation({
    mutationFn: (data: AnalyzeCostRequest) =>
      costOptimizationApi.analyzeCost(data),
  });
};

export const useModelPricing = () => {
  return useQuery({
    queryKey: ['cost-optimization', 'model-pricing'],
    queryFn: () => costOptimizationApi.getModelPricing(),
  });
};

export const useModelSelection = () => {
  return useMutation({
    mutationFn: (data: SelectModelRequest) =>
      costOptimizationApi.selectModel(data),
  });
};




