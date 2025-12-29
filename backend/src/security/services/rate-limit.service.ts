import { Injectable, Logger } from '@nestjs/common';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

@Injectable()
export class RateLimitService {
  private readonly logger = new Logger(RateLimitService.name);
  private readonly store = new Map<string, RateLimitEntry>();

  private readonly defaultLimit = 10;
  private readonly defaultWindow = 60000;

  checkRateLimit(
    identifier: string,
    limit?: number,
    windowMs?: number,
  ): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
    limit: number;
  } {
    const limitValue = limit || this.defaultLimit;
    const windowValue = windowMs || this.defaultWindow;
    const now = Date.now();
    const key = identifier;

    const entry = this.store.get(key);

    if (!entry || now >= entry.resetTime) {
      const resetTime = now + windowValue;
      this.store.set(key, {
        count: 1,
        resetTime,
      });

      return {
        allowed: true,
        remaining: limitValue - 1,
        resetTime,
        limit: limitValue,
      };
    }

    if (entry.count >= limitValue) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
        limit: limitValue,
      };
    }

    entry.count += 1;
    this.store.set(key, entry);

    return {
      allowed: true,
      remaining: limitValue - entry.count,
      resetTime: entry.resetTime,
      limit: limitValue,
    };
  }

  resetRateLimit(identifier: string): void {
    this.store.delete(identifier);
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now >= entry.resetTime) {
        this.store.delete(key);
      }
    }
  }
}
