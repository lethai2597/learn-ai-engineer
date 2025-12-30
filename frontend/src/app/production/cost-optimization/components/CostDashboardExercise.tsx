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
  Alert,
  Statistic,
  Table,
  Tag,
} from "antd";
import {
  useCostAnalysis,
  useModelSelection,
} from "@/hooks/use-cost-optimization";
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

export function CostDashboardExercise() {
  const [form] = Form.useForm();
  const [analysisResult, setAnalysisResult] = useState<{
    inputTokens: number;
    estimatedOutputTokens: number;
    estimatedCost: number;
    recommendations: string[];
  } | null>(null);
  const [comparisonResults, setComparisonResults] = useState<
    Array<{
      model: string;
      inputTokens: number;
      estimatedOutputTokens: number;
      estimatedCost: number;
    }>
  >([]);
  const [selectionResult, setSelectionResult] = useState<{
    recommendedModel: string;
    reason: string;
    estimatedCost: number;
  } | null>(null);
  const costAnalysis = useCostAnalysis();
  const modelSelection = useModelSelection();

  const handleAnalyze = async (values: {
    prompt: string;
    model: string;
    maxTokens?: number;
  }) => {
    try {
      const response = await costAnalysis.mutateAsync(values);
      setAnalysisResult(response);
    } catch (error) {
      console.error("Error analyzing cost:", error);
    }
  };

  const handleCompare = async (values: {
    prompt: string;
    maxTokens?: number;
  }) => {
    try {
      const promises = MODELS.map((model) =>
        costAnalysis.mutateAsync({
          prompt: values.prompt,
          model,
          maxTokens: values.maxTokens,
        })
      );
      const responses = await Promise.all(promises);
      setComparisonResults(
        responses.map((response, index) => ({
          model: MODELS[index],
          inputTokens: response.inputTokens,
          estimatedOutputTokens: response.estimatedOutputTokens,
          estimatedCost: response.estimatedCost,
        }))
      );
    } catch (error) {
      console.error("Error comparing models:", error);
    }
  };

  const handleSelectModel = async (values: {
    prompt: string;
    taskType: "simple" | "medium" | "complex";
  }) => {
    try {
      const response = await modelSelection.mutateAsync(values);
      setSelectionResult(response);
    } catch (error) {
      console.error("Error selecting model:", error);
    }
  };

  const comparisonColumns = [
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      width: 200,
    },
    {
      title: "Input Tokens",
      dataIndex: "inputTokens",
      key: "inputTokens",
      width: 120,
      render: (count: number) => count.toLocaleString(),
    },
    {
      title: "Est. Output Tokens",
      dataIndex: "estimatedOutputTokens",
      key: "estimatedOutputTokens",
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
      <div className="space-y-6">
        <ServiceCodeDisplay code="production cost optimization 03" />
        <div>
          <Title level={4} className="mb-2">
            Cost Dashboard
          </Title>
          <Paragraph className="text-gray-600 mb-4">
            Phân tích cost cho prompt, so sánh giữa các models, và nhận
            recommendations để optimize cost.
          </Paragraph>
        </div>

        <div>
          <Card>
            <Title level={5} className="mb-4">
              Cost Analysis
            </Title>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleAnalyze}
              initialValues={{
                prompt: "Explain quantum computing in simple terms",
                model: "gpt-4o",
                maxTokens: 500,
              }}
            >
              <Form.Item
                name="prompt"
                label="Prompt"
                rules={[{ required: true, message: "Vui lòng nhập prompt" }]}
              >
                <TextArea rows={6} placeholder="Enter prompt to analyze..." />
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

              <Form.Item name="maxTokens" label="Max Tokens (optional)">
                <Input type="number" min="1" />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={costAnalysis.isPending}
                  >
                    Analyze Cost
                  </Button>
                  <Button
                    onClick={() => {
                      const prompt = form.getFieldValue("prompt");
                      const maxTokens = form.getFieldValue("maxTokens");
                      if (prompt) {
                        handleCompare({ prompt, maxTokens });
                      }
                    }}
                    loading={costAnalysis.isPending}
                  >
                    Compare All Models
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </div>

        {analysisResult && (
          <div>
            <Card>
              <Title level={5} className="mb-4">
                Analysis Result
              </Title>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Statistic
                    title="Input Tokens"
                    value={analysisResult.inputTokens}
                  />
                  <Statistic
                    title="Est. Output Tokens"
                    value={analysisResult.estimatedOutputTokens}
                  />
                  <Statistic
                    title="Estimated Cost"
                    value={analysisResult.estimatedCost}
                    prefix="$"
                    precision={6}
                  />
                </div>

                {analysisResult.recommendations.length > 0 && (
                  <div>
                    <Title level={5} className="mb-2">
                      Recommendations
                    </Title>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {analysisResult.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {comparisonResults.length > 0 && (
          <div>
            <Card>
              <Title level={5} className="mb-4">
                Model Comparison
              </Title>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <Table
                  dataSource={comparisonResults}
                  columns={comparisonColumns}
                  rowKey="model"
                  pagination={false}
                  size="small"
                />
              </div>
            </Card>
          </div>
        )}

        <div>
          <Card>
            <Title level={5} className="mb-4">
              Model Selection
            </Title>
            <Form
              layout="vertical"
              onFinish={handleSelectModel}
              initialValues={{
                prompt: "What is 2 + 2?",
                taskType: "simple",
              }}
            >
              <Form.Item
                name="prompt"
                label="Prompt"
                rules={[{ required: true, message: "Vui lòng nhập prompt" }]}
              >
                <TextArea rows={4} placeholder="Enter prompt..." />
              </Form.Item>

              <Form.Item
                name="taskType"
                label="Task Type"
                rules={[{ required: true, message: "Vui lòng chọn task type" }]}
              >
                <Select>
                  <Select.Option value="simple">Simple</Select.Option>
                  <Select.Option value="medium">Medium</Select.Option>
                  <Select.Option value="complex">Complex</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={modelSelection.isPending}
                >
                  Select Model
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>

        {selectionResult && (
          <div>
            <Card>
              <Title level={5} className="mb-4">
                Recommended Model
              </Title>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Model: </span>
                  <Tag color="blue">{selectionResult.recommendedModel}</Tag>
                </div>
                <div>
                  <span className="font-medium">Reason: </span>
                  <span className="text-gray-700">
                    {selectionResult.reason}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Estimated Cost: </span>
                  <span className="text-gray-700">
                    ${selectionResult.estimatedCost.toFixed(6)}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {(costAnalysis.isError || modelSelection.isError) && (
          <div>
            <Alert
              description="Có lỗi xảy ra khi phân tích cost"
              type="error"
              showIcon
            />
          </div>
        )}
      </div>
    </div>
  );
}
