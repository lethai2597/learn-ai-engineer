import { Injectable } from '@nestjs/common';
import { ChatMessageDto } from '../dto/chat-message.dto';
import { MemoryStrategy } from './memory-strategy.interface';

@Injectable()
export class SlidingWindowStrategy implements MemoryStrategy {
  processMessages(
    messages: ChatMessageDto[],
    newMessage: ChatMessageDto,
    options?: { maxMessages?: number },
  ): Promise<ChatMessageDto[]> {
    const maxMessages = options?.maxMessages || 10;
    const updatedMessages = [...messages, newMessage];

    if (updatedMessages.length <= maxMessages) {
      return Promise.resolve(updatedMessages);
    }

    const excessCount = updatedMessages.length - maxMessages;
    return Promise.resolve(updatedMessages.slice(excessCount));
  }
}
