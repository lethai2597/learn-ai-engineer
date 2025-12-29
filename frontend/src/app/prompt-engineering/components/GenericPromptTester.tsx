"use client";

import { useState } from "react";
import { Form, Input, Button, Alert, Tag } from "antd";
import { useTestPrompt } from "@/hooks/use-prompt-engineering";
import {
  PromptTechnique,
  PromptTechniqueLabels,
  PromptTechniqueDescriptions,
  PromptTextareaRows,
} from "@/types/prompt-engineering";
import { ResultComparison } from "./ResultComparison";
import { ServiceCodeDisplay } from "@/components/ServiceCodeDisplay";

const { TextArea } = Input;

interface ResultItem {
  technique: PromptTechnique;
  response: string;
  isLoading: boolean;
  error?: string;
}

/**
 * Cùng 1 vấn đề: Phân loại tài liệu/ghi chú trong kho tri thức
 * Document: "Ghi chú về meeting với team về architecture design của hệ thống RAG"
 */
const DOCUMENT =
  "Ghi chú về meeting với team về architecture design của hệ thống RAG. Đã thảo luận về vector database, chunking strategy, và embedding models.";

const DEFAULT_PROMPTS: Record<PromptTechnique, string> = {
  [PromptTechnique.ZERO_SHOT]: `Phân loại tài liệu/ghi chú sau: "${DOCUMENT}"`,
  [PromptTechnique.FEW_SHOT]: `Tài liệu 1: "Ghi chú về meeting với team về architecture design" → Meeting Summary
Tài liệu 2: "Vector databases là công nghệ lưu trữ và tìm kiếm dữ liệu dựa trên embeddings" → Learning Material
Tài liệu 3: "Best practices cho prompt engineering: 1) Be specific, 2) Use examples" → Technical Note

Phân loại tài liệu sau: "${DOCUMENT}" → ?`,
  [PromptTechnique.CHAIN_OF_THOUGHT]: `Phân loại tài liệu/ghi chú sau: "${DOCUMENT}"

Hãy suy nghĩ từng bước:
1. Đọc nội dung tài liệu
2. Xác định từ khóa quan trọng
3. Phân loại vào một trong các category: Technical Note, Meeting Summary, Learning Material, Reference`,
  [PromptTechnique.ROLE]: `Đóng vai chuyên gia phân loại tài liệu trong kho tri thức với 10 năm kinh nghiệm

Phân loại tài liệu sau: "${DOCUMENT}"`,
};

export function GenericPromptTester() {
  const [form] = Form.useForm();
  const testPrompt = useTestPrompt();
  const [results, setResults] = useState<ResultItem[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const handleSubmit = async (values: {
    prompts: {
      [key in PromptTechnique]?: string;
    };
    systemMessage?: string;
  }) => {
    // Chỉ lấy các kỹ thuật có prompt được nhập
    const techniquesToTest = Object.values(PromptTechnique).filter(
      (technique) => values.prompts[technique]?.trim()
    );

    if (techniquesToTest.length === 0) {
      return;
    }

    setIsTesting(true);
    const newResults: ResultItem[] = techniquesToTest.map((tech) => ({
      technique: tech,
      response: "",
      isLoading: true,
    }));
    setResults(newResults);

    try {
      const promises = techniquesToTest.map(async (technique) => {
        try {
          const userInput = values.prompts[technique]?.trim();
          if (!userInput) {
            return null;
          }

          // Parse đơn giản
          let examples;
          let role;
          let actualUserInput = userInput;

          if (technique === PromptTechnique.FEW_SHOT) {
            const lines = userInput.split("\n").filter((l) => l.trim());
            const exampleLines = lines.filter(
              (l) => l.includes("→") && !l.includes("Phân loại")
            );
            examples = exampleLines
              .map((line) => {
                const match = line.match(/Tài liệu \d+:\s*"(.+?)"\s*→\s*(.+)/);
                return match
                  ? { input: match[1], output: match[2].trim() }
                  : { input: "", output: "" };
              })
              .filter((e) => e.input && e.output);

            const questionLine = lines.find((l) => l.includes("Phân loại"));
            if (questionLine) {
              const match = questionLine.match(
                /Phân loại tài liệu.*?sau:\s*"(.+?)"/
              );
              actualUserInput = match ? match[1] : questionLine;
            }
          } else if (technique === PromptTechnique.ROLE) {
            const parts = userInput.split("\n\n");
            if (parts.length >= 2) {
              role = parts[0].trim();
              const documentMatch = parts[1].match(
                /Phân loại tài liệu.*?sau:\s*"(.+?)"/
              );
              actualUserInput = documentMatch
                ? documentMatch[1]
                : parts[1].trim();
            }
          }

          const response = await testPrompt.mutateAsync({
            technique,
            userInput: actualUserInput,
            role,
            examples,
            systemMessage: values.systemMessage,
          });

          return {
            technique,
            response: response?.response || "",
            isLoading: false,
          };
        } catch (error) {
          return {
            technique,
            response: "",
            isLoading: false,
            error: error instanceof Error ? error.message : "Có lỗi xảy ra",
          };
        }
      });

      const responses = await Promise.all(promises);
      setResults(responses.filter((r) => r !== null) as ResultItem[]);
    } catch {
      setResults(
        techniquesToTest.map((technique) => ({
          technique,
          response: "",
          isLoading: false,
          error: "Có lỗi xảy ra",
        }))
      );
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div>
      <div className="px-6 py-4 space-y-4 mt-4">
        <ServiceCodeDisplay code="llm fundamentals prompt engineering 01" />
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ prompts: DEFAULT_PROMPTS }}
        >
          <div className="space-y-3">
            {Object.values(PromptTechnique).map((technique) => (
              <div
                key={technique}
                className="border border-gray-200 rounded-lg p-4 bg-white"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Tag color="blue">{PromptTechniqueLabels[technique]}</Tag>
                </div>
                <p className="text-xs text-gray-600 mb-3">
                  {PromptTechniqueDescriptions[technique]}
                </p>
                <Form.Item name={["prompts", technique]} className="mb-0">
                  <TextArea rows={PromptTextareaRows[technique]} />
                </Form.Item>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Form.Item
              label="System Message (Tùy chọn)"
              name="systemMessage"
              className="mb-0"
            >
              <TextArea
                rows={2}
                placeholder="You are a helpful AI assistant."
              />
            </Form.Item>
          </div>

          <div className="mt-4">
            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={isTesting}
                block
              >
                Test và So sánh
              </Button>
            </Form.Item>
          </div>
        </Form>

        {testPrompt.isError && (
          <Alert
            description={testPrompt.error?.message || "Có lỗi xảy ra"}
            type="error"
            showIcon
          />
        )}

        {results.length > 0 && <ResultComparison results={results} />}
      </div>
    </div>
  );
}
