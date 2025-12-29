import { useMutation } from "@tanstack/react-query";
import { modelComparisonApi } from "@/lib/api/model-comparison.api";
import {
  CompareModelsRequest,
  CompareModelsResponse,
  ModelRouterRequest,
  ModelRouterResponse,
} from "@/types/model-comparison";

export const useModelComparison = () => {
  return useMutation<CompareModelsResponse, Error, CompareModelsRequest>({
    mutationFn: modelComparisonApi.compareModels,
  });
};

export const useModelRouter = () => {
  return useMutation<ModelRouterResponse, Error, ModelRouterRequest>({
    mutationFn: modelComparisonApi.modelRouter,
  });
};









