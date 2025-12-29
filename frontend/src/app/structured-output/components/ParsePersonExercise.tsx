"use client";

import { useState } from "react";
import { Form, Input, Button, Alert, Select, Tag } from "antd";
import { useParsePerson } from "@/hooks/use-structured-output";
import { ExtractionMethod } from "@/types/structured-output";
import { ServiceCodeDisplay } from "@/components/ServiceCodeDisplay";

const { TextArea } = Input;

const DEFAULT_TEXT = `Nguyễn Văn An là một lập trình viên full-stack 28 tuổi với 5 năm kinh nghiệm. Anh ấy có kỹ năng về JavaScript, TypeScript, React, Node.js, và Python. Email của anh ấy là nguyenvanan@example.com. Anh ấy đã làm việc tại nhiều công ty công nghệ và có niềm đam mê với AI và machine learning.`;

/**
 * ParsePersonExercise Component
 * Bài tập thực hành: Parse Person từ text
 * So sánh cách request được gửi lên (JSON Mode vs Function Calling)
 */
export function ParsePersonExercise() {
  const [form] = Form.useForm();
  const parsePerson = useParsePerson();
  type RequestPayload =
    | {
        messages: Array<{ role: string; content: string }>;
        response_format: { type: string };
      }
    | {
        messages: Array<{ role: string; content: string }>;
        tools: Array<{
          type: string;
          function: { name: string; description: string; parameters: unknown };
        }>;
      };

  const [result, setResult] = useState<{
    method: ExtractionMethod;
    data: unknown;
    rawResponse: string;
    requestPayload: RequestPayload;
    isLoading: boolean;
    error?: string;
  } | null>(null);

  const generateRequestPayload = (
    text: string,
    method: ExtractionMethod
  ): RequestPayload => {
    const systemPrompt =
      "Bạn là một AI chuyên trích xuất thông tin cá nhân từ text. Hãy trích xuất thông tin về tên, tuổi, kỹ năng, email và tiểu sử (nếu có).";

    if (method === "json-mode") {
      return {
        messages: [
          {
            role: "system",
            content: `${systemPrompt}\n\nLưu ý: Bạn PHẢI trả về JSON hợp lệ, không có text thêm.`,
          },
          {
            role: "user",
            content: `Trích xuất thông tin từ text sau và trả về dưới dạng JSON hợp lệ:\n\n${text}`,
          },
        ],
        response_format: { type: "json_object" },
      };
    } else {
      const jsonSchema = {
        type: "object",
        properties: {
          name: { type: "string" },
          age: { type: "number" },
          skills: { type: "array", items: { type: "string" } },
          email: { type: "string" },
          bio: { type: "string" },
        },
        required: ["name", "age", "skills"],
      };

      return {
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `Trích xuất thông tin từ text sau:\n\n${text}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_person",
              description: systemPrompt,
              parameters: jsonSchema,
            },
          },
        ],
      };
    }
  };

  const handleSubmit = async (values: {
    text: string;
    method: ExtractionMethod;
  }) => {
    setResult({
      method: values.method,
      data: null,
      rawResponse: "",
      requestPayload: generateRequestPayload(values.text, values.method),
      isLoading: true,
    });

    try {
      const response = await parsePerson.mutateAsync({
        text: values.text,
        method: values.method,
      });

      setResult({
        method: values.method,
        data: response.data,
        rawResponse: response.rawResponse,
        requestPayload: generateRequestPayload(values.text, values.method),
        isLoading: false,
      });
    } catch (error) {
      setResult({
        method: values.method,
        data: null,
        rawResponse: "",
        requestPayload: generateRequestPayload(values.text, values.method),
        isLoading: false,
        error: error instanceof Error ? error.message : "Có lỗi xảy ra",
      });
    }
  };

  return (
    <div>
      <div className="space-y-6 px-6 py-4 mt-4">
        <ServiceCodeDisplay code="llm fundamentals structured output 01" />
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            text: DEFAULT_TEXT,
            method: "json-mode" as ExtractionMethod,
          }}
          className="mb-4"
        >
          <Form.Item
            label="Text chứa thông tin về người"
            name="text"
            rules={[{ required: true, message: "Vui lòng nhập text" }]}
          >
            <TextArea rows={6} placeholder="Nhập text..." />
          </Form.Item>

          <Form.Item label="Method" name="method" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="json-mode">JSON Mode</Select.Option>
              <Select.Option value="function-calling">
                Function Calling
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={parsePerson.isPending}
              block
            >
              Parse Person
            </Button>
          </Form.Item>
        </Form>

        {parsePerson.isError && (
          <Alert
            description={
              parsePerson.error?.message || "Có lỗi xảy ra khi parse person"
            }
            type="error"
            showIcon
          />
        )}

        {result && (
          <div className="space-y-4 mt-4">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Kết quả</h3>
              <Tag color={result.method === "json-mode" ? "blue" : "green"}>
                {result.method === "json-mode"
                  ? "JSON Mode"
                  : "Function Calling"}
              </Tag>
            </div>

            {result.error ? (
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <div className="text-red-600 text-sm font-medium mb-1">
                  Lỗi:
                </div>
                <div className="text-red-700 text-sm">{result.error}</div>
              </div>
            ) : result.isLoading ? (
              <div className="bg-gray-50 p-4 rounded border border-gray-100">
                <div className="text-gray-400 text-sm">Đang xử lý...</div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Request Payload */}
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Request Payload (Cách gửi request lên API):
                  </div>
                  <div className="bg-gray-50 p-4 rounded border border-gray-100">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                      {JSON.stringify(result.requestPayload, null, 2)}
                    </pre>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Raw Response (Response từ LLM):
                  </div>
                  <div className="bg-gray-50 p-4 rounded border border-gray-100">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                      {result.rawResponse}
                    </pre>
                  </div>
                </div>

                {result.data != null && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Parsed Data (Sau khi validate với Zod):
                    </div>
                    <div className="bg-gray-50 p-4 rounded border border-gray-100">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
