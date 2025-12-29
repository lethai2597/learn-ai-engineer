import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PromptEngineeringController } from './prompt-engineering.controller';
import { PromptEngineeringService } from './prompt-engineering.service';
import { OpenRouterService } from './services/openrouter.service';
import { ObservabilityModule } from '../observability/observability.module';

/**
 * Prompt Engineering Module
 * Module chính cho các tính năng prompt engineering
 */
@Module({
  imports: [ConfigModule, ObservabilityModule],
  controllers: [PromptEngineeringController],
  providers: [PromptEngineeringService, OpenRouterService],
  exports: [PromptEngineeringService, OpenRouterService], // Export OpenRouterService để các module khác dùng
})
export class PromptEngineeringModule {}
