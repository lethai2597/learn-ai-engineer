import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CostOptimizationController } from './cost-optimization.controller';
import { CostOptimizationService } from './cost-optimization.service';
import { EmbeddingsModule } from '../embeddings/embeddings.module';

@Module({
  imports: [ConfigModule, EmbeddingsModule],
  controllers: [CostOptimizationController],
  providers: [CostOptimizationService],
  exports: [CostOptimizationService],
})
export class CostOptimizationModule {}
