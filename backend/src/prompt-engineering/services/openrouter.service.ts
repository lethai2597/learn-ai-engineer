import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

type ChatMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

type ChatTool = OpenAI.Chat.Completions.ChatCompletionTool;

interface ChatCompletionResponse {
  id: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string | null;
      tool_calls?: Array<{
        id: string;
        type: 'function';
        function: {
          name: string;
          arguments: string;
        };
      }>;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

@Injectable()
export class OpenRouterService {
  private readonly apiKey: string;
  private readonly baseURL: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('openrouter.apiKey') || '';
    this.baseURL =
      this.configService.get<string>('openrouter.baseURL') ||
      'https://openrouter.ai/api/v1';

    if (!this.apiKey) {
      throw new Error('OPENROUTER_API_KEY is required');
    }
  }

  async generateCompletion(
    messages: ChatMessage[],
    options?: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
    },
  ): Promise<string> {
    const result = await this.generateCompletionWithMetadata(messages, options);
    return result.content;
  }

  async generateCompletionWithMetadata(
    messages: ChatMessage[],
    options?: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
    },
  ): Promise<{
    content: string;
    model: string;
    tokens: {
      input: number;
      output: number;
      total: number;
    };
  }> {
    const model =
      options?.model ||
      this.configService.get<string>('openrouter.defaultModel') ||
      'openai/gpt-4o';
    const temperature =
      options?.temperature ??
      this.configService.get<number>('openrouter.temperature');
    const maxTokens =
      options?.maxTokens ??
      this.configService.get<number>('openrouter.maxTokens');

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'http://localhost:4000',
          'X-Title': 'Learn AI - Prompt Engineering',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `OpenRouter API error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`,
        );
      }

      const completion = (await response.json()) as ChatCompletionResponse;
      const content = completion.choices[0]?.message?.content || '';
      const usage = completion.usage;

      return {
        content,
        model,
        tokens: {
          input: usage?.prompt_tokens || 0,
          output: usage?.completion_tokens || 0,
          total: usage?.total_tokens || 0,
        },
      };
    } catch (error) {
      console.error('[OpenRouter Service] Error:', error);
      throw new Error(
        `Failed to generate completion: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async generateJSONCompletion(
    messages: ChatMessage[],
    options?: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
    },
  ): Promise<string> {
    const model =
      options?.model ||
      this.configService.get<string>('openrouter.defaultModel') ||
      'openai/gpt-4o';
    const temperature =
      options?.temperature ??
      this.configService.get<number>('openrouter.temperature');
    const maxTokens =
      options?.maxTokens ??
      this.configService.get<number>('openrouter.maxTokens');

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'http://localhost:4000',
          'X-Title': 'Learn AI - Prompt Engineering',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `OpenRouter API error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`,
        );
      }

      const completion = (await response.json()) as ChatCompletionResponse;
      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('[OpenRouter Service] JSON Mode Error:', error);
      throw new Error(
        `Failed to generate JSON completion: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async generateFunctionCallCompletion(
    messages: ChatMessage[],
    tools: ChatTool[],
    options?: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
    },
  ): Promise<{
    content: string | null;
    toolCalls: Array<{
      id: string;
      type: 'function';
      function: {
        name: string;
        arguments: string;
      };
    }>;
  }> {
    const model =
      options?.model ||
      this.configService.get<string>('openrouter.defaultModel') ||
      'openai/gpt-4o';
    const temperature =
      options?.temperature ??
      this.configService.get<number>('openrouter.temperature');
    const maxTokens =
      options?.maxTokens ??
      this.configService.get<number>('openrouter.maxTokens');

    try {
      const firstTool = tools[0];
      const functionName =
        firstTool && 'function' in firstTool
          ? firstTool.function?.name || ''
          : '';

      const requestBody: Record<string, unknown> = {
        model,
        messages,
        tools,
        temperature,
        max_tokens: maxTokens,
      };

      if (functionName) {
        requestBody.tool_choice = {
          type: 'function',
          function: { name: functionName },
        };
      } else {
        requestBody.tool_choice = 'auto';
      }

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'http://localhost:4000',
          'X-Title': 'Learn AI - Prompt Engineering',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `OpenRouter API error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`,
        );
      }

      const completion = (await response.json()) as ChatCompletionResponse;
      const message = completion.choices[0]?.message;
      return {
        content: message?.content || null,
        toolCalls: message?.tool_calls || [],
      };
    } catch (error) {
      console.error('[OpenRouter Service] Function Calling Error:', error);
      throw new Error(
        `Failed to generate function call completion: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async *generateStreamingCompletion(
    messages: ChatMessage[],
    options?: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
    },
  ): AsyncGenerator<string, void, unknown> {
    const model =
      options?.model ||
      this.configService.get<string>('openrouter.defaultModel') ||
      'openai/gpt-4o';
    const temperature =
      options?.temperature ??
      this.configService.get<number>('openrouter.temperature');
    const maxTokens =
      options?.maxTokens ??
      this.configService.get<number>('openrouter.maxTokens');

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'http://localhost:4000',
          'X-Title': 'Learn AI - Prompt Engineering',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `OpenRouter API error: ${response.status} ${response.statusText}. ${errorData}`,
        );
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.trim() === '') continue;
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                return;
              }
              try {
                const chunk = JSON.parse(data) as {
                  choices?: Array<{
                    delta?: {
                      content?: string;
                    };
                  }>;
                };
                const content = chunk.choices?.[0]?.delta?.content;
                if (content) {
                  yield content;
                }
              } catch (parseError) {
                console.warn(
                  '[OpenRouter Service] Failed to parse chunk:',
                  parseError,
                );
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      console.error('[OpenRouter Service] Streaming Error:', error);
      throw new Error(
        `Failed to generate streaming completion: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async getModels(): Promise<Array<Record<string, unknown>>> {
    try {
      const response = await fetch(`${this.baseURL}/models`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
      const data = (await response.json()) as {
        data?: Array<Record<string, unknown>>;
      };
      return data.data || [];
    } catch (error) {
      console.error('[OpenRouter Service] Error fetching models:', error);
      return [];
    }
  }
}
