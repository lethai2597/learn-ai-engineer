import { Injectable } from '@nestjs/common';
import { OpenRouterService } from '../prompt-engineering/services/openrouter.service';
import OpenAI from 'openai';

type ChatMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

/**
 * Streaming Service
 * Business logic cho streaming responses
 *
 * Design Pattern: Iterator Pattern
 * - Iterate qua streaming chunks từ OpenRouter
 * - Convert sang SSE format
 */
@Injectable()
export class StreamingService {
  constructor(private readonly openRouterService: OpenRouterService) {}

  // llm-fundamentals-streaming-01
  async *streamText(
    prompt: string,
    options?: {
      model?: string;
      temperature?: number;
    },
  ): AsyncGenerator<string, void, unknown> {
    // [BUSINESS] Tạo messages từ user prompt
    const messages: ChatMessage[] = [
      {
        role: 'user',
        content: prompt,
      },
    ];

    try {
      // [BUSINESS] Gọi OpenRouter service để generate streaming completion
      // Streaming: LLM trả về tokens từng phần thay vì đợi toàn bộ response
      const stream = this.openRouterService.generateStreamingCompletion(
        messages,
        {
          model: options?.model,
          temperature: options?.temperature,
        },
      );

      // [BUSINESS] Iterate qua streaming chunks và format thành SSE
      // SSE (Server-Sent Events): Format "data: {content}\n\n" để frontend có thể nhận real-time
      for await (const chunk of stream) {
        // [FRONTEND] Format as SSE để frontend có thể hiển thị từng token ngay lập tức
        const sseChunk = `data: ${JSON.stringify({ content: chunk })}\n\n`;
        yield sseChunk;
      }

      // [FRONTEND] Send done signal để frontend biết stream đã kết thúc
      yield `data: [DONE]\n\n`;
    } catch (error) {
      console.error('[Streaming Service] Error:', error);
      // [FRONTEND] Send error as SSE để frontend có thể hiển thị lỗi
      yield `data: ${JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' })}\n\n`;
      yield `data: [DONE]\n\n`;
    }
  }

  /**
   * Generate non-streaming response (để so sánh)
   */
  async generateNonStreaming(
    prompt: string,
    options?: {
      model?: string;
      temperature?: number;
    },
  ): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'user',
        content: prompt,
      },
    ];

    return this.openRouterService.generateCompletion(messages, {
      model: options?.model,
      temperature: options?.temperature,
    });
  }
}
