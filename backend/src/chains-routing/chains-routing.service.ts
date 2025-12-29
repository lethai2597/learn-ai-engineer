import { Injectable } from '@nestjs/common';
import { OpenRouterService } from '../prompt-engineering/services/openrouter.service';
import {
  SimpleChainRequestDto,
  SimpleChainResponseDto,
} from './dto/simple-chain.dto';
import { RouterRequestDto, RouterResponseDto } from './dto/router.dto';
import {
  ConditionalChainRequestDto,
  ConditionalChainResponseDto,
} from './dto/conditional-chain.dto';

@Injectable()
export class ChainsRoutingService {
  constructor(private readonly openRouterService: OpenRouterService) {}

  // orchestration-chains-routing-01
  async simpleChain(
    dto: SimpleChainRequestDto,
  ): Promise<SimpleChainResponseDto> {
    // [FRONTEND] Đo thời gian bắt đầu để tính totalTime hiển thị cho user
    const startTime = Date.now();

    // [BUSINESS] Bước 1: Dịch text sang tiếng Việt
    // Chain bắt đầu với translation step
    const translatePrompt = `Dịch câu sau sang tiếng Việt: "${dto.text}"\n\nChỉ trả về bản dịch, không thêm giải thích.`;
    const translation = await this.openRouterService.generateCompletion(
      [{ role: 'user', content: translatePrompt }],
      { temperature: 0.3, maxTokens: 200 },
    );

    // [BUSINESS] Bước 2: Tóm tắt nội dung đã dịch
    // Sử dụng output từ bước 1 làm input cho bước 2
    const summarizePrompt = `Tóm tắt ngắn gọn nội dung sau (1-2 câu):\n\n${translation}`;
    const summary = await this.openRouterService.generateCompletion(
      [{ role: 'user', content: summarizePrompt }],
      { temperature: 0.5, maxTokens: 100 },
    );

    // [BUSINESS] Bước 3: Extract keywords từ summary
    // Sử dụng output từ bước 2 làm input cho bước 3
    // Sử dụng JSON mode để đảm bảo output là JSON hợp lệ
    const extractKeywordsPrompt = `Từ nội dung sau, extract 3-5 keywords quan trọng nhất. Trả về dạng JSON array: ["keyword1", "keyword2", ...]\n\n${summary}`;
    const keywordsJson = await this.openRouterService.generateJSONCompletion(
      [{ role: 'user', content: extractKeywordsPrompt }],
      { temperature: 0.3, maxTokens: 100 },
    );

    // [BUSINESS] Parse JSON và fallback nếu parse thất bại
    let keywords: string[] = [];
    try {
      const parsed: unknown = JSON.parse(keywordsJson);
      if (Array.isArray(parsed)) {
        keywords = parsed.filter(
          (item): item is string => typeof item === 'string',
        );
      } else if (
        typeof parsed === 'object' &&
        parsed !== null &&
        'keywords' in parsed
      ) {
        const value = (parsed as Record<string, unknown>).keywords;
        if (Array.isArray(value)) {
          keywords = value.filter(
            (item): item is string => typeof item === 'string',
          );
        }
      }
    } catch {
      keywords = [];
    }
    if (keywords.length === 0) {
      // [BUSINESS] Fallback: Extract keywords đơn giản từ summary
      const fallbackKeywords = summary
        .split(/\s+/)
        .filter((word) => word.length > 3)
        .slice(0, 5);
      keywords = fallbackKeywords;
    }

    // [FRONTEND] Tính totalTime để hiển thị cho user biết thời gian xử lý
    const totalTime = Date.now() - startTime;

    return {
      translation: translation.trim(),
      summary: summary.trim(),
      keywords,
      totalTime,
    };
  }

