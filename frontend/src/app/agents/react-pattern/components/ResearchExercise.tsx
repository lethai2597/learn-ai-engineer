"use client";

import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Alert,
  Typography,
  Steps,
  Card,
  Tag,
} from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import { useReactResearch } from "@/hooks/use-react-pattern";
import { ServiceCodeDisplay } from "@/components/ServiceCodeDisplay";

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

export function ResearchExercise() {
  const [form] = Form.useForm();
  const research = useReactResearch();
  const [result, setResult] = useState<{
    steps: Array<{
      thought?: string;
      action?: { functionName: string; arguments: Record<string, any> };
      observation?: any;
    }>;
    finalResponse: string;
    latency: number;
    iterations: number;
  } | null>(null);

  const handleSubmit = async (values: {
    query: string;
    maxIterations?: number;
  }) => {
    if (!values.query?.trim()) {
      return;
    }

    try {
      const response = await research.mutateAsync({
        query: values.query.trim(),
        maxIterations: values.maxIterations || 10,
      });
      setResult(response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <ServiceCodeDisplay code="agents react pattern 02" />
      <div className="mb-6 mt-4">
        <Title level={4} className="mb-2">
          ReAct Research Agent: Tìm kiếm và tổng hợp thông tin
        </Title>
        <Paragraph className="text-gray-600">
          Nhập câu hỏi yêu cầu tìm kiếm và tổng hợp thông tin, agent sẽ tự động
          tìm kiếm và tổng hợp kết quả bằng ReAct pattern. Ví dụ: "So sánh giá
          iPhone 15 vs Samsung S24", "Tìm thông tin về AI và Machine Learning".
        </Paragraph>
      </div>

      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={{
          query: "So sánh giá iPhone 15 vs Samsung S24",
          maxIterations: 5,
        }}
      >
        <Form.Item
          name="query"
          label="User Query"
          rules={[{ required: true, message: "Vui lòng nhập query" }]}
        >
          <TextArea
            rows={3}
            placeholder="Ví dụ: So sánh giá iPhone 15 vs Samsung S24"
            disabled={research.isPending}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={research.isPending}
          >
            Chạy ReAct Research Agent
          </Button>
        </Form.Item>
      </Form>

      {research.error && (
        <Alert
          description={research.error.message || "Có lỗi xảy ra"}
          type="error"
          showIcon
        />
      )}

      {result && (
        <div className="mt-6">
          <Title level={4} className="mb-4">
            Kết quả ReAct Loop
          </Title>

          <Steps
            orientation="vertical"
            current={result.steps.length + 1}
            items={[
              {
                title: "Step 0: User Query",
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
              ...result.steps.map((step, index) => {
                const stepNumber = index + 1;
                const hasAction = step.action !== undefined;
                const hasObservation = step.observation !== undefined;

                return {
                  title: `Step ${stepNumber}: ${
                    hasAction
                      ? `Action - ${step.action?.functionName}`
                      : "Final Answer"
                  }`,
                  description: (
                    <Card className="mt-2">
                      {step.thought && (
                        <div className="mb-3">
                          <strong>Thought:</strong>
                          <Paragraph
                            style={{ marginBottom: 0 }}
                            className="mt-1 text-gray-700"
                          >
                            {step.thought}
                          </Paragraph>
                        </div>
                      )}
                      {hasAction && (
                        <div className="mb-3">
                          <div className="space-y-2">
                            <div>
                              <strong>Function Name:</strong>{" "}
                              <Tag color="blue">{step.action?.functionName}</Tag>
                            </div>
                            <div>
                              <strong>Arguments:</strong>
                              <pre className="mt-1 p-2 bg-gray-50 rounded text-sm overflow-x-auto">
                                {JSON.stringify(step.action?.arguments, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </div>
                      )}
                      {hasObservation && (
                        <div>
                          <strong>Observation:</strong>
                          <pre className="mt-1 p-2 bg-gray-50 rounded text-sm overflow-x-auto">
                            {JSON.stringify(step.observation, null, 2)}
                          </pre>
                        </div>
                      )}
                    </Card>
                  ),
                };
              }),
              {
                title: `Step ${result.steps.length + 1}: Final Response`,
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
            <Tag color="purple">Iterations: {result.iterations}</Tag>
            <Tag color="orange">Steps: {result.steps.length}</Tag>
          </div>
        </div>
      )}
    </div>
  );
}
