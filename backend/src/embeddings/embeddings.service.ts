import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CreateEmbeddingsResponseDto,
  EmbeddingResultDto,
} from './dto/create-embeddings.dto';
import {
  SemanticSearchResponseDto,
  SearchResultDto,
} from './dto/semantic-search.dto';

@Injectable()
export class EmbeddingsService {
  private readonly apiKey: string;
  private readonly baseURL: string;
  private readonly model = 'text-embedding-3-large';

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('openrouter.apiKey') || '';
    this.baseURL =
      this.configService.get<string>('openrouter.baseURL') ||
      'https://openrouter.ai/api/v1';

    if (!this.apiKey) {
      throw new Error('OPENROUTER_API_KEY is required');
    }
  }

  // rag-embeddings-01
  async createEmbeddings(
    texts: string[],
  ): Promise<CreateEmbeddingsResponseDto> {
    // [FRONTEND] Đo thời gian bắt đầu để tính latency hiển thị cho user
    const startTime = Date.now();

    try {
      // [BUSINESS] Gọi OpenRouter API để tạo embeddings vectors
      // Sử dụng raw HTTP call thay vì SDK để dễ hiểu cách hoạt động
      // API endpoint: POST /embeddings với body chứa model và input texts
      const response = await fetch(`${this.baseURL}/embeddings`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:4000',
          'X-Title': 'Learn AI - Embeddings',
        },
        body: JSON.stringify({
          model: this.model,
          input: texts,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message ||
            `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      const data = await response.json();

      // [BUSINESS] Map response từ API thành format chuẩn
      // Mỗi text sẽ có một embedding vector (array of numbers)
      const results: EmbeddingResultDto[] = data.data.map(
        (item: { embedding: number[] }, index: number) => ({
          text: texts[index],
          embedding: item.embedding,
          dimensions: item.embedding.length,
        }),
      );

      // [FRONTEND] Tính latency để hiển thị cho user biết thời gian xử lý
      const latency = Date.now() - startTime;

      return {
        results,
        model: this.model,
        latency,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_GATEWAY,
          message: `Failed to create embeddings: ${errorMessage}`,
          error: 'Embeddings API error',
        },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  calculateCosineSimilarity(a: number[], b: number[]): number {
    // [BUSINESS] Cosine Similarity: công thức tính độ tương đồng giữa 2 vectors
    // Công thức: cos(θ) = (A · B) / (||A|| × ||B||)
    // Giá trị từ -1 đến 1, càng gần 1 thì càng giống nhau
    if (a.length !== b.length) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Vectors must have the same length',
          error: 'Invalid vectors',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // [BUSINESS] Tính dot product (A · B) và magnitude (||A||, ||B||)
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      magnitudeA += a[i] * a[i];
      magnitudeB += b[i] * b[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    // [BUSINESS] Xử lý edge case: vector zero
    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0;
    }

    return dotProduct / (magnitudeA * magnitudeB);
  }

  // rag-embeddings-02
  async semanticSearch(
    query: string,
    texts: string[],
    topK: number = 5,
  ): Promise<SemanticSearchResponseDto> {
    // [FRONTEND] Đo thời gian bắt đầu để tính latency hiển thị cho user
    const startTime = Date.now();

    try {
      // [BUSINESS] Tạo embeddings cho query và tất cả texts cùng lúc
      // Gộp query và texts thành một array để gọi API một lần (batch processing)
      const allTexts = [query, ...texts];

      // [BUSINESS] Gọi OpenRouter API để tạo embeddings
      // Sử dụng raw HTTP call thay vì SDK để dễ hiểu cách hoạt động
      const response = await fetch(`${this.baseURL}/embeddings`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:4000',
          'X-Title': 'Learn AI - Embeddings',
        },
        body: JSON.stringify({
          model: this.model,
          input: allTexts,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message ||
            `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      const data = await response.json();

      // [BUSINESS] Tách embedding của query (phần tử đầu tiên) và embeddings của texts
      const queryEmbedding = data.data[0].embedding;
      const textEmbeddings = data.data.slice(1);

      // [BUSINESS] Tính cosine similarity giữa query embedding và mỗi text embedding
      // Similarity càng cao thì text càng liên quan đến query
      const similarities: Array<{
        text: string;
        similarity: number;
        index: number;
      }> = textEmbeddings.map(
        (item: { embedding: number[] }, index: number) => ({
          text: texts[index],
          similarity: this.calculateCosineSimilarity(
            queryEmbedding,
            item.embedding,
          ),
          index,
        }),
      );

      // [BUSINESS] Sắp xếp theo similarity giảm dần để lấy top K kết quả
      similarities.sort((a, b) => b.similarity - a.similarity);

      const topResults = similarities.slice(0, topK);

      // [FRONTEND] Format kết quả với rank để hiển thị cho user
      const results: SearchResultDto[] = topResults.map((item, rank) => ({
        text: item.text,
        similarity: item.similarity,
        rank: rank + 1,
      }));

      // [FRONTEND] Tính latency để hiển thị cho user biết thời gian xử lý
      const latency = Date.now() - startTime;

      return {
        query,
        results,
        latency,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_GATEWAY,
          message: `Failed to perform semantic search: ${errorMessage}`,
          error: 'Semantic search error',
        },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
