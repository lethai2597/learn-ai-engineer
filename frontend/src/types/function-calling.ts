export interface CalculatorRequest {
  query: string;
}

export interface CalculatorResponse {
  functionName: string;
  arguments: Record<string, any>;
  toolResult: any;
  finalResponse: string;
  latency: number;
}

export interface WeatherRequest {
  query: string;
}

export interface WeatherResponse {
  functionName: string;
  arguments: Record<string, any>;
  toolResult: any;
  finalResponse: string;
  latency: number;
}

export interface ToolCall {
  functionName: string;
  arguments: Record<string, any>;
  result: any;
}

export interface AssistantRequest {
  query: string;
}

export interface AssistantResponse {
  toolCalls: ToolCall[];
  finalResponse: string;
  latency: number;
}






