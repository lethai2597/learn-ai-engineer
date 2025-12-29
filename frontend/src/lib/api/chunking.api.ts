import { apiClient } from './client';
import {
  ChunkTextRequest,
  ChunkTextResponse,
} from '@/types/chunking';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export const chunkingApi = {
  chunkText: async (
    data: ChunkTextRequest
  ): Promise<ChunkTextResponse> => {
    const response = await apiClient.post<ApiResponse<ChunkTextResponse>>(
      '/api/v1/chunking/chunk',
      data
    );
    return response.data.data;
  },
};







