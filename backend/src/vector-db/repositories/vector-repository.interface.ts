export interface DocumentMetadata {
  text?: string;
  [key: string]: string | number | boolean | null | undefined;
}

export interface SearchResult {
  id: string;
  score: number;
  metadata?: DocumentMetadata;
}

export interface IVectorRepository {
  addDocuments(
    collectionName: string,
    ids: string[],
    embeddings: number[][],
    metadatas?: DocumentMetadata[],
  ): Promise<void>;

  search(
    collectionName: string,
    queryEmbedding: number[],
    topK: number,
    filter?: Record<string, unknown>,
  ): Promise<SearchResult[]>;

  delete(collectionName: string, ids: string[]): Promise<void>;

  collectionExists(collectionName: string): Promise<boolean>;

  createCollection(collectionName: string): Promise<void>;

  deleteCollection(collectionName: string): Promise<void>;
}
