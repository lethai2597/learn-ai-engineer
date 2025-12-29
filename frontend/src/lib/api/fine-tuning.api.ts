import { apiClient } from './client';
import {
  ValidateDatasetRequest,
  ValidateDatasetResponse,
  PrepareDatasetRequest,
  PrepareDatasetResponse,
} from '@/types/fine-tuning';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export const fineTuningApi = {
  validateDataset: async (
    data: ValidateDatasetRequest
  ): Promise<ValidateDatasetResponse> => {
    const response = await apiClient.post<ApiResponse<ValidateDatasetResponse>>(
      '/api/v1/fine-tuning/validate-dataset',
      data
    );
    return response.data.data;
  },

  prepareDataset: async (
    data: PrepareDatasetRequest
  ): Promise<PrepareDatasetResponse> => {
    const response = await apiClient.post<ApiResponse<PrepareDatasetResponse>>(
      '/api/v1/fine-tuning/prepare-dataset',
      data
    );
    return response.data.data;
  },
};




