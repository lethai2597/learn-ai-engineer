import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReactPatternController } from './react-pattern.controller';
import { ReactPatternService } from './react-pattern.service';
import { PromptEngineeringModule } from '../prompt-engineering/prompt-engineering.module';

@Module({
  imports: [ConfigModule, PromptEngineeringModule],
  controllers: [ReactPatternController],
  providers: [ReactPatternService],
  exports: [ReactPatternService],
})
export class ReactPatternModule {}
