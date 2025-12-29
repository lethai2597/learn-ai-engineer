"use client";

import { Typography, Divider, Alert, Tag } from "antd";

const { Title, Paragraph } = Typography;

export function LearningSection() {
  const concepts = [
    {
      title: "Function Calling Flow",
      description:
        "Flow cơ bản của function calling: User query → LLM quyết định gọi function → Execute function → LLM trả về kết quả cuối cùng. Đây là cách biến AI từ 'người tư vấn' thành 'trợ lý thực thi'.",
      useCases: [
        "User: 'Gửi email cho Nam' → LLM calls sendEmail function → Execute → LLM: 'Đã gửi email thành công!'",
        "User: 'Tính 15 + 27' → LLM calls calculate function → Execute → LLM: 'Kết quả là 42'",
        "User: 'Thời tiết Hà Nội?' → LLM calls getWeather function → Execute → LLM: 'Hà Nội đang nắng, 28°C'",
      ],
      example: `User: "Gửi email cho Nam nội dung: Họp lúc 3PM"
  ↓
LLM returns: {
  function: "sendEmail",
  arguments: { to: "nam@example.com", subject: "Meeting", body: "Họp lúc 3PM" }
}
  ↓
Your Code: Execute sendEmail(...)
  ↓
LLM: "Đã gửi email thành công!"`,
    },
    {
      title: "Define Functions với OpenAI",
      description:
        "Định nghĩa function schemas theo format OpenAI. Bao gồm: name, description (rõ ràng, có ví dụ), và parameters (type, properties, required). Description tốt giúp LLM hiểu khi nào nên gọi function.",
      useCases: [
        "Calculator tool: add, subtract, multiply, divide",
        "Weather tool: get weather by city",
        "Email tool: send email with to, subject, body",
        "Search tool: search web with query",
      ],
      example: `const tools = [
  {
    type: 'function',
    function: {
      name: 'sendEmail',
      description: 'Send an email to a recipient. Use this when user wants to send, forward, or compose email.',
      parameters: {
        type: 'object',
        properties: {
          to: { type: 'string', description: 'Email address' },
          subject: { type: 'string' },
          body: { type: 'string' },
        },
        required: ['to', 'body'],
      },
    },
  },
];

const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [...],
  tools,
});

if (response.choices[0].message.tool_calls) {
  const toolCall = response.choices[0].message.tool_calls[0];
  const args = JSON.parse(toolCall.function.arguments);
  await sendEmail(args.to, args.subject, args.body);
}`,
    },
    {
      title: "Best Practices cho Function Descriptions",
      description:
        "Function descriptions phải rõ ràng, có ví dụ, và mô tả chi tiết parameters. Description tốt giúp LLM hiểu chính xác khi nào và cách sử dụng function.",
      useCases: [
        "Rõ ràng: Mô tả chính xác function làm gì",
        "Ví dụ: Đưa ví dụ trong description",
        "Parameters: Mô tả chi tiết từng parameter",
        "Context: Giải thích khi nào nên dùng function này",
      ],
      example: `❌ Bad:
description: "Send email"

✅ Good:
description: "Send an email to a recipient. Use this when user wants to send, forward, or compose email. Example: 'Gửi email cho Nam' sẽ gọi function này với to='nam@example.com'."

❌ Bad:
parameters: {
  city: { type: 'string' }
}

✅ Good:
parameters: {
  city: {
    type: 'string',
    description: 'Tên thành phố. Hỗ trợ: Hà Nội, TP.HCM, Đà Nẵng và các tên tiếng Anh tương ứng'
  }
}`,
    },
    {
      title: "Multiple Tools & Tool Registry",
      description:
        "Assistant có thể có nhiều tools khác nhau. Sử dụng Registry Pattern để quản lý và lookup tools động. Áp dụng Factory Pattern để tạo tool instances dựa trên function name.",
      useCases: [
        "Assistant với calculator, weather, time, search tools",
        "Dynamic tool lookup và execution",
        "Tool registry cho extensibility",
      ],
      example: `const tools = [
  searchWebTool,
  sendEmailTool,
  createCalendarEventTool,
  queryDatabaseTool,
];

class ToolRegistry {
  private tools: Map<string, Tool> = new Map();
  
  register(tool: Tool) { ... }
  execute(name: string, args: any) { ... }
}

const registry = new ToolRegistry();
tools.forEach(tool => registry.register(tool));

const result = await registry.execute(functionName, args);`,
    },
  ];

  const designPatterns = [
    {
      pattern: "Command Pattern",
      description: "Tool calls được xử lý như commands. Mỗi tool call là một command có thể execute.",
      example: "toolCall.execute(args) → Command execution",
    },
    {
      pattern: "Strategy Pattern",
      description: "Mỗi tool là một strategy khác nhau. LLM chọn strategy (tool) phù hợp dựa trên user query.",
      example: "Calculator tool vs Weather tool vs Search tool",
    },
    {
      pattern: "Factory Pattern",
      description: "Tool factory để tạo tool instances dựa trên function name. Registry sử dụng factory để lookup tools.",
      example: "registry.get(functionName) → Factory creates tool instance",
    },
    {
      pattern: "Registry Pattern",
      description: "Tool registry để lookup tools động. Cho phép register và execute tools một cách linh hoạt.",
      example: "ToolRegistry.register(tool) → ToolRegistry.execute(name, args)",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <Title level={3} className="mb-4 text-xl">
          Vị trí trong kiến trúc tổng thể
        </Title>
        <Paragraph className="text-gray-700 leading-relaxed mb-4">
          Function Calling được implement ở <strong>Backend API layer</strong> trong một Agent system. Đây là lớp xử lý giữa LLM và các tools/functions, cho phép AI thực thi các tác vụ cụ thể thay vì chỉ tư vấn.
        </Paragraph>
        <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-4">
          <div className="text-gray-700 text-sm font-mono mb-2">
            Flow: User Query → Backend API → LLM API (với tools) → Tool Registry → Execute Tool → LLM API (với result) → Final Response
          </div>
          <ol className="list-decimal list-inside space-y-2 text-gray-600 text-sm mt-3">
            <li>
              <strong>User Query:</strong> User gửi request với yêu cầu cần thực thi
            </li>
            <li>
              <strong>Backend API:</strong> Nhận query, chuẩn bị tools definitions
            </li>
            <li>
              <strong>LLM API:</strong> Gọi với <code className="bg-gray-100 px-1 rounded">tools</code> parameter, LLM quyết định gọi function nào
            </li>
            <li>
              <strong>Tool Registry:</strong> Lookup và execute function dựa trên function name
            </li>
            <li>
              <strong>Execute Tool:</strong> Thực thi function với arguments từ LLM
            </li>
            <li>
              <strong>LLM API (lần 2):</strong> Gửi tool result về LLM để generate final response
            </li>
          </ol>
        </div>
        <Alert
          description="Function Calling không chỉ là feature của LLM API. Bạn cần implement Tool Registry, execution logic, và error handling để có Agent system hoàn chỉnh."
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
                        : "purple"
                    }
                  >
                    {index === 0
                      ? "Flow"
                      : index === 1
                      ? "Definition"
                      : index === 2
                      ? "Best Practices"
                      : "Multiple Tools"}
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
        <div className="space-y-6">
          {designPatterns.map((item, index) => (
            <div
              key={index}
              className={index === 0 ? "" : "border-t border-gray-100 pt-6"}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Title level={5} style={{ marginBottom: 0 }}>
                    {item.pattern}
                  </Title>
                  <Tag color="cyan">Pattern</Tag>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {item.description}
                </p>
                <div className="bg-gray-50 p-2 rounded border border-gray-100">
                  <code className="text-sm text-gray-700">{item.example}</code>
                </div>
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
          Function Calling là sự kết hợp giữa <strong>AI Model API</strong> (function definition và tool calling) và <strong>tự tích hợp</strong> (tool registry, execution logic, error handling). Hiểu rõ phần nào từ API và phần nào tự implement giúp bạn xây dựng Agent system đúng cách.
        </Paragraph>
        <div className="space-y-4">
          <div>
            <Title level={4} className="mb-2">
              AI Model API (OpenAI/Anthropic)
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600 mb-3">
              <li>
                <strong>Tools Parameter:</strong> <code className="bg-gray-100 px-1 rounded">tools</code> array - Định nghĩa function schemas
              </li>
              <li>
                <strong>Tool Calling:</strong> LLM tự động quyết định gọi function nào và với arguments gì
              </li>
              <li>
                <strong>Tool Calls Response:</strong> API trả về <code className="bg-gray-100 px-1 rounded">tool_calls</code> array với function name và arguments
              </li>
            </ul>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              <strong>Lưu ý:</strong> Function definition và tool calling là tính năng có sẵn từ AI Model API. Bạn chỉ cần định nghĩa tools, LLM sẽ tự động quyết định khi nào và cách gọi.
            </div>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Tự tích hợp (Your Code)
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600 mb-3">
              <li>
                <strong>Tool Registry:</strong> Quản lý và lookup tools dựa trên function name
              </li>
              <li>
                <strong>Tool Execution:</strong> Thực thi function với arguments từ LLM
              </li>
              <li>
                <strong>Error Handling:</strong> Xử lý lỗi khi tool execution fail
              </li>
              <li>
                <strong>Validation:</strong> Validate arguments trước khi execute tool
              </li>
              <li>
                <strong>Multi-turn Conversation:</strong> Quản lý conversation flow với multiple tool calls
              </li>
            </ul>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
              <strong>Lưu ý:</strong> Tool registry, execution logic, và error handling là phần bạn phải tự implement. AI Model API chỉ quyết định gọi function, không thực thi function.
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
                {`// 1. Tự tích hợp: Định nghĩa tools và registry
const tools = [calculatorTool, weatherTool, emailTool];
const registry = new ToolRegistry();
tools.forEach(tool => registry.register(tool));

// 2. AI Model API: Gọi với tools parameter
const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [...],
  tools, // API feature - LLM quyết định gọi tool nào
});

// 3. Tự tích hợp: Execute tools từ tool_calls
if (response.choices[0].message.tool_calls) {
  for (const toolCall of response.choices[0].message.tool_calls) {
    const tool = registry.get(toolCall.function.name);
    const args = JSON.parse(toolCall.function.arguments);
    const result = await tool.execute(args); // Tự tích hợp
    
    // 4. AI Model API: Gửi result về LLM
    await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        ...previousMessages,
        { role: 'tool', content: result }, // API feature
      ],
    });
  }
}`}
              </pre>
            </div>
            <Alert
              description="AI Model API quyết định gọi function nào, tự tích hợp thực thi function và quản lý flow. Kết hợp cả hai để có Agent system mạnh mẽ và reliable."
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
              Function Descriptions
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Rõ ràng:</strong> Mô tả chính xác function làm gì, không mơ hồ
              </li>
              <li>
                <strong>Ví dụ:</strong> Đưa ví dụ trong description để LLM hiểu context
              </li>
              <li>
                <strong>Parameters:</strong> Mô tả chi tiết từng parameter, bao gồm format và constraints
              </li>
              <li>
                <strong>Context:</strong> Giải thích khi nào nên dùng function này
              </li>
            </ul>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Error Handling
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Try-catch cho tool execution:</strong> Xử lý lỗi khi tool fail
              </li>
              <li>
                <strong>Fallback logic:</strong> Có fallback khi tool không thể execute
              </li>
              <li>
                <strong>Validation:</strong> Validate arguments trước khi execute tool
              </li>
            </ul>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Tool Registry Pattern
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Registry Pattern:</strong> Centralized tool management, dễ extend
              </li>
              <li>
                <strong>Factory Pattern:</strong> Dynamic tool creation dựa trên function name
              </li>
              <li>
                <strong>Type Safety:</strong> Strong typing cho tool arguments và responses
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Divider className="mb-4" />

      <Alert
        description="Function Calling là một trong những tính năng mạnh mẽ nhất của LLM. Nó cho phép AI không chỉ tư vấn mà còn thực thi các tác vụ cụ thể. Tuy nhiên, cần cẩn thận với security - chỉ cho phép LLM gọi các functions an toàn và validate tất cả arguments."
        type="info"
        showIcon
      />
    </div>
  );
}

