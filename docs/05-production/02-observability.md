# Tracing & Observability

## Mục tiêu học tập

Monitor và debug AI behavior bằng cách log toàn bộ quá trình suy nghĩ và thực thi.

## Nội dung chính

### 1. Tại sao cần Observability?

AI là "black box" - khó debug hơn code thường:
- Cần biết: Prompt gửi gì? Context gì? Tool gọi gì? Response như nào?
- `console.log` không đủ cho production
- Cần track cost, latency, errors theo user/endpoint
- Debug "tại sao AI trả lời sai" cần xem toàn bộ flow

### 2. Kiến trúc Observability Module

Module này áp dụng 3 design patterns:

**Decorator Pattern**: Wrap LLM calls với logging interceptor
**Observer Pattern**: Multiple services observe và log events
**Proxy Pattern**: Proxy OpenAI client để track requests

```
observability/
├── services/
│   ├── langsmith.service.ts      # LangSmith integration
│   ├── helicone.service.ts        # Helicone cost tracking
│   └── custom-logger.service.ts   # In-memory logging
├── interceptors/
│   └── llm-tracing.interceptor.ts # Auto-trace LLM calls
├── decorators/
│   └── trace-llm-call.decorator.ts # Method decorator
└── observability.service.ts       # Main orchestrator
```

### 3. LangSmith Setup

LangSmith tự động trace khi dùng LangChain. Service này setup environment variables:

```typescript
// backend/src/observability/services/langsmith.service.ts
@Injectable()
export class LangSmithService implements OnModuleInit {
  onModuleInit() {
    this.enabled = this.configService.get<boolean>('observability.langsmith.enabled', false);
    this.apiKey = this.configService.get<string>('observability.langsmith.apiKey');
    this.project = this.configService.get<string>('observability.langsmith.project') || 'learn-ai';

    if (this.enabled && this.apiKey) {
      process.env.LANGCHAIN_TRACING_V2 = 'true';
      process.env.LANGCHAIN_API_KEY = this.apiKey;
      process.env.LANGCHAIN_PROJECT = this.project;
    }
  }
}
```

**Environment variables:**
```bash
LANGSMITH_ENABLED=true
LANGCHAIN_API_KEY=your-api-key
LANGCHAIN_PROJECT=learn-ai
```

### 4. Helicone for Cost Tracking

Helicone proxy OpenAI requests và track tự động:

```typescript
// backend/src/observability/services/helicone.service.ts
@Injectable()
export class HeliconeService {
  createOpenAIClient(userId?: string): OpenAI {
    if (!this.enabled || !this.apiKey) {
      return new OpenAI({ apiKey: this.configService.get<string>('openai.apiKey') });
    }

    return new OpenAI({
      apiKey: this.configService.get<string>('openai.apiKey'),
      baseURL: 'https://oai.hconeai.com/v1',
      defaultHeaders: {
        'Helicone-Auth': `Bearer ${this.apiKey}`,
        ...(userId && { 'Helicone-User-Id': userId }),
      },
    });
  }
}
```

**Sử dụng:**
```typescript
// Inject HeliconeService vào service khác
constructor(private heliconeService: HeliconeService) {}

async callLLM() {
  const openai = this.heliconeService.createOpenAIClient(userId);
  const response = await openai.chat.completions.create({...});
  // Tự động tracked trên Helicone dashboard
}
```

### 5. Custom Logging Service

In-memory logging với query và stats:

```typescript
// backend/src/observability/services/custom-logger.service.ts
@Injectable()
export class CustomLoggerService {
  async logLLMCall(log: LLMLog, metadata?: LLMCallMetadata): Promise<void> {
    const enrichedLog: LLMLog = {
      ...log,
      userId: metadata?.userId,
      sessionId: metadata?.sessionId,
      endpoint: metadata?.endpoint,
    };

    this.logs.push(enrichedLog);
    if (this.logs.length > this.MAX_MEMORY_LOGS) {
      this.logs.shift();
    }
  }

  async getLogs(filters?: {
    userId?: string;
    model?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<LLMLog[]> {
    // Filter logic...
  }

  async getStats(): Promise<{
    totalCalls: number;
    totalCost: number;
    totalTokens: number;
    averageLatency: number;
    byModel: Record<string, { calls: number; cost: number }>;
  }> {
    // Calculate stats...
  }
}
```

### 6. LLM Tracing Interceptor (Decorator Pattern)

Tự động trace mọi LLM response:

```typescript
// backend/src/observability/interceptors/llm-tracing.interceptor.ts
@Injectable()
export class LLMTracingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap({
        next: async (data) => {
          if (this.isLLMResponse(data)) {
            await this.observabilityService.logLLMCallFromResponse(
              data,
              Date.now() - startTime,
              { endpoint: request.url }
            );
          }
        },
      }),
    );
  }
}
```

### 7. Observability Service (Orchestrator)

Service chính điều phối tất cả logging services:

