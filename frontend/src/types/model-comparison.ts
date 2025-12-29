export interface CompareModelsRequest {
  prompt: string;
  models: string[];
  temperature?: number;
}

export interface ModelResult {
  model: string;
  text: string;
  latency: number;
  estimatedCost: number;
  inputTokens: number;
  outputTokens: number;
  error?: string;
}

export interface CompareModelsResponse {
  results: ModelResult[];
  totalTime: number;
}

export interface ModelRouterRequest {
  prompt: string;
  taskType?: string;
  temperature?: number;
}

export interface ModelRouterResponse {
  selectedModel: string;
  reason: string;
  result: string;
  latency: number;
  estimatedCost: number;
  inputTokens: number;
  outputTokens: number;
}

export interface ModelInfo {
  name: string;
  inputPrice: number;
  outputPrice: number;
  strengths: string[];
  weaknesses: string[];
}


