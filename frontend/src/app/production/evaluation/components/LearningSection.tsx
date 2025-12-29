"use client";

import { Typography, Divider, Table, Tag, Alert } from "antd";

const { Title, Paragraph } = Typography;

export function LearningSection() {
  const concepts = [
    {
      title: "Golden Dataset",
      description:
        "Bộ test cases với input và expected output chuẩn. Đây là 'ground truth' để đo lường chất lượng LLM output.",
      useCases: [
        "Tạo 10-20 test cases đại diện cho use cases thực tế",
        "Bao gồm cả easy cases và hard cases",
        "Thêm metadata (category, difficulty) để phân tích chi tiết",
      ],
      example: `const goldenDataset = [
  {
    id: "1",
    input: "What's the capital of France?",
    expected: "Paris",
    metadata: { category: "geography", difficulty: "easy" }
  },
  {
    id: "2",
    input: "Explain quantum computing",
    expected: "Quantum computing uses...",
    metadata: { category: "tech", difficulty: "hard" }
  }
];`,
    },
    {
      title: "Evaluation Metrics",
      description:
        "Các phương pháp đo lường chất lượng output. Mỗi metric phù hợp với use case khác nhau.",
      useCases: [
        "Exact Match: Khi cần output chính xác từng ký tự",
        "Contains: Khi chỉ cần output chứa keywords quan trọng",
        "LLM-as-a-Judge: Khi cần đánh giá chất lượng phức tạp (accuracy, completeness, clarity)",
      ],
      example: `// Exact Match: output === expected
// Contains: output.includes(expected)
// LLM-as-a-Judge: GPT-4 chấm điểm 1-10 dựa trên rubric`,
    },
    {
      title: "LLM-as-a-Judge",
      description:
        "Dùng LLM (thường là GPT-4) để chấm điểm output dựa trên rubric. Phù hợp cho các task phức tạp không thể đo bằng exact match.",
      useCases: [
        "Đánh giá chất lượng câu trả lời dài",
        "Đánh giá dựa trên nhiều tiêu chí (accuracy, completeness, clarity)",
        "Khi expected output có nhiều cách diễn đạt đúng",
      ],
      example: `Rubric: "Rate based on: Accuracy (40%), Completeness (30%), Clarity (30%)"

Question: [input]
Expected: [expected]
Actual: [actual]

Score (1-10):`,
    },
  ];

  const metricsComparison = [
    {
      key: "1",
      feature: "Độ chính xác",
      exactMatch: "Cao (100% match)",
      contains: "Trung bình (chỉ cần có keywords)",
      llmJudge: "Cao (đánh giá toàn diện)",
    },
    {
      key: "2",
      feature: "Tốc độ",
      exactMatch: "Rất nhanh",
      contains: "Rất nhanh",
      llmJudge: "Chậm (cần gọi LLM)",
    },
    {
      key: "3",
      feature: "Chi phí",
      exactMatch: "Miễn phí",
      contains: "Miễn phí",
      llmJudge: "Có phí (tốn tokens)",
    },
    {
      key: "4",
      feature: "Use case tốt nhất",
      exactMatch: "Output cố định, cần chính xác",
      contains: "Chỉ cần keywords quan trọng",
      llmJudge: "Output phức tạp, cần đánh giá chất lượng",
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
      title: "Exact Match",
      dataIndex: "exactMatch",
      key: "exactMatch",
    },
    {
      title: "Contains",
      dataIndex: "contains",
      key: "contains",
    },
    {
      title: "LLM-as-a-Judge",
      dataIndex: "llmJudge",
      key: "llmJudge",
    },
  ];

  return (
    <div className="space-y-8">
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
                        ? "Dataset"
                        : index === 1
                        ? "Metrics"
                        : "LLM Judge"}
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
          Bảng so sánh Metrics
        </Title>
        <Table
          dataSource={metricsComparison}
          columns={comparisonColumns}
          pagination={false}
          bordered
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
              Khi nào dùng metric nào?
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Exact Match:</strong> Khi output cần chính xác (ví dụ: mã code, số liệu)
              </li>
              <li>
                <strong>Contains:</strong> Khi chỉ cần keywords quan trọng (ví dụ: classification)
              </li>
              <li>
                <strong>LLM-as-a-Judge:</strong> Khi cần đánh giá chất lượng phức tạp (ví dụ: essay, explanation)
              </li>
            </ul>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Tạo Golden Dataset
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Bắt đầu với 10-20 test cases đại diện</li>
              <li>Bao gồm cả easy và hard cases</li>
              <li>Thêm metadata để phân tích chi tiết</li>
              <li>Update dataset thường xuyên khi có edge cases mới</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

