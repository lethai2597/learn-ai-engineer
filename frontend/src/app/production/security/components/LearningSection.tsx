"use client";

import { Typography, Divider, Alert, Tag } from "antd";

const { Title, Paragraph } = Typography;

export function LearningSection() {
  const concepts = [
    {
      title: "Prompt Injection Detection",
      description:
        "Phát hiện các attempts để override system prompts hoặc inject malicious instructions. Sử dụng regex patterns để detect các suspicious patterns như 'ignore previous instructions', 'system: you are', hoặc role change attempts.",
      useCases: [
        "Phát hiện prompt injection attempts trước khi gửi đến LLM",
        "Block malicious prompts để bảo vệ system prompts",
        "Log và alert khi detect injection attempts",
        "Validate user input trước khi process",
      ],
      example: `const dangerousPatterns = [
  /ignore\\s+(previous|all)\\s+instructions?/i,
  /system\\s*:?\\s*you\\s+are/i,
  /\\[SYSTEM\\]/i,
  /new\\s+role/i,
  /forget\\s+everything/i,
];

function detectPromptInjection(input: string): boolean {
  return dangerousPatterns.some(pattern => pattern.test(input));
}

if (detectPromptInjection(userInput)) {
  return { error: 'Invalid request' };
}`,
    },
    {
      title: "Content Moderation",
      description:
        "Kiểm tra nội dung có vi phạm không (hate, harassment, self-harm, sexual, violence). Sử dụng keyword matching và scoring để identify harmful content. Có thể tích hợp với OpenAI Moderation API hoặc custom rules.",
      useCases: [
        "Moderate user-generated content trước khi hiển thị",
        "Block harmful content để bảo vệ users",
        "Flag content cho review nếu cần",
        "Track moderation stats để improve",
      ],
      example: `async function moderateContent(text: string): Promise<boolean> {
  const moderation = await openai.moderations.create({
    input: text,
  });
  
  const result = moderation.results[0];
  
  if (result.flagged) {
    console.log('Flagged categories:', result.categories);
    return false;
  }
  
  return true;
}`,
    },
    {
      title: "PII Detection & Redaction",
      description:
        "Phát hiện và xóa thông tin cá nhân (PII) như email, phone, SSN, credit card, IP address. Sử dụng regex patterns để detect và redact PII từ text. Giúp bảo vệ privacy và tuân thủ GDPR/CCPA.",
      useCases: [
        "Detect PII trong user input trước khi lưu",
        "Redact PII từ logs và responses",
        "Protect sensitive data trong production",
        "Comply với privacy regulations",
      ],
      example: `async function redactPII(text: string): Promise<string> {
  const patterns = [
    { type: 'EMAIL', pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/g, replacement: '<EMAIL>' },
    { type: 'PHONE', pattern: /(\\+?\\d{1,3}[-.\\s]?)?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}/g, replacement: '<PHONE>' },
    { type: 'SSN', pattern: /\\b\\d{3}-\\d{2}-\\d{4}\\b/g, replacement: '<SSN>' },
  ];
  
  let redactedText = text;
  for (const { pattern, replacement } of patterns) {
    redactedText = redactedText.replace(pattern, replacement);
  }
  
  return redactedText;
}`,
    },
    {
      title: "Rate Limiting",
      description:
        "Giới hạn số requests per user/IP để tránh abuse và DDoS attacks. Sử dụng sliding window hoặc token bucket algorithm. Track requests per identifier (IP, user ID) trong time window.",
      useCases: [
        "Giới hạn số requests per user/IP",
        "Tránh abuse và DDoS attacks",
        "Protect API endpoints khỏi overuse",
        "Fair usage enforcement",
      ],
      example: `import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
});

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'anonymous';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return new Response('Too many requests', { status: 429 });
  }
  
  // Process request...
}`,
    },
    {
      title: "System Prompt Protection",
      description:
        "Bảo vệ system prompts khỏi injection bằng cách tách biệt system prompt và user input. Không bao giờ concatenate user input vào system prompt. Sử dụng separate messages cho system và user.",
      useCases: [
        "Tách biệt system prompt và user input",
        "Không concatenate user input vào system prompt",
        "Validate system prompt không bị modify",
        "Use separate message roles",
      ],
      example: `// ❌ Bad: User input directly in system prompt
const systemPrompt = \`You are a helpful assistant. \${userRole}\`;

// ✅ Good: Separate user input from system
const systemPrompt = 'You are a helpful assistant.';
const userMessage = \`User role: \${userRole}\\n\\nUser query: \${userQuery}\`;

const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage },
  ],
});`,
    },
  ];

  const designPatterns = [
    {
      pattern: "Decorator Pattern",
      description:
        "Security decorators wrap requests với security checks. Mỗi security check là một decorator có thể wrap LLM calls. Dễ dàng thêm/bỏ security checks mà không sửa core logic.",
      example: "SecurityDecorator.wrap(llmCall) → Checked call with security validation",
    },
    {
      pattern: "Chain of Responsibility",
      description:
        "Security checks chain - mỗi check có thể pass hoặc block request. Prompt injection check → Content moderation → PII detection → Rate limit. Nếu một check fail, request bị block.",
      example: "SecurityChain.check(request) → Pass through all checks or block at first failure",
    },
    {
      pattern: "Strategy Pattern",
      description:
        "Different security strategies per endpoint type. Public endpoints có strict rate limiting, internal endpoints có relaxed limits. Dễ dàng thay đổi strategy mà không sửa core logic.",
      example: "SecurityStrategy.select(endpointType) → Appropriate security checks",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <Title level={3} className="mb-4 text-xl">
          Vị trí trong kiến trúc tổng thể
        </Title>
        <Paragraph className="text-gray-700 leading-relaxed mb-4">
          Security được implement ở <strong>Backend API layer</strong> như một middleware layer trước khi request đến LLM API. Đây là lớp bảo vệ đầu tiên để ngăn chặn các threats như prompt injection, harmful content, và abuse.
        </Paragraph>
        <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-4">
          <div className="text-gray-700 text-sm font-mono mb-2">
            Flow: User Request → Security Middleware → (Validation) → LLM API → (Moderation) → Response
          </div>
          <ol className="list-decimal list-inside space-y-2 text-gray-600 text-sm mt-3">
            <li>
              <strong>User Request:</strong> User gửi input đến Backend API
            </li>
            <li>
              <strong>Security Middleware:</strong> Kiểm tra prompt injection, PII detection, rate limiting
            </li>
            <li>
              <strong>Validation:</strong> Nếu pass, request được forward đến LLM API
            </li>
            <li>
              <strong>LLM API:</strong> Xử lý request và trả về response
            </li>
            <li>
              <strong>Content Moderation:</strong> Kiểm tra response có harmful content không
            </li>
            <li>
              <strong>Response:</strong> Trả về safe response cho user
            </li>
            </ol>
        </div>
        <Alert
          description="Security không phải là feature của LLM API. Bạn phải implement security checks ở backend middleware để bảo vệ application khỏi các threats."
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
                          ? "red"
                          : index === 1
                          ? "orange"
                          : index === 2
                          ? "blue"
                          : index === 3
                          ? "green"
                          : "purple"
                      }
                    >
                      {index === 0
                        ? "Injection"
                        : index === 1
                        ? "Moderation"
                        : index === 2
                        ? "PII"
                        : index === 3
                        ? "Rate Limit"
                        : "Protection"}
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
          Security là sự kết hợp giữa <strong>AI Model API</strong> (content moderation) và <strong>tự tích hợp</strong> (prompt injection detection, PII detection, rate limiting). Hiểu rõ phần nào từ API và phần nào tự implement giúp bạn xây dựng security layer đúng cách.
        </Paragraph>
        <div className="space-y-4">
          <div>
            <Title level={4} className="mb-2">
              AI Model API (OpenAI/Anthropic)
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600 mb-3">
              <li>
                <strong>Moderation API:</strong> <code className="bg-gray-100 px-1 rounded">openai.moderations.create()</code> - Kiểm tra harmful content (hate, harassment, self-harm, sexual, violence)
              </li>
              <li>
                <strong>Output:</strong> Flagged status và categories
              </li>
            </ul>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              <strong>Lưu ý:</strong> Moderation API là tính năng có sẵn từ OpenAI. Bạn chỉ cần gọi API với text input, sẽ nhận được moderation result.
            </div>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Tự tích hợp (Your Code)
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600 mb-3">
              <li>
                <strong>Prompt Injection Detection:</strong> Regex patterns để detect suspicious patterns (ignore previous instructions, system: you are, etc.)
              </li>
              <li>
                <strong>PII Detection & Redaction:</strong> Regex patterns để detect và redact PII (email, phone, SSN, credit card)
              </li>
              <li>
                <strong>Rate Limiting:</strong> Sliding window hoặc token bucket algorithm để giới hạn requests
              </li>
              <li>
                <strong>System Prompt Protection:</strong> Tách biệt system prompt và user input
              </li>
              <li>
                <strong>Security Chain:</strong> Chain of Responsibility pattern để combine multiple security checks
              </li>
            </ul>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
              <strong>Lưu ý:</strong> Prompt injection detection, PII detection, và rate limiting là phần bạn phải tự implement. AI Model API chỉ có Moderation API, không có các tính năng khác.
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
                {`// 1. Tự tích hợp: Prompt injection detection
if (detectPromptInjection(userInput)) {
  return { error: 'Invalid request' };
}

// 2. Tự tích hợp: PII detection và redaction
const redactedInput = redactPII(userInput);

// 3. Tự tích hợp: Rate limiting
const { success } = await ratelimit.limit(userId);
if (!success) {
  return { error: 'Too many requests' };
}

// 4. AI Model API: Content moderation (optional, có thể dùng sau)
const moderation = await openai.moderations.create({
  input: redactedInput, // API feature
});

if (moderation.results[0].flagged) {
  return { error: 'Content flagged' };
}

// 5. Gọi LLM API với safe input
const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: systemPrompt }, // Tự tích hợp: Tách biệt
    { role: 'user', content: redactedInput },
  ],
});

// 6. AI Model API: Moderation cho response (optional)
const responseModeration = await openai.moderations.create({
  input: response.choices[0].message.content, // API feature
});`}
              </pre>
            </div>
            <Alert
              description="Tự tích hợp detect và block threats trước khi gọi LLM, AI Model API moderate content. Kết hợp cả hai để có security layer toàn diện."
              type="warning"
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
              Input Validation
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Luôn validate input:</strong> Check prompt injection, PII, và harmful content trước khi process
              </li>
              <li>
                <strong>Use multiple layers:</strong> Combine pattern matching với ML-based detection
              </li>
              <li>
                <strong>Log security events:</strong> Track và alert khi detect suspicious activity
              </li>
            </ul>
          </div>
          <div>
            <Title level={4} className="mb-2">
              System Prompt Protection
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Tách biệt system và user:</strong> Không bao giờ concatenate user input vào system prompt
              </li>
              <li>
                <strong>Use message roles:</strong> Separate system, user, và assistant messages
              </li>
              <li>
                <strong>Validate system prompt:</strong> Ensure system prompt không bị modify
              </li>
            </ul>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Rate Limiting
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Set appropriate limits:</strong> Balance giữa usability và security
              </li>
              <li>
                <strong>Use sliding window:</strong> More fair than fixed window
              </li>
              <li>
                <strong>Track per identifier:</strong> IP, user ID, hoặc API key
              </li>
            </ul>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Privacy & Compliance
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Detect và redact PII:</strong> Protect sensitive data trong logs và responses
              </li>
              <li>
                <strong>Comply với regulations:</strong> GDPR, CCPA, và other privacy laws
              </li>
              <li>
                <strong>Minimize data collection:</strong> Chỉ collect data cần thiết
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Divider className="mb-4" />

      <Alert
        description="Security là một phần quan trọng của production AI systems. Prompt injection, data leakage, và abuse có thể gây ra serious issues. Sử dụng các kỹ thuật detection, moderation, và rate limiting để bảo vệ application và users."
        type="warning"
        showIcon
      />
    </div>
  );
}




