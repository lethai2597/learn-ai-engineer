"use client";

import { useState } from "react";
import { Form, Input, Button, Alert, Typography, Steps, Card, Tag } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import { useCalculator } from "@/hooks/use-function-calling";
import { ServiceCodeDisplay } from "@/components/ServiceCodeDisplay";

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

export function CalculatorExercise() {
  const [form] = Form.useForm();
  const calculator = useCalculator();
  const [result, setResult] = useState<{
    functionName: string;
    arguments: Record<string, any>;
    toolResult: any;
    finalResponse: string;
    latency: number;
  } | null>(null);

  const handleSubmit = async (values: { query: string }) => {
    if (!values.query?.trim()) {
      return;
    }

    try {
      const response = await calculator.mutateAsync({
        query: values.query.trim(),
      });
      setResult(response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <ServiceCodeDisplay code="agents function calling 01" />
      <div className="mb-6 mt-4">
        <Title level={4} className="mb-2">
          Calculator Tool: Function Calling
        </Title>
        <Paragraph className="text-gray-600">
          Nhập query về phép tính, hệ thống sẽ sử dụng function calling để thực hiện phép tính.
          Ví dụ: &quot;Tính 15 + 27&quot;, &quot;Nhân 8 với 9&quot;, &quot;Chia 100 cho 5&quot;.
        </Paragraph>
      </div>

      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={{
          query: "Tính 15 + 27",
        }}
      >
        <Form.Item
          name="query"
          label="User Query"
          rules={[{ required: true, message: "Vui lòng nhập query" }]}
        >
          <TextArea
            rows={3}
            placeholder="Ví dụ: Tính 15 + 27"
            disabled={calculator.isPending}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={calculator.isPending}
          >
            Chạy Calculator Tool
          </Button>
        </Form.Item>
      </Form>

      {calculator.error && (
        <Alert
          description={calculator.error.message || "Có lỗi xảy ra"}
          type="error"
          showIcon
        />
      )}

      {result && (
        <div className="mt-6">
          <Title level={4} className="mb-4">
            Kết quả Function Calling
          </Title>

          <Steps
            orientation="vertical"
            current={4}
            items={[
              {
                title: "Step 1: User Query",
                description: (
                  <Card className="mt-2">
                    <Paragraph style={{ marginBottom: 0 }} className="whitespace-pre-wrap">
                      {form.getFieldValue("query")}
                    </Paragraph>
                  </Card>
                ),
              },
              {
                title: "Step 2: Tool Call Detection",
                description: (
                  <Card className="mt-2">
                    <div className="space-y-2">
                      <div>
                        <strong>Function Name:</strong>{" "}
                        <Tag color="blue">{result.functionName}</Tag>
                      </div>
                      <div>
                        <strong>Arguments:</strong>
                        <pre className="mt-1 p-2 bg-gray-50 rounded text-sm overflow-x-auto">
                          {JSON.stringify(result.arguments, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </Card>
                ),
              },
              {
                title: "Step 3: Tool Execution",
                description: (
                  <Card className="mt-2">
                    <div>
                      <strong>Result:</strong>
                      <pre className="mt-1 p-2 bg-gray-50 rounded text-sm overflow-x-auto">
                        {JSON.stringify(result.toolResult, null, 2)}
                      </pre>
                    </div>
                  </Card>
                ),
              },
              {
                title: "Step 4: Final Response",
                description: (
                  <Card className="mt-2">
                    <Paragraph style={{ marginBottom: 0 }} className="whitespace-pre-wrap">
                      {result.finalResponse}
                    </Paragraph>
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

