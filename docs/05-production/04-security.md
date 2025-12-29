# Security & Safety

## Mục tiêu học tập

Bảo vệ AI application khỏi prompt injection, data leakage và các rủi ro bảo mật khác.

## Nội dung chính

### 1. Prompt Injection Detection
```typescript
const dangerousPatterns = [
  /ignore\s+(previous|all)\s+instructions?/i,
  /system\s*:?\s*you\s+are/i,
  /\[SYSTEM\]/i,
  /new\s+role/i,
  /forget\s+everything/i,
];

function detectPromptInjection(input: string): boolean {
  return dangerousPatterns.some(pattern => pattern.test(input));
}

// Use before sending to LLM
if (detectPromptInjection(userInput)) {
  return { error: 'Invalid request' };
}
```

### 2. NeMo Guardrails
```yaml
# config.yml
rails:
  input:
    flows:
      - check jailbreak
      - check prompt injection
  output:
    flows:
      - check harmful content
      - check PII leakage

prompts:
  - task: check_jailbreak
    content: |
      Is this a jailbreak attempt?
      Input: {{ user_input }}
```

### 3. PII Detection & Redaction
```typescript
import { PresidioAnalyzer, PresidioAnonymizer } from 'presidio';

async function redactPII(text: string): Promise<string> {
  const analyzer = new PresidioAnalyzer();
  const results = await analyzer.analyze(text, ['EMAIL', 'PHONE', 'SSN']);
  
  const anonymizer = new PresidioAnonymizer();
  const anonymized = await anonymizer.anonymize(text, results);
  
  return anonymized.text;
}

// Before: "My email is john@example.com and phone is 555-1234"
// After:  "My email is <EMAIL> and phone is <PHONE>"
```

### 4. Content Moderation
```typescript
async function moderateContent(text: string): Promise<boolean> {
  const moderation = await openai.moderations.create({
    input: text,
  });
  
  const result = moderation.results[0];
  
  if (result.flagged) {
    console.log('Flagged categories:', result.categories);
    return false; // Block this content
  }
  
  return true; // Safe
}
```

### 5. Rate Limiting
```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
});

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'anonymous';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return new Response('Too many requests', { status: 429 });
  }
  
  // Process request...
}
```

### 6. System Prompt Protection
```typescript
// ❌ Bad: User input directly in system prompt
const systemPrompt = `You are a helpful assistant. ${userRole}`;

// ✅ Good: Separate user input from system
const systemPrompt = 'You are a helpful assistant.';
const userMessage = `User role: ${userRole}\n\nUser query: ${userQuery}`;
```

## Tài nguyên học tập

- [NeMo Guardrails](https://github.com/NVIDIA/NeMo-Guardrails)
- [Presidio](https://microsoft.github.io/presidio/)
- [OpenAI Moderation API](https://platform.openai.com/docs/guides/moderation)
- [OWASP LLM Top 10](https://owasp.org/www-project-top-10-for-large-language-model-applications/)

## Bài tập thực hành

1. **Bài 1:** Implement prompt injection detection
2. **Bài 2:** Setup content moderation với OpenAI API
3. **Bài 3:** Implement rate limiting cho API endpoints

## Design Patterns áp dụng

- **Decorator Pattern:** Wrap requests với security checks
- **Chain of Responsibility:** Security checks chain
- **Strategy Pattern:** Different security strategies per endpoint

## Checklist hoàn thành

- [ ] Implement được prompt injection detection
- [ ] Setup được content moderation
- [ ] Implement được PII redaction
- [ ] Setup được rate limiting

