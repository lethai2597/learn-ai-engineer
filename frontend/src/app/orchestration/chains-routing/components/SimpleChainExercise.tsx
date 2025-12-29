"use client";

import { useState } from "react";
import { Form, Input, Button, Alert, Typography, Steps, Card, Tag } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import { useSimpleChain } from "@/hooks/use-chains-routing";
import { ServiceCodeDisplay } from "@/components/ServiceCodeDisplay";

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

export function SimpleChainExercise() {
  const [form] = Form.useForm();
  const simpleChain = useSimpleChain();
  const [result, setResult] = useState<{
    translation: string;
    summary: string;
    keywords: string[];
    totalTime: number;
  } | null>(null);

  const handleSubmit = async (values: { text: string }) => {
    if (!values.text?.trim()) {
      return;
    }

    try {
      const response = await simpleChain.mutateAsync({
        text: values.text.trim(),
      });
      setResult(response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <ServiceCodeDisplay code="orchestration chains routing 01" />
        <Title level={4} className="mb-2 mt-4">
          Simple Chain: Translate → Summarize → Extract Keywords
        </Title>
        <Paragraph className="text-gray-600">
          Nhập text tiếng Anh, hệ thống sẽ xử lý qua 3 bước tuần tự: Dịch sang
          tiếng Việt → Tóm tắt → Extract keywords.
        </Paragraph>
      </div>

      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={{
          text: "Vector databases là công nghệ lưu trữ và tìm kiếm dữ liệu dựa trên embeddings. Chúng cho phép semantic search hiệu quả hơn so với traditional keyword search. Một số vector DB phổ biến: ChromaDB, Pinecone, Weaviate.",
        }}
      >
        <Form.Item
          name="text"
          label="Input Text (tiếng Anh)"
          rules={[{ required: true, message: "Vui lòng nhập text" }]}
        >
          <TextArea
            rows={4}
            placeholder="Ví dụ: Vector databases là công nghệ lưu trữ và tìm kiếm dữ liệu dựa trên embeddings..."
            disabled={simpleChain.isPending}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={simpleChain.isPending}
          >
            Chạy Simple Chain
          </Button>
        </Form.Item>
      </Form>

      {simpleChain.error && (
        <Alert
          description={simpleChain.error.message || "Có lỗi xảy ra"}
          type="error"
          showIcon
        />
      )}

      {result && (
        <div className="mt-6">
          <Title level={4} className="mb-4">
            Kết quả
          </Title>

          <Steps
            orientation="vertical"
            current={3}
            items={[
              {
                title: "Step 1: Translation",
                description: (
                  <Card className="mt-2">
                    <Paragraph
                      style={{ marginBottom: 0 }}
                      className="whitespace-pre-wrap"
                    >
                      {result.translation}
                    </Paragraph>
                  </Card>
                ),
              },
              {
                title: "Step 2: Summary",
                description: (
                  <Card className="mt-2">
                    <Paragraph
                      style={{ marginBottom: 0 }}
                      className="whitespace-pre-wrap"
                    >
                      {result.summary}
                    </Paragraph>
                  </Card>
                ),
              },
              {
                title: "Step 3: Keywords",
                description: (
                  <Card className="mt-2">
                    <div className="flex flex-wrap gap-2">
                      {result.keywords.map((keyword, index) => (
                        <Tag key={index} color="blue">
                          {keyword}
                        </Tag>
                      ))}
                    </div>
                  </Card>
                ),
              },
            ]}
          />

          <div className="mt-4">
            <Tag color="green">Total Time: {result.totalTime}ms</Tag>
          </div>
        </div>
      )}
    </div>
  );
}