```typescript
// backend/src/observability/observability.service.ts
@Injectable()
export class ObservabilityService {
  async logLLMCall(log: LLMLog, metadata?: LLMCallMetadata): Promise<void> {
    const promises: Promise<void>[] = [];

    if (this.langSmithService.isEnabled()) {
      promises.push(this.langSmithService.logLLMCall(log, metadata));
    }

    if (this.heliconeService.isEnabled()) {
      promises.push(this.heliconeService.logLLMCall(log));
    }

    if (this.customLoggerService.isEnabled()) {
      promises.push(this.customLoggerService.logLLMCall(log, metadata));
    }

    await Promise.allSettled(promises);
  }

  private calculateCost(model: string, inputTokens: number, outputTokens: number): number {
    const pricing: Record<string, { input: number; output: number }> = {
      'gpt-4o': { input: 0.0025 / 1000, output: 0.01 / 1000 },
      'gpt-3.5-turbo': { input: 0.0005 / 1000, output: 0.0015 / 1000 },
      // ...
    };
    const price = pricing[model] || { input: 0.001 / 1000, output: 0.002 / 1000 };
    return inputTokens * price.input + outputTokens * price.output;
  }
}
```

### 8. API Endpoints

```typescript
// GET /api/v1/observability/logs?userId=123&model=gpt-4
// GET /api/v1/observability/stats
// POST /api/v1/observability/logs
```

**Query logs:**
```bash
curl "http://localhost:4000/api/v1/observability/logs?userId=user123&model=gpt-4"
```

**Get stats:**
```bash
curl "http://localhost:4000/api/v1/observability/stats"
```

Response:
```json
{
  "success": true,
  "data": {
    "totalCalls": 150,
    "totalCost": 12.45,
    "totalTokens": 45000,
    "averageLatency": 1250,
    "byModel": {
      "gpt-4o": { "calls": 100, "cost": 8.50 },
      "gpt-3.5-turbo": { "calls": 50, "cost": 3.95 }
    }
  }
}
```

## 9. Configuration

Thêm vào `.env`:

```bash
# LangSmith
LANGSMITH_ENABLED=true
LANGCHAIN_API_KEY=your-langsmith-api-key
LANGCHAIN_PROJECT=learn-ai

# Helicone
HELICONE_ENABLED=true
HELICONE_API_KEY=your-helicone-api-key

# Custom Logging
CUSTOM_LOGGING_ENABLED=true
CUSTOM_LOGGING_STORAGE=memory
```

## 10. Sử dụng trong Code

**Option 1: Tự động qua Interceptor**
```typescript
// Áp dụng interceptor ở controller level
@UseInterceptors(LLMTracingInterceptor)
@Controller('chat')
export class ChatController {
  // Tất cả responses tự động được trace
}
```

**Option 2: Manual logging**
```typescript
constructor(private observabilityService: ObservabilityService) {}

async callLLM() {
  const startTime = Date.now();
  const response = await llm.invoke(prompt);
  const latency = Date.now() - startTime;

  await this.observabilityService.logLLMCallFromResponse(
    response,
    latency,
    { userId: 'user123', endpoint: '/chat' }
  );
}
```

**Option 3: Sử dụng Helicone client**
```typescript
constructor(
  private observabilityService: ObservabilityService
) {}

async callOpenAI() {
  const openai = this.observabilityService
    .getHeliconeService()
    .createOpenAIClient('user123');
  
  const response = await openai.chat.completions.create({...});
  // Tự động tracked trên Helicone
}
```

## Tài nguyên học tập

- [LangSmith](https://smith.langchain.com/) - Tracing platform
- [Helicone](https://www.helicone.ai/) - Cost tracking & analytics
- [Arize Phoenix](https://phoenix.arize.com/) - LLM observability
- [OpenTelemetry](https://opentelemetry.io/) - Distributed tracing standard

## Bài tập thực hành

1. **Bài 1:** Setup LangSmith và view traces
   - Tạo account tại https://smith.langchain.com/
   - Thêm `LANGCHAIN_API_KEY` vào `.env`
   - Gọi một LLM endpoint và xem trace trên dashboard

2. **Bài 2:** Setup Helicone và track costs
   - Tạo account tại https://www.helicone.ai/
   - Thêm `HELICONE_API_KEY` vào `.env`
   - Sử dụng `HeliconeService.createOpenAIClient()` và xem dashboard

3. **Bài 3:** Query logs và stats
   - Gọi `GET /api/v1/observability/stats`
   - Filter logs theo user: `GET /api/v1/observability/logs?userId=123`
   - Phân tích cost per model

4. **Bài 4:** Debug một lỗi thực tế
   - Tìm một LLM call trả về kết quả sai
   - Xem log để biết prompt gửi gì, context gì
   - Sửa prompt và verify lại

## Design Patterns áp dụng

- **Decorator Pattern**: `LLMTracingInterceptor` wrap LLM calls với logging
- **Observer Pattern**: Multiple services (LangSmith, Helicone, Custom) observe và log events
- **Proxy Pattern**: `HeliconeService` proxy OpenAI client để track requests
- **Strategy Pattern**: Có thể switch giữa các logging strategies

## Checklist hoàn thành

- [ ] Setup được LangSmith hoặc Helicone
- [ ] View được traces trên dashboard
- [ ] Track được cost per user/endpoint
- [ ] Query được logs qua API
- [ ] Xem được stats (total cost, calls, latency)
- [ ] Debug được một lỗi thực tế bằng traces

