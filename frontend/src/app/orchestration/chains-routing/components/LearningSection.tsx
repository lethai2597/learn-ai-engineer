"use client";

import { Typography, Divider, Table, Alert, Tag } from "antd";

const { Title, Paragraph } = Typography;

export function LearningSection() {
  const concepts = [
    {
      title: "Simple Chain",
      description:
        "Xử lý tuần tự qua nhiều bước, output của bước trước là input của bước sau. Đây là pattern cơ bản nhất cho chains, phù hợp khi bạn cần xử lý data qua nhiều stages.",
      useCases: [
        "Translate → Summarize → Extract keywords",
        "Preprocess → Analyze → Generate report",
        "Any sequential processing pipeline",
      ],
      example: `// Simple Chain: 3 bước tuần tự
const translation = await translateLLM(userInput);
const summary = await summarizeLLM(translation);
const keywords = await extractKeywords(summary);

// Output từng bước:
// Step 1: "Xin chào, bạn khỏe không?"
// Step 2: "Lời chào hỏi thân thiện"
// Step 3: ["chào hỏi", "thân thiện"]`,
    },
    {
      title: "Router Pattern",
      description:
        "Phân loại input và route đến handler phù hợp. Áp dụng Strategy Pattern - chọn strategy (model) dựa trên input. Phù hợp khi bạn có nhiều models và cần chọn model tốt nhất cho từng task.",
      useCases: [
        "Intent classification → Route to appropriate model",
        "Code tasks → Code model, Creative → Creative model",
        "Dynamic model selection based on input",
      ],
      example: `// Router Pattern: Phân loại và route
const intent = await classifyIntent(input);

switch (intent) {
  case 'code':
    return await codeModel(input); // Gemini Flash
  case 'creative':
    return await creativeModel(input); // Claude
  case 'general':
    return await generalModel(input); // GPT-3.5
}

// Flow:
// Input → Classify → Route → Model → Response`,
    },
    {
      title: "Conditional Chains",
      description:
        "Chain có logic điều kiện - một số bước chỉ chạy khi điều kiện thỏa mãn. Phù hợp khi bạn cần xử lý khác nhau tùy vào input (ví dụ: chỉ translate nếu không phải tiếng Anh).",
      useCases: [
        "Detect language → Translate if needed → Process",
        "Check condition → Branch → Process",
        "Multi-path processing based on conditions",
      ],
      example: `// Conditional Chain: Có điều kiện
const language = await detectLanguage(doc);

if (language !== 'en') {
  doc = await translate(doc, 'en');
}

const summary = await summarize(doc);
const entities = await extractEntities(summary);

// Flow:
// Detect → [Condition] → Translate? → Summarize → Extract`,
    },
  ];

  const comparisonData = [
    {
      key: "1",
      feature: "Pattern",
      simpleChain: "Sequential processing",
      router: "Classification → Routing",
      conditional: "Conditional branching",
    },
    {
      key: "2",
      feature: "Design Pattern",
      simpleChain: "Pipeline Pattern",
      router: "Strategy Pattern",
      conditional: "Chain of Responsibility",
    },
    {
      key: "3",
      feature: "Use case tốt nhất",
      simpleChain: "Multi-step processing",
      router: "Dynamic model selection",
      conditional: "Conditional processing",
    },
    {
      key: "4",
      feature: "Độ phức tạp",
      simpleChain: "Đơn giản",
      router: "Trung bình",
      conditional: "Trung bình",
    },
    {
      key: "5",
      feature: "Khi nào dùng",
      simpleChain: "Cần xử lý tuần tự",
      router: "Có nhiều models, cần chọn phù hợp",
      conditional: "Có logic điều kiện",
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
      title: "Simple Chain",
      dataIndex: "simpleChain",
      key: "simpleChain",
    },
    {
      title: "Router Pattern",
      dataIndex: "router",
      key: "router",
    },
    {
      title: "Conditional Chain",
      dataIndex: "conditional",
      key: "conditional",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <Title level={3} className="mb-4 text-xl">
          Vị trí trong kiến trúc tổng thể
        </Title>
        <Paragraph className="text-gray-700 leading-relaxed mb-4">
          Chains & Routing được implement ở <strong>Backend API layer</strong> như một orchestration layer để điều phối nhiều LLM calls và route requests đến handlers/models phù hợp. Đây là lớp logic phức tạp để xử lý multi-step workflows.
        </Paragraph>
        <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-4">
          <div className="text-gray-700 text-sm font-mono mb-2">
            Flow: User Request → Router/Chain → (Multiple LLM Calls) → Response
          </div>
          <div className="space-y-3 mt-3">
            <div>
              <strong className="text-gray-700">Simple Chain:</strong>
              <ol className="list-decimal list-inside space-y-1 text-gray-600 text-sm mt-1 ml-2">
                <li>User request đến Backend API</li>
                <li>Chain xử lý tuần tự: Step 1 → Step 2 → Step 3</li>
                <li>Output của step trước là input của step sau</li>
                <li>Final response được trả về</li>
              </ol>
            </div>
            <div>
              <strong className="text-gray-700">Router Pattern:</strong>
              <ol className="list-decimal list-inside space-y-1 text-gray-600 text-sm mt-1 ml-2">
                <li>User request đến Backend API</li>
                <li>Router phân loại input (intent classification)</li>
                <li>Route đến handler/model phù hợp (GPT-4, Claude, GPT-3.5)</li>
                <li>Handler xử lý và trả về response</li>
              </ol>
            </div>
          </div>
        </div>
        <Alert
          description="Chains & Routing không phải là feature của LLM API. Bạn phải tự implement orchestration logic để điều phối nhiều LLM calls và route requests đến handlers phù hợp."
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
                          ? "green"
                          : index === 1
                          ? "blue"
                          : "orange"
                      }
                    >
                      {index === 0
                        ? "Sequential"
                        : index === 1
                        ? "Routing"
                        : "Conditional"}
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
          Bảng so sánh: Simple Chain vs Router vs Conditional Chain
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
          LangChain LCEL
        </Title>
        <Paragraph className="text-gray-700 leading-relaxed">
          LangChain cung cấp LCEL (LangChain Expression Language) để xây dựng chains một cách declarative.
          Tuy nhiên, với nhiều use cases, code thuần (native TypeScript) dễ hiểu và debug hơn.
        </Paragraph>
        <div className="bg-gray-50 p-4 rounded border border-gray-100 my-4">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
            {`// LangChain LCEL
import { PromptTemplate } from 'langchain/prompts';
import { RunnableSequence } from 'langchain/schema/runnable';

const chain = RunnableSequence.from([
  promptTemplate,
  llm,
  outputParser,
]);

const result = await chain.invoke({ input: '...' });

// Native TypeScript (Khuyến nghị)
const result = await outputParser(
  await llm(await promptTemplate({ input: '...' }))
);`}
          </pre>
        </div>
        <Alert
          description="LangChain có thể phức tạp quá mức. Với nhiều use cases, code thuần (native TypeScript) dễ hiểu và debug hơn. Chỉ dùng LangChain khi thực sự cần features sẵn có (ví dụ: memory integration, tool calling)."
          type="warning"
          showIcon
          className="mb-4"
        />
      </div>

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          Best Practices
        </Title>
        <div className="space-y-4">
          <div>
            <Title level={4} className="mb-2">
              Khi nào dùng pattern nào?
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Simple Chain:</strong> Khi cần xử lý tuần tự qua nhiều bước, output của bước trước là input của bước sau
              </li>
              <li>
                <strong>Router Pattern:</strong> Khi có nhiều models và cần chọn model phù hợp dựa trên input
              </li>
              <li>
                <strong>Conditional Chain:</strong> Khi có logic điều kiện, một số bước chỉ chạy khi điều kiện thỏa mãn
              </li>
            </ul>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Native Code vs LangChain
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Native Code (Khuyến nghị):</strong> Dễ hiểu, dễ debug, không có dependency phức tạp, phù hợp cho hầu hết use cases
              </li>
              <li>
                <strong>LangChain:</strong> Chỉ dùng khi thực sự cần features sẵn có (memory integration, tool calling, complex workflows)
              </li>
              <li>
                <strong>Rule of thumb:</strong> Bắt đầu với native code, chỉ dùng LangChain khi thực sự cần thiết
              </li>
            </ul>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Error Handling
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Try-catch cho từng step:</strong> Xử lý lỗi ở từng bước trong chain
              </li>
              <li>
                <strong>Fallback logic:</strong> Có fallback khi một bước fail
              </li>
              <li>
                <strong>Timeout handling:</strong> Set timeout cho từng LLM call
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

