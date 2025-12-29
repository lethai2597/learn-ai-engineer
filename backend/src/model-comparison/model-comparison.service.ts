import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  tool_calls?: Array<{
    id: string;
    type: 'function';
    function: {
      name: string;
      arguments: string;
    };
  }>;
  tool_call_id?: string;
}

interface ChatCompletionResponse {
  id: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string | null;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface ModelPricing {
  inputPrice: number;
  outputPrice: number;
}

interface ModelResult {
  model: string;
  text: string;
  latency: number;
  estimatedCost: number;
  inputTokens: number;
  outputTokens: number;
  error?: string;
}

@Injectable()
export class ModelComparisonService {
  private readonly apiKey: string;
  private readonly baseURL: string;
  private readonly modelPricing: Record<string, ModelPricing> = {
    'openai/gpt-4o': { inputPrice: 2.5, outputPrice: 10 },
    'openai/gpt-4': { inputPrice: 30, outputPrice: 60 },
    'openai/gpt-3.5-turbo': { inputPrice: 1, outputPrice: 2 },
    'anthropic/claude-3.5-sonnet': { inputPrice: 3, outputPrice: 15 },
    'google/gemini-1.5-flash': { inputPrice: 0.075, outputPrice: 0.3 },
    'google/gemini-1.5-flash-8b': { inputPrice: 0.075, outputPrice: 0.3 },
    'meta-llama/llama-3-8b-instruct': { inputPrice: 0.05, outputPrice: 0.15 },
    'qwen/qwen-2.5-7b-instruct': { inputPrice: 0.1, outputPrice: 0.1 },
    'microsoft/phi-3-mini-128k-instruct': { inputPrice: 0.2, outputPrice: 0.2 },
  };

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('openrouter.apiKey') || '';
    this.baseURL =
      this.configService.get<string>('openrouter.baseURL') ||
      'https://openrouter.ai/api/v1';

    if (!this.apiKey) {
      throw new Error('OPENROUTER_API_KEY is required');
    }
  }

