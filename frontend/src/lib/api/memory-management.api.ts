import { apiClient } from './client';
import {
  ChatRequest,
  ChatResponse,
  ChatMessage,
} from '@/types/memory-management';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export const memoryManagementApi = {
  chat: async (data: ChatRequest): Promise<ChatResponse> => {
    const response = await apiClient.post<ApiResponse<ChatResponse>>(
      '/api/v1/memory-management/chat',
      data,
    );
    return response.data.data;
  },

  getSession: async (sessionId: string): Promise<ChatMessage[]> => {
    const response = await apiClient.get<ApiResponse<ChatMessage[]>>(
      `/api/v1/memory-management/sessions/${sessionId}`,
    );
    return response.data.data;
  },

  deleteSession: async (sessionId: string): Promise<void> => {
    await apiClient.delete(`/api/v1/memory-management/sessions/${sessionId}`);
  },
};






