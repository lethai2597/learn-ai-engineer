import { Injectable } from '@nestjs/common';
import { OllamaService } from './services/ollama.service';

@Injectable()
export class LocalModelsService {
  constructor(private readonly ollamaService: OllamaService) {}

  async chat(
    message: string,
    model?: string,
  ): Promise<{
    response: string;
    model: string;
    tokens?: {
      input: number;
      output: number;
      total: number;
    };
  }> {
    return this.ollamaService.generate(message, model);
  }

  async listModels(): Promise<string[]> {
    return this.ollamaService.listModels();
  }
}
