import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum MemoryStrategy {
  SLIDING_WINDOW = 'sliding-window',
  SUMMARIZATION = 'summarization',
  TOKEN_TRUNCATION = 'token-truncation',
}

export class ChatRequestDto {
  @ApiProperty({
    description: 'Message mới từ user',
    example: 'Tên tôi là gì?',
  })
  @IsString()
  message: string;

  @ApiPropertyOptional({
    description: 'Session ID để quản lý conversation',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiProperty({
    description: 'Memory strategy để sử dụng',
    enum: MemoryStrategy,
    example: MemoryStrategy.SLIDING_WINDOW,
  })
  @IsEnum(MemoryStrategy)
  strategy: MemoryStrategy;

  @ApiPropertyOptional({
    description: 'Số lượng messages tối đa (cho sliding window)',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  maxMessages?: number;

  @ApiPropertyOptional({
    description: 'Số tokens tối đa (cho token truncation)',
    example: 2000,
    minimum: 100,
    maximum: 8000,
  })
  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(8000)
  maxTokens?: number;
}
