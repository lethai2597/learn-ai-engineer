"use client";

import { Typography, Divider, Alert, Tag } from "antd";

const { Title, Paragraph } = Typography;

export function LearningSection() {
  const concepts = [
    {
      title: "Token Counting",
      description:
        "Đếm tokens trước khi gửi request là bước đầu tiên để kiểm soát cost. Sử dụng tiktoken library để đếm chính xác tokens theo từng model. Luôn set max_tokens để tránh response quá dài gây tốn tiền.",
      useCases: [
        "Kiểm tra token count trước khi gửi request",
        "Tính toán estimated cost dựa trên token count",
        "Set max_tokens hợp lý để giới hạn output length",
        "So sánh cost giữa các models",
      ],
      example: `import { encoding_for_model } from 'tiktoken';

function countTokens(text: string, model: string): number {
  const encoding = encoding_for_model(model);
  const tokens = encoding.encode(text);
  encoding.free();
  return tokens.length;
}

const tokenCount = countTokens(prompt, 'gpt-4');
const estimatedCost = calculateCost(model, tokenCount, maxTokens);`,
    },
    {
      title: "Prompt Caching (Claude)",
      description:
        "Claude hỗ trợ prompt caching với ephemeral cache. System prompt được cache và chỉ trả tiền lần đầu, các lần sau chỉ trả 10% giá. Giúp tiết kiệm đáng kể khi system prompt dài.",
      useCases: [
        "Cache system prompt dài (10k+ tokens)",
        "Giảm cost khi system prompt không thay đổi",
        "Tối ưu cho applications có system prompt cố định",
      ],
      example: `const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  system: [{
    type: 'text',
    text: longSystemPrompt,
    cache_control: { type: 'ephemeral' }
  }],
  messages: [...]
});

// Lần 2 trở đi: Chỉ trả 10% giá cho cached prompt`,
    },
    {
      title: "Semantic Caching",
      description:
        "Cache responses dựa trên semantic similarity thay vì exact match. Sử dụng embeddings và cosine similarity để tìm cached responses tương tự. Giúp tái sử dụng responses cho queries tương tự mà không cần gọi LLM lại.",
      useCases: [
        "Cache responses cho queries tương tự",
        "Giảm cost khi có nhiều queries tương tự",
        "Tăng tốc độ response cho cached queries",
      ],
      example: `async function getCachedResponse(query: string): Promise<string | null> {
  const queryEmbedding = await getEmbedding(query);
  
  for (const cached of cache.values()) {
    const similarity = cosineSimilarity(queryEmbedding, cached.embedding);
    if (similarity > 0.95) {
      return cached.response;
    }
  }
  
  return null;
}`,
    },
    {
      title: "Model Selection Strategy",
      description:
        "Chọn model phù hợp với task complexity. Simple tasks dùng GPT-3.5 Turbo để tiết kiệm, complex tasks dùng GPT-4 để đảm bảo chất lượng. Strategy pattern giúp tự động chọn model dựa trên task type.",
      useCases: [
        "Route simple tasks đến model rẻ hơn",
        "Dùng GPT-4 chỉ khi thực sự cần",
        "Tự động chọn model dựa trên task complexity",
      ],
      example: `interface CostConfig {
  simple: 'gpt-3.5-turbo';
  medium: 'gpt-4-turbo';
  complex: 'gpt-4';
}

function selectModel(taskType: 'simple' | 'medium' | 'complex'): string {
  return costConfig[taskType];
}`,
    },
    {
      title: "Batch Processing",
      description:
        "OpenAI Batch API cho phép gửi nhiều requests cùng lúc với giá giảm 50%. Phù hợp cho non-urgent tasks có thể xử lý trong 24h. Giúp giảm đáng kể cost cho bulk processing.",
      useCases: [
        "Xử lý bulk requests không cần real-time",
        "Giảm 50% cost cho batch processing",
        "Tối ưu cho data processing tasks",
      ],
      example: `const batch = await openai.batches.create({
  input_file_id: fileId,
  endpoint: '/v1/chat/completions',
  completion_window: '24h'
});

// Check status later
const result = await openai.batches.retrieve(batch.id);`,
    },
    {
      title: "Cost Monitoring",
      description:
        "Track cost per user, endpoint, model để identify cost drivers. Set alerts khi vượt budget. Phân tích cost trends để optimize. Giúp kiểm soát và dự đoán cost trong production.",
      useCases: [
        "Track cost per user/endpoint/model",
        "Set alerts khi vượt daily/monthly budget",
        "Phân tích cost trends để optimize",
        "Identify cost drivers và optimize",
      ],
      example: `interface CostTracker {
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
  
  const dailyCost = await getDailyCost(call.userId);
  if (dailyCost > DAILY_LIMIT) {
    await sendAlert(call.userId);
  }
}`,
    },
  ];

  const designPatterns = [
    {
      pattern: "Strategy Pattern",
      description:
        "Model selection strategy cho phép chọn model khác nhau dựa trên task type. Simple tasks → GPT-3.5, Medium → GPT-4 Turbo, Complex → GPT-4. Dễ dàng thay đổi strategy mà không sửa core logic.",
      example: "ModelSelectorService.selectModel(taskType) → Recommended model",
    },
    {
      pattern: "Proxy Pattern",
      description:
        "Caching proxy đứng trước LLM calls để intercept và cache responses. Kiểm tra cache trước khi gọi LLM, trả cached response nếu có, lưu response mới vào cache sau khi gọi LLM.",
      example: "SemanticCacheService.checkCache(query) → Cached response hoặc call LLM",
    },
    {
      pattern: "Decorator Pattern",
      description:
        "Cost tracking decorator wrap LLM calls để track cost tự động. Mỗi LLM call được log với cost, tokens, latency. Không cần sửa code LLM calls, chỉ cần wrap bằng decorator.",
      example: "CostTrackingDecorator.wrap(llmCall) → Tracked call with cost logging",
    },
    {
      pattern: "Factory Pattern",
      description:
        "Cost calculator factory tạo calculator theo model type. Mỗi model có pricing khác nhau, factory tạo calculator phù hợp. Dễ dàng thêm model mới mà không sửa core logic.",
      example: "CostCalculatorFactory.create(model) → Model-specific calculator",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <Title level={3} className="mb-4 text-xl">
          Vị trí trong kiến trúc tổng thể
        </Title>
        <Paragraph className="text-gray-700 leading-relaxed mb-4">
          Cost Optimization được implement ở <strong>Backend API layer</strong> như một cost management layer bao quanh LLM API calls. Đây là lớp quản lý chi phí để tối ưu cost trong khi vẫn đảm bảo chất lượng.
        </Paragraph>
        <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-4">
          <div className="text-gray-700 text-sm font-mono mb-2">
            Flow: Request → Cost Layer (Token Counting, Caching, Model Selection) → LLM API → Cost Tracking → Response
          </div>
          <ol className="list-decimal list-inside space-y-2 text-gray-600 text-sm mt-3">
            <li>
              <strong>Request:</strong> User request đến Backend API
            </li>
            <li>
              <strong>Token Counting:</strong> Đếm tokens trước khi gọi LLM để estimate cost
            </li>
            <li>
              <strong>Cache Check:</strong> Kiểm tra semantic cache trước khi gọi LLM
            </li>
            <li>
              <strong>Model Selection:</strong> Chọn model phù hợp (GPT-3.5 vs GPT-4) dựa trên task complexity
            </li>
            <li>
              <strong>LLM API:</strong> Gọi LLM API với model đã chọn
            </li>
            <li>
              <strong>Cost Tracking:</strong> Track cost, tokens, latency sau mỗi call
            </li>
            <li>
              <strong>Response:</strong> Trả về response và update cache
            </li>
          </ol>
        </div>
        <Alert
          description="Cost Optimization không phải là feature của LLM API. Bạn phải implement cost management layer ở backend để kiểm soát và tối ưu chi phí."
          type="info"
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
                          ? "green"
                          : index === 2
                          ? "orange"
                          : index === 3
                          ? "purple"
                          : index === 4
                          ? "cyan"
                          : "magenta"
                      }
                    >
                      {index === 0
                        ? "Counting"
                        : index === 1
                        ? "Caching"
                        : index === 2
                        ? "Semantic"
                        : index === 3
                        ? "Selection"
                        : index === 4
                        ? "Batch"
                        : "Monitoring"}
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
          AI Model API vs Tự tích hợp
        </Title>
        <Paragraph className="text-gray-700 leading-relaxed mb-4">
          Cost Optimization là sự kết hợp giữa <strong>AI Model API</strong> (prompt caching - Claude) và <strong>tự tích hợp</strong> (token counting, semantic caching, model selection, cost tracking). Hiểu rõ phần nào từ API và phần nào tự implement giúp bạn tối ưu cost hiệu quả.
        </Paragraph>
        <div className="space-y-4">
          <div>
            <Title level={4} className="mb-2">
              AI Model API (Claude)
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600 mb-3">
              <li>
                <strong>Prompt Caching:</strong> Claude hỗ trợ <code className="bg-gray-100 px-1 rounded">cache_control: {`{ type: 'ephemeral' }`}</code> - Cache system prompt, chỉ trả 10% giá lần sau
              </li>
              <li>
                <strong>Batch API:</strong> OpenAI Batch API - Giảm 50% cost cho non-urgent tasks
              </li>
            </ul>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              <strong>Lưu ý:</strong> Prompt caching (Claude) và Batch API (OpenAI) là tính năng có sẵn từ AI Model API. Bạn chỉ cần set parameters đúng cách.
            </div>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Tự tích hợp (Your Code)
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600 mb-3">
              <li>
                <strong>Token Counting:</strong> Sử dụng tiktoken library để đếm tokens trước khi gọi LLM
              </li>
              <li>
                <strong>Semantic Caching:</strong> Cache responses dựa trên semantic similarity (embeddings + cosine similarity)
              </li>
              <li>
                <strong>Model Selection:</strong> Strategy pattern để chọn model phù hợp (GPT-3.5 vs GPT-4)
              </li>
              <li>
                <strong>Cost Tracking:</strong> Track cost per user, endpoint, model để identify cost drivers
              </li>
              <li>
                <strong>Cost Alerts:</strong> Set alerts khi vượt daily/monthly budget
              </li>
            </ul>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
              <strong>Lưu ý:</strong> Token counting, semantic caching, model selection, và cost tracking là phần bạn phải tự implement. AI Model API chỉ có prompt caching (Claude) và batch API (OpenAI).
            </div>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Kết hợp cả hai
            </Title>
            <Paragraph className="text-gray-700 leading-relaxed mb-3">
              Trong production, bạn <strong>luôn kết hợp</strong> cả AI Model API và tự tích hợp:
            </Paragraph>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {`// 1. Tự tích hợp: Token counting
const tokenCount = countTokens(prompt, 'gpt-4');
const estimatedCost = calculateCost('gpt-4', tokenCount);

// 2. Tự tích hợp: Semantic cache check
const cachedResponse = await semanticCache.get(query);
if (cachedResponse) {
  return cachedResponse; // Tiết kiệm 100% cost
}

// 3. Tự tích hợp: Model selection
const model = selectModel(taskComplexity); // GPT-3.5 hoặc GPT-4

// 4. AI Model API: Gọi với prompt caching (Claude)
const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet',
  system: [{
    type: 'text',
    text: systemPrompt,
    cache_control: { type: 'ephemeral' } // API feature - tiết kiệm 90%
  }],
  messages: [...],
});

// 5. Tự tích hợp: Cost tracking
await costTracker.track({
  userId,
  model,
  tokens: response.usage,
  cost: calculateCost(model, response.usage),
});

// 6. Tự tích hợp: Update cache
await semanticCache.set(query, response);`}
              </pre>
            </div>
            <Alert
              description="Tự tích hợp optimize cost trước và sau LLM call (token counting, caching, model selection), AI Model API cung cấp prompt caching và batch API. Kết hợp cả hai để giảm cost tối đa."
              type="info"
              showIcon
              className="mt-3"
            />
          </div>
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
              Token Management
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Luôn set max_tokens:</strong> Tránh response quá dài gây tốn tiền
              </li>
              <li>
                <strong>Đếm tokens trước:</strong> Sử dụng tiktoken để đếm chính xác
              </li>
              <li>
                <strong>Monitor token usage:</strong> Track tokens per request để optimize
              </li>
            </ul>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Caching Strategies
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Semantic caching:</strong> Cache responses cho queries tương tự
              </li>
              <li>
                <strong>Prompt caching:</strong> Dùng Claude prompt caching cho system prompts dài
              </li>
              <li>
                <strong>TTL hợp lý:</strong> Set TTL phù hợp để balance freshness và cost
              </li>
            </ul>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Model Selection
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Chọn model phù hợp:</strong> Simple tasks → GPT-3.5, Complex → GPT-4
              </li>
              <li>
                <strong>Analyze complexity:</strong> Tự động phân tích task complexity
              </li>
              <li>
                <strong>Cost vs Quality:</strong> Balance giữa cost và quality requirements
              </li>
            </ul>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Cost Monitoring
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Track per user/endpoint:</strong> Identify cost drivers
              </li>
              <li>
                <strong>Set alerts:</strong> Alert khi vượt daily/monthly budget
              </li>
              <li>
                <strong>Analyze trends:</strong> Phân tích cost trends để optimize
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Divider className="mb-4" />

      <Alert
        description="Cost optimization là một phần quan trọng của production AI systems. Chi phí có thể phình to rất nhanh nếu không được kiểm soát. Sử dụng các kỹ thuật token counting, caching, và model selection để giảm thiểu cost trong khi vẫn đảm bảo chất lượng."
        type="info"
        showIcon
      />
    </div>
  );
}

