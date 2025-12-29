import { useMutation } from "@tanstack/react-query";
import { embeddingsApi } from "@/lib/api/embeddings.api";
import {
  CreateEmbeddingsRequest,
  CreateEmbeddingsResponse,
  SemanticSearchRequest,
  SemanticSearchResponse,
} from "@/types/embeddings";

export const useCreateEmbeddings = () => {
  return useMutation<CreateEmbeddingsResponse, Error, CreateEmbeddingsRequest>({
    mutationFn: embeddingsApi.createEmbeddings,
  });
};

export const useSemanticSearch = () => {
  return useMutation<SemanticSearchResponse, Error, SemanticSearchRequest>({
    mutationFn: embeddingsApi.semanticSearch,
  });
};









