import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { LLMLog } from '../types/observability.types';

@Injectable()
export class HeliconeService implements OnModuleInit {
  private readonly logger = new Logger(HeliconeService.name);
  private enabled = false;
  private apiKey?: string;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.enabled = this.configService.get<boolean>(
      'observability.helicone.enabled',
      false,
    );
    this.apiKey = this.configService.get<string>(
      'observability.helicone.apiKey',
    );

    if (this.enabled && this.apiKey) {
      this.logger.log('Helicone tracking enabled');
    } else {
      this.logger.warn('Helicone tracking disabled - missing API key');
    }
  }

  createOpenAIClient(userId?: string): OpenAI {
    const openrouterApiKey =
      this.configService.get<string>('openrouter.apiKey');
    const openrouterBaseURL =
      this.configService.get<string>('openrouter.baseURL');

    if (!openrouterApiKey) {
      throw new Error('OPENROUTER_API_KEY is required');
    }

    if (!this.enabled || !this.apiKey) {
      return new OpenAI({
        apiKey: openrouterApiKey,
        baseURL: openrouterBaseURL,
        defaultHeaders: {
          'HTTP-Referer': 'http://localhost:4000',
          'X-Title': 'Learn AI - Helicone',
        },
      });
    }

    return new OpenAI({
      apiKey: openrouterApiKey,
      baseURL: 'https://oai.hconeai.com/v1',
      defaultHeaders: {
        'Helicone-Auth': `Bearer ${this.apiKey}`,
        ...(userId && { 'Helicone-User-Id': userId }),
      },
    });
  }

  logLLMCall(log: LLMLog): Promise<void> {
    if (!this.enabled) {
      return Promise.resolve();
    }

    this.logger.debug(
      `Helicone tracking: ${log.model} - ${log.tokens.total} tokens - $${log.cost.toFixed(4)}`,
    );
    return Promise.resolve();
  }

  isEnabled(): boolean {
    return this.enabled && !!this.apiKey;
  }
}
