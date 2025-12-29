import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class SimulateRetryRequestDto {
  @ApiProperty({ description: 'Maximum number of retries', example: 3 })
  @IsNumber()
  @IsOptional()
  maxRetries?: number;

  @ApiProperty({ description: 'Base delay in milliseconds', example: 1000 })
  @IsNumber()
  @IsOptional()
  baseDelay?: number;

  @ApiProperty({ description: 'Whether to simulate failure', example: false })
  @IsBoolean()
  @IsOptional()
  shouldFail?: boolean;
}

export class SimulateRetryResponseDto {
  @ApiProperty({ description: 'Number of attempts made' })
  attempts: number;

  @ApiProperty({ description: 'Delays between retries in milliseconds' })
  delays: number[];

  @ApiProperty({ description: 'Whether the operation succeeded' })
  success: boolean;

  @ApiProperty({ description: 'Error message if failed', required: false })
  error?: string;
}
