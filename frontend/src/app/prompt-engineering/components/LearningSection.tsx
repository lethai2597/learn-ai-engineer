"use client";

import { Typography, Divider, Table, Alert } from "antd";
import { TechniqueCard } from "./TechniqueCard";
import { PromptTechnique } from "@/types/prompt-engineering";

const { Title, Paragraph } = Typography;

/**
 * LearningSection Component
 * Hiển thị phần lý thuyết về các kỹ thuật Prompt Engineering
 *
 * Design Pattern: Masonry Layout
 * - Cards được sắp xếp tự nhiên như gạch, chiều cao khác nhau
 * - Comparison table để so sánh nhanh
 * - Minimal design: border-based, không shadow
 */
export function LearningSection() {
  // Cùng 1 vấn đề: Phân loại tài liệu/ghi chú trong kho tri thức
  const DOCUMENT = "Ghi chú về meeting với team về architecture design của hệ thống RAG. Đã thảo luận về vector database, chunking strategy, và embedding models.";

  const techniques = [
    {
      technique: PromptTechnique.ZERO_SHOT,
      title: "Zero-shot Prompting",
      description:
        "Hỏi AI trực tiếp không cần ví dụ mẫu. Kỹ thuật này dựa vào khả năng hiểu ngữ cảnh tự nhiên của LLM.",
      useCases: [
        "Các task đơn giản, rõ ràng",
        "Câu hỏi thông thường",
        "Translation, summarization cơ bản",
      ],
      example: `Phân loại tài liệu/ghi chú sau: "${DOCUMENT}"`,
    },
    {
      technique: PromptTechnique.FEW_SHOT,
      title: "Few-shot Prompting",
      description:
        "Đưa 2-5 ví dụ mẫu trước khi hỏi để AI học pattern và format mong muốn. Giúp cải thiện độ chính xác đáng kể.",
      useCases: [
        "Classification với nhiều categories",
        "Format output cụ thể (JSON, XML, etc.)",
        "Task cần pattern rõ ràng",
      ],
      example: `Tài liệu 1: "Ghi chú về meeting với team về architecture design" → Meeting Summary
Tài liệu 2: "Vector databases là công nghệ lưu trữ và tìm kiếm dữ liệu" → Learning Material
Tài liệu 3: "Best practices cho prompt engineering: 1) Be specific" → Technical Note

Phân loại tài liệu sau: "${DOCUMENT}" → ?`,
    },
    {
      technique: PromptTechnique.CHAIN_OF_THOUGHT,
      title: "Chain-of-Thought (CoT)",
      description:
        'Bảo AI "hãy suy nghĩ từng bước" để giải quyết vấn đề phức tạp. Kỹ thuật này giúp AI reasoning tốt hơn.',
      useCases: [
        "Logic phức tạp, toán học",
        "Reasoning, suy luận",
        "Bài toán nhiều bước",
      ],
      example: `Phân loại tài liệu/ghi chú sau: "${DOCUMENT}"

Hãy suy nghĩ từng bước:
1. Đọc nội dung tài liệu
2. Xác định từ khóa quan trọng
3. Phân loại vào một trong các category: Technical Note, Meeting Summary, Learning Material, Reference`,
    },
    {
      technique: PromptTechnique.ROLE,
      title: "Role Prompting",
      description:
        'Gán vai trò cụ thể cho AI: "Bạn là chuyên gia..." để chuyên môn hóa câu trả lời theo ngữ cảnh.',
      useCases: [
        "Chuyên môn hóa câu trả lời",
        "Tone và style cụ thể",
        "Domain-specific knowledge",
      ],
      example: `chuyên gia phân loại tài liệu trong kho tri thức với 10 năm kinh nghiệm

Phân loại tài liệu sau: "${DOCUMENT}"`,
    },
  ];

  const comparisonData = [
    {
      key: "1",
      feature: "Cần ví dụ mẫu",
      zeroShot: "Không",
      fewShot: "Có (2-5 ví dụ)",
      chainOfThought: "Không",
      role: "Không",
    },
    {
      key: "2",
      feature: "Độ phức tạp",
      zeroShot: "Đơn giản",
      fewShot: "Trung bình",
      chainOfThought: "Phức tạp",
      role: "Đơn giản",
    },
    {
      key: "3",
      feature: "Use case tốt nhất",
      zeroShot: "Task đơn giản",
      fewShot: "Classification, Format",
      chainOfThought: "Reasoning, Logic",
      role: "Chuyên môn hóa",
    },
    {
      key: "4",
      feature: "Độ chính xác",
      zeroShot: "Trung bình",
      fewShot: "Cao",
      chainOfThought: "Cao (với logic)",
      role: "Trung bình-Cao",
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
      title: "Zero-shot",
      dataIndex: "zeroShot",
      key: "zeroShot",
    },
    {
      title: "Few-shot",
      dataIndex: "fewShot",
      key: "fewShot",
    },
    {
      title: "Chain-of-Thought",
      dataIndex: "chainOfThought",
      key: "chainOfThought",
    },
    {
      title: "Role-based",
      dataIndex: "role",
      key: "role",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        {techniques.map((tech) => (
          <div key={tech.technique}>
            <TechniqueCard {...tech} />
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
          Dùng 1 Technique hay Kết hợp Nhiều Techniques?
        </Title>
        <div className="space-y-4">
          <div>
            <Title level={4} className="mb-2">
              Thông thường: Kết hợp nhiều Techniques
            </Title>
            <Paragraph className="text-gray-700 leading-relaxed mb-3">
              Khác với Memory Management, trong Prompt Engineering bạn <strong>thường kết hợp nhiều techniques</strong> trong cùng một prompt để đạt kết quả tốt nhất:
            </Paragraph>
            <div className="space-y-3 mb-4">
              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <Title level={5} className="mb-2">
                  Ví dụ: Role + Few-shot + Chain-of-Thought
                </Title>
                <div className="bg-white p-3 rounded border border-gray-100">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                    {`Bạn là chuyên gia phân loại tài liệu trong kho tri thức với 10 năm kinh nghiệm.

Ví dụ:
Tài liệu 1: "Ghi chú về meeting với team về architecture design" → Meeting Summary
Tài liệu 2: "Vector databases là công nghệ lưu trữ và tìm kiếm dữ liệu" → Learning Material
Tài liệu 3: "Best practices cho prompt engineering: 1) Be specific" → Technical Note

Phân loại tài liệu sau: "Ghi chú về meeting với team về architecture design của hệ thống RAG. Đã thảo luận về vector database, chunking strategy, và embedding models."

Hãy suy nghĩ từng bước:
1. Đọc nội dung tài liệu
2. Xác định từ khóa quan trọng
3. So sánh với các ví dụ
4. Phân loại vào category phù hợp`}
                  </pre>
                </div>
                <Paragraph className="text-gray-600 text-sm mt-2 mb-4">
                  Kết hợp: <strong>Role</strong> (chuyên gia) + <strong>Few-shot</strong> (ví dụ) + <strong>Chain-of-Thought</strong> (suy nghĩ từng bước)
                </Paragraph>
              </div>
            </div>
            <Alert
              description="Kết hợp techniques giúp cải thiện độ chính xác đáng kể. Ví dụ: Role + Few-shot thường tốt hơn chỉ dùng Few-shot đơn thuần."
              type="info"
              showIcon
              className="mb-4"
            />
          </div>

          <div>
            <Title level={4} className="mb-2">
              Khi nào chỉ dùng 1 Technique?
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Zero-shot:</strong> Task đơn giản, không cần ví dụ hoặc reasoning phức tạp
              </li>
              <li>
                <strong>Few-shot:</strong> Khi chỉ cần format cụ thể, không cần role hoặc CoT
              </li>
              <li>
                <strong>Role:</strong> Khi chỉ cần tone/style, không cần ví dụ
              </li>
            </ul>
          </div>

          <div>
            <Title level={4} className="mb-2">
              Best Practices cho Kết hợp Techniques
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Role + Few-shot:</strong> Phổ biến nhất, cải thiện accuracy đáng kể
              </li>
              <li>
                <strong>Role + Chain-of-Thought:</strong> Cho complex reasoning tasks
              </li>
              <li>
                <strong>Few-shot + Chain-of-Thought:</strong> Cho classification với logic phức tạp
              </li>
              <li>
                <strong>Rule of thumb:</strong> Bắt đầu với Role + Few-shot, thêm CoT nếu cần reasoning
              </li>
            </ul>
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
              Prompt Structure
            </Title>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {`1. Role/Context (nếu cần)
2. Task description
3. Few-shot examples (nếu cần)
4. Chain-of-Thought instructions (nếu cần)
5. Actual input/question`}
              </pre>
            </div>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Tips để có Prompt tốt
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Be specific:</strong> Mô tả rõ ràng output mong muốn
              </li>
              <li>
                <strong>Use examples:</strong> Few-shot examples giúp AI hiểu pattern
              </li>
              <li>
                <strong>Break down complex tasks:</strong> Dùng Chain-of-Thought cho multi-step tasks
              </li>
              <li>
                <strong>Iterate và test:</strong> Test prompt với nhiều inputs khác nhau
              </li>
              <li>
                <strong>Monitor token usage:</strong> Few-shot và CoT tốn nhiều tokens hơn
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}




