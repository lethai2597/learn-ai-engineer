import { useMutation } from '@tanstack/react-query';
import { evaluationApi } from '@/lib/api/evaluation.api';
import { RunEvaluationRequest } from '@/types/evaluation';

export const useRunEvaluations = () => {
  return useMutation({
    mutationFn: (data: RunEvaluationRequest) =>
      evaluationApi.runEvaluations(data),
  });
};






