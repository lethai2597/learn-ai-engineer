import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PromptEngineeringModule } from './prompt-engineering/prompt-engineering.module';
import { StructuredOutputModule } from './structured-output/structured-output.module';
import { StreamingModule } from './streaming/streaming.module';
import { ModelComparisonModule } from './model-comparison/model-comparison.module';
import { EmbeddingsModule } from './embeddings/embeddings.module';
import { VectorDbModule } from './vector-db/vector-db.module';
import { ChunkingModule } from './chunking/chunking.module';
import { MemoryManagementModule } from './memory-management/memory-management.module';
import { ChainsRoutingModule } from './chains-routing/chains-routing.module';
import { FunctionCallingModule } from './function-calling/function-calling.module';
import { ReactPatternModule } from './react-pattern/react-pattern.module';
import { EvaluationModule } from './evaluation/evaluation.module';
import { ObservabilityModule } from './observability/observability.module';
import { CostOptimizationModule } from './cost-optimization/cost-optimization.module';
import { SecurityModule } from './security/security.module';
import { ErrorHandlingModule } from './error-handling/error-handling.module';
import { MultimodalModule } from './multimodal/multimodal.module';
import { FineTuningModule } from './fine-tuning/fine-tuning.module';
import { LocalModelsModule } from './local-models/local-models.module';
import configuration from './config/configuration';

@Module({
  imports: [
    // ConfigModule - Quản lý environment variables
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule global
      load: [configuration], // Load configuration từ file config
      envFilePath: ['.env.local', '.env'], // Load từ .env files
    }),
    // ThrottlerModule - Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // Time window: 60 seconds
        limit: 10, // Max requests per window
      },
    ]),
    PromptEngineeringModule,
    StructuredOutputModule,
    StreamingModule,
    ModelComparisonModule,
    EmbeddingsModule,
    VectorDbModule,
    ChunkingModule,
    MemoryManagementModule,
    ChainsRoutingModule,
    FunctionCallingModule,
    ReactPatternModule,
    EvaluationModule,
    ObservabilityModule,
    CostOptimizationModule,
    SecurityModule,
    ErrorHandlingModule,
    MultimodalModule,
    FineTuningModule,
    LocalModelsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global Throttler Guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
