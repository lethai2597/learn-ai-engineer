import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ModelComparisonController } from './model-comparison.controller';
import { ModelComparisonService } from './model-comparison.service';
import { PromptEngineeringModule } from '../prompt-engineering/prompt-engineering.module';

@Module({
  imports: [ConfigModule, PromptEngineeringModule],
  controllers: [ModelComparisonController],
  providers: [ModelComparisonService],
  exports: [ModelComparisonService],
})
export class ModelComparisonModule {}
