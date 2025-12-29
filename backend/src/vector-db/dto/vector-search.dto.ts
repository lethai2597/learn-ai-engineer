import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VectorSearchRequestDto {
  @ApiProperty({
    description: 'Query text để tìm kiếm semantic',
    example: 'Con chó',
  })
  @IsString()
  @MaxLength(8000, { message: 'Query tối đa 8000 ký tự' })
  query: string;

  @ApiProperty({
    description: 'Tên collection để search',
    example: 'documents',
  })
  @IsString()
  @MaxLength(100, { message: 'Collection name tối đa 100 ký tự' })
  collectionName: string;

  @ApiPropertyOptional({
    description: 'Số lượng kết quả trả về (top K)',
    default: 5,
    minimum: 1,
    maximum: 100,
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  topK?: number;
}

export class VectorSearchResultDto {
  @ApiProperty({
    description: 'Document ID',
    example: 'doc-1',
  })
  id: string;

  @ApiProperty({
    description: 'Text content của document',
    example: 'Con chó đang chạy',
  })
  text: string;

  @ApiProperty({
    description: 'Similarity score với query (0-1)',
    example: 0.95,
  })
  similarity: number;

  @ApiProperty({
    description: 'Thứ hạng (rank)',
    example: 1,
  })
  rank: number;
}

export class VectorSearchResponseDto {
  @ApiProperty({
    description: 'Query text',
    example: 'Con chó',
  })
  query: string;

  @ApiProperty({
    description: 'Tên collection đã search',
    example: 'documents',
  })
  collectionName: string;

  @ApiProperty({
    description: 'Kết quả search được sắp xếp theo similarity',
    type: [VectorSearchResultDto],
  })
  results: VectorSearchResultDto[];

  @ApiProperty({
    description: 'Thời gian xử lý (ms)',
    example: 567,
  })
  latency: number;
}

export class DeleteDocumentsRequestDto {
  @ApiProperty({
    description: 'Danh sách document IDs cần xóa',
    type: [String],
    example: ['doc-1', 'doc-2'],
  })
  @IsArray()
  @IsString({ each: true })
  documentIds: string[];

  @ApiProperty({
    description: 'Tên collection chứa documents',
    example: 'documents',
  })
  @IsString()
  @MaxLength(100, { message: 'Collection name tối đa 100 ký tự' })
  collectionName: string;
}

export class DeleteDocumentsResponseDto {
  @ApiProperty({
    description: 'Số lượng documents đã xóa',
    example: 2,
  })
  deletedCount: number;

  @ApiProperty({
    description: 'Tên collection',
    example: 'documents',
  })
  collectionName: string;

  @ApiProperty({
    description: 'Thời gian xử lý (ms)',
    example: 123,
  })
  latency: number;
}
