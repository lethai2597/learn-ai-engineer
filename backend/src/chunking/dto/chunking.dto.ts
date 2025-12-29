import {
  IsString,
  IsNumber,
  IsEnum,
  Min,
  Max,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ChunkingStrategy {
  FIXED_SIZE = 'fixed-size',
  RECURSIVE = 'recursive',
  SEMANTIC = 'semantic',
  SENTENCE = 'sentence',
}

export class ChunkTextRequestDto {
  @ApiProperty({
    description: 'Text cần chunk',
    example:
      'Đây là một đoạn văn dài. Nó chứa nhiều câu. Mỗi câu có ý nghĩa riêng. Chúng ta cần cắt nhỏ để xử lý.',
  })
  @IsString()
  @MaxLength(50000, { message: 'Text tối đa 50000 ký tự' })
  text: string;

  @ApiProperty({
    description: 'Chiến lược chunking',
    enum: ChunkingStrategy,
    example: ChunkingStrategy.RECURSIVE,
  })
  @IsEnum(ChunkingStrategy)
  strategy: ChunkingStrategy;

  @ApiProperty({
    description: 'Kích thước chunk (tokens hoặc characters)',
    example: 500,
    minimum: 50,
    maximum: 2000,
  })
  @IsNumber()
  @Min(50, { message: 'Chunk size tối thiểu 50' })
  @Max(2000, { message: 'Chunk size tối đa 2000' })
  chunkSize: number;

  @ApiPropertyOptional({
    description: 'Overlap giữa các chunks (tokens hoặc characters)',
    example: 50,
    minimum: 0,
    maximum: 500,
  })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Overlap không được âm' })
  @Max(500, { message: 'Overlap tối đa 500' })
  chunkOverlap?: number;
}

export class ChunkResultDto {
  @ApiProperty({ description: 'Nội dung chunk' })
  content: string;

  @ApiProperty({ description: 'Chỉ số chunk (bắt đầu từ 0)' })
  index: number;

  @ApiProperty({ description: 'Kích thước chunk (characters)' })
  size: number;

  @ApiProperty({ description: 'Metadata của chunk', required: false })
  metadata?: Record<string, any>;
}

export class ChunkTextResponseDto {
  @ApiProperty({
    description: 'Danh sách chunks',
    type: [ChunkResultDto],
  })
  chunks: ChunkResultDto[];

  @ApiProperty({ description: 'Tổng số chunks' })
  totalChunks: number;

  @ApiProperty({ description: 'Chiến lược đã sử dụng' })
  strategy: ChunkingStrategy;

  @ApiProperty({ description: 'Thời gian xử lý (ms)' })
  latency: number;
}
