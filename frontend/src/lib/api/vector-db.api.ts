import { apiClient } from "./client";
import {
  IngestDocumentsRequest,
  IngestDocumentsResponse,
  VectorSearchRequest,
  VectorSearchResponse,
  DeleteDocumentsRequest,
  DeleteDocumentsResponse,
} from "@/types/vector-db";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export const vectorDbApi = {
  ingestDocuments: async (
    data: IngestDocumentsRequest
  ): Promise<IngestDocumentsResponse> => {
    const response = await apiClient.post<
      ApiResponse<IngestDocumentsResponse>
    >("/api/v1/vector-db/ingest", data);
    return response.data.data; 
  },

  vectorSearch: async (
    data: VectorSearchRequest
  ): Promise<VectorSearchResponse> => {
    const response = await apiClient.post<ApiResponse<VectorSearchResponse>>(
      "/api/v1/vector-db/search",
      data
    );
    return response.data.data;
  },

  deleteDocuments: async (
    data: DeleteDocumentsRequest
  ): Promise<DeleteDocumentsResponse> => {
    const response = await apiClient.delete<ApiResponse<DeleteDocumentsResponse>>(
      "/api/v1/vector-db/documents",
      { data }
    );
    return response.data.data;
  },
};




