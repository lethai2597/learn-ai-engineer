"use client";

import { useState } from "react";
import {
  Form,
  InputNumber,
  Button,
  Card,
  Typography,
  Space,
  Alert,
  Tag,
  Statistic,
  Switch,
} from "antd";
import { useSimulateRetry } from "@/hooks/use-error-handling";
import { ServiceCodeDisplay } from "@/components/ServiceCodeDisplay";

const { Title, Paragraph } = Typography;

export function RetryExercise() {
  const [form] = Form.useForm();
  const [result, setResult] = useState<any>(null);
  const simulateRetry = useSimulateRetry();

  const handleSubmit = async (values: {
    maxRetries: number;
    baseDelay: number;
    shouldFail: boolean;
  }) => {
    try {
      const response = await simulateRetry.mutateAsync({
        maxRetries: values.maxRetries,
        baseDelay: values.baseDelay,
        shouldFail: values.shouldFail,
      });
      setResult(response);
    } catch (error) {
      console.error("Error simulating retry:", error);
    }
  };

  return (
    <div>
      <ServiceCodeDisplay code="production error handling 01" />
      <div className="space-y-6 mt-4">
        <div>
          <Title level={4} className="mb-2">
            Retry với Exponential Backoff
          </Title>
          <Paragraph className="text-gray-600 mb-4">
            Mô phỏng retry logic với exponential backoff và jitter. Test với các
            cấu hình khác nhau để hiểu cách retry hoạt động.
          </Paragraph>
        </div>

        <div>
          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                maxRetries: 3,
                baseDelay: 1000,
                shouldFail: false,
              }}
            >
              <Form.Item
                name="maxRetries"
                label="Max Retries"
                rules={[
                  { required: true, message: "Vui lòng nhập max retries" },
                ]}
              >
                <InputNumber min={1} max={10} className="w-full" />
              </Form.Item>

              <Form.Item
                name="baseDelay"
                label="Base Delay (ms)"
                rules={[
                  { required: true, message: "Vui lòng nhập base delay" },
                ]}
              >
                <InputNumber
                  min={100}
                  max={10000}
                  step={100}
                  className="w-full"
                />
              </Form.Item>

              <Form.Item
                name="shouldFail"
                label="Simulate Failure"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={simulateRetry.isPending}
                  >
                    Simulate Retry
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

        {simulateRetry.isError && (
          <div>
            <Alert
              description={
                simulateRetry.error?.message ||
                "Có lỗi xảy ra khi simulate retry"
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
                <Statistic title="Attempts Made" value={result.attempts} />
              </Card>
              <Card>
                <Statistic
                  title="Success"
                  value={result.success ? "Yes" : "No"}
                  valueStyle={{
                    color: result.success ? "#3f8600" : "#cf1322",
                  }}
                />
              </Card>
            </div>

            <div>
              <Title level={5} className="mb-2">
                Retry Details
              </Title>
              <Card>
                <div className="space-y-3">
                  <div>
                    <strong>Delays between retries:</strong>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {result.delays.length > 0 ? (
                        result.delays.map((delay: number, idx: number) => (
                          <Tag key={idx} color="blue">
                            {delay}ms
                          </Tag>
                        ))
                      ) : (
                        <Tag>No retries needed</Tag>
                      )}
                    </div>
                  </div>
                  {result.error && (
                    <div>
                      <strong>Error:</strong>{" "}
                      <span className="text-red-600">{result.error}</span>
                    </div>
                  )}
                  <div>
                    <strong>Explanation:</strong>
                    <Paragraph className="text-gray-600 mt-2">
                      {result.success
                        ? "Operation succeeded. No retries were needed or all retries succeeded."
                        : "Operation failed after all retry attempts. The delays show exponential backoff: each retry waits longer than the previous one."}
                    </Paragraph>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
