import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmbeddingsController } from './embeddings.controller';
import { EmbeddingsService } from './embeddings.service';

@Module({
  imports: [ConfigModule],
  controllers: [EmbeddingsController],
  providers: [EmbeddingsService],
  exports: [EmbeddingsService],
})
export class EmbeddingsModule {}
