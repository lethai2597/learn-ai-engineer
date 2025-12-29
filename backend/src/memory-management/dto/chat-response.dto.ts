import { ApiProperty } from '@nestjs/swagger';
import { ChatMessageDto } from './chat-message.dto';
import { MemoryStrategy } from './chat-request.dto';

export class ChatResponseDto {
  @ApiProperty({
    description: 'Response từ LLM',
    example: 'Xin chào! Tôi là AI assistant. Bạn tên gì?',
  })
  response: string;

  @ApiProperty({
    description: 'Toàn bộ message history sau khi áp dụng memory strategy',
    type: [ChatMessageDto],
  })
  messages: ChatMessageDto[];

  @ApiProperty({
    description: 'Tổng số tokens trong context',
    example: 150,
  })
  tokenCount: number;

  @ApiProperty({
    description: 'Memory strategy đã sử dụng',
    enum: MemoryStrategy,
    example: MemoryStrategy.SLIDING_WINDOW,
  })
  strategy: MemoryStrategy;

  @ApiProperty({
    description: 'Session ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  sessionId: string;
}
