import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ModelRouterRequestDto {
  @ApiProperty({
    description: 'Prompt text',
    example: 'Solve this complex math problem: What is the square root of 144?',
  })
  @IsString()
  prompt: string;

  @ApiPropertyOptional({
    description: 'Task type to help router select appropriate model',
    example: 'complex-reasoning',
    enum: [
      'simple',
      'complex-reasoning',
      'code-generation',
      'long-context',
      'general',
    ],
  })
  @IsOptional()
  @IsString()
  taskType?: string;

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

export class ModelRouterResponseDto {
  @ApiProperty({ description: 'Selected model name' })
  selectedModel: string;

  @ApiProperty({ description: 'Reason for selecting this model' })
  reason: string;

  @ApiProperty({ description: 'Generated text' })
  result: string;

  @ApiProperty({ description: 'Latency in milliseconds' })
  latency: number;

  @ApiProperty({ description: 'Estimated cost in USD' })
  estimatedCost: number;

  @ApiProperty({ description: 'Input tokens used' })
  inputTokens: number;

  @ApiProperty({ description: 'Output tokens used' })
  outputTokens: number;
}
