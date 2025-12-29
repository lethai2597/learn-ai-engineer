import { useMutation } from '@tanstack/react-query';
import { errorHandlingApi } from '@/lib/api/error-handling.api';
import {
  SimulateRetryRequest,
  GetCircuitStateRequest,
  ResetCircuitRequest,
  SimulateCircuitBreakerRequest,
  SimulateFallbackRequest,
} from '@/types/error-handling';

export const useSimulateRetry = () => {
  return useMutation({
    mutationFn: (data: SimulateRetryRequest) =>
      errorHandlingApi.simulateRetry(data),
  });
};

export const useGetCircuitState = () => {
  return useMutation({
    mutationFn: (data: GetCircuitStateRequest) =>
      errorHandlingApi.getCircuitState(data),
  });
};

export const useResetCircuit = () => {
  return useMutation({
    mutationFn: (data: ResetCircuitRequest) =>
      errorHandlingApi.resetCircuit(data),
  });
};

export const useSimulateCircuitBreaker = () => {
  return useMutation({
    mutationFn: (data: SimulateCircuitBreakerRequest) =>
      errorHandlingApi.simulateCircuitBreaker(data),
  });
};

export const useSimulateFallback = () => {
  return useMutation({
    mutationFn: (data: SimulateFallbackRequest) =>
      errorHandlingApi.simulateFallback(data),
  });
};




