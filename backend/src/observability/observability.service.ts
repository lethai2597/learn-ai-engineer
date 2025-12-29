import { Injectable, Logger } from '@nestjs/common';
import { LangSmithService } from './services/langsmith.service';
import { HeliconeService } from './services/helicone.service';
import { CustomLoggerService } from './services/custom-logger.service';
import { LLMLog, LLMCallMetadata } from './types/observability.types';

@Injectable()
export class ObservabilityService {
  private readonly logger = new Logger(ObservabilityService.name);

  constructor(
    private readonly langSmithService: LangSmithService,
    private readonly heliconeService: HeliconeService,
    private readonly customLoggerService: CustomLoggerService,
  ) {}

  async logLLMCall(log: LLMLog, metadata?: LLMCallMetadata): Promise<void> {
    const promises: Promise<void>[] = [];

    if (this.langSmithService.isEnabled()) {
      promises.push(this.langSmithService.logLLMCall(log, metadata));
    }

    if (this.heliconeService.isEnabled()) {
      promises.push(this.heliconeService.logLLMCall(log));
    }

    if (this.customLoggerService.isEnabled()) {
      promises.push(this.customLoggerService.logLLMCall(log, metadata));
    }

    await Promise.allSettled(promises);
  }

  async logLLMCallFromResponse(
    response: any,
    latency: number,
    metadata?: LLMCallMetadata,
  ): Promise<void> {
    const log: LLMLog = {
      timestamp: new Date().toISOString(),
      model: response.model || 'unknown',
      provider: response.provider || 'unknown',
      prompt: response.prompt || response.input || '',
      response: response.response || response.content || response.text || '',
      tokens: {
        input: response.tokens?.input || response.usage?.prompt_tokens || 0,
        output:
          response.tokens?.output || response.usage?.completion_tokens || 0,
        total:
          response.tokens?.total ||
          response.usage?.total_tokens ||
          (response.tokens?.input || 0) + (response.tokens?.output || 0),
      },
      cost: this.calculateCost(
        response.model || 'unknown',
        response.tokens?.input || response.usage?.prompt_tokens || 0,
        response.tokens?.output || response.usage?.completion_tokens || 0,
      ),
      latency,
      userId: metadata?.userId,
      sessionId: metadata?.sessionId,
      endpoint: metadata?.endpoint,
      metadata: metadata?.metadata,
    };

    await this.logLLMCall(log, metadata);
  }

  async logError(
    error: Error,
    latency: number,
    metadata?: LLMCallMetadata,
  ): Promise<void> {
    const log: LLMLog = {
      timestamp: new Date().toISOString(),
      model: 'unknown',
      provider: 'unknown',
      prompt: '',
      response: '',
      tokens: { input: 0, output: 0, total: 0 },
      cost: 0,
      latency,
      error: error.message,
      userId: metadata?.userId,
      sessionId: metadata?.sessionId,
      endpoint: metadata?.endpoint,
      metadata: {
        ...metadata?.metadata,
        errorStack: error.stack,
      },
    };

    await this.logLLMCall(log, metadata);
  }

  async getLogs(filters?: {
    userId?: string;
    model?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    return this.customLoggerService.getLogs(filters);
  }

  async getStats() {
    return this.customLoggerService.getStats();
  }

  getHeliconeService(): HeliconeService {
    return this.heliconeService;
  }

  private calculateCost(
    model: string,
    inputTokens: number,
    outputTokens: number,
  ): number {
    const pricing: Record<string, { input: number; output: number }> = {
      'gpt-4o': { input: 0.0025 / 1000, output: 0.01 / 1000 },
      'gpt-4-turbo': { input: 0.01 / 1000, output: 0.03 / 1000 },
      'gpt-4': { input: 0.03 / 1000, output: 0.06 / 1000 },
      'gpt-3.5-turbo': { input: 0.0005 / 1000, output: 0.0015 / 1000 },
      'claude-3-opus': { input: 0.015 / 1000, output: 0.075 / 1000 },
      'claude-3-sonnet': { input: 0.003 / 1000, output: 0.015 / 1000 },
      'claude-3-haiku': { input: 0.00025 / 1000, output: 0.00125 / 1000 },
    };

    const price = pricing[model] || {
      input: 0.001 / 1000,
      output: 0.002 / 1000,
    };

    return inputTokens * price.input + outputTokens * price.output;
  }
}
