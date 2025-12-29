import { Injectable, Logger } from '@nestjs/common';

interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  jitter?: boolean;
}

@Injectable()
export class RetryService {
  private readonly logger = new Logger(RetryService.name);

  async retryWithBackoff<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {},
  ): Promise<T> {
    const {
      maxRetries = 3,
      baseDelay = 1000,
      maxDelay = 10000,
      jitter = true,
    } = options;

    let lastError: Error;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error: any) {
        lastError = error;

        const status = error?.status || error?.response?.status || 0;
        const shouldRetry =
          status === 429 || status >= 500 || error?.code === 'ECONNRESET';

        if (!shouldRetry || attempt === maxRetries - 1) {
          throw error;
        }

        const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
        const jitterValue = jitter ? Math.random() * 100 : 0;
        const totalDelay = delay + jitterValue;

        this.logger.warn(
          `Attempt ${attempt + 1} failed. Retrying in ${totalDelay.toFixed(0)}ms...`,
        );

        await this.sleep(totalDelay);
      }
    }

    throw lastError!;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  simulateRetry(
    maxRetries: number = 3,
    baseDelay: number = 1000,
    shouldFail: boolean = false,
  ): {
    attempts: number;
    delays: number[];
    success: boolean;
    error?: string;
  } {
    const attempts: number[] = [];
    const delays: number[] = [];
    let success = false;
    let error: string | undefined;

    for (let i = 0; i < maxRetries; i++) {
      attempts.push(i + 1);
      if (i > 0) {
        const delay = Math.min(baseDelay * Math.pow(2, i - 1), 10000);
        delays.push(delay);
      }

      if (!shouldFail || i === maxRetries - 1) {
        success = true;
        break;
      } else {
        error = `Error on attempt ${i + 1}`;
      }
    }

    return {
      attempts: attempts.length,
      delays,
      success,
      error,
    };
  }
}
