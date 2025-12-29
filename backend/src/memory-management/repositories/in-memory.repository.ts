import { Injectable } from '@nestjs/common';
import { ChatMessageDto } from '../dto/chat-message.dto';
import { MemoryRepository } from './memory-repository.interface';

@Injectable()
export class InMemoryRepository implements MemoryRepository {
  private readonly sessions: Map<string, ChatMessageDto[]> = new Map();

  saveSession(sessionId: string, messages: ChatMessageDto[]): Promise<void> {
    this.sessions.set(sessionId, messages);
    return Promise.resolve();
  }

  loadSession(sessionId: string): Promise<ChatMessageDto[] | null> {
    return Promise.resolve(this.sessions.get(sessionId) || null);
  }

  deleteSession(sessionId: string): Promise<void> {
    this.sessions.delete(sessionId);
    return Promise.resolve();
  }

  sessionExists(sessionId: string): Promise<boolean> {
    return Promise.resolve(this.sessions.has(sessionId));
  }
}
