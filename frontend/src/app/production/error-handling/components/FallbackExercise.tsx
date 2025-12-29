"use client";

import { useState } from "react";
import {
  Form,
  Select,
  Button,
  Card,
  Typography,
  Space,
  Alert,
  Tag,
  Statistic,
  Switch,
} from "antd";
import { useSimulateFallback } from "@/hooks/use-error-handling";
import { ServiceCodeDisplay } from "@/components/ServiceCodeDisplay";

const { Title, Paragraph } = Typography;
const { Option } = Select;

const AVAILABLE_MODELS = [
  "gpt-4",
  "claude-3-5-sonnet",
  "gpt-3.5-turbo",
  "claude-3-opus",
  "gpt-4-turbo",
];

export function FallbackExercise() {
  const [form] = Form.useForm();
  const [result, setResult] = useState<any>(null);
  const simulateFallback = useSimulateFallback();

  const handleSubmit = async (values: {
    models: string[];
    shouldFail: boolean;
  }) => {
    try {
      const response = await simulateFallback.mutateAsync({
        models: values.models,
        shouldFail: values.shouldFail,
      });
      setResult(response);
    } catch (error) {
      console.error("Error simulating fallback:", error);
    }
  };

  return (
    <div>
      <ServiceCodeDisplay code="production error handling 03" />
      <div className="space-y-6 mt-4">
        <div>
          <Title level={4} className="mb-2">
            Fallback Strategy
        </Title>
        <Paragraph className="text-gray-600 mb-4">
          Mô phỏng fallback strategy với multiple models. System sẽ thử từng model theo thứ tự cho đến khi một model thành công.
        </Paragraph>
      </div>

      <div>
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              models: ["gpt-4", "claude-3-5-sonnet", "gpt-3.5-turbo"],
              shouldFail: false,
            }}
          >
            <Form.Item
              name="models"
              label="Model Order (Fallback Sequence)"
              rules={[
                { required: true, message: "Vui lòng chọn ít nhất một model" },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Select models in fallback order"
                className="w-full"
              >
                {AVAILABLE_MODELS.map((model) => (
                  <Option key={model} value={model}>
                    {model}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="shouldFail"
              label="Simulate All Failures"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={simulateFallback.isPending}
                >
                  Simulate Fallback
                </Button>
                <Button
                  onClick={() => {
                    form.resetFields();
                    setResult(null);
                  }}
                >
                  Clear
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>

      {simulateFallback.isError && (
        <div>
          <Alert
            description={
              simulateFallback.error?.message ||
              "Có lỗi xảy ra khi simulate fallback"
            }
            type="error"
            showIcon
          />
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <Statistic
                title="Source Model"
                value={result.source}
              />
            </Card>
            <Card>
              <Statistic
                title="Attempts Made"
                value={result.attempts.length}
              />
            </Card>
          </div>

          <div>
            <Title level={5} className="mb-2">
              Fallback Attempts
            </Title>
            <Card>
              <div className="space-y-3">
                {result.attempts.map(
                  (
                    attempt: { model: string; success: boolean; error?: string },
                    idx: number
                  ) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <Tag color={attempt.success ? "green" : "red"}>
                          {attempt.success ? "Success" : "Failed"}
                        </Tag>
                        <span className="font-mono text-sm">{attempt.model}</span>
                      </div>
                      {attempt.error && (
                        <span className="text-red-600 text-sm">
                          {attempt.error}
                        </span>
                      )}
                    </div>
                  )
                )}
              </div>
            </Card>
          </div>

          <div>
            <Title level={5} className="mb-2">
              Result
            </Title>
            <Card>
              <div className="space-y-2">
                <div>
                  <strong>Response:</strong>{" "}
                  <span className="text-gray-700">{result.result}</span>
                </div>
                <div>
                  <strong>Source:</strong>{" "}
                  <Tag color="green">{result.source}</Tag>
                </div>
                <Paragraph className="text-gray-600 mt-2">
                  {result.source !== "fallback"
                    ? `Successfully used ${result.source} after trying ${result.attempts.length} model(s).`
                    : "All models failed. Fallback to default response."}
                </Paragraph>
              </div>
            </Card>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}