  // orchestration-chains-routing-02
  async routeRequest(dto: RouterRequestDto): Promise<RouterResponseDto> {
    // [FRONTEND] Đo thời gian bắt đầu để tính latency hiển thị cho user
    const startTime = Date.now();

    // [BUSINESS] Bước 1: Phân loại intent của input
    // Router pattern: Phân tích input để quyết định route nào sẽ được sử dụng
    const classifyPrompt = `Phân loại intent của câu sau thành một trong các loại: "code", "creative", hoặc "general".\n\nCâu: "${dto.input}"\n\nTrả về chỉ một từ: "code", "creative", hoặc "general".`;
    const intentResponse = await this.openRouterService.generateCompletion(
      [{ role: 'user', content: classifyPrompt }],
      { temperature: 0.1, maxTokens: 10 },
    );

    const intent = intentResponse.trim().toLowerCase();
    let selectedModel: string;
    let reason: string;

    // [BUSINESS] Bước 2: Chọn model dựa trên intent
    // Router logic: Mỗi intent sẽ route đến model phù hợp nhất
    if (intent.includes('code')) {
      selectedModel = 'openai/gpt-3.5-turbo';
      reason =
        'Intent là "code" → Chọn GPT-3.5 Turbo vì code generation tốt và giá rẻ';
    } else if (intent.includes('creative')) {
      selectedModel = 'anthropic/claude-3.5-sonnet';
      reason =
        'Intent là "creative" → Chọn Claude 3.5 Sonnet vì creative writing tốt';
    } else {
      selectedModel = 'openai/gpt-3.5-turbo';
      reason =
        'Intent là "general" → Chọn GPT-3.5 Turbo vì general purpose và giá rẻ';
    }

    // [BUSINESS] Bước 3: Gọi LLM với model đã chọn
    // Sử dụng selectedModel từ routing decision
    const response = await this.openRouterService.generateCompletion(
      [{ role: 'user', content: dto.input }],
      {
        model: selectedModel,
        temperature: dto.temperature || 0.7,
        maxTokens: 500,
      },
    );

    // [FRONTEND] Tính latency để hiển thị cho user biết thời gian xử lý
    const latency = Date.now() - startTime;

    return {
      intent: intent.includes('code')
        ? 'code'
        : intent.includes('creative')
          ? 'creative'
          : 'general',
      selectedModel,
      reason,
      response: response.trim(),
      latency,
    };
  }

  // orchestration-chains-routing-03
  async processDocument(
    dto: ConditionalChainRequestDto,
  ): Promise<ConditionalChainResponseDto> {
    // [FRONTEND] Đo thời gian bắt đầu để tính totalTime hiển thị cho user
    const startTime = Date.now();

    // [BUSINESS] Bước 1: Phát hiện ngôn ngữ của document
    // Conditional chain bắt đầu với language detection
    const detectLanguagePrompt = `Xác định ngôn ngữ của văn bản sau. Trả về chỉ mã ngôn ngữ (ví dụ: "en", "vi", "fr", "es"):\n\n"${dto.document}"`;
    const languageResponse = await this.openRouterService.generateCompletion(
      [{ role: 'user', content: detectLanguagePrompt }],
      { temperature: 0.1, maxTokens: 5 },
    );

    const detectedLanguage = languageResponse.trim().toLowerCase().slice(0, 2);
    let processedDocument = dto.document;
    let wasTranslated = false;

    // [BUSINESS] Bước 2: Dịch document nếu cần (conditional logic)
    // Conditional chain: Chỉ dịch nếu ngôn ngữ không phải tiếng Anh hoặc tiếng Việt
    if (detectedLanguage !== 'en' && detectedLanguage !== 'vi') {
      const translatePrompt = `Dịch văn bản sau sang tiếng Anh:\n\n"${dto.document}"\n\nChỉ trả về bản dịch, không thêm giải thích.`;
      processedDocument = await this.openRouterService.generateCompletion(
        [{ role: 'user', content: translatePrompt }],
        { temperature: 0.3, maxTokens: 500 },
      );
      wasTranslated = true;
    }

    // [BUSINESS] Bước 3: Tóm tắt document (sau khi dịch nếu cần)
    // Sử dụng processedDocument (có thể đã được dịch) làm input
    const summarizePrompt = `Tóm tắt ngắn gọn văn bản sau (2-3 câu):\n\n${processedDocument}`;
    const summary = await this.openRouterService.generateCompletion(
      [{ role: 'user', content: summarizePrompt }],
      { temperature: 0.5, maxTokens: 150 },
    );

    // [BUSINESS] Bước 4: Extract entities từ document
    // Sử dụng processedDocument làm input, output là JSON array
    const extractEntitiesPrompt = `Từ văn bản sau, extract các entities quan trọng (tên người, địa điểm, tổ chức, v.v.). Trả về dạng JSON array: ["entity1", "entity2", ...]\n\n${processedDocument}`;
    const entitiesJson = await this.openRouterService.generateJSONCompletion(
      [{ role: 'user', content: extractEntitiesPrompt }],
      { temperature: 0.3, maxTokens: 200 },
    );

    // [BUSINESS] Parse JSON entities
    let entities: string[] = [];
    try {
      const parsed: unknown = JSON.parse(entitiesJson);
      if (Array.isArray(parsed)) {
        entities = parsed.filter(
          (item): item is string => typeof item === 'string',
        );
      } else if (
        typeof parsed === 'object' &&
        parsed !== null &&
        'entities' in parsed
      ) {
        const value = (parsed as Record<string, unknown>).entities;
        if (Array.isArray(value)) {
          entities = value.filter(
            (item): item is string => typeof item === 'string',
          );
        }
      }
    } catch {
      entities = [];
    }

    // [FRONTEND] Tính totalTime để hiển thị cho user biết thời gian xử lý
    const totalTime = Date.now() - startTime;

    return {
      detectedLanguage,
      wasTranslated,
      processedDocument: processedDocument.trim(),
      summary: summary.trim(),
      entities,
      totalTime,
    };
  }
}
