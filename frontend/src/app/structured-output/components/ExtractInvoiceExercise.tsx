"use client";

import { useState } from "react";
import { Form, Input, Button, Select, Card, Alert, Spin } from "antd";
import { useExtractInvoice } from "@/hooks/use-structured-output";
import { ExtractionMethod } from "@/types/structured-output";

const { TextArea } = Input;

const DEFAULT_TEXT = `Meeting Notes - Architecture Design
Date: 2024-01-15
Topic: RAG System Architecture

Key Points:
- Vector DB: ChromaDB
- Embedding Model: OpenAI text-embedding-3-small
- Chunking Strategy: Recursive with 500 tokens
- Retrieval: Top 3 similar chunks

Action Items:
- Setup ChromaDB instance
- Implement chunking service
- Test retrieval accuracy`;

/**
 * ExtractInvoiceExercise Component
 * Bài tập 2: Extract Invoice từ text
 */
export function ExtractInvoiceExercise() {
  const [form] = Form.useForm();
  const extractInvoice = useExtractInvoice();
  const [result, setResult] = useState<{
    data: unknown;
    rawResponse: string;
    method: string;
  } | null>(null);

  const handleSubmit = async (values: {
    invoiceText: string;
    method: ExtractionMethod;
  }) => {
    try {
      const response = await extractInvoice.mutateAsync({
        invoiceText: values.invoiceText,
        method: values.method,
      });
      setResult(response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="space-y-4">
      <Card title="Bài 2: Extract Document" size="small">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            invoiceText: DEFAULT_TEXT,
            method: "json-mode" as ExtractionMethod,
          }}
        >
          <Form.Item
            label="Document/Meeting Notes Text"
            name="invoiceText"
            rules={[{ required: true, message: "Vui lòng nhập document text" }]}
          >
            <TextArea rows={6} placeholder="Nhập document text..." />
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
              loading={extractInvoice.isPending}
              block
            >
              Extract Document
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {extractInvoice.isError && (
        <Alert
          description={
            extractInvoice.error?.message || "Có lỗi xảy ra khi extract document"
          }
          type="error"
          showIcon
        />
      )}

      {extractInvoice.isPending && (
        <div className="flex justify-center py-4">
          <Spin size="large" />
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <Card title="Kết quả" size="small">
            <div className="space-y-4">
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





