import { Injectable, Logger } from '@nestjs/common';

interface FallbackOption<T> {
  name: string;
  fn: () => Promise<T>;
}

@Injectable()
export class FallbackService {
  private readonly logger = new Logger(FallbackService.name);

  async executeWithFallback<T>(
    options: FallbackOption<T>[],
  ): Promise<{ result: T; source: string }> {
    if (options.length === 0) {
      throw new Error('No fallback options provided');
    }

    for (const option of options) {
      try {
        this.logger.log(`Trying ${option.name}...`);
        const result = await option.fn();
        this.logger.log(`Success with ${option.name}`);
        return { result, source: option.name };
      } catch (error) {
        this.logger.warn(`${option.name} failed: ${error}`);
        continue;
      }
    }

    throw new Error('All fallback options failed');
  }

  simulateFallback(
    models: string[],
    shouldFail: boolean = false,
  ): {
    attempts: Array<{ model: string; success: boolean; error?: string }>;
    result: string;
    source: string;
  } {
    const attempts: Array<{
      model: string;
      success: boolean;
      error?: string;
    }> = [];
    let result = '';
    let source = '';

    for (const model of models) {
      const success = !shouldFail || model === models[models.length - 1];
      attempts.push({
        model,
        success,
        error: success ? undefined : 'Model unavailable',
      });

      if (success) {
        result = `Response from ${model}`;
        source = model;
        break;
      }
    }

    return { attempts, result, source };
  }
}
