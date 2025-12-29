"use client";

import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Card,
  Typography,
  Space,
  Statistic,
  Table,
  Alert,
} from "antd";
import { useCountTokens, useModelPricing } from "@/hooks/use-cost-optimization";
import { ServiceCodeDisplay } from "@/components/ServiceCodeDisplay";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const MODELS = [
  "gpt-4o",
  "gpt-4-turbo",
  "gpt-4",
  "gpt-3.5-turbo",
  "claude-3-5-sonnet",
  "claude-3-opus",
  "claude-3-sonnet",
  "claude-3-haiku",
];

export function TokenCountingExercise() {
  const [form] = Form.useForm();
  const [results, setResults] = useState<
    Array<{
      model: string;
      tokenCount: number;
      estimatedCost: number;
    }>
  >([]);
  const countTokens = useCountTokens();
  const { data: pricing } = useModelPricing();

  const handleSubmit = async (values: { text: string; model: string }) => {
    try {
      const response = await countTokens.mutateAsync({
        text: values.text,
        model: values.model,
      });
      setResults([
        {
          model: values.model,
          tokenCount: response.tokenCount,
          estimatedCost: response.estimatedCost,
        },
      ]);
    } catch (error) {
      console.error("Error counting tokens:", error);
    }
  };

  const handleCompareAll = async (values: { text: string }) => {
    try {
      const promises = MODELS.map((model) =>
        countTokens.mutateAsync({
          text: values.text,
          model,
        })
      );
      const responses = await Promise.all(promises);
      setResults(
        responses.map((response, index) => ({
          model: MODELS[index],
          tokenCount: response.tokenCount,
          estimatedCost: response.estimatedCost,
        }))
      );
    } catch (error) {
      console.error("Error comparing models:", error);
    }
  };

  const columns = [
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      width: 200,
    },
    {
      title: "Token Count",
      dataIndex: "tokenCount",
      key: "tokenCount",
      width: 150,
      render: (count: number) => count.toLocaleString(),
    },
    {
      title: "Estimated Cost",
      dataIndex: "estimatedCost",
      key: "estimatedCost",
      width: 150,
      render: (cost: number) => `$${cost.toFixed(6)}`,
      sorter: (a: { estimatedCost: number }, b: { estimatedCost: number }) =>
        a.estimatedCost - b.estimatedCost,
    },
  ];

  return (
    <div>
      <ServiceCodeDisplay code="production cost optimization 01" />
      <div className="space-y-6 mt-4">
        <div>
          <Title level={4} className="mb-2">
            Token Counting
          </Title>
          <Paragraph className="text-gray-600 mb-4">
            Đếm số tokens trong text và ước tính cost. So sánh cost giữa các
            models để chọn model phù hợp.
          </Paragraph>
        </div>

        <div>
          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                text: "What is the capital of France?",
                model: "gpt-4o",
              }}
            >
              <Form.Item
                name="text"
                label="Text"
                rules={[{ required: true, message: "Vui lòng nhập text" }]}
              >
                <TextArea
                  rows={6}
                  placeholder="Enter text to count tokens..."
                  className="font-mono"
                />
              </Form.Item>

              <Form.Item
                name="model"
                label="Model"
                rules={[{ required: true, message: "Vui lòng chọn model" }]}
              >
                <Select>
                  {MODELS.map((model) => (
                    <Select.Option key={model} value={model}>
                      {model}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={countTokens.isPending}
                  >
                    Count Tokens
                  </Button>
                  <Button
                    onClick={() => {
                      const text = form.getFieldValue("text");
                      if (text) {
                        handleCompareAll({ text });
                      }
                    }}
                    loading={countTokens.isPending}
                  >
                    Compare All Models
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </div>

        {countTokens.isError && (
          <div>
            <Alert
              description={
                countTokens.error?.message || "Có lỗi xảy ra khi đếm tokens"
              }
              type="error"
              showIcon
            />
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            {results.length === 1 && (
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <Statistic
                    title="Token Count"
                    value={results[0].tokenCount}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Estimated Cost"
                    value={results[0].estimatedCost}
                    prefix="$"
                    precision={6}
                  />
                </Card>
              </div>
            )}

            <div>
              <Title level={5} className="mb-4">
                {results.length === 1 ? "Result" : "Model Comparison"}
              </Title>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <Table
                  dataSource={results}
                  columns={columns}
                  rowKey="model"
                  pagination={false}
                  size="small"
                />
              </div>
            </div>
          </div>
        )}

        {pricing && (
          <div>
            <Card>
              <Title level={5} className="mb-4">
                Model Pricing (per 1K tokens)
              </Title>
              <div className="space-y-2">
                {Object.entries(pricing).map(([model, prices]) => (
                  <div
                    key={model}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                  >
                    <span className="font-medium">{model}</span>
                    <span className="text-gray-600">
                      Input: ${(prices.input * 1000).toFixed(4)} | Output: $
                      {(prices.output * 1000).toFixed(4)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
