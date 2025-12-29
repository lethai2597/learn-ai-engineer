import {
  IsArray,
  IsString,
  IsOptional,
  ArrayMinSize,
  ArrayMaxSize,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class IngestDocumentsRequestDto {
  @ApiProperty({
    description: 'Danh sách texts cần ingest vào vector database',
    example: [
      'Con chó đang chạy',
      'The dog is running',
      'Mèo đang ngủ',
      'The cat is sleeping',
    ],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Cần ít nhất 1 text' })
  @ArrayMaxSize(1000, { message: 'Tối đa 1000 texts' })
  @IsString({ each: true })
  @MaxLength(8000, { each: true, message: 'Mỗi text tối đa 8000 ký tự' })
  texts: string[];

  @ApiPropertyOptional({
    description: 'Tên collection để lưu documents',
    default: 'documents',
    example: 'documents',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Collection name tối đa 100 ký tự' })
  collectionName?: string;
}

export class IngestDocumentsResponseDto {
  @ApiProperty({
    description: 'Danh sách document IDs đã được tạo',
    type: [String],
    example: ['doc-1', 'doc-2', 'doc-3'],
  })
  documentIds: string[];

  @ApiProperty({
    description: 'Danh sách texts đã được ingest (tương ứng với documentIds)',
    type: [String],
    example: ['Con chó đang chạy', 'The dog is running', 'Mèo đang ngủ'],
  })
  texts: string[];

  @ApiProperty({
    description: 'Số lượng documents đã ingest',
    example: 3,
  })
  count: number;

  @ApiProperty({
    description: 'Tên collection đã sử dụng',
    example: 'documents',
  })
  collectionName: string;

  @ApiProperty({
    description: 'Thời gian xử lý (ms)',
    example: 1234,
  })
  latency: number;
}
