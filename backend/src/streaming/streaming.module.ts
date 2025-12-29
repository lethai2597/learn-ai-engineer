import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StreamingController } from './streaming.controller';
import { StreamingService } from './streaming.service';
import { PromptEngineeringModule } from '../prompt-engineering/prompt-engineering.module';

/**
 * Streaming Module
 * Module chính cho các tính năng streaming
 */
@Module({
  imports: [ConfigModule, PromptEngineeringModule],
  controllers: [StreamingController],
  providers: [StreamingService],
  exports: [StreamingService],
})
export class StreamingModule {}
