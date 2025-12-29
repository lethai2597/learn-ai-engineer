"use client";

import { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Card,
  Typography,
  Space,
  Alert,
  Tag,
  Statistic,
} from "antd";
import {
  useGetCircuitState,
  useResetCircuit,
  useSimulateCircuitBreaker,
} from "@/hooks/use-error-handling";
import { ServiceCodeDisplay } from "@/components/ServiceCodeDisplay";

const { Title, Paragraph } = Typography;

export function CircuitBreakerExercise() {
  const [form] = Form.useForm();
  const [stateResult, setStateResult] = useState<any>(null);
  const [simulateResult, setSimulateResult] = useState<any>(null);
  const getCircuitState = useGetCircuitState();
  const resetCircuit = useResetCircuit();
  const simulateCircuitBreaker = useSimulateCircuitBreaker();

  const handleGetState = async (values: { name: string }) => {
    try {
      const response = await getCircuitState.mutateAsync({
        name: values.name,
      });
      setStateResult(response);
    } catch (error) {
      console.error("Error getting circuit state:", error);
    }
  };

  const handleSimulate = async (values: {
    name: string;
    failureThreshold: number;
    timeout: number;
    failures: number;
  }) => {
    try {
      const response = await simulateCircuitBreaker.mutateAsync({
        name: values.name,
        failureThreshold: values.failureThreshold,
        timeout: values.timeout,
        failures: values.failures,
      });
      setSimulateResult(response);
    } catch (error) {
      console.error("Error simulating circuit breaker:", error);
    }
  };

  const handleReset = async (name: string) => {
    try {
      await resetCircuit.mutateAsync({ name });
      setStateResult(null);
      setSimulateResult(null);
    } catch (error) {
      console.error("Error resetting circuit:", error);
    }
  };

  return (
    <div>
      <ServiceCodeDisplay code="production error handling 02" />
      <div className="space-y-6 mt-4">
        <div>
          <Title level={4} className="mb-2">
            Circuit Breaker Pattern
          </Title>
          <Paragraph className="text-gray-600 mb-4">
            Mô phỏng circuit breaker pattern. Circuit sẽ mở (OPEN) sau khi đạt
            failure threshold và tự động đóng lại sau timeout period.
          </Paragraph>
        </div>

        <div className="grid gap-4">
          <Card>
            <Title level={5} className="mb-4">
              Get Circuit State
            </Title>
            <Form
              layout="vertical"
              onFinish={handleGetState}
              initialValues={{ name: "llm-api" }}
            >
              <Form.Item
                name="name"
                label="Circuit Name"
                rules={[
                  { required: true, message: "Vui lòng nhập circuit name" },
                ]}
              >
                <Input placeholder="e.g., llm-api" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={getCircuitState.isPending}
                >
                  Get State
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <Card>
            <Title level={5} className="mb-4">
              Simulate Failures
            </Title>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSimulate}
              initialValues={{
                name: "llm-api",
                failureThreshold: 5,
                timeout: 60000,
                failures: 3,
              }}
            >
              <Form.Item
                name="name"
                label="Circuit Name"
                rules={[{ required: true }]}
              >
                <Input placeholder="e.g., llm-api" />
              </Form.Item>
              <Form.Item
                name="failureThreshold"
                label="Failure Threshold"
                rules={[{ required: true }]}
              >
                <InputNumber min={1} max={20} className="w-full" />
              </Form.Item>
              <Form.Item
                name="timeout"
                label="Timeout (ms)"
                rules={[{ required: true }]}
              >
                <InputNumber
                  min={1000}
                  max={300000}
                  step={1000}
                  className="w-full"
                />
              </Form.Item>
              <Form.Item
                name="failures"
                label="Number of Failures"
                rules={[{ required: true }]}
              >
                <InputNumber min={1} max={20} className="w-full" />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={simulateCircuitBreaker.isPending}
                  >
                    Simulate
                  </Button>
                  <Button
                    onClick={() => {
                      const name = form.getFieldValue("name");
                      if (name) {
                        handleReset(name);
                      }
                    }}
                    loading={resetCircuit.isPending}
                  >
                    Reset Circuit
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </div>

        {stateResult && (
          <div className="space-y-4">
            <Title level={5}>Circuit State</Title>
            <Card>
              <div className="grid grid-cols-2 gap-4">
                <Statistic
                  title="State"
                  value={stateResult.state}
                  valueStyle={{
                    color:
                      stateResult.state === "OPEN"
                        ? "#cf1322"
                        : stateResult.state === "HALF_OPEN"
                        ? "#faad14"
                        : "#3f8600",
                  }}
                />
                <Statistic title="Failures" value={stateResult.failures} />
              </div>
              {stateResult.lastFailTime && (
                <div className="mt-4">
                  <strong>Last Fail Time:</strong>{" "}
                  <span className="text-gray-600">
                    {new Date(stateResult.lastFailTime).toLocaleString()}
                  </span>
                </div>
              )}
            </Card>
          </div>
        )}

        {simulateResult && (
          <div className="space-y-4">
            <Title level={5}>Simulation Result</Title>
            <Card>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <Statistic
                    title="State"
                    value={simulateResult.state}
                    valueStyle={{
                      color: simulateResult.isOpen ? "#cf1322" : "#3f8600",
                    }}
                  />
                  <Statistic
                    title="Total Failures"
                    value={simulateResult.failures}
                  />
                </div>
                <div>
                  <Tag color={simulateResult.isOpen ? "red" : "green"}>
                    {simulateResult.isOpen ? "Circuit OPEN" : "Circuit CLOSED"}
                  </Tag>
                </div>
                <Paragraph className="text-gray-600">
                  {simulateResult.isOpen
                    ? "Circuit breaker is OPEN. Calls will be blocked until timeout period expires."
                    : "Circuit breaker is CLOSED. Calls are allowed."}
                </Paragraph>
              </div>
            </Card>
          </div>
        )}

        {(getCircuitState.isError ||
          simulateCircuitBreaker.isError ||
          resetCircuit.isError) && (
          <Alert description="Có lỗi xảy ra" type="error" showIcon />
        )}
      </div>
    </div>
  );
}
