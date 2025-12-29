import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ObservabilityService } from '../observability.service';
import { LLMCallMetadata } from '../types/observability.types';

@Injectable()
export class LLMTracingInterceptor implements NestInterceptor {
  constructor(private observabilityService: ObservabilityService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const startTime = Date.now();

    const metadata: LLMCallMetadata = {
      userId: request.user?.id || request.headers['x-user-id'],
      sessionId: request.headers['x-session-id'],
      endpoint: request.url,
      requestId: request.headers['x-request-id'] || this.generateRequestId(),
      tags: ['api-call'],
    };

    return next.handle().pipe(
      tap({
        next: (data) => {
          const latency = Date.now() - startTime;

          if (this.isLLMResponse(data)) {
            void this.observabilityService.logLLMCallFromResponse(
              data,
              latency,
              metadata,
            );
          }
        },
        error: (error) => {
          const latency = Date.now() - startTime;
          void this.observabilityService.logError(error, latency, metadata);
        },
      }),
    );
  }

  private isLLMResponse(data: any): boolean {
    return (
      data && (data.model || data.provider || data.response || data.content)
    );
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
