import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ErrorHandlingService } from './error-handling.service';
import {
  SimulateRetryRequestDto,
  SimulateRetryResponseDto,
} from './dto/retry.dto';
import {
  GetCircuitStateRequestDto,
  GetCircuitStateResponseDto,
  ResetCircuitRequestDto,
  SimulateCircuitBreakerRequestDto,
  SimulateCircuitBreakerResponseDto,
} from './dto/circuit-breaker.dto';
import {
  SimulateFallbackRequestDto,
  SimulateFallbackResponseDto,
} from './dto/fallback.dto';

@ApiTags('error-handling')
@Controller('error-handling')
export class ErrorHandlingController {
  constructor(private readonly errorHandlingService: ErrorHandlingService) {}

  @Post('simulate-retry')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Simulate retry with exponential backoff',
    description: 'Mô phỏng retry logic với exponential backoff và jitter',
  })
  @ApiBody({ type: SimulateRetryRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Retry simulation result',
    type: SimulateRetryResponseDto,
  })
  simulateRetry(
    @Body() dto: SimulateRetryRequestDto,
  ): Promise<SimulateRetryResponseDto> {
    return this.errorHandlingService.simulateRetry(
      dto.maxRetries,
      dto.baseDelay,
      dto.shouldFail,
    );
  }

  @Get('circuit-state')
  @ApiOperation({
    summary: 'Get circuit breaker state',
    description: 'Lấy trạng thái hiện tại của circuit breaker',
  })
  @ApiResponse({
    status: 200,
    description: 'Circuit breaker state',
    type: GetCircuitStateResponseDto,
  })
  getCircuitState(
    @Body() dto: GetCircuitStateRequestDto,
  ): Promise<GetCircuitStateResponseDto> {
    return this.errorHandlingService.getCircuitState(dto.name);
  }

  @Post('circuit-state')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get circuit breaker state (POST)',
    description: 'Lấy trạng thái hiện tại của circuit breaker',
  })
  @ApiBody({ type: GetCircuitStateRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Circuit breaker state',
    type: GetCircuitStateResponseDto,
  })
  getCircuitStatePost(
    @Body() dto: GetCircuitStateRequestDto,
  ): Promise<GetCircuitStateResponseDto> {
    return this.errorHandlingService.getCircuitState(dto.name);
  }

  @Post('reset-circuit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset circuit breaker',
    description: 'Reset circuit breaker về trạng thái CLOSED',
  })
  @ApiBody({ type: ResetCircuitRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Circuit breaker reset successfully',
  })
  resetCircuit(@Body() dto: ResetCircuitRequestDto): Promise<void> {
    this.errorHandlingService.resetCircuit(dto.name);
    return Promise.resolve();
  }

  @Post('simulate-circuit-breaker')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Simulate circuit breaker',
    description: 'Mô phỏng circuit breaker với số lần failure',
  })
  @ApiBody({ type: SimulateCircuitBreakerRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Circuit breaker simulation result',
    type: SimulateCircuitBreakerResponseDto,
  })
  async simulateCircuitBreaker(
    @Body() dto: SimulateCircuitBreakerRequestDto,
  ): Promise<SimulateCircuitBreakerResponseDto> {
    const state = await this.errorHandlingService.getCircuitState(dto.name);

    const newFailures = (state.failures || 0) + dto.failures;
    const failureThreshold = dto.failureThreshold || 5;

    const isOpen = newFailures >= failureThreshold;

    return {
      state: isOpen ? 'OPEN' : 'CLOSED',
      failures: newFailures,
      isOpen,
    };
  }

  @Post('simulate-fallback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Simulate fallback strategy',
    description: 'Mô phỏng fallback strategy với multiple models',
  })
  @ApiBody({ type: SimulateFallbackRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Fallback simulation result',
    type: SimulateFallbackResponseDto,
  })
  simulateFallback(
    @Body() dto: SimulateFallbackRequestDto,
  ): Promise<SimulateFallbackResponseDto> {
    return this.errorHandlingService.simulateFallback(
      dto.models,
      dto.shouldFail,
    );
  }
}
