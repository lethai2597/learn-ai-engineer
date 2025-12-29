import { ChatMessageDto } from '../dto/chat-message.dto';

export interface MemoryRepository {
  saveSession(sessionId: string, messages: ChatMessageDto[]): Promise<void>;
  loadSession(sessionId: string): Promise<ChatMessageDto[] | null>;
  deleteSession(sessionId: string): Promise<void>;
  sessionExists(sessionId: string): Promise<boolean>;
}
