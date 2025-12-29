import { Injectable } from '@nestjs/common';
import { ChatMessageDto } from '../dto/chat-message.dto';
import { MemoryStrategy } from './memory-strategy.interface';

@Injectable()
export class TokenTruncationStrategy implements MemoryStrategy {
  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  private countTokens(messages: ChatMessageDto[]): number {
    return messages.reduce(
      (total, msg) => total + this.estimateTokens(msg.content),
      0,
    );
  }

  processMessages(
    messages: ChatMessageDto[],
    newMessage: ChatMessageDto,
    options?: { maxTokens?: number },
  ): Promise<ChatMessageDto[]> {
    const maxTokens = options?.maxTokens || 2000;
    const updatedMessages = [...messages, newMessage];
    const currentTokens = this.countTokens(updatedMessages);

    if (currentTokens <= maxTokens) {
      return Promise.resolve(updatedMessages);
    }

    const result: ChatMessageDto[] = [];
    const newMessageTokens = this.estimateTokens(newMessage.content);

    if (newMessageTokens > maxTokens) {
      const truncatedContent = newMessage.content.slice(
        0,
        (maxTokens - 100) * 4,
      );
      return Promise.resolve([
        {
          ...newMessage,
          content: truncatedContent + '...',
        },
      ]);
    }

    result.push(newMessage);
    let remainingTokens = maxTokens - newMessageTokens;

    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      const msgTokens = this.estimateTokens(msg.content);

      if (remainingTokens >= msgTokens) {
        result.unshift(msg);
        remainingTokens -= msgTokens;
      } else {
        const truncatedContent = msg.content.slice(0, remainingTokens * 4);
        if (truncatedContent.length > 0) {
          result.unshift({
            ...msg,
            content: truncatedContent + '...',
          });
        }
        break;
      }
    }

    return Promise.resolve(result);
  }
}
