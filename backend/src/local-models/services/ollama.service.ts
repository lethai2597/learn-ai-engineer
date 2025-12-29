import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  stream?: boolean;
}

interface OllamaGenerateResponse {
  response: string;
  model: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

@Injectable()
export class OllamaService {
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl =
      this.configService.get<string>('OLLAMA_BASE_URL') ||
      'http://localhost:11434';
  }

  // advanced-local-models-01
  async generate(
    prompt: string,
    model: string = 'llama3',
  ): Promise<{
    response: string;
    model: string;
    tokens?: {
      input: number;
      output: number;
      total: number;
    };
  }> {
    try {
      // [BUSINESS] Tạo request body cho Ollama API
      // Ollama: Local LLM server, chạy models trên máy local (không cần API key)
      const requestBody: OllamaGenerateRequest = {
        model,
        prompt,
        stream: false,
      };

      // [BUSINESS] Gọi Ollama API bằng raw HTTP call
      // Endpoint: POST /api/generate
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      // [BUSINESS] Xử lý các lỗi phổ biến của Ollama
      if (!response.ok) {
        if (response.status === 404) {
          throw new BadRequestException(
            `Model "${model}" not found. Please run: ollama pull ${model}`,
          );
        }
        if (response.status === 503 || response.status === 0) {
          throw new BadRequestException(
            'Ollama service is not running. Please start Ollama: ollama serve',
          );
        }
        const errorText = await response.text();
        throw new BadRequestException(
          `Ollama API error: ${response.status} - ${errorText}`,
        );
      }

      // [BUSINESS] Parse response từ Ollama
      const data: OllamaGenerateResponse = await response.json();

      return {
        response: data.response,
        model: data.model,
        // [FRONTEND] Extract token counts để hiển thị cho user
        tokens:
          data.prompt_eval_count !== undefined && data.eval_count !== undefined
            ? {
                input: data.prompt_eval_count,
                output: data.eval_count,
                total: data.prompt_eval_count + data.eval_count,
              }
            : undefined,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new BadRequestException(
          'Cannot connect to Ollama. Please ensure Ollama is running: ollama serve',
        );
      }
      if (error instanceof Error) {
        throw new BadRequestException(`Ollama error: ${error.message}`);
      }
      throw new BadRequestException('Failed to generate response from Ollama');
    }
  }

  async listModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 503 || response.status === 0) {
          throw new BadRequestException(
            'Ollama service is not running. Please start Ollama: ollama serve',
          );
        }
        return [];
      }

      const data = await response.json();
      return data.models?.map((model: { name: string }) => model.name) || [];
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      return [];
    }
  }
}
