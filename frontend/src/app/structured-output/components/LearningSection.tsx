"use client";

import { Typography, Divider, Table, Tag, Alert } from "antd";

const { Title, Paragraph } = Typography;

/**
 * LearningSection Component
 * Hiển thị phần lý thuyết về Structured Output
 *
 * Design Pattern: Masonry Layout
 * - Cards được sắp xếp tự nhiên như gạch, chiều cao khác nhau
 * - Comparison table để so sánh nhanh
 * - Minimal design: border-based, không shadow
 */
export function LearningSection() {
  const concepts = [
    {
      title: "JSON Mode",
      description:
        "JSON Mode đảm bảo LLM trả về output là JSON hợp lệ bằng cách sử dụng `response_format: { type: 'json_object' }`. Đây là cách đơn giản nhất để có structured output.",
      useCases: [
        "Khi chỉ cần JSON hợp lệ, không cần type safety chặt chẽ",
        "Khi schema đơn giản, không phức tạp",
        "Khi muốn implementation nhanh",
      ],
      example: `// Request
{
  "model": "gpt-4o",
  "messages": [...],
  "response_format": { "type": "json_object" }
}

// Response
{
  "name": "John Doe",
  "age": 30,
  "skills": ["TypeScript", "React"]
}`,
    },
    {
      title: "Function Calling",
      description:
        "Function Calling sử dụng `tools` parameter để định nghĩa function schema chặt chẽ. LLM sẽ gọi function với arguments đúng format, đảm bảo type safety tốt hơn.",
      useCases: [
        "Khi cần type safety chặt chẽ",
        "Khi schema phức tạp với nested objects",
        "Khi muốn tích hợp với existing function system",
      ],
      example: `// Request
{
  "model": "gpt-4o",
  "messages": [...],
  "tools": [{
    "type": "function",
    "function": {
      "name": "extract_person",
      "parameters": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "age": { "type": "number" }
        }
      }
    }
  }]
}

// Response
{
  "tool_calls": [{
    "function": {
      "name": "extract_person",
      "arguments": "{\\"name\\":\\"John\\",\\"age\\":30}"
    }
  }]
}`,
    },
    {
      title: "Zod Schema",
      description:
        "Zod là TypeScript-first schema validation library. Cho phép định nghĩa schema một cách type-safe và validate data runtime. Có thể convert Zod schema sang JSON Schema cho Function Calling.",
      useCases: [
        "Định nghĩa schema type-safe trong TypeScript",
        "Validate data từ LLM response",
        "Convert schema giữa các formats (Zod ↔ JSON Schema)",
      ],
      example: `import { z } from 'zod';

// Định nghĩa schema
const PersonSchema = z.object({
  name: z.string(),
  age: z.number().int().positive(),
  skills: z.array(z.string()),
  email: z.string().email().optional(),
});

// Validate data
const data = PersonSchema.parse(jsonResponse);

// Type inference
type Person = z.infer<typeof PersonSchema>;`,
    },
  ];

  const comparisonData = [
    {
      key: "1",
      feature: "Độ đơn giản",
      jsonMode: "Đơn giản",
      functionCalling: "Phức tạp hơn",
      zod: "Trung bình",
    },
    {
      key: "2",
      feature: "Type Safety",
      jsonMode: "Thấp (chỉ JSON hợp lệ)",
      functionCalling: "Cao (schema chặt chẽ)",
      zod: "Cao (TypeScript + runtime)",
    },
    {
      key: "3",
      feature: "Validation",
      jsonMode: "Không có",
      functionCalling: "Có (từ LLM)",
      zod: "Có (runtime validation)",
    },
    {
      key: "4",
      feature: "Use case tốt nhất",
      jsonMode: "Schema đơn giản, nhanh",
      functionCalling: "Schema phức tạp, type-safe",
      zod: "Validation và type safety",
    },
    {
      key: "5",
      feature: "Error handling",
      jsonMode: "Parse errors",
      functionCalling: "Tool call errors",
      zod: "Validation errors chi tiết",
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
      title: "JSON Mode",
      dataIndex: "jsonMode",
      key: "jsonMode",
    },
    {
      title: "Function Calling",
      dataIndex: "functionCalling",
      key: "functionCalling",
    },
    {
      title: "Zod",
      dataIndex: "zod",
      key: "zod",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <Title level={3} className="mb-4 text-xl">
          Vị trí trong kiến trúc tổng thể
        </Title>
        <Paragraph className="text-gray-700 leading-relaxed mb-4">
          Structured Output được sử dụng ở <strong>Backend API layer</strong> trong một ứng dụng AI. Đây là lớp xử lý giữa frontend và LLM API, có nhiệm vụ đảm bảo dữ liệu trả về từ LLM có format chuẩn và type-safe.
        </Paragraph>
        <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-4">
          <div className="text-gray-700 text-sm font-mono mb-2">
            Flow: Frontend → Backend API → LLM API (với structured output) → Validation Layer (Zod) → Typed Response → Frontend
          </div>
          <ol className="list-decimal list-inside space-y-2 text-gray-600 text-sm mt-3">
            <li>
              <strong>Frontend:</strong> Gửi request với user input
            </li>
            <li>
              <strong>Backend API:</strong> Nhận request, chuẩn bị prompt và schema
            </li>
            <li>
              <strong>LLM API:</strong> Gọi với JSON Mode hoặc Function Calling để đảm bảo output có format
            </li>
            <li>
              <strong>Validation Layer:</strong> Validate response với Zod schema để đảm bảo type safety
            </li>
            <li>
              <strong>Response:</strong> Trả về typed data cho frontend
            </li>
          </ol>
        </div>
        <Alert
          description="Structured Output không phải là feature của frontend hay database, mà là logic xử lý ở backend để đảm bảo LLM trả về data có cấu trúc và có thể validate được."
          type="info"
          showIcon
        />
      </div>

      <Divider />

      {/* Masonry Layout */}
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
                        ? "JSON Mode"
                        : index === 1
                        ? "Function Calling"
                        : "Zod"}
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

      {/* Comparison Table */}
      <div>
        <Title level={3} className="mb-4 text-xl">
          Bảng so sánh nhanh
        </Title>
        <Table
          dataSource={comparisonData}
          columns={comparisonColumns}
          pagination={false}
          bordered
        />
      </div>

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          Dùng 1 Method hay Kết hợp Nhiều Methods?
        </Title>
        <div className="space-y-4">
          <div>
            <Title level={4} className="mb-2">
              Thông thường: Kết hợp JSON Mode + Zod
            </Title>
            <Paragraph className="text-gray-700 leading-relaxed mb-3">
              Trong production, bạn <strong>thường kết hợp JSON Mode với Zod</strong> để có cả JSON hợp lệ và type-safe validation:
            </Paragraph>
            <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-4">
              <div className="bg-white p-3 rounded border border-gray-100">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {`// 1. Dùng JSON Mode để đảm bảo JSON hợp lệ
const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [...],
  response_format: { type: 'json_object' }
});

// 2. Dùng Zod để validate và type-safe
const PersonSchema = z.object({
  name: z.string(),
  age: z.number().int().positive(),
});

const data = PersonSchema.parse(JSON.parse(response));`}
                </pre>
              </div>
              <Paragraph className="text-gray-600 text-sm mt-2 mb-4">
                Kết hợp: <strong>JSON Mode</strong> (đảm bảo JSON hợp lệ) + <strong>Zod</strong> (validate và type-safe)
              </Paragraph>
            </div>
            <Alert
              description="JSON Mode đảm bảo output là JSON hợp lệ, Zod đảm bảo data đúng schema và type-safe. Kết hợp cả hai cho production-ready code."
              type="info"
              showIcon
              className="mb-4"
            />
          </div>

          <div>
            <Title level={4} className="mb-2">
              Function Calling: Dùng riêng hoặc với Zod
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Function Calling đơn thuần:</strong> Khi schema đơn giản, không cần validation phức tạp
              </li>
              <li>
                <strong>Function Calling + Zod:</strong> Khi cần validate nested objects, optional fields, hoặc custom validation rules
              </li>
              <li>
                <strong>Rule of thumb:</strong> Function Calling cho schema definition, Zod cho runtime validation
              </li>
            </ul>
          </div>

          <div>
            <Title level={4} className="mb-2">
              Workflow khuyến nghị
            </Title>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {`1. Định nghĩa Zod schema (type-safe)
2. Convert Zod → JSON Schema (cho Function Calling hoặc JSON Mode)
3. Gọi LLM với JSON Mode hoặc Function Calling
4. Parse response với Zod để validate
5. Sử dụng typed data trong code`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          AI Model API vs Tự tích hợp
        </Title>
        <Paragraph className="text-gray-700 leading-relaxed mb-4">
          Structured Output là sự kết hợp giữa <strong>AI Model API</strong> (đảm bảo format) và <strong>tự tích hợp</strong> (validation và type safety). Hiểu rõ phần nào từ API và phần nào tự implement giúp bạn thiết kế hệ thống đúng cách.
        </Paragraph>
        <div className="space-y-4">
          <div>
            <Title level={4} className="mb-2">
              AI Model API (OpenAI/Anthropic)
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600 mb-3">
              <li>
                <strong>JSON Mode:</strong> <code className="bg-gray-100 px-1 rounded">response_format: {`{ type: 'json_object' }`}</code> - Đảm bảo output là JSON hợp lệ
              </li>
              <li>
                <strong>Function Calling:</strong> <code className="bg-gray-100 px-1 rounded">tools</code> parameter - Định nghĩa function schema và LLM sẽ gọi function với arguments đúng format
              </li>
              <li>
                <strong>Model capability:</strong> LLM tự động tuân theo format được yêu cầu
              </li>
            </ul>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              <strong>Lưu ý:</strong> JSON Mode và Function Calling là tính năng có sẵn từ AI Model API. Bạn chỉ cần set parameters đúng cách, LLM sẽ tự động trả về format mong muốn.
            </div>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Tự tích hợp (Your Code)
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600 mb-3">
              <li>
                <strong>Zod Schema Definition:</strong> Định nghĩa schema type-safe trong TypeScript
              </li>
              <li>
                <strong>Validation Logic:</strong> Validate data từ LLM response với Zod
              </li>
              <li>
                <strong>Error Handling:</strong> Xử lý validation errors, parse errors, và type mismatches
              </li>
              <li>
                <strong>Schema Conversion:</strong> Convert Zod schema sang JSON Schema (cho Function Calling)
              </li>
              <li>
                <strong>Type Inference:</strong> Tạo TypeScript types từ Zod schema
              </li>
            </ul>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
              <strong>Lưu ý:</strong> Zod và validation logic là phần bạn phải tự implement. AI Model API chỉ đảm bảo format, không đảm bảo data đúng schema hoặc type-safe.
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
                {`// 1. Tự tích hợp: Định nghĩa Zod schema
const PersonSchema = z.object({
  name: z.string(),
  age: z.number().int().positive(),
});

// 2. AI Model API: Gọi với JSON Mode
const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [...],
  response_format: { type: 'json_object' } // API feature
});

// 3. Tự tích hợp: Validate với Zod
const data = PersonSchema.parse(JSON.parse(response.choices[0].message.content));
// → Type-safe, validated data`}
              </pre>
            </div>
            <Alert
              description="AI Model API đảm bảo JSON hợp lệ, Zod đảm bảo data đúng schema và type-safe. Kết hợp cả hai cho production-ready code."
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
              Khi nào dùng method nào?
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>JSON Mode:</strong> Schema đơn giản, cần implementation nhanh
              </li>
              <li>
                <strong>Function Calling:</strong> Schema phức tạp, cần type safety từ LLM
              </li>
              <li>
                <strong>Zod:</strong> Luôn nên dùng để validate và type-safe (kết hợp với JSON Mode hoặc Function Calling)
              </li>
            </ul>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Error Handling
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>JSON Mode:</strong> Catch JSON.parse() errors, validate với Zod
              </li>
              <li>
                <strong>Function Calling:</strong> Check tool_calls array, validate arguments với Zod
              </li>
              <li>
                <strong>Zod:</strong> Dùng try-catch với .parse() hoặc .safeParse() để handle validation errors
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}





