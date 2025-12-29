import {
  IsArray,
  IsString,
  ArrayMinSize,
  ArrayMaxSize,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmbeddingsRequestDto {
  @ApiProperty({
    description: 'Danh sách texts cần tạo embeddings',
    example: ['Con chó đang chạy', 'The dog is running', 'Mèo đang ngủ'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Cần ít nhất 1 text' })
  @ArrayMaxSize(100, { message: 'Tối đa 100 texts' })
  @IsString({ each: true })
  @MaxLength(8000, { each: true, message: 'Mỗi text tối đa 8000 ký tự' })
  texts: string[];
}

export class EmbeddingResultDto {
  @ApiProperty({ description: 'Text gốc' })
  text: string;

  @ApiProperty({ description: 'Embedding vector', type: [Number] })
  embedding: number[];

  @ApiProperty({ description: 'Số dimensions của vector' })
  dimensions: number;
}

export class CreateEmbeddingsResponseDto {
  @ApiProperty({
    description: 'Kết quả embeddings cho từng text',
    type: [EmbeddingResultDto],
  })
  results: EmbeddingResultDto[];

  @ApiProperty({ description: 'Model được sử dụng' })
  model: string;

  @ApiProperty({ description: 'Thời gian xử lý (ms)' })
  latency: number;
}
