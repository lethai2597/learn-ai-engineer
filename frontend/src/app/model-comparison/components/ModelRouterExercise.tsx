"use client";

import { useState } from "react";
import { Form, Input, Button, Alert, Select, Tag, Typography } from "antd";
import { useModelRouter } from "@/hooks/use-model-comparison";
import { ServiceCodeDisplay } from "@/components/ServiceCodeDisplay";

const { TextArea } = Input;
const { Paragraph, Text } = Typography;

const DEFAULT_PROMPT =
  "Solve this complex math problem step by step: What is the square root of 144?";

const TASK_TYPES = [
  { label: "Auto detect", value: undefined },
  { label: "Simple", value: "simple" },
  { label: "Complex Reasoning", value: "complex-reasoning" },
  { label: "Code Generation", value: "code-generation" },
  { label: "Long Context", value: "long-context" },
  { label: "General", value: "general" },
];

export function ModelRouterExercise() {
  const [form] = Form.useForm();
  const router = useModelRouter();
  const [result, setResult] = useState<{
    selectedModel: string;
    reason: string;
    result: string;
    latency: number;
    estimatedCost: number;
    inputTokens: number;
    outputTokens: number;
  } | null>(null);

  const handleSubmit = async (values: {
    prompt: string;
    taskType?: string;
  }) => {
    try {
      const response = await router.mutateAsync({
        prompt: values.prompt,
        taskType: values.taskType,
      });
      setResult(response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const formatCost = (cost: number) => {
    if (cost < 0.001) {
      return `$${(cost * 1000).toFixed(4)}`;
    }
    return `$${cost.toFixed(4)}`;
  };

  return (
    <div>
      <ServiceCodeDisplay code="llm fundamentals model comparison 02" />
      <div className="space-y-6 mt-4">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            prompt: DEFAULT_PROMPT,
            taskType: undefined,
          }}
        >
          <Form.Item
            label="Prompt"
            name="prompt"
            rules={[{ required: true, message: "Vui lòng nhập prompt" }]}
          >
            <TextArea rows={4} placeholder="Nhập prompt..." />
          </Form.Item>

          <div className="pb-4">
            <Form.Item
              label="Task Type (Optional)"
              name="taskType"
              help="Để trống để router tự động detect dựa trên prompt"
            >
              <Select placeholder="Chọn task type..." options={TASK_TYPES} />
            </Form.Item>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={router.isPending}
              block
            >
              Route Model
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
          <div className="space-y-4 mt-4">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Kết quả Router
              </h3>
              <Tag color="blue" className="text-base">
                {result.selectedModel}
              </Tag>
            </div>

            <div className="space-y-4">
              <div>
                <Text strong className="text-sm text-gray-600">
                  Lý do chọn model:
                </Text>
                <div className="mt-1 bg-blue-50 p-3 rounded">
                  <Paragraph
                    className="text-gray-700 mb-0"
                    style={{ marginBottom: 0 }}
                  >
                    {result.reason}
                  </Paragraph>
                </div>
              </div>

              <div>
                <Text strong className="text-sm text-gray-600">
                  Generated Response:
                </Text>
                <div className="mt-1 bg-gray-50 p-4 rounded min-h-[200px]">
                  <Paragraph className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm mb-0">
                    {result.result}
                  </Paragraph>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-gray-200">
                <div>
                  <Text className="text-xs text-gray-500">Latency</Text>
                  <div className="text-sm font-medium">{result.latency}ms</div>
                </div>
                <div>
                  <Text className="text-xs text-gray-500">Estimated Cost</Text>
                  <div className="text-sm font-medium">
                    {formatCost(result.estimatedCost)}
                  </div>
                </div>
                <div>
                  <Text className="text-xs text-gray-500">Input Tokens</Text>
                  <div className="text-sm font-medium">
                    {result.inputTokens.toLocaleString()}
                  </div>
                </div>
                <div>
                  <Text className="text-xs text-gray-500">Output Tokens</Text>
                  <div className="text-sm font-medium">
                    {result.outputTokens.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
