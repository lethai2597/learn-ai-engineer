import { Module } from '@nestjs/common';
import { MemoryManagementController } from './memory-management.controller';
import { MemoryManagementService } from './memory-management.service';
import { PromptEngineeringModule } from '../prompt-engineering/prompt-engineering.module';
import { SlidingWindowStrategy } from './strategies/sliding-window.strategy';
import { SummarizationStrategy } from './strategies/summarization.strategy';
import { TokenTruncationStrategy } from './strategies/token-truncation.strategy';
import { InMemoryRepository } from './repositories/in-memory.repository';

@Module({
  imports: [PromptEngineeringModule],
  controllers: [MemoryManagementController],
  providers: [
    MemoryManagementService,
    SlidingWindowStrategy,
    SummarizationStrategy,
    TokenTruncationStrategy,
    {
      provide: 'MemoryRepository',
      useClass: InMemoryRepository,
    },
  ],
  exports: [MemoryManagementService],
})
export class MemoryManagementModule {}
