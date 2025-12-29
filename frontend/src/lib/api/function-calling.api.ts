import { apiClient } from './client';
import {
  CalculatorRequest,
  CalculatorResponse,
  WeatherRequest,
  WeatherResponse,
  AssistantRequest,
  AssistantResponse,
} from '@/types/function-calling';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export const functionCallingApi = {
  calculate: async (
    data: CalculatorRequest,
  ): Promise<CalculatorResponse> => {
    const response = await apiClient.post<ApiResponse<CalculatorResponse>>(
      '/api/v1/function-calling/calculator',
      data,
    );
    return response.data.data;
  },

  getWeather: async (data: WeatherRequest): Promise<WeatherResponse> => {
    const response = await apiClient.post<ApiResponse<WeatherResponse>>(
      '/api/v1/function-calling/weather',
      data,
    );
    return response.data.data;
  },

  assistant: async (data: AssistantRequest): Promise<AssistantResponse> => {
    const response = await apiClient.post<ApiResponse<AssistantResponse>>(
      '/api/v1/function-calling/assistant',
      data,
    );
    return response.data.data;
  },
};






