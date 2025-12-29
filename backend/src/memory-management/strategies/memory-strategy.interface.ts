import { ChatMessageDto } from '../dto/chat-message.dto';

export interface MemoryStrategy {
  processMessages(
    messages: ChatMessageDto[],
    newMessage: ChatMessageDto,
    options?: Record<string, any>,
  ): Promise<ChatMessageDto[]>;
}
