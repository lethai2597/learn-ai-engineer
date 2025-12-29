# Chains & Routing

## Mục tiêu học tập

Kết nối các bước xử lý tuần tự hoặc rẽ nhánh để xây dựng logic phức tạp.

## Nội dung chính

### 1. Simple Chain
```typescript
// Step 1: Translate
const translation = await translateLLM(userInput);

// Step 2: Summarize
const summary = await summarizeLLM(translation);

// Step 3: Extract keywords
const keywords = await extractKeywords(summary);
```

### 2. Router Pattern
```typescript
async function routeRequest(input: string): Promise<string> {
  const intent = await classifyIntent(input);
  
  switch (intent) {
    case 'code':
      return await codeModel(input); // Llama 3 Code
    case 'creative':
      return await creativeModel(input); // Claude
    case 'general':
      return await generalModel(input); // GPT-3.5
    default:
      return await fallbackModel(input);
  }
}
```

### 3. Conditional Chains
```typescript
async function processDocument(doc: string) {
  const language = await detectLanguage(doc);
  
  if (language !== 'en') {
    doc = await translate(doc, 'en');
  }
  
  const summary = await summarize(doc);
  const entities = await extractEntities(summary);
  
  return { summary, entities };
}
```

### 4. LangChain LCEL
```typescript
import { PromptTemplate } from 'langchain/prompts';
import { RunnableSequence } from 'langchain/schema/runnable';

const chain = RunnableSequence.from([
  promptTemplate,
  llm,
  outputParser,
]);

const result = await chain.invoke({ input: '...' });
```

### 5. Cảnh báo quan trọng
⚠️ **LangChain có thể phức tạp quá mức.** Với nhiều use cases, code thuần (native TypeScript) dễ hiểu và debug hơn. Chỉ dùng LangChain khi thực sự cần features sẵn có.

## Tài nguyên học tập

- [LangChain LCEL](https://js.langchain.com/docs/expression_language/)
- [Flow-based Programming](https://en.wikipedia.org/wiki/Flow-based_programming)

## Bài tập thực hành

1. **Bài 1:** Build simple chain: Translate → Summarize
2. **Bài 2:** Build router phân loại intent và gọi model phù hợp
3. **Bài 3:** Build multi-step chain với conditional logic

## Design Patterns áp dụng

- **Chain of Responsibility:** Pass request through chain of handlers
- **Strategy Pattern:** Select strategy (model) based on input
- **Template Method:** Define algorithm skeleton, override steps
- **Pipeline Pattern:** Data flows through processing stages

## Checklist hoàn thành

- [ ] Hiểu khái niệm chains và routing
- [ ] Implement được simple chain thuần (no framework)
- [ ] Build được router với intent classification
- [ ] Biết khi nào nên/không nên dùng LangChain

