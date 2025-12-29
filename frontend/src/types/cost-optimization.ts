export interface CountTokensRequest {
  text: string;
  model: string;
}

export interface CountTokensResponse {
  tokenCount: number;
  estimatedCost: number;
}

export interface CheckCacheRequest {
  query: string;
  threshold?: number;
}

export interface CheckCacheResponse {
  cached: boolean;
  response?: string;
  similarity?: number;
}

export interface StoreCacheRequest {
  query: string;
  response: string;
}

export interface StoreCacheResponse {
  success: boolean;
}

export interface CacheStats {
  totalEntries: number;
  hitRate: number;
  savings: number;
}

export interface AnalyzeCostRequest {
  prompt: string;
  model: string;
  maxTokens?: number;
}

export interface AnalyzeCostResponse {
  inputTokens: number;
  estimatedOutputTokens: number;
  estimatedCost: number;
  recommendations: string[];
}

export interface ModelPricing {
  [model: string]: {
    input: number;
    output: number;
  };
}

export interface SelectModelRequest {
  prompt: string;
  taskType: 'simple' | 'medium' | 'complex';
}

export interface SelectModelResponse {
  recommendedModel: string;
  reason: string;
  estimatedCost: number;
}