  // llm-fundamentals-model-comparison-01
  async compareModels(
    prompt: string,
    models: string[],
    temperature?: number,
  ): Promise<{
    results: ModelResult[];
    totalTime: number;
  }> {
    // [FRONTEND] Đo thời gian bắt đầu để tính totalTime hiển thị cho user
    const startTime = Date.now();

    // [BUSINESS] Gọi tất cả models song song (parallel) với cùng một prompt
    // Promise.all để so sánh performance và output của nhiều models cùng lúc
    const promises = models.map(async (model): Promise<ModelResult> => {
      const modelStartTime = Date.now();
      try {
        const messages: ChatMessage[] = [
          {
            role: 'user',
            content: prompt,
          },
        ];

        // [BUSINESS] Gọi LLM API cho từng model
        // Sử dụng fetch API để gọi OpenRouter API
        const response = await fetch(`${this.baseURL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
            'HTTP-Referer': 'http://localhost:4000',
            'X-Title': 'Learn AI - Model Comparison',
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: temperature ?? 0.7,
          }),
        });

        if (!response.ok) {
          throw new Error(
            `API error: ${response.status} ${response.statusText}`,
          );
        }

        const completion = (await response.json()) as ChatCompletionResponse;

        // [FRONTEND] Tính latency cho từng model để so sánh
        const latency = Date.now() - modelStartTime;
        const text = completion.choices[0]?.message?.content || '';
        const usage = completion.usage;
        const inputTokens = usage?.prompt_tokens || 0;
        const outputTokens = usage?.completion_tokens || 0;

        // [BUSINESS] Tính estimated cost dựa trên pricing của từng model
        const pricing = this.modelPricing[model] || {
          inputPrice: 0,
          outputPrice: 0,
        };
        const estimatedCost =
          (inputTokens / 1_000_000) * pricing.inputPrice +
          (outputTokens / 1_000_000) * pricing.outputPrice;

        return {
          model,
          text,
          latency,
          estimatedCost,
          inputTokens,
          outputTokens,
        };
      } catch (error) {
        // [FRONTEND] Nếu model fail, vẫn trả về result với error để hiển thị
        const latency = Date.now() - modelStartTime;
        return {
          model,
          text: '',
          latency,
          estimatedCost: 0,
          inputTokens: 0,
          outputTokens: 0,
          error:
            error instanceof Error ? error.message : 'Unknown error occurred',
        };
      }
    });

    // [BUSINESS] Đợi tất cả models hoàn thành
    const results = await Promise.all(promises);

    // [FRONTEND] Tính totalTime để hiển thị cho user biết thời gian xử lý tổng
    const totalTime = Date.now() - startTime;

    return {
      results,
      totalTime,
    };
  }

  selectModelByTask(
    prompt: string,
    taskType?: string,
  ): { model: string; reason: string } {
    const lowerPrompt = prompt.toLowerCase();
    const lowerTaskType = taskType?.toLowerCase() || '';
    const promptLength = prompt.length;

    if (
      lowerTaskType === 'complex-reasoning' ||
      lowerTaskType === 'reasoning' ||
      lowerPrompt.includes('solve') ||
      lowerPrompt.includes('calculate') ||
      lowerPrompt.includes('analyze') ||
      lowerPrompt.includes('explain why') ||
      lowerPrompt.includes('reasoning')
    ) {
      return {
        model: 'google/gemini-1.5-flash',
        reason:
          'Gemini Flash 1.5 được chọn vì có khả năng reasoning tốt với giá rẻ ($0.075/$0.30 per 1M tokens)',
      };
    }

    if (
      lowerTaskType === 'code-generation' ||
      lowerTaskType === 'coding' ||
      lowerPrompt.includes('code') ||
      lowerPrompt.includes('function') ||
      lowerPrompt.includes('program') ||
      lowerPrompt.includes('algorithm')
    ) {
      return {
        model: 'google/gemini-1.5-flash',
        reason:
          'Gemini Flash 1.5 được chọn vì có khả năng code generation tốt với giá rẻ',
      };
    }

    if (
      lowerTaskType === 'long-context' ||
      promptLength > 2000 ||
      lowerPrompt.includes('summarize') ||
      lowerPrompt.includes('document')
    ) {
      return {
        model: 'google/gemini-1.5-flash',
        reason:
          'Gemini Flash 1.5 được chọn vì có khả năng xử lý long context tốt với giá rẻ',
      };
    }

    if (lowerTaskType === 'simple' || promptLength < 100) {
      return {
        model: 'meta-llama/llama-3-8b-instruct',
        reason:
          'Llama 3 8B được chọn vì rẻ nhất ($0.05/$0.15 per 1M tokens) và nhanh cho simple tasks',
      };
    }

    return {
      model: 'google/gemini-1.5-flash',
      reason:
        'Gemini Flash 1.5 được chọn làm default vì rẻ ($0.075/$0.30 per 1M tokens), nhanh và phù hợp cho hầu hết các task',
    };
  }

  private getFallbackChain(primaryModel: string): string[] {
    const fallbackMap: Record<string, string[]> = {
      'google/gemini-1.5-flash': [
        'google/gemini-1.5-flash',
        'openai/gpt-3.5-turbo',
        'meta-llama/llama-3-8b-instruct',
      ],
      'meta-llama/llama-3-8b-instruct': [
        'meta-llama/llama-3-8b-instruct',
        'google/gemini-1.5-flash',
        'openai/gpt-3.5-turbo',
      ],
      'openai/gpt-3.5-turbo': [
        'openai/gpt-3.5-turbo',
        'google/gemini-1.5-flash',
        'meta-llama/llama-3-8b-instruct',
      ],
    };

    return (
      fallbackMap[primaryModel] || [
        'google/gemini-1.5-flash',
        'openai/gpt-3.5-turbo',
        'meta-llama/llama-3-8b-instruct',
      ]
    );
  }

  // llm-fundamentals-model-comparison-02
  async routeModel(
    prompt: string,
    taskType?: string,
    temperature?: number,
  ): Promise<{
    selectedModel: string;
    reason: string;
    result: string;
    latency: number;
    estimatedCost: number;
    inputTokens: number;
    outputTokens: number;
  }> {
    // [BUSINESS] Bước 1: Chọn model phù hợp dựa trên task type và prompt
    // Model router: Phân tích task để chọn model tốt nhất (rẻ, nhanh, phù hợp)
    const { model, reason } = this.selectModelByTask(prompt, taskType);

    // [FRONTEND] Đo thời gian bắt đầu để tính latency hiển thị cho user
    const startTime = Date.now();

    // [BUSINESS] Bước 2: Tạo fallback chain để xử lý khi primary model fail
    // Fallback: Nếu model chính không khả dụng, thử các model backup
    const fallbackModels = this.getFallbackChain(model);

    const messages: ChatMessage[] = [
      {
        role: 'user',
        content: prompt,
      },
    ];

    let lastError: Error | null = null;

    // [BUSINESS] Bước 3: Thử từng model trong fallback chain
    // Nếu model chính fail, tự động fallback sang model tiếp theo
    for (const tryModel of fallbackModels) {
      try {
        // [BUSINESS] Gọi LLM API với model đã chọn
        const response = await fetch(`${this.baseURL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
            'HTTP-Referer': 'http://localhost:4000',
            'X-Title': 'Learn AI - Model Comparison',
          },
          body: JSON.stringify({
            model: tryModel,
            messages,
            temperature: temperature ?? 0.7,
          }),
        });

        if (!response.ok) {
          throw new Error(
            `API error: ${response.status} ${response.statusText}`,
          );
        }

        const completion = (await response.json()) as ChatCompletionResponse;

        // [FRONTEND] Tính latency và cost để hiển thị cho user
        const latency = Date.now() - startTime;
        const text = completion.choices[0]?.message?.content || '';
        const usage = completion.usage;
        const inputTokens = usage?.prompt_tokens || 0;
        const outputTokens = usage?.completion_tokens || 0;

        const pricing = this.modelPricing[tryModel] || {
          inputPrice: 0,
          outputPrice: 0,
        };
        const estimatedCost =
          (inputTokens / 1_000_000) * pricing.inputPrice +
          (outputTokens / 1_000_000) * pricing.outputPrice;

        return {
          selectedModel: tryModel,
          reason:
            tryModel === model
              ? reason
              : `${reason} (Fallback to ${tryModel} vì ${model} không khả dụng)`,
          result: text,
          latency,
          estimatedCost,
          inputTokens,
          outputTokens,
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        console.error(
          `[Model Router] Model ${tryModel} failed:`,
          lastError.message,
        );
        continue;
      }
    }

    // [BUSINESS] Nếu tất cả models đều fail, throw error
    const errorMessage = lastError
      ? `Tất cả models đều thất bại. Lỗi cuối cùng: ${lastError.message}`
      : 'Tất cả models đều thất bại';
    throw new HttpException(
      {
        statusCode: HttpStatus.BAD_GATEWAY,
        message: errorMessage,
        error: 'Model routing failed',
      },
      HttpStatus.BAD_GATEWAY,
    );
  }

  estimateCost(
    model: string,
    inputTokens: number,
    outputTokens: number,
  ): number {
    const pricing = this.modelPricing[model] || {
      inputPrice: 0,
      outputPrice: 0,
    };
    return (
      (inputTokens / 1_000_000) * pricing.inputPrice +
      (outputTokens / 1_000_000) * pricing.outputPrice
    );
  }
}
