import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CloudClient, Collection } from 'chromadb';
import {
  IVectorRepository,
  DocumentMetadata,
  SearchResult,
} from './vector-repository.interface';

@Injectable()
export class ChromaVectorRepository implements IVectorRepository, OnModuleInit {
  private readonly logger = new Logger(ChromaVectorRepository.name);
  private client: CloudClient;
  private readonly collections = new Map<string, Collection>();

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('chroma.apiKey');
    const tenant = this.configService.get<string>('chroma.tenant');
    const database = this.configService.get<string>('chroma.database');

    if (!apiKey || !tenant || !database) {
      throw new Error(
        'ChromaDB Cloud configuration is required: CHROMA_API_KEY, CHROMA_TENANT, CHROMA_DATABASE',
      );
    }

    this.client = new CloudClient({
      apiKey,
      tenant,
      database,
    });

    this.logger.log(
      `ChromaDB Cloud client initialized: tenant=${tenant}, database=${database}`,
    );
  }

  private async getOrCreateCollection(
    collectionName: string,
  ): Promise<Collection> {
    if (this.collections.has(collectionName)) {
      return this.collections.get(collectionName)!;
    }

    let collection: Collection;
    const exists = await this.collectionExists(collectionName);

    if (exists) {
      collection = await this.client.getCollection({ name: collectionName });
    } else {
      collection = await this.client.createCollection({ name: collectionName });
    }

    this.collections.set(collectionName, collection);
    return collection;
  }

  async addDocuments(
    collectionName: string,
    ids: string[],
    embeddings: number[][],
    metadatas?: DocumentMetadata[],
  ): Promise<void> {
    try {
      const collection = await this.getOrCreateCollection(collectionName);

      const documents = metadatas?.map((meta) => meta.text || '') || [];

      const chromaMetadatas = (metadatas || []).map((meta) => {
        const chromaMeta: Record<string, string | number | boolean | null> = {};
        Object.entries(meta).forEach(([key, value]) => {
          if (value !== undefined) {
            chromaMeta[key] = value;
          }
        });
        return chromaMeta;
      });

      await collection.add({
        ids,
        embeddings,
        metadatas: chromaMetadatas,
        documents: documents.length > 0 ? documents : undefined,
      });

      this.logger.log(
        `Added ${ids.length} documents to collection: ${collectionName}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to add documents to collection ${collectionName}:`,
        error,
      );
      throw error;
    }
  }

  async search(
    collectionName: string,
    queryEmbedding: number[],
    topK: number,
    filter?: Record<string, unknown>,
  ): Promise<SearchResult[]> {
    try {
      const collection = await this.getOrCreateCollection(collectionName);

      const where = filter
        ? Object.entries(filter).reduce(
            (acc, [key, value]) => {
              acc[key] = { $eq: value };
              return acc;
            },
            {} as Record<string, { $eq: unknown }>,
          )
        : undefined;

      const results = await collection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: topK,
        where: where as never,
      });

      const searchResults: SearchResult[] = [];

      if (results.ids && results.ids[0]) {
        for (let i = 0; i < results.ids[0].length; i++) {
          const id = results.ids[0][i];
          const distance = results.distances?.[0]?.[i];
          const metadata = results.metadatas?.[0]?.[i] as
            | DocumentMetadata
            | undefined;

          const score =
            distance !== undefined && distance !== null ? 1 - distance : 0;

          searchResults.push({
            id,
            score,
            metadata,
          });
        }
      }

      return searchResults;
    } catch (error) {
      this.logger.error(
        `Failed to search in collection ${collectionName}:`,
        error,
      );
      throw error;
    }
  }

  async delete(collectionName: string, ids: string[]): Promise<void> {
    try {
      const collection = await this.getOrCreateCollection(collectionName);
      await collection.delete({ ids });
      this.logger.log(
        `Deleted ${ids.length} documents from collection: ${collectionName}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to delete documents from collection ${collectionName}:`,
        error,
      );
      throw error;
    }
  }

  async collectionExists(collectionName: string): Promise<boolean> {
    try {
      const collections = await this.client.listCollections();
      return collections.some((col) => col.name === collectionName);
    } catch (error) {
      this.logger.error('Failed to check collection existence:', error);
      return false;
    }
  }

  async createCollection(collectionName: string): Promise<void> {
    try {
      if (await this.collectionExists(collectionName)) {
        this.logger.warn(
          `Collection ${collectionName} already exists, skipping creation`,
        );
        return;
      }

      const collection = await this.client.createCollection({
        name: collectionName,
      });
      this.collections.set(collectionName, collection);
      this.logger.log(`Created collection: ${collectionName}`);
    } catch (error) {
      this.logger.error(
        `Failed to create collection ${collectionName}:`,
        error,
      );
      throw error;
    }
  }

  async deleteCollection(collectionName: string): Promise<void> {
    try {
      if (!(await this.collectionExists(collectionName))) {
        this.logger.warn(
          `Collection ${collectionName} does not exist, skipping deletion`,
        );
        return;
      }

      await this.client.deleteCollection({ name: collectionName });
      this.collections.delete(collectionName);
      this.logger.log(`Deleted collection: ${collectionName}`);
    } catch (error) {
      this.logger.error(
        `Failed to delete collection ${collectionName}:`,
        error,
      );
      throw error;
    }
  }
}
