import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ModelComparisonService } from './model-comparison.service';
import {
  CompareModelsRequestDto,
  CompareModelsResponseDto,
} from './dto/compare-models.dto';
import {
  ModelRouterRequestDto,
  ModelRouterResponseDto,
} from './dto/model-router.dto';

@ApiTags('model-comparison')
@Controller('model-comparison')
export class ModelComparisonController {
  constructor(
    private readonly modelComparisonService: ModelComparisonService,
  ) {}

  @Post('compare')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Compare multiple models',
    description: 'So sánh output của nhiều models cho cùng một prompt',
  })
  @ApiBody({ type: CompareModelsRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Comparison results',
    type: CompareModelsResponseDto,
  })
  async compareModels(
    @Body() dto: CompareModelsRequestDto,
  ): Promise<CompareModelsResponseDto> {
    const result = await this.modelComparisonService.compareModels(
      dto.prompt,
      dto.models,
      dto.temperature,
    );

    return result;
  }

  @Post('router')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Model router',
    description: 'Tự động chọn model phù hợp dựa trên task type',
  })
  @ApiBody({ type: ModelRouterRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Router result',
    type: ModelRouterResponseDto,
  })
  async routeModel(
    @Body() dto: ModelRouterRequestDto,
  ): Promise<ModelRouterResponseDto> {
    const result = await this.modelComparisonService.routeModel(
      dto.prompt,
      dto.taskType,
      dto.temperature,
    );

    return result;
  }
}
