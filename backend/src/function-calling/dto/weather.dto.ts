import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WeatherRequestDto {
  @ApiProperty({
    description: 'User query về thời tiết',
    example: 'Thời tiết ở Hà Nội như thế nào?',
  })
  @IsString()
  query: string;
}

export class WeatherResponseDto {
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
