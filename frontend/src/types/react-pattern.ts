export interface ReActStep {
  thought?: string;
  action?: {
    functionName: string;
    arguments: Record<string, any>;
  };
  observation?: any;
}

export interface ReactCalculatorRequest {
  query: string;
  maxIterations?: number;
}

export interface ReactCalculatorResponse {
  steps: ReActStep[];
  finalResponse: string;
  latency: number;
  iterations: number;
}

export interface ReactResearchRequest {
  query: string;
  maxIterations?: number;
}

export interface ReactResearchResponse {
  steps: ReActStep[];
  finalResponse: string;
  latency: number;
  iterations: number;
}

