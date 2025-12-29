export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

export enum MemoryStrategy {
  SLIDING_WINDOW = 'sliding-window',
  SUMMARIZATION = 'summarization',
  TOKEN_TRUNCATION = 'token-truncation',
}

export interface ChatMessage {
  role: MessageRole;
  content: string;
  timestamp?: string;
}

export interface ChatRequest {
  message: string;
  sessionId?: string;
  strategy: MemoryStrategy;
  maxMessages?: number;
  maxTokens?: number;
}

export interface ChatResponse {
  response: string;
  messages: ChatMessage[];
  tokenCount: number;
  strategy: MemoryStrategy;
  sessionId: string;
}






