import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EvaluationController } from './evaluation.controller';
import { EvaluationService } from './evaluation.service';
import { ExactMatchStrategy } from './strategies/exact-match.strategy';
import { ContainsStrategy } from './strategies/contains.strategy';
import { LlmJudgeStrategy } from './strategies/llm-judge.strategy';
import { PromptEngineeringModule } from '../prompt-engineering/prompt-engineering.module';

@Module({
  imports: [ConfigModule, PromptEngineeringModule],
  controllers: [EvaluationController],
  providers: [
    EvaluationService,
    ExactMatchStrategy,
    ContainsStrategy,
    LlmJudgeStrategy,
  ],
})
export class EvaluationModule {}
