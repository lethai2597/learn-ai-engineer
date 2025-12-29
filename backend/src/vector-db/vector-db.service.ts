import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { VectorDatabaseFactory } from './repositories/vector-database.factory';
import { IVectorRepository } from './repositories/vector-repository.interface';
import { IngestDocumentsResponseDto } from './dto/ingest-documents.dto';
import {
  VectorSearchResponseDto,
  VectorSearchResultDto,
  DeleteDocumentsResponseDto,
} from './dto/vector-search.dto';

@Injectable()
export class VectorDbService {
  private readonly logger = new Logger(VectorDbService.name);
  private readonly repository: IVectorRepository;
  private readonly defaultCollectionName: string;

  constructor(
    private readonly embeddingsService: EmbeddingsService,
    private readonly vectorDbFactory: VectorDatabaseFactory,
    private readonly configService: ConfigService,
  ) {
    this.repository = this.vectorDbFactory.getDefaultRepository();
    this.defaultCollectionName =
      this.configService.get<string>('chroma.collectionName') || 'documents';
  }

  // rag-vector-db-01
  async ingestDocuments(
    texts: string[],
    collectionName?: string,
  ): Promise<IngestDocumentsResponseDto> {
    // [FRONTEND] Đo thời gian bắt đầu để tính latency hiển thị cho user
    const startTime = Date.now();
    const targetCollection = collectionName || this.defaultCollectionName;

    try {
      this.logger.log(
        `Ingesting ${texts.length} documents into collection: ${targetCollection}`,
      );

      // [BUSINESS] Tạo embeddings cho tất cả texts
      // Sử dụng embeddings service để chuyển texts thành vectors
      const embeddingsResponse =
        await this.embeddingsService.createEmbeddings(texts);

      // [BUSINESS] Extract embeddings vectors từ response
      const embeddings = embeddingsResponse.results.map((r) => r.embedding);

      // [BUSINESS] Tạo unique IDs cho mỗi document
      // Format: doc-{timestamp}-{index} để đảm bảo unique
      const documentIds = texts.map((_, index) => `doc-${Date.now()}-${index}`);

      // [BUSINESS] Tạo metadata cho mỗi document
      // Metadata chứa text gốc để có thể retrieve sau này
      const metadatas = texts.map((text) => ({ text }));

      // [BUSINESS] Lưu documents vào vector database
      // Repository sẽ xử lý việc lưu embeddings, IDs và metadata vào ChromaDB
      await this.repository.addDocuments(
        targetCollection,
        documentIds,
        embeddings,
        metadatas,
      );

      // [FRONTEND] Tính latency để hiển thị cho user biết thời gian xử lý
      const latency = Date.now() - startTime;

      this.logger.log(
        `Successfully ingested ${texts.length} documents in ${latency}ms`,
      );

      return {
        documentIds,
        texts,
        count: texts.length,
        collectionName: targetCollection,
        latency,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      this.logger.error(`Failed to ingest documents: ${errorMessage}`, error);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Failed to ingest documents: ${errorMessage}`,
          error: 'Ingest error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // rag-vector-db-02
  async search(
    query: string,
    collectionName: string,
    topK: number = 5,
  ): Promise<VectorSearchResponseDto> {
    // [FRONTEND] Đo thời gian bắt đầu để tính latency hiển thị cho user
    const startTime = Date.now();

    try {
      this.logger.log(
        `Searching for "${query}" in collection: ${collectionName} with topK: ${topK}`,
      );

      // [BUSINESS] Tạo embedding cho query text
      // Query text cần được chuyển thành vector để so sánh với documents trong database
      const queryEmbeddingResponse =
        await this.embeddingsService.createEmbeddings([query]);
      const queryEmbedding = queryEmbeddingResponse.results[0].embedding;

      // [BUSINESS] Tìm kiếm trong vector database
      // Repository sẽ tính cosine similarity giữa query embedding và tất cả document embeddings
      // Trả về top K documents có similarity cao nhất
      const searchResults = await this.repository.search(
        collectionName,
        queryEmbedding,
        topK,
      );

      // [FRONTEND] Format kết quả với rank để hiển thị cho user
      const results: VectorSearchResultDto[] = searchResults.map(
        (result, index) => ({
          id: result.id,
          text: (result.metadata?.text as string) || '',
          similarity: result.score,
          rank: index + 1,
        }),
      );

      // [FRONTEND] Tính latency để hiển thị cho user biết thời gian xử lý
      const latency = Date.now() - startTime;

      this.logger.log(
        `Search completed in ${latency}ms, found ${results.length} results`,
      );

      return {
        query,
        collectionName,
        results,
        latency,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      this.logger.error(`Failed to search: ${errorMessage}`, error);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Failed to search: ${errorMessage}`,
          error: 'Search error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteDocuments(
    documentIds: string[],
    collectionName: string,
  ): Promise<DeleteDocumentsResponseDto> {
    const startTime = Date.now();

    try {
      this.logger.log(
        `Deleting ${documentIds.length} documents from collection: ${collectionName}`,
      );

      await this.repository.delete(collectionName, documentIds);

      const latency = Date.now() - startTime;

      this.logger.log(
        `Successfully deleted ${documentIds.length} documents in ${latency}ms`,
      );

      return {
        deletedCount: documentIds.length,
        collectionName,
        latency,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      this.logger.error(`Failed to delete documents: ${errorMessage}`, error);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Failed to delete documents: ${errorMessage}`,
          error: 'Delete error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
