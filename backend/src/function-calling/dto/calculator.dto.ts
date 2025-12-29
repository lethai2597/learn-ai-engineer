import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CalculatorRequestDto {
  @ApiProperty({
    description: 'User query về phép tính',
    example: 'Tính 15 + 27',
  })
  @IsString()
  query: string;
}

export class CalculatorResponseDto {
  @ApiProperty({ description: 'Tên function được gọi' })
  functionName: string;

  @ApiProperty({ description: 'Arguments của function call' })
  arguments: Record<string, any>;

  @ApiProperty({ description: 'Kết quả thực thi tool' })
  toolResult: any;

  @ApiProperty({ description: 'Final response từ LLM' })
  finalResponse: string;

  @ApiProperty({ description: 'Thời gian xử lý (ms)' })
  latency: number;
}
