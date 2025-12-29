import { useMutation } from '@tanstack/react-query';
import { reactPatternApi } from '@/lib/api/react-pattern.api';
import {
  ReactCalculatorRequest,
  ReactCalculatorResponse,
  ReactResearchRequest,
  ReactResearchResponse,
} from '@/types/react-pattern';

export const useReactCalculator = () => {
  return useMutation<ReactCalculatorResponse, Error, ReactCalculatorRequest>({
    mutationFn: reactPatternApi.calculator,
  });
};

export const useReactResearch = () => {
  return useMutation<ReactResearchResponse, Error, ReactResearchRequest>({
    mutationFn: reactPatternApi.research,
  });
};

