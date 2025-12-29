import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LocalModelsController } from './local-models.controller';
import { LocalModelsService } from './local-models.service';
import { OllamaService } from './services/ollama.service';

@Module({
  imports: [ConfigModule],
  controllers: [LocalModelsController],
  providers: [LocalModelsService, OllamaService],
  exports: [LocalModelsService],
})
export class LocalModelsModule {}
