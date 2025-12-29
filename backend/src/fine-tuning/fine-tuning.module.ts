import { Module } from '@nestjs/common';
import { FineTuningController } from './fine-tuning.controller';
import { FineTuningService } from './fine-tuning.service';

@Module({
  controllers: [FineTuningController],
  providers: [FineTuningService],
  exports: [FineTuningService],
})
export class FineTuningModule {}
