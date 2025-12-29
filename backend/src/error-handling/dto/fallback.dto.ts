import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsBoolean, IsOptional } from 'class-validator';

export class SimulateFallbackRequestDto {
  @ApiProperty({
    description: 'List of model names to try',
    example: ['gpt-4', 'claude-3-5-sonnet', 'gpt-3.5-turbo'],
  })
  @IsArray()
  @IsString({ each: true })
  models: string[];

  @ApiProperty({ description: 'Whether to simulate failure', example: false })
  @IsBoolean()
  @IsOptional()
  shouldFail?: boolean;
}

export class SimulateFallbackResponseDto {
  @ApiProperty({ description: 'Attempts made for each model' })
  attempts: Array<{
    model: string;
    success: boolean;
    error?: string;
  }>;

  @ApiProperty({ description: 'Final result' })
  result: string;

  @ApiProperty({ description: 'Source model that succeeded' })
  source: string;
}
