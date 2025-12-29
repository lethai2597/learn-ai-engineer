import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CostOptimizationService } from './cost-optimization.service';
import {
  CountTokensRequestDto,
  CountTokensResponseDto,
} from './dto/count-tokens.dto';
import {
  CheckCacheRequestDto,
  CheckCacheResponseDto,
  StoreCacheRequestDto,
  StoreCacheResponseDto,
  CacheStatsResponseDto,
} from './dto/semantic-cache.dto';
import {
  AnalyzeCostRequestDto,
  AnalyzeCostResponseDto,
  ModelPricingResponseDto,
} from './dto/cost-analysis.dto';
import {
  SelectModelRequestDto,
  SelectModelResponseDto,
} from './dto/model-selection.dto';

@ApiTags('cost-optimization')
@Controller('cost-optimization')
export class CostOptimizationController {
  constructor(
    private readonly costOptimizationService: CostOptimizationService,
  ) {}

  @Post('count-tokens')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Count tokens in text',
    description: 'Đếm số tokens trong text và ước tính cost',
  })
  @ApiBody({ type: CountTokensRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Token count và estimated cost',
    type: CountTokensResponseDto,
  })
  countTokens(
    @Body() dto: CountTokensRequestDto,
  ): Promise<CountTokensResponseDto> {
    return this.costOptimizationService.countTokens(dto);
  }

  @Post('semantic-cache/check')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Check semantic cache',
    description: 'Kiểm tra xem có cached response tương tự không',
  })
  @ApiBody({ type: CheckCacheRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Cache check result',
    type: CheckCacheResponseDto,
  })
  async checkCache(
    @Body() dto: CheckCacheRequestDto,
  ): Promise<CheckCacheResponseDto> {
    return this.costOptimizationService.checkCache(dto);
  }

  @Post('semantic-cache/store')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Store in semantic cache',
    description: 'Lưu query và response vào cache',
  })
  @ApiBody({ type: StoreCacheRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Store result',
    type: StoreCacheResponseDto,
  })
  async storeCache(
    @Body() dto: StoreCacheRequestDto,
  ): Promise<StoreCacheResponseDto> {
    return this.costOptimizationService.storeCache(dto);
  }

  @Get('semantic-cache/stats')
  @ApiOperation({
    summary: 'Get cache statistics',
    description: 'Lấy thống kê về cache: hit rate, total entries, savings',
  })
  @ApiResponse({
    status: 200,
    description: 'Cache statistics',
    type: CacheStatsResponseDto,
  })
  getCacheStats(): Promise<CacheStatsResponseDto> {
    return this.costOptimizationService.getCacheStats();
  }

  @Post('analyze')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Analyze cost for prompt',
    description: 'Phân tích cost cho prompt và đưa ra recommendations',
  })
  @ApiBody({ type: AnalyzeCostRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Cost analysis result',
    type: AnalyzeCostResponseDto,
  })
  analyzeCost(
    @Body() dto: AnalyzeCostRequestDto,
  ): Promise<AnalyzeCostResponseDto> {
    return this.costOptimizationService.analyzeCost(dto);
  }

  @Get('model-pricing')
  @ApiOperation({
    summary: 'Get model pricing',
    description: 'Lấy bảng giá của các models',
  })
  @ApiResponse({
    status: 200,
    description: 'Model pricing table',
    type: ModelPricingResponseDto,
  })
  getModelPricing(): Promise<ModelPricingResponseDto> {
    return this.costOptimizationService.getModelPricing();
  }

  @Post('select-model')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Select optimal model',
    description: 'Recommend model phù hợp dựa trên task type',
  })
  @ApiBody({ type: SelectModelRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Model selection result',
    type: SelectModelResponseDto,
  })
  selectModel(
    @Body() dto: SelectModelRequestDto,
  ): Promise<SelectModelResponseDto> {
    return this.costOptimizationService.selectModel(dto);
  }
}
