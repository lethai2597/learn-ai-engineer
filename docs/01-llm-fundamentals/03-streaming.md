# Streaming & Real-time Response

## Mục tiêu học tập

Trả về response từng phần (token-by-token) để cải thiện UX, không để user chờ đợi lâu.

## Nội dung chính

### 1. Server-Sent Events (SSE) vs WebSocket
- **SSE:** Đơn giản, one-way, đủ cho hầu hết AI use cases
- **WebSocket:** Two-way, phức tạp hơn, cần cho real-time chat

### 2. Token-by-token Streaming với OpenAI
```typescript
const stream = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [...],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '');
}
```

### 3. Vercel AI SDK streamText()
```typescript
import { streamText } from 'ai';

const result = await streamText({
  model: openai('gpt-4'),
  prompt: 'Tell me a story',
});

return result.toTextStreamResponse();
```

### 4. Handling Stream Interruption
- User cancel (AbortController)
- Network timeout
- Retry logic

## Tài nguyên học tập

- [MDN - Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [Vercel AI SDK - Streaming](https://sdk.vercel.ai/docs/ai-sdk-core/streaming)
- [OpenAI Streaming Guide](https://platform.openai.com/docs/api-reference/streaming)

## Bài tập thực hành

1. **Bài 1:** Build API endpoint trả về streaming text response
2. **Bài 2:** Build frontend hiển thị streaming response (React/Next.js)
3. **Bài 3:** Implement cancellation khi user click "Stop"

## Design Patterns áp dụng

- **Observer Pattern:** Frontend observe streaming chunks
- **Iterator Pattern:** Iterate through async stream
- **Command Pattern:** Handle user commands (stop, resume)

## Checklist hoàn thành

- [ ] Hiểu sự khác biệt SSE vs WebSocket
- [ ] Implement được streaming API endpoint
- [ ] Implement được frontend với streaming UI
- [ ] Xử lý được cancellation và errors

