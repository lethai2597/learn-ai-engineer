"use client";

import { Typography, Divider, Alert, Tag, Table } from "antd";

const { Title, Paragraph } = Typography;

export function LearningSection() {
  const hardwareRequirements = [
    {
      modelSize: "7B (Llama 3 8B)",
      vram: "8GB",
      quality: "Tốt",
      speed: "Nhanh",
    },
    {
      modelSize: "13B (Llama 2 13B)",
      vram: "16GB",
      quality: "Rất tốt",
      speed: "Trung bình",
    },
    {
      modelSize: "70B (Llama 2 70B)",
      vram: "80GB",
      quality: "Xuất sắc",
      speed: "Chậm",
    },
  ];

  const modelComparison = [
    {
      model: "Llama 3 8B",
      size: "8GB",
      strengths: "General purpose, fast",
      bestFor: "Chatbots, QA",
    },
    {
      model: "Mistral 7B",
      size: "8GB",
      strengths: "Multilingual, good at coding",
      bestFor: "International apps",
    },
    {
      model: "CodeLlama 7B",
      size: "8GB",
      strengths: "Code generation",
      bestFor: "Developer tools",
    },
    {
      model: "Llama 3 70B",
      size: "80GB",
      strengths: "GPT-4 level quality",
      bestFor: "High-end tasks",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div>
          <div className="border border-gray-200 rounded-lg p-6 bg-white hover:border-gray-300 transition-colors">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Title level={4} style={{ marginBottom: 0 }}>
                    Tại sao chạy Local?
                  </Title>
                  <Tag color="blue">Privacy</Tag>
                </div>
                <div className="space-y-3">
                  <div>
                    <Title level={5} className="mb-2">
                      Ưu điểm:
                    </Title>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>
                        <strong>Privacy:</strong> Dữ liệu không rời khỏi server
                      </li>
                      <li>
                        <strong>Cost:</strong> Miễn phí sau khi setup (không giới hạn requests)
                      </li>
                      <li>
                        <strong>Latency:</strong> Không phụ thuộc internet
                      </li>
                      <li>
                        <strong>Compliance:</strong> Đáp ứng yêu cầu GDPR, HIPAA
                      </li>
                    </ul>
                  </div>
                  <div>
                    <Title level={5} className="mb-2">
                      Nhược điểm:
                    </Title>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>Cần GPU mạnh (8GB+ VRAM)</li>
                      <li>Chất lượng kém hơn GPT-4</li>
                      <li>Khó scale</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="border border-gray-200 rounded-lg p-6 bg-white hover:border-gray-300 transition-colors">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Title level={4} style={{ marginBottom: 0 }}>
                    Hardware Requirements
                  </Title>
                  <Tag color="green">Setup</Tag>
                </div>
                <Paragraph className="text-gray-700 leading-relaxed">
                  Model size quyết định VRAM cần thiết. Models nhỏ hơn (7B-13B) chạy tốt trên consumer GPUs, models lớn (70B+) cần server-grade GPUs.
                </Paragraph>
                <div className="mt-4">
                  <Table
                    dataSource={hardwareRequirements}
                    rowKey="modelSize"
                    columns={[
                      { title: "Model Size", dataIndex: "modelSize", key: "modelSize" },
                      { title: "VRAM Required", dataIndex: "vram", key: "vram" },
                      { title: "Quality", dataIndex: "quality", key: "quality" },
                      { title: "Speed", dataIndex: "speed", key: "speed" },
                    ]}
                    pagination={false}
                    size="small"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="border border-gray-200 rounded-lg p-6 bg-white hover:border-gray-300 transition-colors">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Title level={4} style={{ marginBottom: 0 }}>
                    Setup Ollama
                  </Title>
                  <Tag color="orange">Tool</Tag>
                </div>
                <Paragraph className="text-gray-700 leading-relaxed">
                  Ollama là cách đơn giản nhất để chạy local models. Hỗ trợ nhiều models và có API tương thích với OpenAI format.
                </Paragraph>
                <div className="mt-4">
                  <Title level={5}>Installation:</Title>
                  <div className="bg-gray-50 p-3 rounded border border-gray-100 mt-2">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                      {`# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Download model
ollama pull llama3         # 8B model
ollama pull llama3:70b     # 70B model
ollama pull mistral        # Mistral 7B
ollama pull codellama      # Code specialist

# Run as API server
ollama serve`}
                    </pre>
                  </div>
                </div>
                <div className="mt-4">
                  <Title level={5}>API Usage:</Title>
                  <div className="bg-gray-50 p-3 rounded border border-gray-100 mt-2">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                      {`async function callOllama(prompt: string): Promise<string> {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3',
      prompt: prompt,
      stream: false,
    }),
  });
  
  const data = await response.json();
  return data.response;
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="border border-gray-200 rounded-lg p-6 bg-white hover:border-gray-300 transition-colors">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Title level={4} style={{ marginBottom: 0 }}>
                    Quantization (Giảm VRAM)
                  </Title>
                  <Tag color="purple">Optimization</Tag>
                </div>
                <Paragraph className="text-gray-700 leading-relaxed">
                  Quantization giảm precision của model để giảm VRAM requirements. Trade-off giữa quality và memory usage.
                </Paragraph>
                <div className="mt-4">
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>
                      <strong>Q4:</strong> 4-bit quantization - Fast, 8GB VRAM, quality OK
                    </li>
                    <li>
                      <strong>Q8:</strong> 8-bit - Slower, 16GB VRAM, quality excellent
                    </li>
                    <li>
                      <strong>FP16:</strong> Full precision - Slowest, 32GB VRAM, quality best
                    </li>
                  </ul>
                </div>
                <div className="mt-4">
                  <div className="bg-gray-50 p-3 rounded border border-gray-100">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                      {`// Q4: 4-bit quantization
ollama pull llama3:q4

// Q8: 8-bit
ollama pull llama3:q8

// FP16: Full precision
ollama pull llama3:fp16`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          Model Comparison
        </Title>
        <Table
          dataSource={modelComparison}
          rowKey="model"
          columns={[
            { title: "Model", dataIndex: "model", key: "model" },
            { title: "Size", dataIndex: "size", key: "size" },
            { title: "Strengths", dataIndex: "strengths", key: "strengths" },
            { title: "Best For", dataIndex: "bestFor", key: "bestFor" },
          ]}
          pagination={false}
          size="small"
        />
      </div>

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          Design Patterns
        </Title>
        <div className="space-y-4">
          <div>
            <Title level={4} className="mb-2">
              Adapter Pattern
            </Title>
            <Paragraph className="text-gray-700 leading-relaxed">
              Adapt Ollama API (khác format với OpenAI) thành OpenAI-compatible interface. Cho phép code sử dụng local models giống như cloud APIs.
            </Paragraph>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Singleton Pattern
            </Title>
            <Paragraph className="text-gray-700 leading-relaxed">
              Single model instance trong service để tối ưu memory usage và đảm bảo consistency.
            </Paragraph>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Factory Pattern
            </Title>
            <Paragraph className="text-gray-700 leading-relaxed">
              Model factory cho different use cases. Có thể mở rộng để support nhiều providers (Ollama, vLLM, llama.cpp).
            </Paragraph>
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
              Hardware Requirements
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>VRAM:</strong> Minimum 8GB cho 7B models, 16GB+ cho 13B models
              </li>
              <li>
                <strong>CPU:</strong> Modern CPU với nhiều cores cho tốt hơn
              </li>
              <li>
                <strong>Storage:</strong> Models lớn (70B) cần 40GB+ disk space
              </li>
            </ul>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Model Selection
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>7B-8B models:</strong> Tốt cho most use cases, chạy nhanh trên consumer GPUs
              </li>
              <li>
                <strong>13B models:</strong> Better quality, cần VRAM nhiều hơn
              </li>
              <li>
                <strong>70B+ models:</strong> GPT-4 level quality, chỉ dùng khi thực sự cần
              </li>
            </ul>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Performance Optimization
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Quantization:</strong> Dùng Q4/Q8 để giảm VRAM nếu quality đủ
              </li>
              <li>
                <strong>Context size:</strong> Giảm context size nếu không cần để tăng speed
              </li>
              <li>
                <strong>Batch processing:</strong> Process nhiều requests cùng lúc để tăng throughput
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Alert
        description="Local models phù hợp cho use cases cần privacy cao hoặc cost optimization. Tuy nhiên, cần hardware mạnh và chất lượng có thể kém hơn cloud models. Chỉ dùng khi thực sự cần local deployment."
        type="info"
        showIcon
        className="mb-4"
      />
    </div>
  );
}




