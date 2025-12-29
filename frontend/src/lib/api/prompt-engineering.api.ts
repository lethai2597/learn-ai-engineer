import { apiClient } from "./client";
import { PromptTechnique } from "@/types/prompt-engineering";

/**
 * API functions cho Prompt Engineering
 */

export interface TestPromptRequest {
  technique: PromptTechnique;
  userInput: string;
  role?: string;
  examples?: Array<{ input: string; output: string }>;
  systemMessage?: string;
  model?: string;
  temperature?: number;
}

export interface TestPromptResponse {
  response: string;
  technique: string;
}

export interface ClassifyEmailRequest {
  email: string;
  technique: PromptTechnique;
}

export interface ClassifyEmailResponse {
  category: string;
  response: string;
  technique: string;
}

export interface ExtractCVRequest {
  cvText: string;
  technique: PromptTechnique;
}

export interface ExtractCVResponse {
  data: Record<string, any>;
  response: string;
  technique: string;
}

export interface SolveLogicProblemRequest {
  problem: string;
  technique: PromptTechnique;
}

export interface SolveLogicProblemResponse {
  solution: string;
  response: string;
  technique: string;
}

/**
 * Response wrapper từ TransformInterceptor
 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export const promptEngineeringApi = {
  /**
   * Test generic prompt
   */
  testPrompt: async (data: TestPromptRequest): Promise<TestPromptResponse> => {
    const response = await apiClient.post<ApiResponse<TestPromptResponse>>(
      "/api/v1/prompt-engineering/test-prompt",
      data
    );
    // Backend TransformInterceptor wrap response trong { success, data, timestamp }
    // Nên cần access response.data.data
    return response.data.data;
  },

  /**
   * Bài 1: Email Classification
   */
  classifyEmail: async (
    data: ClassifyEmailRequest
  ): Promise<ClassifyEmailResponse> => {
    const response = await apiClient.post<ApiResponse<ClassifyEmailResponse>>(
      "/api/v1/prompt-engineering/classify-email",
      data
    );
    return response.data.data;
  },

  /**
   * Bài 2: CV Extraction
   */
  extractCV: async (data: ExtractCVRequest): Promise<ExtractCVResponse> => {
    const response = await apiClient.post<ApiResponse<ExtractCVResponse>>(
      "/api/v1/prompt-engineering/extract-cv",
      data
    );
    return response.data.data;
  },

  /**
   * Bài 3: Logic Problem Solving
   */
  solveLogicProblem: async (
    data: SolveLogicProblemRequest
  ): Promise<SolveLogicProblemResponse> => {
    const response = await apiClient.post<
      ApiResponse<SolveLogicProblemResponse>
    >("/api/v1/prompt-engineering/solve-logic", data);
    return response.data.data;
  },
};









