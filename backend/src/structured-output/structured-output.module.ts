import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StructuredOutputController } from './structured-output.controller';
import { StructuredOutputService } from './structured-output.service';
import { PromptEngineeringModule } from '../prompt-engineering/prompt-engineering.module';

@Module({
  imports: [ConfigModule, PromptEngineeringModule],
  controllers: [StructuredOutputController],
  providers: [StructuredOutputService],
  exports: [StructuredOutputService],
})
export class StructuredOutputModule {}
