"use client";

import { useState } from "react";
import { Form, Input, Button, Alert, Typography, Steps, Card, Tag } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import { useAssistant } from "@/hooks/use-function-calling";
import { ServiceCodeDisplay } from "@/components/ServiceCodeDisplay";

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

export function AssistantExercise() {
  const [form] = Form.useForm();
  const assistant = useAssistant();
  const [result, setResult] = useState<{
    toolCalls: Array<{
      functionName: string;
      arguments: Record<string, any>;
      result: any;
    }>;
    finalResponse: string;
    latency: number;
  } | null>(null);

  const handleSubmit = async (values: { query: string }) => {
    if (!values.query?.trim()) {
      return;
    }

    try {
      const response = await assistant.mutateAsync({
        query: values.query.trim(),
      });
      setResult(response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <ServiceCodeDisplay code="agents function calling 03" />
      <div className="mb-6 mt-4">
        <Title level={4} className="mb-2">
          Multi-tool Assistant: Function Calling với nhiều Tools
        </Title>
        <Paragraph className="text-gray-600">
          Nhập query có thể yêu cầu nhiều tools khác nhau, hệ thống sẽ tự động
          gọi các tools phù hợp. Ví dụ: &quot;Tính 10 * 5 rồi cho tôi biết thời
          tiết Hà Nội&quot;, &quot;Bây giờ là mấy giờ?&quot;.
        </Paragraph>
      </div>

      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={{
          query: "Tính 10 * 5 rồi cho tôi biết thời tiết Hà Nội",
        }}
      >
        <Form.Item
          name="query"
          label="User Query"
          rules={[{ required: true, message: "Vui lòng nhập query" }]}
        >
          <TextArea
            rows={3}
            placeholder="Ví dụ: Tính 10 * 5 rồi cho tôi biết thời tiết Hà Nội"
            disabled={assistant.isPending}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={assistant.isPending}
          >
            Chạy Multi-tool Assistant
          </Button>
        </Form.Item>
      </Form>

      {assistant.error && (
        <Alert
          description={assistant.error.message || "Có lỗi xảy ra"}
          type="error"
          showIcon
        />
      )}

      {result && (
        <div className="mt-6">
          <Title level={4} className="mb-4">
            Kết quả Multi-tool Function Calling
          </Title>

          <Steps
            orientation="vertical"
            current={result.toolCalls.length + 1}
            items={[
              {
                title: "Step 1: User Query",
                description: (
                  <Card className="mt-2">
                    <Paragraph
                      style={{ marginBottom: 0 }}
                      className="whitespace-pre-wrap"
                    >
                      {form.getFieldValue("query")}
                    </Paragraph>
                  </Card>
                ),
              },
              ...result.toolCalls.map((toolCall, index) => ({
                title: `Step ${index + 2}: Tool Call ${index + 1} - ${
                  toolCall.functionName
                }`,
                description: (
                  <Card className="mt-2">
                    <div className="space-y-3">
                      <div>
                        <strong>Function Name:</strong>{" "}
                        <Tag color="blue">{toolCall.functionName}</Tag>
                      </div>
                      <div>
                        <strong>Arguments:</strong>
                        <pre className="mt-1 p-2 bg-gray-50 rounded text-sm overflow-x-auto">
                          {JSON.stringify(toolCall.arguments, null, 2)}
                        </pre>
                      </div>
                      <div>
                        <strong>Result:</strong>
                        <pre className="mt-1 p-2 bg-gray-50 rounded text-sm overflow-x-auto">
                          {JSON.stringify(toolCall.result, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </Card>
                ),
              })),
              {
                title: `Step ${result.toolCalls.length + 2}: Final Response`,
                description: (
                  <Card className="mt-2">
                    <Paragraph
                      style={{ marginBottom: 0 }}
                      className="whitespace-pre-wrap"
                    >
                      {result.finalResponse}
                    </Paragraph>
                  </Card>
                ),
              },
            ]}
          />

          <div className="mt-4 space-x-2">
            <Tag color="green">Latency: {result.latency}ms</Tag>
            <Tag color="purple">Tool Calls: {result.toolCalls.length}</Tag>
          </div>
        </div>
      )}
    </div>
  );
}
