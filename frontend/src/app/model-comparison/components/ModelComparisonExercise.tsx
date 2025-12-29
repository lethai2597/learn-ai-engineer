"use client";

import { useState } from "react";
import { Form, Input, Button, Alert, Select, Tag, Typography } from "antd";
import { useModelComparison } from "@/hooks/use-model-comparison";
import { ServiceCodeDisplay } from "@/components/ServiceCodeDisplay";

const { TextArea } = Input;
const { Paragraph } = Typography;

const DEFAULT_PROMPT =
  "Explain quantum computing in simple terms for a beginner.";

const AVAILABLE_MODELS = [
  {
    label: "Llama 3 8B Instruct (Rẻ)",
    value: "meta-llama/llama-3-8b-instruct",
  },
  { label: "Qwen 2.5 7B Instruct (Rẻ)", value: "qwen/qwen-2.5-7b-instruct" },
  { label: "GPT-3.5-turbo", value: "openai/gpt-3.5-turbo" },
  { label: "GPT-4o (Đắt)", value: "openai/gpt-4o" },
  { label: "Claude 3.5 Sonnet (Đắt)", value: "anthropic/claude-3.5-sonnet" },
];

export function ModelComparisonExercise() {
  const [form] = Form.useForm();
  const comparison = useModelComparison();
  const [results, setResults] = useState<{
    results: Array<{
      model: string;
      text: string;
      latency: number;
      estimatedCost: number;
      inputTokens: number;
      outputTokens: number;
      error?: string;
    }>;
    totalTime: number;
  } | null>(null);

  const handleSubmit = async (values: { prompt: string; models: string[] }) => {
    try {
      const response = await comparison.mutateAsync({
        prompt: values.prompt,
        models: values.models,
      });
      setResults(response);
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
      <div className="space-y-6">
        <ServiceCodeDisplay code="llm fundamentals model comparison 01" />
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            prompt: DEFAULT_PROMPT,
            models: ["meta-llama/llama-3-8b-instruct", "openai/gpt-3.5-turbo"],
          }}
        >
          <Form.Item
            label="Prompt"
            name="prompt"
            rules={[{ required: true, message: "Vui lòng nhập prompt" }]}
          >
            <TextArea rows={4} placeholder="Nhập prompt..." />
          </Form.Item>

          <Form.Item
            label="Models để so sánh"
            name="models"
            rules={[
              { required: true, message: "Vui lòng chọn ít nhất 1 model" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn models..."
              options={AVAILABLE_MODELS}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={comparison.isPending}
              block
            >
              So sánh Models
            </Button>
          </Form.Item>
        </Form>

        {comparison.error && (
          <Alert
            description={comparison.error.message || "Có lỗi xảy ra"}
            type="error"
            showIcon
          />
        )}

        {results && (
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Kết quả so sánh
              </h3>
              <Tag color="blue">Total time: {results.totalTime}ms</Tag>
            </div>

            <div className="flex flex-col space-y-8">
              {results.results.map((result, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">
                      {result.model}
                    </span>
                    {result.error ? (
                      <Tag color="red">Error</Tag>
                    ) : (
                      <Tag color="green">Success</Tag>
                    )}
                  </div>

                  {result.error ? (
                    <Alert
                      description={result.error}
                      type="error"
                      showIcon
                      className="mt-2"
                    />
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-4 rounded max-h-[300px] overflow-y-auto">
                        <Paragraph className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm mb-0">
                          {result.text}
                        </Paragraph>
                      </div>

                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex justify-between">
                          <span>Latency:</span>
                          <span className="font-medium">
                            {result.latency}ms
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estimated Cost:</span>
                          <span className="font-medium">
                            {formatCost(result.estimatedCost)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Input Tokens:</span>
                          <span className="font-medium">
                            {result.inputTokens.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Output Tokens:</span>
                          <span className="font-medium">
                            {result.outputTokens.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
