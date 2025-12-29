export interface ChatRequest {
  message: string;
  model?: string;
}

export interface ChatResponse {
  response: string;
  model: string;
  tokens?: {
    input: number;
    output: number;
    total: number;
  };
}

export interface ListModelsResponse {
  models: string[];
}




