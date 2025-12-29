import { Module } from '@nestjs/common';
import { ChunkingController } from './chunking.controller';
import { ChunkingService } from './chunking.service';

@Module({
  controllers: [ChunkingController],
  providers: [ChunkingService],
  exports: [ChunkingService],
})
export class ChunkingModule {}
