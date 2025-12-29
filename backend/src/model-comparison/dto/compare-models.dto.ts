import {
  IsString,
  IsArray,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CompareModelsRequestDto {
  @ApiProperty({
    description: 'Prompt text to compare across models',
    example: 'Explain quantum computing in simple terms',
  })
  @IsString()
  prompt: string;

  @ApiProperty({
    description: 'Array of model names to compare',
    example: [
      'openai/gpt-4o',
      'openai/gpt-3.5-turbo',
      'anthropic/claude-3.5-sonnet',
    ],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  models: string[];

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

export class ModelResultDto {
  @ApiProperty({ description: 'Model name' })
  model: string;

  @ApiProperty({ description: 'Generated text' })
  text: string;

  @ApiProperty({ description: 'Latency in milliseconds' })
  latency: number;

  @ApiProperty({ description: 'Estimated cost in USD' })
  estimatedCost: number;

  @ApiProperty({ description: 'Input tokens used' })
  inputTokens: number;

  @ApiProperty({ description: 'Output tokens used' })
  outputTokens: number;

  @ApiPropertyOptional({ description: 'Error message if request failed' })
  error?: string;
}

export class CompareModelsResponseDto {
  @ApiProperty({
    description: 'Results from each model',
    type: [ModelResultDto],
  })
  results: ModelResultDto[];

  @ApiProperty({ description: 'Total time taken in milliseconds' })
  totalTime: number;
}
