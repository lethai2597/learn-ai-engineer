import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { EvaluationService } from './evaluation.service';
import {
  RunEvaluationRequestDto,
  RunEvaluationResponseDto,
} from './dto/run-evaluation.dto';

@ApiTags('evaluation')
@Controller('evaluations')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post('run')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Run batch evaluation',
    description: 'Evaluate multiple test cases using specified metric',
  })
  @ApiBody({ type: RunEvaluationRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Evaluation completed successfully',
    type: RunEvaluationResponseDto,
  })
  async runEvaluation(
    @Body() dto: RunEvaluationRequestDto,
  ): Promise<RunEvaluationResponseDto> {
    return this.evaluationService.runEvaluation(dto);
  }
}
