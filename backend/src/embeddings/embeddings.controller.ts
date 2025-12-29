import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { EmbeddingsService } from './embeddings.service';
import {
  CreateEmbeddingsRequestDto,
  CreateEmbeddingsResponseDto,
} from './dto/create-embeddings.dto';
import {
  SemanticSearchRequestDto,
  SemanticSearchResponseDto,
} from './dto/semantic-search.dto';

@ApiTags('embeddings')
@Controller('embeddings')
export class EmbeddingsController {
  constructor(private readonly embeddingsService: EmbeddingsService) {}

  @Post('create')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Create embeddings',
    description: 'Tạo embeddings vectors cho danh sách texts',
  })
  @ApiBody({ type: CreateEmbeddingsRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Embeddings created successfully',
    type: CreateEmbeddingsResponseDto,
  })
  async createEmbeddings(
    @Body() dto: CreateEmbeddingsRequestDto,
  ): Promise<CreateEmbeddingsResponseDto> {
    return this.embeddingsService.createEmbeddings(dto.texts);
  }

  @Post('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Semantic search',
    description: 'Tìm texts gần nghĩa nhất với query text',
  })
  @ApiBody({ type: SemanticSearchRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Search completed successfully',
    type: SemanticSearchResponseDto,
  })
  async semanticSearch(
    @Body() dto: SemanticSearchRequestDto,
  ): Promise<SemanticSearchResponseDto> {
    return this.embeddingsService.semanticSearch(
      dto.query,
      dto.texts,
      dto.topK,
    );
  }
}
