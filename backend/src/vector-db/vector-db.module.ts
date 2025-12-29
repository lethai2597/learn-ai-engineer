import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VectorDbController } from './vector-db.controller';
import { VectorDbService } from './vector-db.service';
import { EmbeddingsModule } from '../embeddings/embeddings.module';
import { ChromaVectorRepository } from './repositories/chroma-vector.repository';
import { VectorDatabaseFactory } from './repositories/vector-database.factory';

@Module({
  imports: [ConfigModule, EmbeddingsModule],
  controllers: [VectorDbController],
  providers: [VectorDbService, ChromaVectorRepository, VectorDatabaseFactory],
  exports: [VectorDbService],
})
export class VectorDbModule {}
