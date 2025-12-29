import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LLMLog, LLMCallMetadata } from '../types/observability.types';

@Injectable()
export class LangSmithService implements OnModuleInit {
  private readonly logger = new Logger(LangSmithService.name);
  private enabled = false;
  private apiKey?: string;
  private project?: string;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.enabled = this.configService.get<boolean>(
      'observability.langsmith.enabled',
      false,
    );
    this.apiKey = this.configService.get<string>(
      'observability.langsmith.apiKey',
    );
    this.project =
      this.configService.get<string>('observability.langsmith.project') ||
      'learn-ai';

    if (this.enabled && this.apiKey) {
      process.env.LANGCHAIN_TRACING_V2 = 'true';
      process.env.LANGCHAIN_API_KEY = this.apiKey;
      process.env.LANGCHAIN_PROJECT = this.project;
      this.logger.log('LangSmith tracing enabled');
    } else {
      this.logger.warn('LangSmith tracing disabled - missing API key');
    }
  }

  logLLMCall(log: LLMLog, metadata?: LLMCallMetadata): Promise<void> {
    if (!this.enabled || !this.apiKey) {
      return Promise.resolve();
    }

    try {
      const runData = {
        name: 'llm-call',
        run_type: 'llm',
        inputs: {
          messages: [{ role: 'user', content: log.prompt }],
          model: log.model,
        },
        outputs: {
          response: log.response,
        },
        extra: {
          tokens: log.tokens,
          cost: log.cost,
          latency: log.latency,
          ...metadata?.metadata,
        },
        tags: metadata?.tags || [],
        metadata: {
          userId: metadata?.userId,
          sessionId: metadata?.sessionId,
          endpoint: metadata?.endpoint,
          ...metadata?.metadata,
        },
      };

      this.logger.debug(`LangSmith trace: ${JSON.stringify(runData)}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to log to LangSmith: ${errorMessage}`);
    }
    return Promise.resolve();
  }

  isEnabled(): boolean {
    return this.enabled && !!this.apiKey;
  }
}
