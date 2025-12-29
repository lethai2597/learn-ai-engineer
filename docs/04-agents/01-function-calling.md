# Tool Calling (Function Calling)

## Mục tiêu học tập

Biến AI từ "người tư vấn" thành "trợ lý thực thi" bằng cách cho phép gọi functions/tools.

## Nội dung chính

### 1. Function Calling Flow
```
User: "Gửi email cho Nam nội dung: Họp lúc 3PM"
  ↓
LLM returns: {
  function: "sendEmail",
  arguments: { to: "nam@example.com", subject: "Meeting", body: "Họp lúc 3PM" }
}
  ↓
Your Code: Execute sendEmail(...)
  ↓
LLM: "Đã gửi email thành công!"
```

### 2. Define Functions với OpenAI
```typescript
const tools = [
  {
    type: 'function',
    function: {
      name: 'sendEmail',
      description: 'Send an email to a recipient',
      parameters: {
        type: 'object',
        properties: {
          to: { type: 'string', description: 'Email address' },
          subject: { type: 'string' },
          body: { type: 'string' },
        },
        required: ['to', 'body'],
      },
    },
  },
];

const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [...],
  tools,
});

if (response.choices[0].message.tool_calls) {
  const toolCall = response.choices[0].message.tool_calls[0];
  const args = JSON.parse(toolCall.function.arguments);
  await sendEmail(args.to, args.subject, args.body);
}
```

### 3. Best Practices cho Function Descriptions
- **Rõ ràng:** Mô tả chính xác function làm gì
- **Ví dụ:** Đưa ví dụ trong description
- **Parameters:** Mô tả chi tiết từng parameter

❌ Bad: `description: "Send email"`
✅ Good: `description: "Send an email to a recipient. Use this when user wants to send, forward, or compose email."`

### 4. Multiple Tools
```typescript
const tools = [
  searchWebTool,
  sendEmailTool,
  createCalendarEventTool,
  queryDatabaseTool,
];
```

## Tài nguyên học tập

- [OpenAI Function Calling](https://platform.openai.com/docs/guides/function-calling)
- [Anthropic Tool Use](https://docs.anthropic.com/claude/docs/tool-use)

## Bài tập thực hành

1. **Bài 1:** Implement simple calculator tool (add, subtract, multiply, divide)
2. **Bài 2:** Implement weather tool (mock API)
3. **Bài 3:** Build assistant với 3+ tools khác nhau

## Design Patterns áp dụng

- **Command Pattern:** Tool calls as commands
- **Strategy Pattern:** Different tools as strategies
- **Factory Pattern:** Tool factory based on function name
- **Registry Pattern:** Tool registry for dynamic lookup

## Checklist hoàn thành

- [ ] Hiểu flow của function calling
- [ ] Define được function schemas đúng format
- [ ] Viết được function descriptions tốt
- [ ] Handle được tool call responses

