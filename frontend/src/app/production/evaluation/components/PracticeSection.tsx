"use client";

import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Table,
  Alert,
  Space,
  Typography,
  Tag,
} from "antd";
import { useRunEvaluations } from "@/hooks/use-evaluation";
import {
  EvaluationMetric,
  RunEvaluationRequest,
  EvaluationResult,
} from "@/types/evaluation";
import { ServiceCodeDisplay } from "@/components/ServiceCodeDisplay";

const { TextArea } = Input;
const { Title } = Typography;

const SAMPLE_DATASET = `[
  {
    "id": "1",
    "input": "What's the capital of France?",
    "expected": "Paris",
    "actual": "The capital of France is Paris."
  },
  {
    "id": "2",
    "input": "Explain quantum computing in one sentence",
    "expected": "Quantum computing uses quantum mechanical phenomena like superposition and entanglement to perform computations.",
    "actual": "Quantum computing leverages quantum mechanics principles such as superposition and entanglement for computational tasks."
  }
]`;

export function PracticeSection() {
  const [form] = Form.useForm();
  const runEvaluations = useRunEvaluations();
  const [results, setResults] = useState<EvaluationResult[]>([]);
  const [summary, setSummary] = useState<{
    total: number;
    passed: number;
    failed: number;
    passRate: number;
    avgScore: number;
  } | null>(null);

  const handleSubmit = async (values: {
    dataset: string;
    metric: EvaluationMetric;
    judgeModel?: string;
    judgeTemperature?: number;
    judgeRubric?: string;
  }) => {
    try {
      const parsedDataset = JSON.parse(values.dataset);
      const request: RunEvaluationRequest = {
        dataset: parsedDataset,
        metric: values.metric,
      };

      if (values.metric === EvaluationMetric.LLM_AS_JUDGE) {
        request.judge = {
          model: values.judgeModel,
          temperature: values.judgeTemperature,
          rubric: values.judgeRubric,
        };
      }

      const response = await runEvaluations.mutateAsync(request);
      setResults(response.results);
      setSummary(response.summary);
    } catch (error) {
      console.error("Evaluation error:", error);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Input",
      dataIndex: "input",
      key: "input",
      ellipsis: true,
    },
    {
      title: "Expected",
      dataIndex: "expected",
      key: "expected",
      ellipsis: true,
    },
    {
      title: "Actual",
      dataIndex: "actual",
      key: "actual",
      ellipsis: true,
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      width: 100,
      render: (score: number) => score.toFixed(2),
    },
    {
      title: "Status",
      dataIndex: "passed",
      key: "passed",
      width: 100,
      render: (passed: boolean) => (
        <span style={{ color: passed ? "#52c41a" : "#ff4d4f" }}>
          {passed ? "✓ Pass" : "✗ Fail"}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="space-y-6 px-6 py-4 mt-4">
        <ServiceCodeDisplay code="production evaluation 01" />
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            dataset: SAMPLE_DATASET,
            metric: EvaluationMetric.EXACT_MATCH,
            judgeModel: "openai/gpt-4o",
            judgeTemperature: 0.3,
            judgeRubric:
              "Rate based on: Accuracy (40%), Completeness (30%), Clarity (30%)",
          }}
        >
          <Form.Item
            name="dataset"
            label="JSON Dataset"
            rules={[
              { required: true, message: "Vui lòng nhập dataset" },
              {
                validator: (_, value) => {
                  try {
                    JSON.parse(value);
                    return Promise.resolve();
                  } catch {
                    return Promise.reject("Invalid JSON format");
                  }
                },
              },
            ]}
            help="Paste your dataset JSON here. Format: [{ id?, input, expected, actual, metadata? }]"
          >
            <TextArea
              rows={12}
              placeholder="Paste your dataset JSON here"
              className="font-mono text-sm"
            />
          </Form.Item>

          <Form.Item
            name="metric"
            label="Evaluation Metric"
            rules={[{ required: true, message: "Vui lòng chọn metric" }]}
          >
            <Select>
              <Select.Option value={EvaluationMetric.EXACT_MATCH}>
                Exact Match
              </Select.Option>
              <Select.Option value={EvaluationMetric.CONTAINS}>
                Contains
              </Select.Option>
              <Select.Option value={EvaluationMetric.LLM_AS_JUDGE}>
                LLM-as-a-Judge
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.metric !== currentValues.metric
            }
          >
            {({ getFieldValue }) =>
              getFieldValue("metric") === EvaluationMetric.LLM_AS_JUDGE ? (
                <Space orientation="vertical" className="w-full">
                  <Form.Item name="judgeModel" label="Judge Model">
                    <Select>
                      <Select.Option value="openai/gpt-4o">
                        GPT-4o
                      </Select.Option>
                      <Select.Option value="openai/gpt-4-turbo">
                        GPT-4 Turbo
                      </Select.Option>
                      <Select.Option value="anthropic/claude-3.5-sonnet">
                        Claude 3.5 Sonnet
                      </Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="judgeTemperature"
                    label="Temperature"
                    rules={[{ type: "number", min: 0, max: 2 }]}
                  >
                    <Input type="number" step="0.1" />
                  </Form.Item>
                  <Form.Item name="judgeRubric" label="Rubric">
                    <TextArea rows={3} />
                  </Form.Item>
                </Space>
              ) : null
            }
          </Form.Item>

          <div className="pt-4 mb-4">
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={runEvaluations.isPending}
                block
              >
                Run Evaluation
              </Button>
            </Form.Item>
          </div>
        </Form>

        {runEvaluations.isError && (
          <Alert
            description={
              runEvaluations.error?.message ||
              "Có lỗi xảy ra khi chạy evaluation"
            }
            type="error"
            showIcon
          />
        )}

        {summary && (
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between mb-4">
              <Title level={3} style={{ marginBottom: 0 }}>
                Kết quả Evaluation
              </Title>
              <Tag color="blue">
                Pass Rate: {(summary.passRate * 100).toFixed(1)}%
              </Tag>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="text-sm text-gray-600 mb-1">Total</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {summary.total}
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="text-sm text-gray-600 mb-1">Passed</div>
                <div
                  className="text-2xl font-semibold"
                  style={{ color: "#52c41a" }}
                >
                  {summary.passed}
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="text-sm text-gray-600 mb-1">Failed</div>
                <div
                  className="text-2xl font-semibold"
                  style={{ color: "#ff4d4f" }}
                >
                  {summary.failed}
                </div>
              </div>
              {summary.avgScore > 0 && (
                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="text-sm text-gray-600 mb-1">Avg Score</div>
                  <div className="text-2xl font-semibold text-gray-900">
                    {summary.avgScore.toFixed(2)} / 10
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-4">
            <Title level={4} className="mb-4">
              Chi tiết kết quả
            </Title>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Table
                dataSource={results}
                columns={columns}
                rowKey={(record, index) => record.id || `row-${index}`}
                pagination={false}
                scroll={{ x: true }}
                size="small"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
