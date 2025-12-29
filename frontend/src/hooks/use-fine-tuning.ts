import { useMutation } from '@tanstack/react-query';
import { fineTuningApi } from '@/lib/api/fine-tuning.api';
import {
  ValidateDatasetRequest,
  ValidateDatasetResponse,
  PrepareDatasetRequest,
  PrepareDatasetResponse,
} from '@/types/fine-tuning';

export const useValidateDataset = () => {
  return useMutation<ValidateDatasetResponse, Error, ValidateDatasetRequest>({
    mutationFn: (data) => fineTuningApi.validateDataset(data),
  });
};

export const usePrepareDataset = () => {
  return useMutation<PrepareDatasetResponse, Error, PrepareDatasetRequest>({
    mutationFn: (data) => fineTuningApi.prepareDataset(data),
  });
};




