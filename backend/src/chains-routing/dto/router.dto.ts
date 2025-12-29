import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RouterRequestDto {
  @ApiProperty({
    description: 'Input text để phân loại intent và route',
    example:
      'Tóm tắt các best practices về prompt engineering từ kho tri thức của tôi',
  })
  @IsString()
  input: string;

  @ApiPropertyOptional({
    description: 'Temperature cho LLM',
    default: 0.7,
  })
  @IsOptional()
  temperature?: number;
}

export class RouterResponseDto {
  @ApiProperty({ description: 'Intent được phân loại' })
  intent: string;

  @ApiProperty({ description: 'Model được chọn' })
  selectedModel: string;

  @ApiProperty({ description: 'Lý do chọn model này' })
  reason: string;

  @ApiProperty({ description: 'Response từ model' })
  response: string;

  @ApiProperty({ description: 'Thời gian xử lý (ms)' })
  latency: number;
}
