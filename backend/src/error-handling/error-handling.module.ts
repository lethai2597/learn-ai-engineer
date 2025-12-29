import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ErrorHandlingController } from './error-handling.controller';
import { ErrorHandlingService } from './error-handling.service';
import { RetryService } from './services/retry.service';
import { CircuitBreakerService } from './services/circuit-breaker.service';
import { FallbackService } from './services/fallback.service';

@Module({
  imports: [ConfigModule],
  controllers: [ErrorHandlingController],
  providers: [
    ErrorHandlingService,
    RetryService,
    CircuitBreakerService,
    FallbackService,
  ],
  exports: [ErrorHandlingService],
})
export class ErrorHandlingModule {}
