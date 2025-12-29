/**
 * Types cho Streaming
 */

export interface StreamRequest {
  prompt: string;
  model?: string;
  temperature?: number;
}

export interface StreamResponse {
  text: string;
}

export interface StreamChunk {
  content?: string;
  error?: string;
  done?: boolean;
}









