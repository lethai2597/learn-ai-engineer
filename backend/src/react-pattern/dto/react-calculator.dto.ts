import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReactCalculatorRequestDto {
  @ApiProperty({
    description: 'User query về bài toán toán học nhiều bước',
    example: 'Tính (10 + 5) * 2 rồi chia cho 3',
  })
  @IsString()
  query: string;

  @ApiProperty({
    description: 'Số lần lặp tối đa (default: 10)',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  maxIterations?: number;
}

export class ReActStepDto {
  @ApiProperty({ description: 'Thought của agent', required: false })
  thought?: string;

  @ApiProperty({ description: 'Action (tool call)', required: false })
  action?: {
    functionName: string;
    arguments: Record<string, any>;
  };

  @ApiProperty({ description: 'Observation (tool result)', required: false })
  observation?: any;
}

export class ReactCalculatorResponseDto {
  @ApiProperty({
    description: 'Danh sách các steps trong ReAct loop',
    type: [ReActStepDto],
  })
  steps: ReActStepDto[];

  @ApiProperty({ description: 'Final response từ LLM' })
  finalResponse: string;

  @ApiProperty({ description: 'Thời gian xử lý (ms)' })
  latency: number;

  @ApiProperty({ description: 'Số lần lặp đã thực hiện' })
  iterations: number;
}
