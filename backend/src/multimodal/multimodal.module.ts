import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MultimodalController } from './multimodal.controller';
import { MultimodalService } from './multimodal.service';
import { VisionService } from './services/vision.service';
import { PromptEngineeringModule } from '../prompt-engineering/prompt-engineering.module';

@Module({
  imports: [ConfigModule, PromptEngineeringModule],
  controllers: [MultimodalController],
  providers: [MultimodalService, VisionService],
  exports: [MultimodalService],
})
export class MultimodalModule {}
