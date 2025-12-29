# Model Selection & Comparison

## Mục tiêu học tập

Hiểu điểm mạnh, yếu và chi phí của từng LLM để chọn đúng model cho đúng task.

## Nội dung chính

### 1. So sánh Models phổ biến

| Model | Cost ($/1M tokens) | Strengths | Weaknesses |
|-------|-------------------|-----------|------------|
| GPT-4 | $30 input / $60 output | Reasoning, complex tasks | Đắt, chậm |
| GPT-3.5-turbo | $1 input / $2 output | Nhanh, rẻ, general tasks | Kém GPT-4 về reasoning |
| Claude 3.5 Sonnet | $3 input / $15 output | Văn hay, coding, long context | Ít phổ biến hơn |
| Llama 3 8B | Free (self-hosted) | Miễn phí, privacy | Cần GPU, kém hơn GPT-4 |

### 2. Trade-offs: Cost vs Quality vs Speed
- **High-quality tasks:** GPT-4, Claude 3.5
- **Simple tasks:** GPT-3.5, Llama 3
- **Latency-sensitive:** GPT-3.5-turbo, Llama 3

### 3. Local Models với Ollama
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Run Llama 3
ollama run llama3

# API call
curl http://localhost:11434/api/generate -d '{
  "model": "llama3",
  "prompt": "Why is the sky blue?"
}'
```

### 4. Model Router Pattern
```typescript
function selectModel(task: string): Model {
  if (isComplexReasoning(task)) return 'gpt-4';
  if (isCodeGeneration(task)) return 'llama3-code';
  return 'gpt-3.5-turbo'; // Default
}
```

## Tài nguyên học tập

- [Artificial Analysis](https://artificialanalysis.ai/) - Benchmark & pricing
- [Ollama](https://ollama.com/)
- [LM Studio](https://lmstudio.ai/)

## Bài tập thực hành

1. **Bài 1:** Chạy Llama 3 local với Ollama
2. **Bài 2:** So sánh output của GPT-4 vs GPT-3.5 vs Llama 3 cho cùng 1 task
3. **Bài 3:** Build model router tự động chọn model dựa trên task type

## Design Patterns áp dụng

- **Strategy Pattern:** Chọn model như một strategy khác nhau
- **Factory Pattern:** ModelFactory tạo instance dựa trên config
- **Chain of Responsibility:** Fallback từ model này sang model khác nếu fail

## Checklist hoàn thành

- [ ] Biết trade-off giữa các models phổ biến
- [ ] Chạy được local model với Ollama
- [ ] Build được model router đơn giản
- [ ] Tính được cost ước tính cho use case của mình

