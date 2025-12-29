import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FunctionCallingController } from './function-calling.controller';
import { FunctionCallingService } from './function-calling.service';
import { PromptEngineeringModule } from '../prompt-engineering/prompt-engineering.module';

@Module({
  imports: [ConfigModule, PromptEngineeringModule],
  controllers: [FunctionCallingController],
  providers: [FunctionCallingService],
  exports: [FunctionCallingService],
})
export class FunctionCallingModule {}
