# Cost Optimization & Token Management

## Mục tiêu học tập

Kiểm soát và giảm thiểu chi phí API LLM trong production.

## Nội dung chính

### 1. Token Counting
```typescript
import { encoding_for_model } from 'tiktoken';

function countTokens(text: string, model: string = 'gpt-4'): number {
  const encoding = encoding_for_model(model);
  const tokens = encoding.encode(text);
  encoding.free();
  return tokens.length;
}

// Always set max_tokens to avoid runaway costs
const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [...],
  max_tokens: 500, // Limit output
});
```

### 2. Prompt Caching (Claude)
```typescript
// Cache system prompt - chỉ trả tiền lần đầu
const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  system: [
    {
      type: 'text',
      text: longSystemPrompt, // 10,000 tokens
      cache_control: { type: 'ephemeral' }, // Cache this!
    },
  ],
  messages: [...],
});

// Lần 2 trở đi: Chỉ trả 10% giá cho cached prompt
```

### 3. Semantic Caching
```typescript
import { Redis } from '@upstash/redis';

async function getCachedResponse(query: string): Promise<string | null> {
  const queryEmbedding = await getEmbedding(query);
  const cached = await redis.get('cache:*'); // Get all cached
  
  for (const [key, value] of cached) {
    const similarity = cosineSimilarity(queryEmbedding, value.embedding);
    if (similarity > 0.95) { // 95% similar
      return value.response;
    }
  }
  
  return null;
}

async function chat(query: string): Promise<string> {
  const cached = await getCachedResponse(query);
  if (cached) return cached;
  
  const response = await llm.invoke(query);
  await cacheResponse(query, response);
  return response;
}
```

### 4. Model Selection Strategy
```typescript
interface CostConfig {
  simple: 'gpt-3.5-turbo';    // $0.002/1K
  medium: 'gpt-4-turbo';       // $0.01/1K
  complex: 'gpt-4';            // $0.03/1K
}

function selectModel(complexity: number): Model {
  if (complexity < 3) return 'gpt-3.5-turbo';
  if (complexity < 7) return 'gpt-4-turbo';
  return 'gpt-4';
}
```

### 5. Batch Processing
```typescript
// Instead of 100 individual requests
// Use OpenAI Batch API - 50% discount!
const batch = await openai.batches.create({
  input_file_id: fileId,
  endpoint: '/v1/chat/completions',
  completion_window: '24h',
});

// Check status later
const result = await openai.batches.retrieve(batch.id);
```

### 6. Cost Monitoring
```typescript
interface CostTracker {
  userId: string;
  date: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
}

async function trackCost(call: LLMCall) {
  const cost = calculateCost(call.model, call.tokens);
  await db.costs.insert({ ...call, cost });
  
  // Alert if over budget
  const dailyCost = await getDailyCost(call.userId);
  if (dailyCost > DAILY_LIMIT) {
    await sendAlert(call.userId);
  }
}
```

## Tài nguyên học tập

- [tiktoken](https://github.com/openai/tiktoken)
- [OpenAI Batch API](https://platform.openai.com/docs/guides/batch)
- [Claude Prompt Caching](https://docs.anthropic.com/claude/docs/prompt-caching)

## Bài tập thực hành

1. **Bài 1:** Implement token counting cho prompts
2. **Bài 2:** Setup semantic caching với Redis
3. **Bài 3:** Build cost dashboard theo user/endpoint

## Design Patterns áp dụng

- **Strategy Pattern:** Different caching strategies
- **Proxy Pattern:** Caching proxy trước LLM
- **Decorator Pattern:** Add cost tracking to LLM calls

## Checklist hoàn thành

- [ ] Implement được token counting
- [ ] Setup được semantic caching
- [ ] Track được cost per user
- [ ] Giảm được chi phí >30% so với baseline

