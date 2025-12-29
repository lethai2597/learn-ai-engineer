export interface IngestDocumentsRequest {
  texts: string[];
  collectionName?: string;
}

export interface IngestDocumentsResponse {
  documentIds: string[];
  texts: string[];
  count: number;
  collectionName: string;
  latency: number;
}

export interface VectorSearchRequest {
  query: string;
  collectionName: string;
  topK?: number;
}

export interface VectorSearchResult {
  id: string;
  text: string;
  similarity: number;
  rank: number;
}

export interface VectorSearchResponse {
  query: string;
  collectionName: string;
  results: VectorSearchResult[];
  latency: number;
}

export interface DeleteDocumentsRequest {
  documentIds: string[];
  collectionName: string;
}

export interface DeleteDocumentsResponse {
  deletedCount: number;
  collectionName: string;
  latency: number;
}




