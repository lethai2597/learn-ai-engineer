import { Injectable, Logger } from '@nestjs/common';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { encoding_for_model, get_encoding } from 'tiktoken';
import {
  CountTokensResponseDto,
  CountTokensRequestDto,
} from './dto/count-tokens.dto';
import {
  CheckCacheRequestDto,
  CheckCacheResponseDto,
  StoreCacheRequestDto,
  StoreCacheResponseDto,
  CacheStatsResponseDto,
} from './dto/semantic-cache.dto';
import {
  AnalyzeCostRequestDto,
  AnalyzeCostResponseDto,
  ModelPricingResponseDto,
} from './dto/cost-analysis.dto';
import {
  SelectModelRequestDto,
  SelectModelResponseDto,
} from './dto/model-selection.dto';

interface CacheEntry {
  query: string;
  response: string;
  embedding: number[];
  timestamp: Date;
}

@Injectable()
export class CostOptimizationService {
  private readonly logger = new Logger(CostOptimizationService.name);
  private readonly cache = new Map<string, CacheEntry>();
  private readonly defaultThreshold = 0.95;
  private readonly ttl = 24 * 60 * 60 * 1000;
  private cacheHits = 0;
  private cacheMisses = 0;
  private totalSavings = 0;

  private readonly pricing: Record<string, { input: number; output: number }> =
    {
      'gpt-4o': { input: 0.0025 / 1000, output: 0.01 / 1000 },
      'gpt-4-turbo': { input: 0.01 / 1000, output: 0.03 / 1000 },
      'gpt-4': { input: 0.03 / 1000, output: 0.06 / 1000 },
      'gpt-3.5-turbo': { input: 0.0005 / 1000, output: 0.0015 / 1000 },
      'claude-3-5-sonnet': { input: 0.003 / 1000, output: 0.015 / 1000 },
      'claude-3-opus': { input: 0.015 / 1000, output: 0.075 / 1000 },
      'claude-3-sonnet': { input: 0.003 / 1000, output: 0.015 / 1000 },
      'claude-3-haiku': { input: 0.00025 / 1000, output: 0.00125 / 1000 },
    };

  private readonly modelConfig: Record<
    'simple' | 'medium' | 'complex',
    string
  > = {
    simple: 'gpt-3.5-turbo',
    medium: 'gpt-4-turbo',
    complex: 'gpt-4',
  };

  constructor(private readonly embeddingsService: EmbeddingsService) {
    setInterval(() => this.cleanupExpiredEntries(), 60 * 60 * 1000);
  }

  private countTokensInternal(text: string, model: string): number {
    try {
      let encoding;
      try {
        encoding = encoding_for_model(model as any);
      } catch {
        this.logger.warn(
          `Model ${model} not found, using cl100k_base encoding`,
        );
        encoding = get_encoding('cl100k_base');
      }

      const tokens = encoding.encode(text);
      const count = tokens.length;
      encoding.free();
      return count;
    } catch (error) {
      this.logger.error(`Error counting tokens: ${error.message}`);
      return Math.ceil(text.length / 4);
    }
  }

  private calculateCost(
    model: string,
    inputTokens: number,
    outputTokens: number,
  ): number {
    const price = this.pricing[model] || {
      input: 0.001 / 1000,
      output: 0.002 / 1000,
    };

    return inputTokens * price.input + outputTokens * price.output;
  }

  private estimateOutputTokens(prompt: string): number {
    const inputTokens = Math.ceil(prompt.length / 4);
    const avgOutputRatio = 0.5;
    return Math.ceil(inputTokens * avgOutputRatio);
  }

  private async getEmbedding(text: string): Promise<number[]> {
    const response = await this.embeddingsService.createEmbeddings([text]);
    return response.results[0].embedding;
  }

  private generateCacheKey(query: string): string {
    return `cache_${Buffer.from(query).toString('base64').substring(0, 50)}`;
  }

  private isExpired(entry: CacheEntry): boolean {
    const age = Date.now() - entry.timestamp.getTime();
    return age > this.ttl;
  }

  private cleanupExpiredEntries(): void {
    let cleaned = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    if (cleaned > 0) {
      this.logger.debug(`Cleaned up ${cleaned} expired cache entries`);
    }
  }

  private analyzeComplexity(prompt: string): 'simple' | 'medium' | 'complex' {
    const length = prompt.length;
    const tokenCount = Math.ceil(length / 4);

    const complexKeywords = [
      'analyze',
      'compare',
      'evaluate',
      'explain',
      'synthesize',
      'design',
      'create',
      'generate',
    ];
    const keywordCount = complexKeywords.filter((keyword) =>
      prompt.toLowerCase().includes(keyword),
    ).length;

    if (tokenCount < 100 && keywordCount === 0) {
      return 'simple';
    } else if (tokenCount < 500 && keywordCount < 3) {
      return 'medium';
    } else {
      return 'complex';
    }
  }

  // production-cost-optimization-01
  async countTokens(
    dto: CountTokensRequestDto,
  ): Promise<CountTokensResponseDto> {
    // [BUSINESS] Đếm số tokens trong input text
    // Token counting: Ước tính số tokens để tính cost chính xác
    const tokenCount = this.countTokensInternal(dto.text, dto.model);

    // [BUSINESS] Ước tính số output tokens dựa trên input
    // Output tokens thường ít hơn input, nhưng cần estimate để tính cost
    const estimatedOutputTokens = this.estimateOutputTokens(dto.text);

    // [BUSINESS] Tính estimated cost dựa trên token count và model pricing
    // Cost = (input_tokens * input_price) + (output_tokens * output_price)
    const estimatedCost = this.calculateCost(
      dto.model,
      tokenCount,
      estimatedOutputTokens,
    );

    return {
      tokenCount,
      estimatedCost,
    };
  }

