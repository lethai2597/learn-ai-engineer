"use client";

import { Typography, Divider, Table, Tag, Alert } from "antd";

const { Title, Paragraph } = Typography;

export function LearningSection() {
  const comparisonData = [
    {
      key: "1",
      model: "Gemini Flash 1.5",
      cost: "$0.075 input / $0.30 output",
      strengths: "Rẻ nhất, nhanh, quality tốt",
      weaknesses: "Kém GPT-4 về reasoning phức tạp",
    },
    {
      key: "2",
      model: "Llama 3 8B Instruct",
      cost: "$0.05 input / $0.15 output",
      strengths: "Rất rẻ, open source",
      weaknesses: "Quality kém hơn các model lớn",
    },
    {
      key: "3",
      model: "Qwen 2.5 7B Instruct",
      cost: "$0.1 input / $0.1 output",
      strengths: "Rẻ, multilingual tốt",
      weaknesses: "Ít phổ biến hơn",
    },
    {
      key: "4",
      model: "GPT-3.5-turbo",
      cost: "$1 input / $2 output",
      strengths: "Nhanh, general tasks",
      weaknesses: "Đắt hơn Gemini Flash",
    },
    {
      key: "5",
      model: "GPT-4o",
      cost: "$2.5 input / $10 output",
      strengths: "Reasoning tốt, complex tasks",
      weaknesses: "Đắt, chậm",
    },
    {
      key: "6",
      model: "Claude 3.5 Sonnet",
      cost: "$3 input / $15 output",
      strengths: "Văn hay, coding, long context",
      weaknesses: "Đắt nhất",
    },
  ];

  const comparisonColumns = [
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      className: "font-medium",
    },
    {
      title: "Cost ($/1M tokens)",
      dataIndex: "cost",
      key: "cost",
    },
    {
      title: "Strengths",
      dataIndex: "strengths",
      key: "strengths",
    },
    {
      title: "Weaknesses",
      dataIndex: "weaknesses",
      key: "weaknesses",
    },
  ];

  const tradeOffsData = [
    {
      key: "1",
      useCase: "High-quality tasks",
      models: "GPT-4o, Claude 3.5",
      reason: "Cần reasoning tốt, chấp nhận chi phí cao",
    },
    {
      key: "2",
      useCase: "Simple tasks (Khuyến nghị)",
      models: "Gemini Flash 1.5, Llama 3 8B",
      reason: "Rẻ nhất, quality đủ tốt cho hầu hết task",
    },
    {
      key: "3",
      useCase: "Latency-sensitive",
      models: "Gemini Flash 1.5, GPT-3.5-turbo",
      reason: "Cần response nhanh với chi phí thấp",
    },
    {
      key: "4",
      useCase: "Budget-conscious",
      models: "Gemini Flash 1.5, Llama 3 8B, Qwen 2.5 7B",
      reason: "Ưu tiên chi phí thấp, vẫn đảm bảo quality cơ bản",
    },
  ];

  const tradeOffsColumns = [
    {
      title: "Use Case",
      dataIndex: "useCase",
      key: "useCase",
      className: "font-medium",
    },
    {
      title: "Models phù hợp",
      dataIndex: "models",
      key: "models",
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <Title level={3} className="mb-4 text-xl">
          So sánh Models phổ biến
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
          Trade-offs: Cost vs Quality vs Speed
        </Title>
        <Table
          dataSource={tradeOffsData}
          columns={tradeOffsColumns}
          pagination={false}
          bordered
        />
      </div>

      <Divider />

      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Title level={4} style={{ marginBottom: 0 }}>
                Local Models với Ollama
              </Title>
              <Tag color="green">Local</Tag>
            </div>
            <Paragraph className="text-gray-700 leading-relaxed">
              Ollama cho phép chạy LLM trên máy local, không cần internet và
              hoàn toàn miễn phí. Phù hợp cho privacy-sensitive applications
              hoặc khi muốn kiểm soát hoàn toàn infrastructure.
            </Paragraph>
          </div>

          <div>
            <Title level={5}>Cài đặt và sử dụng:</Title>
            <div className="bg-gray-50 p-3 rounded border border-gray-100 mt-2">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {`# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Run Llama 3
ollama run llama3

# API call
curl http://localhost:11434/api/generate -d '{
  "model": "llama3",
  "prompt": "Why is the sky blue?"
}'`}
              </pre>
            </div>
          </div>

          <div>
            <Title level={5}>Ưu điểm:</Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Miễn phí hoàn toàn</li>
              <li>Privacy: Data không rời khỏi máy</li>
              <li>Không cần internet sau khi download model</li>
              <li>Kiểm soát hoàn toàn infrastructure</li>
            </ul>
          </div>

          <div>
            <Title level={5}>Nhược điểm:</Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Cần GPU mạnh để chạy tốt</li>
              <li>Quality kém hơn GPT-4/Claude</li>
              <li>Phải tự quản lý infrastructure</li>
            </ul>
          </div>
        </div>
      </div>

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          Dùng 1 Model hay Routing Nhiều Models?
        </Title>
        <div className="space-y-4">
          <div>
            <Title level={4} className="mb-2">
              Thông thường: Routing Nhiều Models (Model Router)
            </Title>
            <Paragraph className="text-gray-700 leading-relaxed mb-3">
              Trong production, bạn <strong>thường dùng Model Router</strong> để tự động chọn model phù hợp cho từng task, giúp tối ưu cost và quality:
            </Paragraph>
            <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-4">
              <div className="bg-white p-3 rounded border border-gray-100">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {`function routeModel(task: string): Model {
  if (isComplexReasoning(task)) {
    return 'gpt-4o'; // Quality cao
  }
  if (isCodeGeneration(task)) {
    return 'gemini-flash-1.5'; // Rẻ, code tốt
  }
  if (isSimpleTask(task)) {
    return 'gemini-flash-1.5'; // Rẻ nhất
  }
  return 'gpt-3.5-turbo'; // Default
}`}
                </pre>
              </div>
            </div>
            <Alert
              description="Model Router giúp tối ưu cost: dùng model rẻ cho task đơn giản, model đắt cho task phức tạp. Có thể tiết kiệm 50-70% chi phí so với dùng GPT-4 cho mọi task."
              type="info"
              showIcon
              className="mb-4"
            />
          </div>

          <div>
            <Title level={4} className="mb-2">
              Khi nào chỉ dùng 1 Model?
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Prototype/MVP:</strong> Dùng 1 model (GPT-3.5 hoặc Gemini Flash) để test nhanh
              </li>
              <li>
                <strong>Simple application:</strong> Tất cả tasks đều đơn giản, không cần routing
              </li>
              <li>
                <strong>Budget không giới hạn:</strong> Dùng GPT-4 cho mọi task (không khuyến nghị)
              </li>
              <li>
                <strong>Consistency requirement:</strong> Cần output consistent từ cùng 1 model
              </li>
            </ul>
          </div>

          <div>
            <Title level={4} className="mb-2">
              Best Practices cho Model Router
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Start simple:</strong> Bắt đầu với 1 model, thêm routing khi cần
              </li>
              <li>
                <strong>Monitor costs:</strong> Track cost theo model để optimize routing logic
              </li>
              <li>
                <strong>Fallback strategy:</strong> Nếu model chính fail, fallback sang model khác
              </li>
              <li>
                <strong>A/B testing:</strong> Test nhiều models để tìm model tốt nhất cho từng task
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Divider />

      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Title level={4} style={{ marginBottom: 0 }}>
                Model Router Pattern
              </Title>
              <Tag color="blue">Strategy Pattern</Tag>
            </div>
            <Paragraph className="text-gray-700 leading-relaxed">
              Model Router tự động chọn model phù hợp dựa trên task type. Áp
              dụng Strategy Pattern để chọn strategy (model) khác nhau cho từng
              loại task.
            </Paragraph>
          </div>

          <div>
            <Title level={5}>Ví dụ implementation:</Title>
            <div className="bg-gray-50 p-3 rounded border border-gray-100 mt-2">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {`function selectModel(task: string): Model {
  if (isComplexReasoning(task)) return 'gpt-4';
  if (isCodeGeneration(task)) return 'llama3-code';
  return 'gpt-3.5-turbo'; // Default
}`}
              </pre>
            </div>
          </div>

          <div>
            <Title level={5}>Routing logic:</Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Complex reasoning:</strong> Gemini Flash 1.5 (rẻ,
                quality tốt)
              </li>
              <li>
                <strong>Code generation:</strong> Gemini Flash 1.5 (rẻ, code
                tốt)
              </li>
              <li>
                <strong>Long context:</strong> Gemini Flash 1.5 (rẻ, xử lý
                context tốt)
              </li>
              <li>
                <strong>Simple tasks:</strong> Gemini Flash 1.5 (rẻ nhất, nhanh)
              </li>
              <li>
                <strong>Note:</strong> Router ưu tiên model rẻ để tiết kiệm chi
                phí test
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}





