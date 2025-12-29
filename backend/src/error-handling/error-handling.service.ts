import { Injectable, Logger } from '@nestjs/common';
import { RetryService } from './services/retry.service';
import { CircuitBreakerService } from './services/circuit-breaker.service';
import { FallbackService } from './services/fallback.service';

@Injectable()
export class ErrorHandlingService {
  private readonly logger = new Logger(ErrorHandlingService.name);

  constructor(
    private readonly retryService: RetryService,
    private readonly circuitBreakerService: CircuitBreakerService,
    private readonly fallbackService: FallbackService,
  ) {}

  async retryWithBackoff<T>(
    fn: () => Promise<T>,
    options?: {
      maxRetries?: number;
      baseDelay?: number;
      maxDelay?: number;
      jitter?: boolean;
    },
  ): Promise<T> {
    return this.retryService.retryWithBackoff(fn, options);
  }

  // production-error-handling-01
  async simulateRetry(
    maxRetries: number = 3,
    baseDelay: number = 1000,
    shouldFail: boolean = false,
  ) {
    // [BUSINESS] Mô phỏng retry logic với exponential backoff
    // Exponential backoff: Delay tăng dần theo công thức baseDelay * 2^attempt
    // Jitter: Thêm randomness để tránh thundering herd problem
    return this.retryService.simulateRetry(maxRetries, baseDelay, shouldFail);
  }

  async getCircuitState(name: string) {
    return this.circuitBreakerService.getCircuitState(name);
  }

  // production-error-handling-02
  async callWithCircuitBreaker<T>(
    circuitName: string,
    fn: () => Promise<T>,
    config?: {
      failureThreshold?: number;
      timeout?: number;
      successThreshold?: number;
    },
  ): Promise<T> {
    // [BUSINESS] Circuit Breaker Pattern: Bảo vệ hệ thống khỏi cascade failures
    // States: CLOSED (normal), OPEN (failing, reject requests), HALF_OPEN (testing recovery)
    // Khi failure threshold đạt, circuit mở và reject requests ngay lập tức
    const circuit = this.circuitBreakerService.getCircuit(circuitName, config);
    return circuit.call(fn);
  }

  resetCircuit(name: string): void {
    this.circuitBreakerService.resetCircuit(name);
  }

  async executeWithFallback<T>(
    options: Array<{ name: string; fn: () => Promise<T> }>,
  ): Promise<{ result: T; source: string }> {
    return this.fallbackService.executeWithFallback(options);
  }

  // production-error-handling-03
  async simulateFallback(models: string[], shouldFail: boolean = false) {
    // [BUSINESS] Fallback Strategy: Thử các options theo thứ tự, dùng option đầu tiên thành công
    // Nếu primary model fail, tự động fallback sang backup models
    // Giúp đảm bảo availability khi một service không khả dụng
    return this.fallbackService.simulateFallback(models, shouldFail);
  }
}
