import { apiClient } from "./client";
import {
  ChatRequest,
  ChatResponse,
  ListModelsResponse,
} from "@/types/local-models";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export const localModelsApi = {
  chat: async (data: ChatRequest): Promise<ChatResponse> => {
    const response = await apiClient.post<ApiResponse<ChatResponse>>(
      "/api/v1/local-models/chat",
      data
    );
    return response.data.data;
  },

  listModels: async (): Promise<ListModelsResponse> => {
    const response = await apiClient.get<ApiResponse<ListModelsResponse>>(
      "/api/v1/local-models/models"
    );
    return response.data.data;
  },
};