  // production-cost-optimization-02
  async checkCache(dto: CheckCacheRequestDto): Promise<CheckCacheResponseDto> {
    // [BUSINESS] Kiểm tra semantic cache: Tìm query tương tự trong cache
    // Semantic caching: So sánh embedding similarity thay vì exact match
    // Nếu similarity >= threshold, trả về cached response để tiết kiệm cost
    const queryEmbedding = await this.getEmbedding(dto.query);
    const searchThreshold = dto.threshold || this.defaultThreshold;

    let bestMatch: CacheEntry | null = null;
    let bestSimilarity = 0;

    for (const entry of this.cache.values()) {
      if (this.isExpired(entry)) {
        continue;
      }

      const similarity = this.embeddingsService.calculateCosineSimilarity(
        queryEmbedding,
        entry.embedding,
      );

      if (similarity > bestSimilarity) {
        bestSimilarity = similarity;
        bestMatch = entry;
      }
    }

    if (bestMatch && bestSimilarity >= searchThreshold) {
      this.cacheHits++;
      return {
        cached: true,
        response: bestMatch.response,
        similarity: bestSimilarity,
      };
    }

    this.cacheMisses++;
    return {
      cached: false,
      similarity: bestSimilarity,
    };
  }

  // production-cost-optimization-02
  async storeCache(dto: StoreCacheRequestDto): Promise<StoreCacheResponseDto> {
    // [BUSINESS] Lưu query và response vào semantic cache
    // Cache được lưu với embedding vector để có thể tìm kiếm semantic similarity sau này
    const embedding = await this.getEmbedding(dto.query);
    const entry: CacheEntry = {
      query: dto.query,
      response: dto.response,
      embedding,
      timestamp: new Date(),
    };

    const key = this.generateCacheKey(dto.query);
    this.cache.set(key, entry);
    this.logger.debug(
      `Cached entry for query: ${dto.query.substring(0, 50)}...`,
    );
    return { success: true };
  }

  async getCacheStats(): Promise<CacheStatsResponseDto> {
    const totalRequests = this.cacheHits + this.cacheMisses;
    const hitRate = totalRequests > 0 ? this.cacheHits / totalRequests : 0;

    return {
      totalEntries: this.cache.size,
      hitRate,
      savings: this.totalSavings,
    };
  }

  // production-cost-optimization-03
  async analyzeCost(
    dto: AnalyzeCostRequestDto,
  ): Promise<AnalyzeCostResponseDto> {
    // [BUSINESS] Đếm input tokens từ prompt
    const inputTokens = this.countTokensInternal(dto.prompt, dto.model);

    // [BUSINESS] Ước tính output tokens (dùng maxTokens nếu có, không thì estimate)
    const estimatedOutputTokens =
      dto.maxTokens || this.estimateOutputTokens(dto.prompt);

    // [BUSINESS] Tính estimated cost
    const estimatedCost = this.calculateCost(
      dto.model,
      inputTokens,
      estimatedOutputTokens,
    );

    // [BUSINESS] Phân tích và đưa ra recommendations để optimize cost
    const recommendations: string[] = [];

    if (inputTokens > 4000) {
      recommendations.push(
        'Prompt quá dài, cân nhắc rút gọn hoặc chunking để giảm cost',
      );
    }

    if (estimatedCost > 0.1) {
      recommendations.push(
        'Cost cao, cân nhắc dùng model rẻ hơn hoặc semantic caching',
      );
    }

    if (!dto.maxTokens) {
      recommendations.push('Nên set max_tokens để tránh response quá dài');
    }

    // [BUSINESS] Phân tích complexity của task để recommend model phù hợp
    const complexity = this.analyzeComplexity(dto.prompt);
    if (complexity === 'simple' && dto.model.includes('gpt-4')) {
      recommendations.push(
        'Task đơn giản, có thể dùng GPT-3.5 Turbo để tiết kiệm 80% cost',
      );
    }

    return {
      inputTokens,
      estimatedOutputTokens,
      estimatedCost,
      recommendations,
    };
  }

  async getModelPricing(): Promise<ModelPricingResponseDto> {
    return { ...this.pricing };
  }

  async selectModel(
    dto: SelectModelRequestDto,
  ): Promise<SelectModelResponseDto> {
    const recommendedModel = this.modelConfig[dto.taskType];
    const inputTokens = this.countTokensInternal(dto.prompt, recommendedModel);
    const estimatedOutputTokens = this.estimateOutputTokens(dto.prompt);
    const estimatedCost = this.calculateCost(
      recommendedModel,
      inputTokens,
      estimatedOutputTokens,
    );

    const reasons: Record<'simple' | 'medium' | 'complex', string> = {
      simple: 'Task đơn giản, dùng GPT-3.5 Turbo để tiết kiệm chi phí',
      medium:
        'Task phức tạp vừa phải, dùng GPT-4 Turbo để cân bằng chất lượng và chi phí',
      complex: 'Task phức tạp, cần GPT-4 để đảm bảo chất lượng output',
    };

    return {
      recommendedModel,
      reason: reasons[dto.taskType],
      estimatedCost,
    };
  }
}
