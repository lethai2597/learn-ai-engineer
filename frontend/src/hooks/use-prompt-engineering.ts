import { useMutation } from "@tanstack/react-query";
import {
  promptEngineeringApi,
  TestPromptRequest,
  ClassifyEmailRequest,
  ExtractCVRequest,
  SolveLogicProblemRequest,
} from "@/lib/api/prompt-engineering.api";

/**
 * React Query hooks cho Prompt Engineering
 */

export const useTestPrompt = () => {
  return useMutation({
    mutationFn: (data: TestPromptRequest) =>
      promptEngineeringApi.testPrompt(data),
  });
};

export const useClassifyEmail = () => {
  return useMutation({
    mutationFn: (data: ClassifyEmailRequest) =>
      promptEngineeringApi.classifyEmail(data),
  });
};

export const useExtractCV = () => {
  return useMutation({
    mutationFn: (data: ExtractCVRequest) =>
      promptEngineeringApi.extractCV(data),
  });
};

export const useSolveLogicProblem = () => {
  return useMutation({
    mutationFn: (data: SolveLogicProblemRequest) =>
      promptEngineeringApi.solveLogicProblem(data),
  });
};









