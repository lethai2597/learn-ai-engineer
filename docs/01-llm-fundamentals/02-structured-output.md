# Structured Output (JSON Mode & Zod)

## Mục tiêu học tập

Ép AI trả về dữ liệu theo Schema JSON định sẵn, đảm bảo code có thể parse và validate được.

## Nội dung chính

### 1. JSON Mode vs Function Calling
- **JSON Mode:** Đảm bảo output là JSON hợp lệ
- **Function Calling:** Đảm bảo tuân theo schema chặt chẽ + type safety
- Khi nào dùng cái nào?

### 2. Schema Definition với Zod
```typescript
import { z } from 'zod';

const PersonSchema = z.object({
  name: z.string(),
  age: z.number(),
  skills: z.array(z.string()),
});
```

### 3. OpenAI Function Calling
- Định nghĩa function schema
- Parse response và handle lỗi

### 4. Vercel AI SDK generateObject
- Modern approach với built-in streaming support

## Tài nguyên học tập

- [OpenAI Function Calling Guide](https://platform.openai.com/docs/guides/function-calling)
- [Zod Documentation](https://zod.dev/)
- [Vercel AI SDK - generateObject](https://sdk.vercel.ai/docs/ai-sdk-core/generating-structured-data)

## Bài tập thực hành

1. **Bài 1:** Parse một đoạn văn giới thiệu thành object Person
2. **Bài 2:** Trích xuất thông tin hóa đơn từ text thành Invoice schema
3. **Bài 3:** Build một API endpoint nhận text, trả về structured JSON

## Design Patterns áp dụng

- **Strategy Pattern:** Chọn parser khác nhau (JSON Mode vs Function Calling) dựa trên use case
- **Adapter Pattern:** Chuyển đổi LLM output sang domain model

## Checklist hoàn thành

- [ ] Hiểu sự khác biệt JSON Mode vs Function Calling
- [ ] Biết định nghĩa schema với Zod
- [ ] Implement được API endpoint với structured output
- [ ] Xử lý được edge cases (output không hợp lệ)

