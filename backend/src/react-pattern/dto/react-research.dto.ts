import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReActStepDto } from './react-calculator.dto';

export class ReactResearchRequestDto {
  @ApiProperty({
    description: 'User query yêu cầu tìm kiếm và tổng hợp thông tin',
    example: 'So sánh giá iPhone 15 vs Samsung S24',
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

export class ReactResearchResponseDto {
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
