import { apiClient } from './client';
import {
  RunEvaluationRequest,
  RunEvaluationResponse,
} from '@/types/evaluation';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export const evaluationApi = {
  runEvaluations: async (
    data: RunEvaluationRequest,
  ): Promise<RunEvaluationResponse> => {
    const response = await apiClient.post<ApiResponse<RunEvaluationResponse>>(
      '/api/v1/evaluations/run',
      data,
    );
    return response.data.data;
  },
};






