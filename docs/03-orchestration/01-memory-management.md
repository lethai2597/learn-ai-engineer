# Conversation Memory Management

## Mục tiêu học tập

Quản lý lịch sử chat để LLM "nhớ" được context của cuộc hội thoại.

## Nội dung chính

### 1. Tại sao cần Memory?
- LLM là **stateless** (không có trạng thái)
- Mỗi request độc lập, không "nhớ" request trước
- Phải tự gửi kèm lịch sử chat

### 2. Memory Strategies

#### Sliding Window (Simple)
```typescript
class SlidingWindowMemory {
  private messages: Message[] = [];
  private maxMessages = 10;
  
  addMessage(msg: Message) {
    this.messages.push(msg);
    if (this.messages.length > this.maxMessages) {
      this.messages.shift(); // Remove oldest
    }
  }
  
  getContext() {
    return this.messages;
  }
}
```

#### Summarization (Advanced)
```typescript
async function summarizeOldMessages(messages: Message[]): Promise<string> {
  const oldMessages = messages.slice(0, -10);
  return await llm.summarize(oldMessages);
}
```

#### Token-based Truncation
- Track token count
- Truncate khi vượt quá limit

### 3. Persistent Storage
```typescript
// Redis for session storage
import { Redis } from '@upstash/redis';

class RedisMemory {
  private redis: Redis;
  
  async saveSession(sessionId: string, messages: Message[]) {
    await this.redis.set(sessionId, JSON.stringify(messages));
  }
  
  async loadSession(sessionId: string): Promise<Message[]> {
    const data = await this.redis.get(sessionId);
    return JSON.parse(data);
  }
}
```

### 4. LangChain Memory Types
- `BufferMemory`: Lưu tất cả messages
- `BufferWindowMemory`: Sliding window
- `ConversationSummaryMemory`: Auto-summarize old messages

## Tài nguyên học tập

- [LangChain Memory](https://js.langchain.com/docs/modules/memory/)
- [Redis Documentation](https://redis.io/docs/)

## Bài tập thực hành

1. **Bài 1:** Implement sliding window memory
2. **Bài 2:** Integrate Redis để lưu chat history
3. **Bài 3:** Build chatbot nhớ được context 10 câu trước

## Design Patterns áp dụng

- **Memento Pattern:** Save/restore conversation state
- **Strategy Pattern:** Different memory strategies
- **Decorator Pattern:** Add memory capabilities to base LLM

## Checklist hoàn thành

- [ ] Hiểu tại sao LLM cần memory management
- [ ] Implement được sliding window memory
- [ ] Integrate được Redis cho persistent storage
- [ ] Xử lý được context window overflow

