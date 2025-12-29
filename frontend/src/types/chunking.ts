export enum ChunkingStrategy {
  FIXED_SIZE = 'fixed-size',
  RECURSIVE = 'recursive',
  SEMANTIC = 'semantic',
  SENTENCE = 'sentence',
}

export interface ChunkTextRequest {
  text: string;
  strategy: ChunkingStrategy;
  chunkSize: number;
  chunkOverlap?: number;
}

export interface ChunkResult {
  content: string;
  index: number;
  size: number;
  metadata?: Record<string, any>;
}

export interface ChunkTextResponse {
  chunks: ChunkResult[];
  totalChunks: number;
  strategy: ChunkingStrategy;
  latency: number;
}







