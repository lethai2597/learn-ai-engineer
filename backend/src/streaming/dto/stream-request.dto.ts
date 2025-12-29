import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StreamRequestDto {
  @ApiProperty({
    description: 'Prompt text to stream',
    example: 'Tell me a story about a brave knight',
  })
  @IsString()
  prompt: string;

  @ApiPropertyOptional({
    description: 'Model to use (optional)',
    example: 'openai/gpt-4o',
  })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({
    description: 'Temperature (0-2)',
    default: 0.7,
    minimum: 0,
    maximum: 2,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;
}

export class StreamResponseDto {
  @ApiProperty({ description: 'Streaming chunk content' })
  content: string;

  @ApiProperty({ description: 'Whether this is the final chunk' })
  done: boolean;
}
