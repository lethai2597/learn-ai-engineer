# Prompt Engineering & In-Context Learning

## Mục tiêu học tập

Học kỹ thuật thiết kế input (prompt) để AI hiểu ngữ cảnh, vai trò và format mà không cần train lại model.

## Nội dung chính

### 1. Zero-shot Prompting
- Hỏi AI trực tiếp không cần ví dụ mẫu
- Use case: Các task đơn giản, rõ ràng

### 2. Few-shot Prompting
- Đưa 2-5 ví dụ mẫu trước khi hỏi
- Use case: Classification, format cụ thể

### 3. Chain-of-Thought (CoT)
- Bảo AI "hãy suy nghĩ từng bước"
- Use case: Logic phức tạp, toán học, reasoning

### 4. Role Prompting
- Gán vai trò cụ thể: "Bạn là chuyên gia..."
- Use case: Chuyên môn hóa câu trả lời

## Tài nguyên học tập

- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [OpenAI Playground](https://platform.openai.com/playground)
- [Anthropic Console](https://console.anthropic.com/)

## Bài tập thực hành

1. **Bài 1:** Viết prompt phân loại email thành: Technical Issue / Sales / General Inquiry
2. **Bài 2:** Viết prompt trích xuất thông tin từ CV thành JSON
3. **Bài 3:** Viết prompt giải bài toán logic bằng Chain-of-Thought

## Checklist hoàn thành

- [ ] Hiểu sự khác biệt giữa Zero-shot, Few-shot, CoT
- [ ] Thực hành trên OpenAI Playground ít nhất 10 prompts khác nhau
- [ ] Viết được prompt có độ chính xác >90% cho 1 task cụ thể

