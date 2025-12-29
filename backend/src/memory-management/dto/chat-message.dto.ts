import { IsEnum, IsString, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

export class ChatMessageDto {
  @ApiProperty({
    description: 'Vai trò của message',
    enum: MessageRole,
    example: MessageRole.USER,
  })
  @IsEnum(MessageRole)
  role: MessageRole;

  @ApiProperty({
    description: 'Nội dung message',
    example: 'Xin chào, bạn tên gì?',
  })
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description: 'Timestamp của message',
    example: '2024-01-15T10:30:00Z',
  })
  @IsOptional()
  @IsDateString()
  timestamp?: string;
}
