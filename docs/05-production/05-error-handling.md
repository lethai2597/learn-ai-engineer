# Error Handling & Retry Logic

## Mục tiêu học tập

Xử lý lỗi thông minh khi gọi API LLM để tăng độ ổn định của application.

## Nội dung chính

### 1. Common LLM API Errors
- **429 Too Many Requests:** Rate limit exceeded
- **500 Internal Server Error:** LLM provider issue
- **Timeout:** Request quá lâu
- **Context Length Exceeded:** Prompt quá dài

### 2. Exponential Backoff với Jitter
```typescript
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      if (error.status === 429 || error.status >= 500) {
        // Exponential backoff: 1s, 2s, 4s, 8s...
        const delay = baseDelay * Math.pow(2, i);
        // Add jitter: random 0-100ms
        const jitter = Math.random() * 100;
        await sleep(delay + jitter);
      } else {
        throw error; // Don't retry 4xx errors (except 429)
      }
    }
  }
}

// Usage
const response = await retryWithBackoff(() =>
  openai.chat.completions.create({ ... })
);
```

### 3. Using p-retry Library
```typescript
import pRetry from 'p-retry';

const response = await pRetry(
  () => openai.chat.completions.create({ ... }),
  {
    retries: 3,
    factor: 2,
    minTimeout: 1000,
    maxTimeout: 10000,
    onFailedAttempt: error => {
      console.log(`Attempt ${error.attemptNumber} failed. ${error.retriesLeft} retries left.`);
    },
  }
);
```

### 4. Fallback Models
```typescript
async function chatWithFallback(messages: Message[]): Promise<string> {
  const models = ['gpt-4', 'claude-3-5-sonnet', 'gpt-3.5-turbo'];
  
  for (const model of models) {
    try {
      return await callLLM(model, messages);
    } catch (error) {
      console.log(`${model} failed, trying next...`);
    }
  }
  
  throw new Error('All models failed');
}
```

### 5. Circuit Breaker Pattern
```typescript
class CircuitBreaker {
  private failures = 0;
  private lastFailTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  
  constructor(
    private threshold = 5,
    private timeout = 60000 // 1 minute
  ) {}
  
  async call<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailTime > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }
  
  private onFailure() {
    this.failures++;
    this.lastFailTime = Date.now();
    
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
    }
  }
}

// Usage
const breaker = new CircuitBreaker();
const response = await breaker.call(() =>
  openai.chat.completions.create({ ... })
);
```

### 6. Timeout Configuration
```typescript
import { AbortController } from 'abort-controller';

async function callWithTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    return await fn();
  } finally {
    clearTimeout(timeout);
  }
}

// OpenAI with timeout
const response = await openai.chat.completions.create(
  { ... },
  { timeout: 30000 } // 30 seconds
);
```

### 7. Graceful Degradation
```typescript
async function chat(query: string): Promise<Response> {
  try {
    const answer = await llm.invoke(query);
    return { answer, source: 'ai' };
  } catch (error) {
    // Fallback to keyword search
    const results = await keywordSearch(query);
    return { answer: results[0]?.text || 'Error', source: 'fallback' };
  }
}
```

## Tài nguyên học tập

- [p-retry](https://github.com/sindresorhus/p-retry)
- [Circuit Breaker Pattern](https://martinfowler.com/bliki/CircuitBreaker.html)

## Bài tập thực hành

1. **Bài 1:** Implement retry với exponential backoff
2. **Bài 2:** Implement circuit breaker
3. **Bài 3:** Build fallback system với multiple models

## Design Patterns áp dụng

- **Retry Pattern:** Exponential backoff with jitter
- **Circuit Breaker Pattern:** Stop calling failing services
- **Fallback Pattern:** Graceful degradation
- **Timeout Pattern:** Prevent hanging requests

## Checklist hoàn thành

- [ ] Implement được retry với exponential backoff
- [ ] Implement được circuit breaker
- [ ] Setup được fallback models
- [ ] Configure được timeout cho tất cả API calls

