import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChainsRoutingController } from './chains-routing.controller';
import { ChainsRoutingService } from './chains-routing.service';
import { PromptEngineeringModule } from '../prompt-engineering/prompt-engineering.module';

@Module({
  imports: [ConfigModule, PromptEngineeringModule],
  controllers: [ChainsRoutingController],
  providers: [ChainsRoutingService],
  exports: [ChainsRoutingService],
})
export class ChainsRoutingModule {}
