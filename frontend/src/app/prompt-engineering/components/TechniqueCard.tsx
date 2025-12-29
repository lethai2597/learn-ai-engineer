"use client";

import { Typography, Tag } from "antd";
import { PromptTechnique, PromptTechniqueLabels } from "@/types/prompt-engineering";

const { Title, Paragraph } = Typography;

interface TechniqueCardProps {
  technique: PromptTechnique;
  title: string;
  description: string;
  useCases: string[];
  example?: string;
}

/**
 * TechniqueCard Component
 * Hiển thị thông tin lý thuyết về một kỹ thuật prompting
 * 
 * Design Pattern: Presentational Component
 * - Minimal design: border thay vì shadow
 * - Clean spacing và typography
 */
export function TechniqueCard({
  technique,
  title,
  description,
  useCases,
  example,
}: TechniqueCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white hover:border-gray-300 transition-colors">
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Title level={4} style={{ marginBottom: 0 }}>
              {title}
            </Title>
            <Tag color="blue">
              {PromptTechniqueLabels[technique]}
            </Tag>
          </div>
          <Paragraph className="text-gray-700 leading-relaxed">
            {description}
          </Paragraph>
        </div>

        <div>
          <Title level={5}>
            Use Cases:
          </Title>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            {useCases.map((useCase, index) => (
              <li key={index}>{useCase}</li>
            ))}
          </ul>
        </div>

        {example && (
          <div>
            <Title level={5}>
              Ví dụ:
            </Title>
            <div className="bg-gray-50 p-3 rounded border border-gray-100">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {example}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

