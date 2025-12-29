"use client";

import { useState } from "react";
import { Form, Input, Button, Alert, Typography, Tag, Select, InputNumber } from "antd";
import { useChunkText } from "@/hooks/use-chunking";
import { ChunkingStrategy } from "@/types/chunking";
import { ServiceCodeDisplay } from "@/components/ServiceCodeDisplay";

const { TextArea } = Input;
const { Paragraph, Text } = Typography;

const DEFAULT_TEXT = `Đây là một đoạn văn dài về React hooks. React hooks là một tính năng mạnh mẽ cho phép bạn sử dụng state và các tính năng khác của React mà không cần viết class component.

useState là hook phổ biến nhất. Nó cho phép bạn thêm state vào functional component. Bạn có thể khai báo nhiều state variables trong cùng một component.

useEffect là hook khác rất quan trọng. Nó cho phép bạn thực hiện side effects trong functional components. Nó tương đương với componentDidMount, componentDidUpdate, và componentWillUnmount trong class components.

useContext cho phép bạn chia sẻ data giữa các components mà không cần truyền props qua nhiều levels. Đây là cách tốt để tránh prop drilling.

Custom hooks cho phép bạn tái sử dụng logic giữa các components. Bạn có thể tạo hook riêng để encapsulate logic và sử dụng lại ở nhiều nơi.`;

export function ChunkingExercise() {
  const [form] = Form.useForm();
  const chunkText = useChunkText();
  const [results, setResults] = useState<{
    chunks: Array<{
      content: string;
      index: number;
      size: number;
    }>;
    totalChunks: number;
    strategy: ChunkingStrategy;
    latency: number;
  } | null>(null);

  const handleSubmit = async (values: {
    text: string;
    strategy: ChunkingStrategy;
    chunkSize: number;
    chunkOverlap?: number;
  }) => {
    try {
      const response = await chunkText.mutateAsync({
        text: values.text,
        strategy: values.strategy,
        chunkSize: values.chunkSize,
        chunkOverlap: values.chunkOverlap,
      });
      setResults(response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="space-y-6 px-6 py-4">
      <ServiceCodeDisplay code="rag chunking 01" />
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          text: DEFAULT_TEXT,
          strategy: ChunkingStrategy.RECURSIVE,
          chunkSize: 200,
          chunkOverlap: 20,
        }}
      >
        <Form.Item
          label="Text cần chunk"
          name="text"
          rules={[{ required: true, message: "Vui lòng nhập text" }]}
          help="Nhập text dài để test chunking"
        >
          <TextArea
            rows={10}
            placeholder="Nhập text dài để test chunking..."
          />
        </Form.Item>

        <Form.Item
          label="Strategy"
          name="strategy"
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value={ChunkingStrategy.FIXED_SIZE}>
              Fixed-size (Kích thước cố định)
            </Select.Option>
            <Select.Option value={ChunkingStrategy.RECURSIVE}>
              Recursive (Ranh giới tự nhiên)
            </Select.Option>
            <Select.Option value={ChunkingStrategy.SEMANTIC}>
              Semantic (Đơn vị ngữ nghĩa)
            </Select.Option>
            <Select.Option value={ChunkingStrategy.SENTENCE}>
              Sentence (Cắt theo câu)
            </Select.Option>
          </Select>
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Chunk Size"
            name="chunkSize"
            rules={[
              { required: true },
              { type: "number", min: 50, max: 2000 },
            ]}
            help="Kích thước chunk (characters)"
          >
            <InputNumber min={50} max={2000} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Chunk Overlap"
            name="chunkOverlap"
            rules={[{ type: "number", min: 0, max: 500 }]}
            help="Overlap giữa các chunks (characters)"
          >
            <InputNumber min={0} max={500} style={{ width: "100%" }} />
          </Form.Item>
        </div>

        <div className="pt-4">
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={chunkText.isPending}
              block
            >
              Chunk Text
            </Button>
          </Form.Item>
        </div>
      </Form>

      {chunkText.error && (
        <Alert
          description={chunkText.error.message || "Có lỗi xảy ra"}
          type="error"
          showIcon
        />
      )}

      {results && (
        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Kết quả Chunking
            </h3>
            <div className="flex items-center gap-2">
              <Tag color="blue">Strategy: {results.strategy}</Tag>
              <Tag color="green">Total: {results.totalChunks} chunks</Tag>
              <Tag color="orange">Latency: {results.latency}ms</Tag>
            </div>
          </div>

          <div className="space-y-4">
            {results.chunks.map((chunk, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-6 bg-white"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Text strong className="text-sm text-gray-600">
                      Chunk {chunk.index + 1}
                    </Text>
                    <Tag color="blue">{chunk.size} chars</Tag>
                  </div>

                  <Paragraph className="text-gray-900 font-medium mt-1 mb-0 whitespace-pre-wrap">
                    {chunk.content}
                  </Paragraph>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

