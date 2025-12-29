import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ChunkingService } from './chunking.service';
import { ChunkTextRequestDto, ChunkTextResponseDto } from './dto/chunking.dto';

@ApiTags('chunking')
@Controller('chunking')
export class ChunkingController {
  constructor(private readonly chunkingService: ChunkingService) {}

  @Post('chunk')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Chunk text',
    description: 'Cắt nhỏ text thành các chunks theo strategy được chọn',
  })
  @ApiBody({ type: ChunkTextRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Text chunked successfully',
    type: ChunkTextResponseDto,
  })
  async chunkText(
    @Body() dto: ChunkTextRequestDto,
  ): Promise<ChunkTextResponseDto> {
    return await this.chunkingService.chunkText(dto);
  }
}
