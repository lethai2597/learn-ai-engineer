import { useMutation, useQuery } from "@tanstack/react-query";
import { localModelsApi } from "@/lib/api/local-models.api";
import {
  ChatRequest,
  ListModelsResponse,
} from "@/types/local-models";

export const useLocalChat = () => {
  return useMutation({
    mutationFn: (data: ChatRequest) => localModelsApi.chat(data),
  });
};

export const useListModels = () => {
  return useQuery<ListModelsResponse>({
    queryKey: ["local-models", "list"],
    queryFn: () => localModelsApi.listModels(),
    retry: false,
    refetchOnWindowFocus: false,
  });
};




