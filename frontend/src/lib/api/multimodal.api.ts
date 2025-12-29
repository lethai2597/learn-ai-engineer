import { apiClient } from "./client";
import {
  AnalyzeImageRequest,
  AnalyzeImageResponse,
} from "@/types/multimodal";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export const multimodalApi = {
  analyzeImage: async (
    data: AnalyzeImageRequest
  ): Promise<AnalyzeImageResponse> => {
    const response = await apiClient.post<ApiResponse<AnalyzeImageResponse>>(
      "/api/v1/multimodal/analyze-image",
      data
    );
    return response.data.data;
  },
};




