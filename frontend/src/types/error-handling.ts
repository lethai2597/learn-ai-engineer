export interface SimulateRetryRequest {
  maxRetries?: number;
  baseDelay?: number;
  shouldFail?: boolean;
}

export interface SimulateRetryResponse {
  attempts: number;
  delays: number[];
  success: boolean;
  error?: string;
}

export interface GetCircuitStateRequest {
  name: string;
}

export interface GetCircuitStateResponse {
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failures: number;
  lastFailTime?: number;
}

export interface ResetCircuitRequest {
  name: string;
}

export interface SimulateCircuitBreakerRequest {
  name: string;
  failureThreshold?: number;
  timeout?: number;
  failures: number;
}

export interface SimulateCircuitBreakerResponse {
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failures: number;
  isOpen: boolean;
}

export interface SimulateFallbackRequest {
  models: string[];
  shouldFail?: boolean;
}

export interface SimulateFallbackResponse {
  attempts: Array<{
    model: string;
    success: boolean;
    error?: string;
  }>;
  result: string;
  source: string;
}




