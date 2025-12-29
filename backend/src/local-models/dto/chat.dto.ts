import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ChatDto {
  @ApiProperty({
    description: 'Message để gửi đến local model',
    example: 'Hello! Explain quantum computing in simple terms.',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: 'Model name (optional, default: llama3)',
    example: 'llama3',
    required: false,
  })
  @IsString()
  @IsOptional()
  model?: string;
}

export class ChatResponseDto {
  @ApiProperty({
    description: 'Response từ local model',
  })
  response: string;

  @ApiProperty({
    description: 'Model được sử dụng',
  })
  model: string;

  @ApiProperty({
    description: 'Metadata về tokens (nếu có)',
    required: false,
  })
  tokens?: {
    input: number;
    output: number;
    total: number;
  };
}
