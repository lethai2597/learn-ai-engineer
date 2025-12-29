import { Injectable } from '@nestjs/common';
import { VisionService } from './services/vision.service';

@Injectable()
export class MultimodalService {
  constructor(private readonly visionService: VisionService) {}

  async analyzeImage(
    imageUrl: string,
    prompt?: string,
  ): Promise<{
    analysis: string;
    model: string;
    tokens: {
      input: number;
      output: number;
      total: number;
    };
  }> {
    return this.visionService.analyzeImage(imageUrl, prompt);
  }
}
