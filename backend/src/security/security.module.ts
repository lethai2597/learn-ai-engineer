import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SecurityController } from './security.controller';
import { SecurityService } from './security.service';
import { PromptInjectionService } from './services/prompt-injection.service';
import { ContentModerationService } from './services/content-moderation.service';
import { PiiDetectionService } from './services/pii-detection.service';
import { RateLimitService } from './services/rate-limit.service';

@Module({
  imports: [ConfigModule],
  controllers: [SecurityController],
  providers: [
    SecurityService,
    PromptInjectionService,
    ContentModerationService,
    PiiDetectionService,
    RateLimitService,
  ],
  exports: [SecurityService],
})
export class SecurityModule {}
