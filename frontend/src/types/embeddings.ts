export interface CreateEmbeddingsRequest {
  texts: string[];
}

export interface EmbeddingResult {
  text: string;
  embedding: number[];
  dimensions: number;
}

export interface CreateEmbeddingsResponse {
  results: EmbeddingResult[];
  model: string;
  latency: number;
}

export interface CalculateSimilarityRequest {
  vectorA: number[];
  vectorB: number[];
}

export interface CalculateSimilarityResponse {
  similarity: number;
}

export interface SemanticSearchRequest {
  query: string;
  texts: string[];
  topK?: number;
}

export interface SearchResult {
  text: string;
  similarity: number;
  rank: number;
}

export interface SemanticSearchResponse {
  query: string;
  results: SearchResult[];
  latency: number;
}









