"use client";

import { useState } from "react";
import { Form, Input, Button, Select, Card, Alert, Spin } from "antd";
import { useGenericExtract } from "@/hooks/use-structured-output";
import { ExtractionMethod } from "@/types/structured-output";

const { TextArea } = Input;

const DEFAULT_TEXT = `Title: Vector Database
Category: Technology
Key Points: Semantic search, embeddings, similarity matching
Tags: database, AI, search, RAG
Source: Learning notes about RAG systems`;

const DEFAULT_SCHEMA = `z.object({
  title: z.string(),
  category: z.string(),
  key_points: z.array(z.string()),
  tags: z.array(z.string()),
  source: z.string().optional(),
})`;

/**
 * GenericExtractExercise Component
 * Bài tập 3: Generic extraction với custom schema
 */
export function GenericExtractExercise() {
  const [form] = Form.useForm();
  const genericExtract = useGenericExtract();
  const [result, setResult] = useState<{
    data: unknown;
    rawResponse: string;
    method: string;
    errors?: string[];
  } | null>(null);

  const handleSubmit = async (values: {
    text: string;
    schema: string;
    method: ExtractionMethod;
  }) => {
    try {
      const response = await genericExtract.mutateAsync({
        text: values.text,
        schema: values.schema,
        method: values.method,
      });
      setResult(response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="space-y-4">
      <Card title="Bài 3: Generic Extraction" size="small">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            text: DEFAULT_TEXT,
            schema: DEFAULT_SCHEMA,
            method: "json-mode" as ExtractionMethod,
          }}
        >
          <Form.Item
            label="Text cần extract"
            name="text"
            rules={[{ required: true, message: "Vui lòng nhập text" }]}
          >
            <TextArea rows={6} placeholder="Nhập text..." />
          </Form.Item>

          <Form.Item
            label="Zod Schema (string)"
            name="schema"
            rules={[{ required: true, message: "Vui lòng nhập schema" }]}
            help="Ví dụ: z.object({ name: z.string(), age: z.number() })"
          >
            <TextArea rows={4} placeholder="Nhập Zod schema..." />
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
              loading={genericExtract.isPending}
              block
            >
              Extract
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {genericExtract.isError && (
        <Alert
          description={
            genericExtract.error?.message || "Có lỗi xảy ra khi extract data"
          }
          type="error"
          showIcon
        />
      )}

      {genericExtract.isPending && (
        <div className="flex justify-center py-4">
          <Spin size="large" />
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <Card title="Kết quả" size="small">
            <div className="space-y-4">
              {result.errors && result.errors.length > 0 && (
                <Alert
                  description={
                    <ul className="list-disc list-inside">
                      {result.errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                    </ul>
                  }
                  type="warning"
                  showIcon
                  className="mt-2"
                />
              )}

              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Parsed Data:
                </div>
                <div className="bg-gray-50 p-4 rounded border border-gray-100">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Raw Response:
                </div>
                <div className="bg-gray-50 p-4 rounded border border-gray-100">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                    {result.rawResponse}
                  </pre>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                Method: <span className="font-medium">{result.method}</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}





