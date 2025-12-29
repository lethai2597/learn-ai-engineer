import { apiClient } from "./client";
import {
  CreateEmbeddingsRequest,
  CreateEmbeddingsResponse,
  SemanticSearchRequest,
  SemanticSearchResponse,
} from "@/types/embeddings";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export const embeddingsApi = {
  createEmbeddings: async (
    data: CreateEmbeddingsRequest
  ): Promise<CreateEmbeddingsResponse> => {
    const response = await apiClient.post<
      ApiResponse<CreateEmbeddingsResponse>
    >("/api/v1/embeddings/create", data);
    return response.data.data;
  },

  semanticSearch: async (
    data: SemanticSearchRequest
  ): Promise<SemanticSearchResponse> => {
    const response = await apiClient.post<ApiResponse<SemanticSearchResponse>>(
      "/api/v1/embeddings/search",
      data
    );
    return response.data.data;
  },
};









