import {
  IsString,
  IsArray,
  IsNumber,
  IsOptional,
  Min,
  Max,
  ArrayMinSize,
  ArrayMaxSize,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CalculateSimilarityRequestDto {
  @ApiProperty({ description: 'Vector A', type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  vectorA: number[];

  @ApiProperty({ description: 'Vector B', type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  vectorB: number[];
}

export class CalculateSimilarityResponseDto {
  @ApiProperty({ description: 'Cosine similarity score (0-1)' })
  similarity: number;
}

export class SemanticSearchRequestDto {
  @ApiProperty({
    description: 'Query text để tìm kiếm',
    example: 'Con chó',
  })
  @IsString()
  @MaxLength(8000, { message: 'Query tối đa 8000 ký tự' })
  query: string;

  @ApiProperty({
    description: 'Danh sách texts để search trong đó',
    example: ['Con chó đang chạy', 'Mèo đang ngủ', 'Chó là động vật'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Cần ít nhất 1 text để search' })
  @ArrayMaxSize(100, { message: 'Tối đa 100 texts' })
  @IsString({ each: true })
  @MaxLength(8000, { each: true, message: 'Mỗi text tối đa 8000 ký tự' })
  texts: string[];

  @ApiPropertyOptional({
    description: 'Số lượng kết quả trả về (top K)',
    default: 5,
    minimum: 1,
    maximum: 20,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(20)
  topK?: number;
}

export class SearchResultDto {
  @ApiProperty({ description: 'Text được tìm thấy' })
  text: string;

  @ApiProperty({ description: 'Similarity score với query (0-1)' })
  similarity: number;

  @ApiProperty({ description: 'Thứ hạng (rank)' })
  rank: number;
}

export class SemanticSearchResponseDto {
  @ApiProperty({ description: 'Query text' })
  query: string;

  @ApiProperty({
    description: 'Kết quả search được sắp xếp theo similarity',
    type: [SearchResultDto],
  })
  results: SearchResultDto[];

  @ApiProperty({ description: 'Thời gian xử lý (ms)' })
  latency: number;
}
