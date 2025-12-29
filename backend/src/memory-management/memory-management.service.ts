import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ChatRequestDto, MemoryStrategy } from './dto/chat-request.dto';
import { ChatResponseDto } from './dto/chat-response.dto';
import { ChatMessageDto, MessageRole } from './dto/chat-message.dto';
import { MemoryRepository } from './repositories/memory-repository.interface';
import { SlidingWindowStrategy } from './strategies/sliding-window.strategy';
import { SummarizationStrategy } from './strategies/summarization.strategy';
import { TokenTruncationStrategy } from './strategies/token-truncation.strategy';
import { OpenRouterService } from '../prompt-engineering/services/openrouter.service';

@Injectable()
export class MemoryManagementService {
  constructor(
    @Inject('MemoryRepository')
    private readonly memoryRepository: MemoryRepository,
    private readonly slidingWindowStrategy: SlidingWindowStrategy,
    private readonly summarizationStrategy: SummarizationStrategy,
    private readonly tokenTruncationStrategy: TokenTruncationStrategy,
    private readonly openRouterService: OpenRouterService,
  ) {}

  // orchestration-memory-management-01
  async chat(dto: ChatRequestDto): Promise<ChatResponseDto> {
    // [BUSINESS] Tạo hoặc sử dụng session ID để quản lý conversation history
    const sessionId = dto.sessionId || randomUUID();
    let messages = await this.memoryRepository.loadSession(sessionId);

    if (!messages) {
      messages = [];
    }

    // [BUSINESS] Tạo message mới từ user input
    const newMessage: ChatMessageDto = {
      role: MessageRole.USER,
      content: dto.message,
      timestamp: new Date().toISOString(),
    };

    // [BUSINESS] Áp dụng memory strategy để xử lý conversation history
    // Strategy sẽ quyết định cách giữ lại messages: sliding window, summarization, hoặc token truncation
    const processedMessages = await this.applyMemoryStrategy(
      messages,
      newMessage,
      dto,
    );

    // [BUSINESS] Convert messages sang format LLM API
    const llmMessages = this.convertToLLMMessages(processedMessages);

    // [BUSINESS] Gọi LLM để generate response
    const response = await this.openRouterService.generateCompletion(
      llmMessages,
      {
        temperature: 0.7,
        maxTokens: 500,
      },
    );

    // [BUSINESS] Tạo assistant message và lưu vào conversation history
    const assistantMessage: ChatMessageDto = {
      role: MessageRole.ASSISTANT,
      content: response,
      timestamp: new Date().toISOString(),
    };

    // [BUSINESS] Lưu TẤT CẢ messages vào repository để giữ đầy đủ lịch sử
    const allMessages = [...messages, newMessage, assistantMessage];
    await this.memoryRepository.saveSession(sessionId, allMessages);

    // [FRONTEND] Estimate token count từ processedMessages (messages gửi cho LLM) để phản ánh đúng cost
    const tokenCount = this.estimateTokens(
      processedMessages.map((m) => m.content).join(' '),
    );

    return {
      response,
      messages: allMessages,
      tokenCount,
      strategy: dto.strategy,
      sessionId,
    };
  }

  async getSession(sessionId: string): Promise<ChatMessageDto[]> {
    const messages = await this.memoryRepository.loadSession(sessionId);
    if (!messages) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    }
    return messages;
  }

  async deleteSession(sessionId: string): Promise<void> {
    const exists = await this.memoryRepository.sessionExists(sessionId);
    if (!exists) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    }
    await this.memoryRepository.deleteSession(sessionId);
  }

  private async applyMemoryStrategy(
    messages: ChatMessageDto[],
    newMessage: ChatMessageDto,
    dto: ChatRequestDto,
  ): Promise<ChatMessageDto[]> {
    switch (dto.strategy) {
      case MemoryStrategy.SLIDING_WINDOW:
        return await this.slidingWindowStrategy.processMessages(
          messages,
          newMessage,
          { maxMessages: dto.maxMessages || 10 },
        );

      case MemoryStrategy.SUMMARIZATION:
        return await this.summarizationStrategy.processMessages(
          messages,
          newMessage,
          { maxMessages: dto.maxMessages || 10 },
        );

      case MemoryStrategy.TOKEN_TRUNCATION:
        return await this.tokenTruncationStrategy.processMessages(
          messages,
          newMessage,
          { maxTokens: dto.maxTokens || 2000 },
        );

      default:
        return [...messages, newMessage];
    }
  }

  private convertToLLMMessages(
    messages: ChatMessageDto[],
  ): Array<{ role: 'user' | 'assistant' | 'system'; content: string }> {
    return messages.map((msg) => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
    }));
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}
