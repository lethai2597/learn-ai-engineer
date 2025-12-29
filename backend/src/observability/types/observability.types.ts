export interface LLMLog {
  timestamp: string;
  userId?: string;
  sessionId?: string;
  model: string;
  provider: string;
  prompt: string;
  response: string;
  tokens: {
    input: number;
    output: number;
    total: number;
  };
  cost: number;
  latency: number;
  endpoint?: string;
  error?: string;
  metadata?: Record<string, any>;
}

export interface TraceContext {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
}

export interface LLMCallMetadata {
  userId?: string;
  sessionId?: string;
  endpoint?: string;
  requestId?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface ObservabilityConfig {
  langsmith?: {
    enabled: boolean;
    apiKey?: string;
    project?: string;
  };
  helicone?: {
    enabled: boolean;
    apiKey?: string;
  };
  customLogging?: {
    enabled: boolean;
    storage?: 'memory' | 'database';
  };
}
