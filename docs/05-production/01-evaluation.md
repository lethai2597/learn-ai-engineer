# Evaluation (Evals)

## Mục tiêu học tập

Đảm bảo chất lượng AI application bằng cách test tự động và đo lường hiệu suất output của LLM.

## Nội dung chính

### 1. Tại sao cần Evaluation?
- LLM output không deterministic - cùng prompt có thể cho kết quả khác nhau
- Cần đo lường chất lượng trước khi deploy production
- Phát hiện regression khi thay đổi prompt hoặc model
- `console.log` và test thủ công không đủ cho scale

### 2. Golden Dataset
Tạo bộ test cases với input và expected output chuẩn:

```typescript
const goldenDataset = [
  {
    id: "1",
    input: "What's the capital of France?",
    expected: "Paris",
    metadata: { category: "geography", difficulty: "easy" }
  },
  {
    id: "2",
    input: "Explain quantum computing in one sentence",
    expected: "Quantum computing uses quantum mechanical phenomena like superposition and entanglement to perform computations.",
    metadata: { category: "tech", difficulty: "hard" }
  },
];
```

### 3. Evaluation Metrics

#### Exact Match
So sánh chính xác từng ký tự: `output === expected`

#### Contains
Kiểm tra output có chứa expected keywords/phrases không

#### LLM-as-a-Judge
Dùng LLM (GPT-4) để chấm điểm chất lượng output dựa trên rubric:

```typescript
async function evaluateWithLLM(input: string, output: string, expected: string, rubric: string) {
  const prompt = `Rate the quality of this answer on a scale of 1-10:

Question: ${input}
Expected: ${expected}
Actual: ${output}

Rubric: ${rubric}

Score (1-10):`;

  const response = await llm.invoke(prompt);
  return parseInt(response.trim());
}
```

### 4. Evaluation Pipeline
1. Load golden dataset
2. Chạy LLM với từng input → lấy actual output
3. Evaluate actual vs expected với metric đã chọn
4. Aggregate results: pass rate, average score, failed cases
5. Report và alert nếu quality drop

## Tài nguyên học tập

- [PromptFoo Documentation](https://www.promptfoo.dev/)
- [LangSmith Evaluations](https://docs.smith.langchain.com/evaluation)
- [OpenAI Evals Framework](https://github.com/openai/evals)

## Bài tập thực hành

1. **Bài 1:** Tạo golden dataset cho chatbot của bạn (10+ examples)
2. **Bài 2:** Implement evaluation với 3 metrics: Exact Match, Contains, LLM-as-a-Judge
3. **Bài 3:** Chạy batch evaluation và phân tích kết quả

## Design Patterns áp dụng

- **Strategy Pattern:** Mỗi metric là một strategy riêng (ExactMatch, Contains, LlmJudge)
- **Template Method:** Pipeline evaluation cố định (validate → evaluate → aggregate → return)
- **Factory Pattern:** Tạo strategy instance từ metric type

## Checklist hoàn thành

- [ ] Tạo được golden dataset
- [ ] Implement được Exact Match và Contains metrics
- [ ] Implement được LLM-as-a-Judge với rubric
- [ ] Chạy được batch evaluation và xem kết quả

