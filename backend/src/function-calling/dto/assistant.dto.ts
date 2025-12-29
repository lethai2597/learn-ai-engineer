import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssistantRequestDto {
  @ApiProperty({
    description: 'User query có thể yêu cầu nhiều tools',
    example: 'Tính 10 * 5 rồi cho tôi biết thời tiết Hà Nội',
  })
  @IsString()
  query: string;
}

export class ToolCallDto {
  @ApiProperty({ description: 'Tên function' })
  functionName: string;

  @ApiProperty({ description: 'Arguments' })
  arguments: Record<string, any>;

  @ApiProperty({ description: 'Kết quả thực thi' })
  result: any;
}

export class AssistantResponseDto {
  @ApiProperty({ description: 'Danh sách tool calls', type: [ToolCallDto] })
  toolCalls: ToolCallDto[];

  @ApiProperty({ description: 'Final response từ LLM' })
  finalResponse: string;

  @ApiProperty({ description: 'Thời gian xử lý (ms)' })
  latency: number;
}
