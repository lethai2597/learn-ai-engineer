import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ObservabilityController } from './observability.controller';
import { ObservabilityService } from './observability.service';
import { LangSmithService } from './services/langsmith.service';
import { HeliconeService } from './services/helicone.service';
import { CustomLoggerService } from './services/custom-logger.service';

@Module({
  imports: [ConfigModule],
  controllers: [ObservabilityController],
  providers: [
    ObservabilityService,
    LangSmithService,
    HeliconeService,
    CustomLoggerService,
  ],
  exports: [ObservabilityService, HeliconeService],
})
export class ObservabilityModule {}
