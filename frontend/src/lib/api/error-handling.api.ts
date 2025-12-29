import { apiClient } from './client';
import {
  SimulateRetryRequest,
  SimulateRetryResponse,
  GetCircuitStateRequest,
  GetCircuitStateResponse,
  ResetCircuitRequest,
  SimulateCircuitBreakerRequest,
  SimulateCircuitBreakerResponse,
  SimulateFallbackRequest,
  SimulateFallbackResponse,
} from '@/types/error-handling';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export const errorHandlingApi = {
  simulateRetry: async (
    data: SimulateRetryRequest,
  ): Promise<SimulateRetryResponse> => {
    const response = await apiClient.post<ApiResponse<SimulateRetryResponse>>(
      '/api/v1/error-handling/simulate-retry',
      data,
    );
    return response.data.data;
  },

  getCircuitState: async (
    data: GetCircuitStateRequest,
  ): Promise<GetCircuitStateResponse> => {
    const response = await apiClient.post<ApiResponse<GetCircuitStateResponse>>(
      '/api/v1/error-handling/circuit-state',
      data,
    );
    return response.data.data;
  },

  resetCircuit: async (data: ResetCircuitRequest): Promise<void> => {
    await apiClient.post('/api/v1/error-handling/reset-circuit', data);
  },

  simulateCircuitBreaker: async (
    data: SimulateCircuitBreakerRequest,
  ): Promise<SimulateCircuitBreakerResponse> => {
    const response = await apiClient.post<
      ApiResponse<SimulateCircuitBreakerResponse>
    >('/api/v1/error-handling/simulate-circuit-breaker', data);
    return response.data.data;
  },

  simulateFallback: async (
    data: SimulateFallbackRequest,
  ): Promise<SimulateFallbackResponse> => {
    const response = await apiClient.post<ApiResponse<SimulateFallbackResponse>>(
      '/api/v1/error-handling/simulate-fallback',
      data,
    );
    return response.data.data;
  },
};




