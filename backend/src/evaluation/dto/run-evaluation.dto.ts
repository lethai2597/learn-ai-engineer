import {
  IsEnum,
  IsArray,
  IsString,
  IsObject,
  IsOptional,
  ValidateNested,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum EvaluationMetric {
  EXACT_MATCH = 'EXACT_MATCH',
  CONTAINS = 'CONTAINS',
  LLM_AS_JUDGE = 'LLM_AS_JUDGE',
}

export class TestCaseDto {
  @ApiProperty({
    description: 'Optional test case ID',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({
    description: 'Input prompt/question',
    example: "What's the capital of France?",
  })
  @IsString()
  input: string;

  @ApiProperty({
    description: 'Expected output',
    example: 'Paris',
  })
  @IsString()
  expected: string;

  @ApiProperty({
    description: 'Actual output from LLM',
    example: 'The capital of France is Paris.',
  })
  @IsString()
  actual: string;

  @ApiProperty({
    description: 'Optional metadata',
    example: { category: 'geography', difficulty: 'easy' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class LlmJudgeConfigDto {
  @ApiProperty({
    description: 'Model to use for judging',
    example: 'openai/gpt-4o',
    default: 'openai/gpt-4o',
  })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({
    description: 'Temperature for judge model',
    example: 0.3,
    default: 0.3,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;

  @ApiProperty({
    description: 'Rubric/criteria for judging',
    example: 'Rate based on: Accuracy (40%), Completeness (30%), Clarity (30%)',
  })
  @IsOptional()
  @IsString()
  rubric?: string;
}

export class RunEvaluationRequestDto {
  @ApiProperty({
    description: 'Array of test cases to evaluate',
    type: [TestCaseDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestCaseDto)
  dataset: TestCaseDto[];

  @ApiProperty({
    description: 'Evaluation metric to use',
    enum: EvaluationMetric,
    example: EvaluationMetric.EXACT_MATCH,
  })
  @IsEnum(EvaluationMetric)
  metric: EvaluationMetric;

  @ApiProperty({
    description: 'LLM judge configuration (only for LLM_AS_JUDGE metric)',
    type: LlmJudgeConfigDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => LlmJudgeConfigDto)
  judge?: LlmJudgeConfigDto;
}

export class EvaluationResultDto {
  @ApiProperty({ description: 'Test case ID if provided' })
  id?: string;

  @ApiProperty({ description: 'Input prompt' })
  input: string;

  @ApiProperty({ description: 'Expected output' })
  expected: string;

  @ApiProperty({ description: 'Actual output' })
  actual: string;

  @ApiProperty({
    description: 'Score (0-10 for LLM_AS_JUDGE, 0 or 1 for others)',
  })
  score: number;

  @ApiProperty({ description: 'Whether the test case passed' })
  passed: boolean;

  @ApiProperty({
    description: 'Additional details (mismatch info, judge rationale, etc.)',
  })
  details?: Record<string, unknown>;
}

export class EvaluationSummaryDto {
  @ApiProperty({ description: 'Total number of test cases' })
  total: number;

  @ApiProperty({ description: 'Number of passed test cases' })
  passed: number;

  @ApiProperty({ description: 'Number of failed test cases' })
  failed: number;

  @ApiProperty({ description: 'Pass rate (0-1)' })
  passRate: number;

  @ApiProperty({ description: 'Average score (0-10)' })
  avgScore: number;
}

export class RunEvaluationResponseDto {
  @ApiProperty({
    description: 'Evaluation summary',
    type: EvaluationSummaryDto,
  })
  summary: EvaluationSummaryDto;

  @ApiProperty({
    description: 'Results for each test case',
    type: [EvaluationResultDto],
  })
  results: EvaluationResultDto[];
}
