"use client";

import { useState } from "react";
import { Form, Input, Button, Alert, Typography, Tag } from "antd";
import { useCreateEmbeddings } from "@/hooks/use-embeddings";
import { ServiceCodeDisplay } from "@/components/ServiceCodeDisplay";

const { TextArea } = Input;
const { Paragraph, Text } = Typography;

const DEFAULT_TEXTS = [
  "Con chó đang chạy",
  "The dog is running",
  "Mèo đang ngủ",
  "The cat is sleeping",
  "Chó là động vật",
];

export function CreateEmbeddingsExercise() {
  const [form] = Form.useForm();
  const createEmbeddings = useCreateEmbeddings();
  const [results, setResults] = useState<{
    results: Array<{
      text: string;
      embedding: number[];
      dimensions: number;
    }>;
    model: string;
    latency: number;
  } | null>(null);

  const handleSubmit = async (values: { texts: string }) => {
    try {
      const texts = values.texts
        .split("\n")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      if (texts.length === 0) {
        return;
      }

      const response = await createEmbeddings.mutateAsync({
        texts,
      });
      setResults(response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <ServiceCodeDisplay code="rag embeddings 01" />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          texts: DEFAULT_TEXTS.join("\n"),
        }}
      >
        <Form.Item
          label="Danh sách texts (mỗi text một dòng)"
          name="texts"
          rules={[{ required: true, message: "Vui lòng nhập ít nhất 1 text" }]}
          help="Nhập nhiều texts, mỗi text một dòng"
        >
          <TextArea
            rows={8}
            placeholder="Con chó đang chạy&#10;The dog is running&#10;Mèo đang ngủ"
          />
        </Form.Item>

        <div className="pt-4">
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={createEmbeddings.isPending}
              block
            >
              Tạo Embeddings
            </Button>
          </Form.Item>
        </div>
      </Form>

      {createEmbeddings.error && (
        <Alert
          description={createEmbeddings.error.message || "Có lỗi xảy ra"}
          type="error"
          showIcon
        />
      )}

      {results && (
        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Kết quả Embeddings
            </h3>
            <div className="flex items-center gap-2">
              <Tag color="blue">Model: {results.model}</Tag>
              <Tag color="green">Latency: {results.latency}ms</Tag>
            </div>
          </div>

          <div className="space-y-4">
            {results.results.map((result, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-6 bg-white"
              >
                <div className="space-y-4">
                  <div>
                    <Text strong className="text-sm text-gray-600">
                      Text {index + 1}:
                    </Text>
                    <Paragraph className="text-gray-900 font-medium mt-1 mb-0">
                      {result.text}
                    </Paragraph>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div>
                      <Text strong>Dimensions: </Text>
                      <Text>{result.dimensions}</Text>
                    </div>
                    <div>
                      <Text strong>Vector length: </Text>
                      <Text>{result.embedding.length}</Text>
                    </div>
                  </div>

                  <div>
                    <Text strong className="text-sm text-gray-600">
                      Embedding vector (sample - 10 giá trị đầu):
                    </Text>
                    <div className="bg-gray-50 p-4 rounded border border-gray-100 mt-2">
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                        {`[${result.embedding
                          .slice(0, 10)
                          .map((v) => v.toFixed(6))
                          .join(", ")}, ...]`}
                      </pre>
                    </div>
                    <Text className="text-xs text-gray-500 mt-1 block">
                      (Hiển thị 10 giá trị đầu trong tổng số{" "}
                      {result.embedding.length} dimensions)
                    </Text>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
