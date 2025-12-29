import { Injectable, Logger } from '@nestjs/common';

type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

interface CircuitBreakerConfig {
  failureThreshold?: number;
  timeout?: number;
  successThreshold?: number;
}

@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);
  private circuits: Map<string, CircuitBreaker> = new Map();

  getCircuit(name: string, config: CircuitBreakerConfig = {}): CircuitBreaker {
    if (!this.circuits.has(name)) {
      this.circuits.set(name, new CircuitBreaker(name, config, this.logger));
    }
    return this.circuits.get(name)!;
  }

  getCircuitState(name: string): {
    state: CircuitState;
    failures: number;
    lastFailTime?: number;
  } {
    const circuit = this.circuits.get(name);
    if (!circuit) {
      return { state: 'CLOSED', failures: 0 };
    }
    return circuit.getState();
  }

  resetCircuit(name: string): void {
    const circuit = this.circuits.get(name);
    if (circuit) {
      circuit.reset();
    }
  }
}

class CircuitBreaker {
  private failures = 0;
  private successes = 0;
  private lastFailTime = 0;
  private state: CircuitState = 'CLOSED';

  constructor(
    private name: string,
    private config: CircuitBreakerConfig,
    private logger: Logger,
  ) {
    this.config = {
      failureThreshold: config.failureThreshold || 5,
      timeout: config.timeout || 60000,
      successThreshold: config.successThreshold || 2,
    };
  }

  async call<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailTime > this.config.timeout!) {
        this.state = 'HALF_OPEN';
        this.successes = 0;
        this.logger.log(`Circuit ${this.name} entering HALF_OPEN state`);
      } else {
        throw new Error(`Circuit breaker ${this.name} is OPEN`);
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;

    if (this.state === 'HALF_OPEN') {
      this.successes++;
      if (this.successes >= this.config.successThreshold!) {
        this.state = 'CLOSED';
        this.logger.log(`Circuit ${this.name} closed after successful calls`);
      }
    } else {
      this.state = 'CLOSED';
    }
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailTime = Date.now();

    if (this.failures >= this.config.failureThreshold!) {
      this.state = 'OPEN';
      this.logger.warn(
        `Circuit ${this.name} opened after ${this.failures} failures`,
      );
    }
  }

  getState(): {
    state: CircuitState;
    failures: number;
    lastFailTime?: number;
  } {
    return {
      state: this.state,
      failures: this.failures,
      lastFailTime: this.lastFailTime || undefined,
    };
  }

  reset(): void {
    this.failures = 0;
    this.successes = 0;
    this.lastFailTime = 0;
    this.state = 'CLOSED';
  }
}
