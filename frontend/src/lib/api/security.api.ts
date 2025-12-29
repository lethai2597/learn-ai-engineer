import { apiClient } from './client';
import {
  DetectInjectionRequest,
  DetectInjectionResponse,
  ModerateContentRequest,
  ModerateContentResponse,
  DetectPiiRequest,
  DetectPiiResponse,
  RedactPiiRequest,
  RedactPiiResponse,
  CheckRateLimitRequest,
  CheckRateLimitResponse,
} from '@/types/security';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export const securityApi = {
  detectInjection: async (
    data: DetectInjectionRequest,
  ): Promise<DetectInjectionResponse> => {
    const response = await apiClient.post<ApiResponse<DetectInjectionResponse>>(
      '/api/v1/security/detect-injection',
      data,
    );
    return response.data.data;
  },

  moderateContent: async (
    data: ModerateContentRequest,
  ): Promise<ModerateContentResponse> => {
    const response = await apiClient.post<ApiResponse<ModerateContentResponse>>(
      '/api/v1/security/moderate',
      data,
    );
    return response.data.data;
  },

  detectPii: async (data: DetectPiiRequest): Promise<DetectPiiResponse> => {
    const response = await apiClient.post<ApiResponse<DetectPiiResponse>>(
      '/api/v1/security/detect-pii',
      data,
    );
    return response.data.data;
  },

  redactPii: async (data: RedactPiiRequest): Promise<RedactPiiResponse> => {
    const response = await apiClient.post<ApiResponse<RedactPiiResponse>>(
      '/api/v1/security/redact-pii',
      data,
    );
    return response.data.data;
  },

  checkRateLimit: async (
    data: CheckRateLimitRequest,
  ): Promise<CheckRateLimitResponse> => {
    const response = await apiClient.post<ApiResponse<CheckRateLimitResponse>>(
      '/api/v1/security/check-rate-limit',
      data,
    );
    return response.data.data;
  },
};




