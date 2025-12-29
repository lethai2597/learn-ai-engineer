"use client";

import { Typography, Divider, Table, Tag, Alert } from "antd";

const { Title, Paragraph } = Typography;

export function LearningSection() {
  const concepts = [
    {
      title: "LangSmith",
      description:
        "Tracing platform tự động track tất cả LangChain calls. Xem được prompt, response, tokens, latency trên dashboard.",
      useCases: [
        "Auto-tracing khi dùng LangChain (chỉ cần set env vars)",
        "View traces trên dashboard để debug",
        "Track prompts, responses, và metadata",
        "Phân tích performance và errors",
      ],
      example: `// Setup trong .env
LANGSMITH_ENABLED=true
LANGCHAIN_API_KEY=your-api-key
LANGCHAIN_PROJECT=learn-ai

// Tự động trace khi dùng LangChain
const chain = prompt | llm | outputParser;
const result = await chain.invoke({ input: "..." });
// Tự động logged trên LangSmith dashboard`,
    },
    {
      title: "Helicone",
      description:
        "Proxy service track tất cả OpenAI requests. Xem cost, latency, tokens theo user/endpoint trên dashboard.",
      useCases: [
        "Cost tracking và analytics",
        "Monitor usage theo user/endpoint",
        "Debug OpenAI API calls",
        "View request/response logs",
      ],
      example: `// Sử dụng HeliconeService
const openai = heliconeService.createOpenAIClient(userId);

// Tất cả requests tự động tracked
const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [...]
});
// Tự động tracked trên Helicone dashboard`,
    },
    {
      title: "Custom Logging",
      description:
        "In-memory logging với query và stats. Track cost, tokens, latency, errors theo user/endpoint.",
      useCases: [
        "Query logs theo user, model, date range",
        "View stats: total cost, calls, latency",
        "Debug errors và failed requests",
        "Analyze cost per model/endpoint",
      ],
      example: `// Query logs
GET /api/v1/observability/logs?userId=123&model=gpt-4

// Get stats
GET /api/v1/observability/stats

// Response
{
  "totalCalls": 150,
  "totalCost": 12.45,
  "totalTokens": 45000,
  "averageLatency": 1250,
  "byModel": {
    "gpt-4o": { "calls": 100, "cost": 8.50 }
  }
}`,
    },
  ];

  const toolsComparison = [
    {
      key: "1",
      feature: "Tracing",
      langsmith: "Có (auto với LangChain)",
      helicone: "Có (cho OpenAI)",
      custom: "Có (manual)",
    },
    {
      key: "2",
      feature: "Cost Tracking",
      langsmith: "Có",
      helicone: "Có (chi tiết)",
      custom: "Có (tính toán)",
    },
    {
      key: "3",
      feature: "Dashboard",
      langsmith: "Có (web UI)",
      helicone: "Có (web UI)",
      custom: "Không (API only)",
    },
    {
      key: "4",
      feature: "Setup",
      langsmith: "Dễ (env vars)",
      helicone: "Dễ (proxy client)",
      custom: "Dễ (built-in)",
    },
    {
      key: "5",
      feature: "Use case tốt nhất",
      langsmith: "LangChain apps",
      helicone: "OpenAI direct calls",
      custom: "Custom analytics",
    },
  ];

  const comparisonColumns = [
    {
      title: "Đặc điểm",
      dataIndex: "feature",
      key: "feature",
      className: "font-medium",
    },
    {
      title: "LangSmith",
      dataIndex: "langsmith",
      key: "langsmith",
    },
    {
      title: "Helicone",
      dataIndex: "helicone",
      key: "helicone",
    },
    {
      title: "Custom Logging",
      dataIndex: "custom",
      key: "custom",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <Title level={3} className="mb-4 text-xl">
          Vị trí trong kiến trúc tổng thể
        </Title>
        <Paragraph className="text-gray-700 leading-relaxed mb-4">
          Observability được implement ở <strong>Backend API layer</strong> như một monitoring layer bao quanh LLM API calls. Đây là lớp theo dõi để debug, analyze performance, và track cost trong production.
        </Paragraph>
        <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-4">
          <div className="text-gray-700 text-sm font-mono mb-2">
            Flow: Request → Observability Layer (Logging/Tracing) → LLM API → Observability Layer (Track Response) → Response
          </div>
          <ol className="list-decimal list-inside space-y-2 text-gray-600 text-sm mt-3">
            <li>
              <strong>Request:</strong> User request đến Backend API
            </li>
            <li>
              <strong>Observability Layer:</strong> Log request, start trace, track metadata
            </li>
            <li>
              <strong>LLM API:</strong> Gọi LLM API (có thể qua proxy như Helicone)
            </li>
            <li>
              <strong>Observability Layer:</strong> Track response, calculate cost, log errors
            </li>
            <li>
              <strong>Response:</strong> Trả về response và update observability data
            </li>
            <li>
              <strong>Dashboard:</strong> View logs, traces, và analytics trên dashboard
            </li>
          </ol>
        </div>
        <Alert
          description="Observability không phải là feature của LLM API. Bạn phải implement logging, tracing, và cost tracking ở backend hoặc dùng third-party tools như LangSmith/Helicone."
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
                        index === 0 ? "blue" : index === 1 ? "green" : "purple"
                      }
                    >
                      {index === 0
                        ? "Tracing"
                        : index === 1
                        ? "Cost Tracking"
                        : "Logging"}
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
          Bảng so sánh Tools
        </Title>
        <Table
          dataSource={toolsComparison}
          columns={comparisonColumns}
          pagination={false}
          bordered
        />
      </div>

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          AI Model API vs Tự tích hợp
        </Title>
        <Paragraph className="text-gray-700 leading-relaxed mb-4">
          Observability có thể được implement bằng <strong>third-party tools</strong> (LangSmith, Helicone) hoặc <strong>tự tích hợp</strong> (custom logging). Hiểu rõ phần nào dùng tool và phần nào tự implement giúp bạn chọn approach phù hợp.
        </Paragraph>
        <div className="space-y-4">
          <div>
            <Title level={4} className="mb-2">
              Third-party Tools (LangSmith/Helicone)
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600 mb-3">
              <li>
                <strong>LangSmith:</strong> Auto-tracing cho LangChain apps, web dashboard, cost tracking
              </li>
              <li>
                <strong>Helicone:</strong> Proxy service cho OpenAI, auto-tracking tất cả requests, web dashboard
              </li>
              <li>
                <strong>Setup:</strong> Chỉ cần set env vars hoặc wrap client
              </li>
            </ul>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              <strong>Lưu ý:</strong> LangSmith và Helicone là third-party services, không phải AI Model API. Chúng tự động track LLM calls và cung cấp dashboard.
            </div>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Tự tích hợp (Your Code)
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600 mb-3">
              <li>
                <strong>Custom Logging:</strong> In-memory logging với query và stats
              </li>
              <li>
                <strong>Cost Tracking:</strong> Tính toán cost dựa trên tokens và model pricing
              </li>
              <li>
                <strong>Error Tracking:</strong> Log errors và failed requests
              </li>
              <li>
                <strong>Analytics API:</strong> Query logs theo user, model, date range
              </li>
              <li>
                <strong>Stats Calculation:</strong> Total cost, calls, latency, by model/endpoint
              </li>
            </ul>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
              <strong>Lưu ý:</strong> Custom logging và analytics là phần bạn phải tự implement. Không có built-in observability từ AI Model API.
            </div>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Kết hợp cả hai
            </Title>
            <Paragraph className="text-gray-700 leading-relaxed mb-3">
              Trong production, bạn có thể <strong>dùng third-party tools</strong> hoặc <strong>tự implement</strong>, hoặc kết hợp cả hai:
            </Paragraph>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {`// Option 1: Dùng third-party tool (LangSmith)
// Setup: Set env vars
LANGSMITH_ENABLED=true
LANGCHAIN_API_KEY=your-api-key

// Tự động trace khi dùng LangChain
const chain = prompt | llm | outputParser;
const result = await chain.invoke({ input: "..." });
// → Tự động logged trên LangSmith dashboard

// Option 2: Dùng third-party tool (Helicone)
const openai = heliconeService.createOpenAIClient(userId);
const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [...]
});
// → Tự động tracked trên Helicone dashboard

// Option 3: Tự tích hợp custom logging
async function callLLM(messages: Message[]) {
  const startTime = Date.now();
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
    });
    
    // Tự tích hợp: Log success
    await logService.log({
      userId,
      model: 'gpt-4o',
      inputTokens: response.usage.prompt_tokens,
      outputTokens: response.usage.completion_tokens,
      cost: calculateCost(response.usage),
      latency: Date.now() - startTime,
      success: true,
    });
    
    return response;
  } catch (error) {
    // Tự tích hợp: Log error
    await logService.log({
      userId,
      model: 'gpt-4o',
      error: error.message,
      latency: Date.now() - startTime,
      success: false,
    });
    throw error;
  }
}`}
              </pre>
            </div>
            <Alert
              description="Third-party tools (LangSmith/Helicone) cung cấp auto-tracking và dashboard, tự tích hợp cho phép custom analytics và control. Chọn approach phù hợp với nhu cầu của bạn."
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
              Khi nào dùng tool nào?
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>LangSmith:</strong> Khi dùng LangChain - auto-tracing rất tiện
              </li>
              <li>
                <strong>Helicone:</strong> Khi gọi OpenAI trực tiếp - cost tracking chi tiết
              </li>
              <li>
                <strong>Custom Logging:</strong> Khi cần query và analyze logs trong app
              </li>
            </ul>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Debug workflow
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>1. Xem logs để biết prompt gửi gì, response nhận gì</li>
              <li>2. Check tokens và cost để optimize</li>
              <li>3. View traces để hiểu flow và tìm bottleneck</li>
              <li>4. Analyze errors và failed requests</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

