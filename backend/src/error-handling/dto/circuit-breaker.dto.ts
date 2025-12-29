import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class GetCircuitStateRequestDto {
  @ApiProperty({ description: 'Circuit breaker name', example: 'llm-api' })
  @IsString()
  name: string;
}

export class GetCircuitStateResponseDto {
  @ApiProperty({
    description: 'Current circuit state',
    enum: ['CLOSED', 'OPEN', 'HALF_OPEN'],
  })
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';

  @ApiProperty({ description: 'Number of consecutive failures' })
  failures: number;

  @ApiProperty({ description: 'Timestamp of last failure', required: false })
  lastFailTime?: number;
}

export class ResetCircuitRequestDto {
  @ApiProperty({ description: 'Circuit breaker name', example: 'llm-api' })
  @IsString()
  name: string;
}

export class SimulateCircuitBreakerRequestDto {
  @ApiProperty({ description: 'Circuit breaker name', example: 'llm-api' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Failure threshold', example: 5 })
  @IsNumber()
  @IsOptional()
  failureThreshold?: number;

  @ApiProperty({ description: 'Timeout in milliseconds', example: 60000 })
  @IsNumber()
  @IsOptional()
  timeout?: number;

  @ApiProperty({ description: 'Number of failures to simulate', example: 3 })
  @IsNumber()
  failures: number;
}

export class SimulateCircuitBreakerResponseDto {
  @ApiProperty({
    description: 'Current circuit state',
    enum: ['CLOSED', 'OPEN', 'HALF_OPEN'],
  })
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';

  @ApiProperty({ description: 'Number of failures' })
  failures: number;

  @ApiProperty({ description: 'Whether circuit is open' })
  isOpen: boolean;
}
