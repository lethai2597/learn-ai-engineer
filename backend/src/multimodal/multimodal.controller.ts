import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { MultimodalService } from './multimodal.service';
import {
  AnalyzeImageDto,
  AnalyzeImageResponseDto,
} from './dto/analyze-image.dto';

@ApiTags('multimodal')
@Controller('multimodal')
export class MultimodalController {
  constructor(private readonly multimodalService: MultimodalService) {}

  @Post('analyze-image')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Bài 1: Analyze Image với GPT-4 Vision',
    description: 'Phân tích image với GPT-4 Vision model',
  })
  @ApiBody({ type: AnalyzeImageDto })
  @ApiResponse({
    status: 200,
    description: 'Image analyzed successfully',
    type: AnalyzeImageResponseDto,
  })
  async analyzeImage(@Body() dto: AnalyzeImageDto) {
    return this.multimodalService.analyzeImage(dto.imageUrl, dto.prompt);
  }
}
