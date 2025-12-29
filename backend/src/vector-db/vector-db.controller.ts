import {
  Controller,
  Post,
  Delete,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { VectorDbService } from './vector-db.service';
import {
  IngestDocumentsRequestDto,
  IngestDocumentsResponseDto,
} from './dto/ingest-documents.dto';
import {
  VectorSearchRequestDto,
  VectorSearchResponseDto,
  DeleteDocumentsRequestDto,
  DeleteDocumentsResponseDto,
} from './dto/vector-search.dto';

@ApiTags('vector-db')
@Controller('vector-db')
export class VectorDbController {
  constructor(private readonly vectorDbService: VectorDbService) {}

  @Post('ingest')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Ingest documents',
    description: 'Tạo embeddings và lưu documents vào vector database',
  })
  @ApiBody({ type: IngestDocumentsRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Documents ingested successfully',
    type: IngestDocumentsResponseDto,
  })
  async ingestDocuments(
    @Body() dto: IngestDocumentsRequestDto,
  ): Promise<IngestDocumentsResponseDto> {
    return this.vectorDbService.ingestDocuments(dto.texts, dto.collectionName);
  }

  @Post('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Vector search',
    description: 'Tìm kiếm semantic trong vector database',
  })
  @ApiBody({ type: VectorSearchRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Search completed successfully',
    type: VectorSearchResponseDto,
  })
  async search(
    @Body() dto: VectorSearchRequestDto,
  ): Promise<VectorSearchResponseDto> {
    return this.vectorDbService.search(dto.query, dto.collectionName, dto.topK);
  }

  @Delete('documents')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete documents',
    description: 'Xóa documents khỏi vector database',
  })
  @ApiBody({ type: DeleteDocumentsRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Documents deleted successfully',
    type: DeleteDocumentsResponseDto,
  })
  async deleteDocuments(
    @Body() dto: DeleteDocumentsRequestDto,
  ): Promise<DeleteDocumentsResponseDto> {
    return this.vectorDbService.deleteDocuments(
      dto.documentIds,
      dto.collectionName,
    );
  }
}
