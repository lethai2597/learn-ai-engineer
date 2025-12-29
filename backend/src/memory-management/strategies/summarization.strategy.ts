import { Injectable } from '@nestjs/common';
import { ChatMessageDto, MessageRole } from '../dto/chat-message.dto';
import { MemoryStrategy } from './memory-strategy.interface';
import { OpenRouterService } from '../../prompt-engineering/services/openrouter.service';

@Injectable()
export class SummarizationStrategy implements MemoryStrategy {
  constructor(private readonly openRouterService: OpenRouterService) {}

  async processMessages(
    messages: ChatMessageDto[],
    newMessage: ChatMessageDto,
    options?: { maxMessages?: number },
  ): Promise<ChatMessageDto[]> {
    const maxMessages = options?.maxMessages || 10;
    const updatedMessages = [...messages, newMessage];

    if (updatedMessages.length <= maxMessages) {
      return updatedMessages;
    }

    const messagesToKeep = updatedMessages.slice(-maxMessages);
    const messagesToSummarize = updatedMessages.slice(0, -maxMessages);

    if (messagesToSummarize.length === 0) {
      return messagesToKeep;
    }

    const summary = await this.summarizeMessages(messagesToSummarize);

    const summaryMessage: ChatMessageDto = {
      role: MessageRole.SYSTEM,
      content: `Tóm tắt cuộc hội thoại trước: ${summary}`,
      timestamp: new Date().toISOString(),
    };

    return [summaryMessage, ...messagesToKeep];
  }

  private async summarizeMessages(messages: ChatMessageDto[]): Promise<string> {
    const conversationText = messages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join('\n');

    const prompt = `Hãy tóm tắt ngắn gọn cuộc hội thoại sau, giữ lại các thông tin quan trọng như tên, sở thích, thông tin cá nhân:

${conversationText}

Tóm tắt:`;

    try {
      const summary = await this.openRouterService.generateCompletion(
        [{ role: 'user', content: prompt }],
        {
          model: 'openai/gpt-3.5-turbo',
          temperature: 0.3,
          maxTokens: 200,
        },
      );

      return summary.trim();
    } catch (error) {
      console.error('[SummarizationStrategy] Error:', error);
      return 'Cuộc hội thoại trước đã được tóm tắt.';
    }
  }
}
