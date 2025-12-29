"use client";

import { useState } from "react";
import { Form, Input, Button, Alert, Typography, Card, Tag, Steps } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import { useRouter } from "@/hooks/use-chains-routing";
import { ServiceCodeDisplay } from "@/components/ServiceCodeDisplay";

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

export function RouterExercise() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [result, setResult] = useState<{
    intent: string;
    selectedModel: string;
    reason: string;
    response: string;
    latency: number;
  } | null>(null);

  const handleSubmit = async (values: {
    input: string;
    temperature?: number;
  }) => {
    if (!values.input?.trim()) {
      return;
    }

    try {
      const response = await router.mutateAsync({
        input: values.input.trim(),
        temperature: values.temperature || 0.7,
      });
      setResult(response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case "code":
        return "blue";
      case "creative":
        return "purple";
      case "general":
        return "green";
      default:
        return "default";
    }
  };

  return (
    <div>
      <div className="mb-6">
        <ServiceCodeDisplay code="orchestration chains routing 02" />
        <Title level={4} className="mb-2 mt-4">
          Router Pattern: Intent Classification → Model Selection
        </Title>
        <Paragraph className="text-gray-600">
          Nhập input, hệ thống sẽ phân loại intent (code/creative/general) và
          route đến model phù hợp.
        </Paragraph>
      </div>

      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={{
          input:
            "Tóm tắt các best practices về prompt engineering từ kho tri thức của tôi",
        }}
      >
        <Form.Item
          name="input"
          label="Input Text"
          rules={[{ required: true, message: "Vui lòng nhập input" }]}
        >
          <TextArea
            rows={4}
            placeholder='Ví dụ: "Tóm tắt các best practices về prompt engineering" hoặc "Giải thích cách hoạt động của vector database"'
            disabled={router.isPending}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={router.isPending}>
            Chạy Router
          </Button>
        </Form.Item>
      </Form>

      {router.error && (
        <Alert
          description={router.error.message || "Có lỗi xảy ra"}
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
            current={2}
            items={[
              {
                title: "Step 1: Intent Classification",
                description: (
                  <Card className="mt-2">
                    <div className="flex items-center gap-2">
                      <span>Intent:</span>
                      <Tag color={getIntentColor(result.intent)}>
                        {result.intent}
                      </Tag>
                    </div>
                  </Card>
                ),
              },
              {
                title: "Step 2: Model Selection & Response",
                description: (
                  <Card className="mt-2">
                    <div className="space-y-3">
                      <div>
                        <Paragraph strong className="mb-1">
                          Selected Model:
                        </Paragraph>
                        <Tag color="blue">{result.selectedModel}</Tag>
                      </div>
                      <div>
                        <Paragraph strong className="mb-1">
                          Reason:
                        </Paragraph>
                        <Paragraph className="mb-0 text-gray-700">
                          {result.reason}
                        </Paragraph>
                      </div>
                      <div>
                        <Paragraph strong className="mb-1">
                          Response:
                        </Paragraph>
                        <Paragraph className="mb-0 whitespace-pre-wrap">
                          {result.response}
                        </Paragraph>
                      </div>
                    </div>
                  </Card>
                ),
              },
            ]}
          />

          <div className="mt-4">
            <Tag color="green">Latency: {result.latency}ms</Tag>
          </div>
        </div>
      )}
    </div>
  );
}
