"use client";

import { Typography, Divider, Alert, Tag } from "antd";

const { Title, Paragraph } = Typography;

export function LearningSection() {
  const concepts = [
    {
      title: "Exponential Backoff với Jitter",
      description:
        "Retry với delay tăng dần theo cấp số nhân (1s, 2s, 4s, 8s...) và thêm jitter (random 0-100ms) để tránh thundering herd problem. Chỉ retry cho 429 (rate limit) và 5xx errors, không retry 4xx errors.",
      useCases: [
        "Retry khi gặp rate limit (429) hoặc server errors (5xx)",
        "Tránh thundering herd với jitter",
        "Giới hạn số lần retry để tránh infinite loops",
        "Log retry attempts để monitor",
      ],
      example: `async function retryWithBackoff<T>(
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
        const delay = baseDelay * Math.pow(2, i);
        const jitter = Math.random() * 100;
        await sleep(delay + jitter);
      } else {
        throw error;
      }
    }
  }
}`,
    },
    {
      title: "Circuit Breaker Pattern",
      description:
        "Tự động stop calling failing services sau khi đạt failure threshold. Circuit có 3 states: CLOSED (normal), OPEN (blocking calls), HALF_OPEN (testing). Giúp tránh cascade failures và cho service time để recover.",
      useCases: [
        "Tránh cascade failures khi service down",
        "Cho service time để recover",
        "Fail fast thay vì wait timeout",
        "Monitor circuit state để alert",
      ],
      example: `class CircuitBreaker {
  private failures = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  
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
}`,
    },
    {
      title: "Fallback Models",
      description:
        "Khi primary model fail, tự động chuyển sang model khác. Thử theo thứ tự: GPT-4 → Claude → GPT-3.5. Đảm bảo application vẫn hoạt động ngay cả khi một model không available.",
      useCases: [
        "Đảm bảo availability khi primary model down",
        "Chuyển sang model rẻ hơn khi cần",
        "Balance giữa cost và reliability",
        "Handle model-specific errors gracefully",
      ],
      example: `async function chatWithFallback(
  messages: Message[]
): Promise<string> {
  const models = ['gpt-4', 'claude-3-5-sonnet', 'gpt-3.5-turbo'];
  
  for (const model of models) {
    try {
      return await callLLM(model, messages);
    } catch (error) {
      console.log(\`\${model} failed, trying next...\`);
    }
  }
  
  throw new Error('All models failed');
}`,
    },
    {
      title: "Timeout Configuration",
      description:
        "Set timeout hợp lý cho mọi API calls để tránh hanging requests. Sử dụng AbortController để cancel requests quá lâu. Timeout nên ngắn hơn client timeout để fail fast.",
      useCases: [
        "Tránh hanging requests",
        "Fail fast khi service slow",
        "Set timeout phù hợp với use case",
        "Cancel requests quá lâu",
      ],
      example: `async function callWithTimeout<T>(
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

const response = await openai.chat.completions.create(
  { ... },
  { timeout: 30000 }
);`,
    },
    {
      title: "Graceful Degradation",
      description:
        "Khi LLM không available, fallback to simpler methods như keyword search, cached responses, hoặc default responses. Đảm bảo user vẫn có experience tốt ngay cả khi AI features fail.",
      useCases: [
        "Fallback khi LLM không available",
        "Provide basic functionality khi AI fail",
        "Cached responses cho common queries",
        "Default responses cho edge cases",
      ],
      example: `async function chat(query: string): Promise<Response> {
  try {
    const answer = await llm.invoke(query);
    return { answer, source: 'ai' };
  } catch (error) {
    const results = await keywordSearch(query);
    return { 
      answer: results[0]?.text || 'Sorry, unable to process',
      source: 'fallback' 
    };
  }
}`,
    },
  ];

  const designPatterns = [
    {
      pattern: "Retry Pattern",
      description:
        "Exponential backoff với jitter cho phép retry failed requests một cách thông minh. Delay tăng dần giúp service có time recover, jitter tránh thundering herd. Chỉ retry cho retryable errors (429, 5xx).",
      example:
        "RetryService.retryWithBackoff(fn, options) → Retry với exponential backoff",
    },
    {
      pattern: "Circuit Breaker Pattern",
      description:
        "Circuit breaker tự động block calls đến failing service sau khi đạt threshold. Giúp tránh cascade failures và cho service time recover. States: CLOSED → OPEN → HALF_OPEN → CLOSED.",
      example: "CircuitBreaker.call(fn) → Protected call với circuit breaker",
    },
    {
      pattern: "Fallback Pattern",
      description:
        "Fallback strategy cho phép chuyển sang alternative khi primary option fail. Model fallback: GPT-4 → Claude → GPT-3.5. Method fallback: LLM → Keyword search → Cached response.",
      example:
        "FallbackService.executeWithFallback(options) → Try options theo thứ tự",
    },
    {
      pattern: "Timeout Pattern",
      description:
        "Timeout pattern đảm bảo requests không hang forever. Set timeout hợp lý cho từng operation type. Sử dụng AbortController để cancel requests quá lâu.",
      example:
        "TimeoutService.callWithTimeout(fn, timeoutMs) → Call với timeout protection",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <Title level={3} className="mb-4 text-xl">
          Vị trí trong kiến trúc tổng thể
        </Title>
        <Paragraph className="text-gray-700 leading-relaxed mb-4">
          Error Handling được implement ở <strong>Backend API layer</strong> như
          một middleware layer bao quanh LLM API calls. Đây là lớp bảo vệ để xử
          lý errors, retry logic, và fallback strategies để đảm bảo application
          vẫn hoạt động ổn định.
        </Paragraph>
        <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-4">
          <div className="text-gray-700 text-sm font-mono mb-2">
            Flow: Request → Error Handling Layer (Retry/Circuit
            Breaker/Fallback) → LLM API → Error Handling (Recovery) → Response
          </div>
          <ol className="list-decimal list-inside space-y-2 text-gray-600 text-sm mt-3">
            <li>
              <strong>Request:</strong> User request đến Backend API
            </li>
            <li>
              <strong>Error Handling Layer:</strong> Wrap LLM call với retry
              logic, circuit breaker, timeout
            </li>
            <li>
              <strong>LLM API:</strong> Gọi LLM API (có thể fail)
            </li>
            <li>
              <strong>Error Detection:</strong> Detect errors (429 rate limit,
              5xx server errors, timeout)
            </li>
            <li>
              <strong>Error Recovery:</strong> Retry với exponential backoff,
              fallback model, hoặc graceful degradation
            </li>
            <li>
              <strong>Response:</strong> Trả về success response hoặc error
              response
            </li>
          </ol>
        </div>
        <Alert
          description="Error Handling không phải là feature của LLM API. Bạn phải implement retry logic, circuit breaker, fallback strategies ở backend để đảm bảo application resilient và reliable."
          type="warning"
          showIcon
        />
      </div>

      <Divider />

      <div className="space-y-6">
        {concepts.map((concept, index) => (
          <div key={index}>
            <div className="border border-gray-200 rounded-lg p-6 bg-white hover:border-gray-300 transition-colors">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Title level={4} style={{ marginBottom: 0 }}>
                      {concept.title}
                    </Title>
                    <Tag
                      color={
                        index === 0
                          ? "blue"
                          : index === 1
                          ? "red"
                          : index === 2
                          ? "green"
                          : index === 3
                          ? "orange"
                          : "purple"
                      }
                    >
                      {index === 0
                        ? "Retry"
                        : index === 1
                        ? "Circuit"
                        : index === 2
                        ? "Fallback"
                        : index === 3
                        ? "Timeout"
                        : "Degradation"}
                    </Tag>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {concept.description}
                  </p>
                </div>

                <div>
                  <Title level={5}>Use Cases:</Title>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {concept.useCases.map((useCase, idx) => (
                      <li key={idx}>{useCase}</li>
                    ))}
                  </ul>
                </div>

                {concept.example && (
                  <div>
                    <Title level={5}>Ví dụ:</Title>
                    <div className="bg-gray-50 p-3 rounded border border-gray-100">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                        {concept.example}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          Design Patterns áp dụng
        </Title>
        <div className="grid gap-4">
          {designPatterns.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 bg-white"
            >
              <div className="flex items-center gap-2 mb-2">
                <Title level={5} style={{ marginBottom: 0 }}>
                  {item.pattern}
                </Title>
                <Tag color="cyan">Pattern</Tag>
              </div>
              <p className="text-gray-700 leading-relaxed mb-2">
                {item.description}
              </p>
              <div className="bg-gray-50 p-2 rounded border border-gray-100">
                <code className="text-sm text-gray-700">{item.example}</code>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          Best Practices
        </Title>
        <div className="space-y-4">
          <div>
            <Title level={4} className="mb-2">
              Retry Strategy
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Chỉ retry retryable errors:</strong> 429 (rate limit) và
                5xx (server errors), không retry 4xx (client errors)
              </li>
              <li>
                <strong>Use exponential backoff:</strong> Delay tăng dần để cho
                service time recover
              </li>
              <li>
                <strong>Add jitter:</strong> Random delay để tránh thundering
                herd problem
              </li>
              <li>
                <strong>Set max retries:</strong> Tránh infinite loops và waste
                resources
              </li>
            </ul>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Circuit Breaker
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Set appropriate threshold:</strong> Balance giữa
                sensitivity và stability
              </li>
              <li>
                <strong>Monitor circuit state:</strong> Alert khi circuit opens
                để investigate
              </li>
              <li>
                <strong>Use timeout:</strong> Test service recovery sau timeout
                period
              </li>
              <li>
                <strong>Half-open state:</strong> Test service recovery trước
                khi fully close
              </li>
            </ul>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Fallback Strategy
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Order fallback options:</strong> Primary → Secondary →
                Tertiary
              </li>
              <li>
                <strong>Log fallback usage:</strong> Track khi nào fallback được
                trigger
              </li>
              <li>
                <strong>Graceful degradation:</strong> Provide basic
                functionality khi AI fail
              </li>
              <li>
                <strong>Cache fallback responses:</strong> Reuse cached
                responses khi possible
              </li>
            </ul>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Timeout & Monitoring
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Set timeout hợp lý:</strong> Ngắn hơn client timeout để
                fail fast
              </li>
              <li>
                <strong>Monitor error rates:</strong> Track retry rates, circuit
                states, fallback usage
              </li>
              <li>
                <strong>Alert on patterns:</strong> Alert khi error rate cao
                hoặc circuit opens
              </li>
              <li>
                <strong>Log all errors:</strong> Log retry attempts, circuit
                state changes, fallback triggers
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Divider className="mb-4" />

      <Alert
        description="Error handling là một phần quan trọng của production AI systems. LLM APIs có thể fail vì nhiều lý do. Sử dụng retry logic, circuit breaker, và fallback strategies để đảm bảo application vẫn hoạt động ổn định ngay cả khi có errors."
        type="info"
        showIcon
      />
    </div>
  );
}
