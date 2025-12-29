"use client";

import { useState } from "react";
import {
  Button,
  Table,
  Alert,
  Space,
  Typography,
  Tag,
  Card,
  Statistic,
  DatePicker,
  Select,
  Input,
  Form,
} from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { promptEngineeringApi } from "@/lib/api/prompt-engineering.api";
import { PromptTechnique } from "@/types/prompt-engineering";

const { Title, Paragraph } = Typography;
const { RangePicker } = DatePicker;

interface LLMLog {
  timestamp: string;
  userId?: string;
  model: string;
  provider: string;
  prompt: string;
  response: string;
  tokens: {
    input: number;
    output: number;
    total: number;
  };
  cost: number;
  latency: number;
  endpoint?: string;
  error?: string;
}

interface Stats {
  totalCalls: number;
  totalCost: number;
  totalTokens: number;
  averageLatency: number;
  byModel: Record<string, { calls: number; cost: number }>;
}

export function PracticeSection() {
  const queryClient = useQueryClient();
  const [queryForm] = Form.useForm();
  const [testForm] = Form.useForm();
  const [filters, setFilters] = useState<{
    userId?: string;
    model?: string;
    startDate?: string;
    endDate?: string;
  }>({});
  const [shouldFetchLogs, setShouldFetchLogs] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    data: logs,
    isLoading: logsLoading,
    refetch: refetchLogs,
  } = useQuery<LLMLog[]>({
    queryKey: ["observability", "logs", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.userId) params.append("userId", filters.userId);
      if (filters.model) params.append("model", filters.model);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);

      const response = await apiClient.get(
        `/api/v1/observability/logs?${params}`
      );

      let logs: LLMLog[] = [];

      if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
        logs = response.data.data.data;
      } else if (Array.isArray(response.data?.data)) {
        logs = response.data.data;
      } else if (Array.isArray(response.data)) {
        logs = response.data;
      }

      console.log("Observability logs parsed:", {
        raw: response.data,
        logs,
        length: logs.length,
        isArray: Array.isArray(logs),
        shouldFetchLogs,
        filters,
      });
      return logs;
    },
    enabled: shouldFetchLogs,
  });

  console.log("Observability logs state:", {
    logs,
    logsLoading,
    shouldFetchLogs,
    logsLength: Array.isArray(logs) ? logs.length : 0,
  });

  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({
    queryKey: ["observability", "stats"],
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/observability/stats");
      const data = response.data.data;
      return {
        ...data,
        byModel: data.byModel || {},
      };
    },
  });

  const handleQuery = (values: {
    userId?: string;
    model?: string;
    dateRange?: [unknown, unknown];
  }) => {
    const newFilters: typeof filters = {};
    if (values.userId) newFilters.userId = values.userId;
    if (values.model) newFilters.model = values.model;
    if (values.dateRange && values.dateRange[0] && values.dateRange[1]) {
      const start = values.dateRange[0] as { toISOString: () => string };
      const end = values.dateRange[1] as { toISOString: () => string };
      newFilters.startDate = start.toISOString();
      newFilters.endDate = end.toISOString();
    }
    setFilters(newFilters);
    setShouldFetchLogs(true);
    refetchLogs();
  };

  const handleGenerateTestLog = async (values: {
    userInput: string;
    model: string;
  }) => {
    setIsGenerating(true);
    try {
      await promptEngineeringApi.testPrompt({
        technique: PromptTechnique.ZERO_SHOT,
        userInput: values.userInput,
        model: values.model,
        temperature: 0.7,
      });

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["observability", "stats"] });
        if (shouldFetchLogs) {
          refetchLogs();
        }
        setIsGenerating(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to generate test log:", error);
      setIsGenerating(false);
    }
  };

  const columns = [
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      width: 180,
      render: (text: string) => new Date(text).toLocaleString("vi-VN"),
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      width: 150,
      render: (model: string) => <Tag color="blue">{model}</Tag>,
    },
    {
      title: "Tokens",
      dataIndex: "tokens",
      key: "tokens",
      width: 120,
      render: (tokens: { total: number }) => tokens.total.toLocaleString(),
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
      width: 100,
      render: (cost: number) => `$${cost.toFixed(4)}`,
    },
    {
      title: "Latency",
      dataIndex: "latency",
      key: "latency",
      width: 100,
      render: (latency: number) => `${latency}ms`,
    },
    {
      title: "Endpoint",
      dataIndex: "endpoint",
      key: "endpoint",
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "error",
      key: "status",
      width: 100,
      render: (error?: string) =>
        error ? <Tag color="red">Error</Tag> : <Tag color="green">Success</Tag>,
    },
  ];

  return (
    <div className="space-y-6 px-6 py-4">
      <div>
        <Title level={3} className="mb-4">
          Generate Test Logs
        </Title>
        <Card>
          <Paragraph className="text-gray-700 mb-4">
            Tạo một LLM call test để xem observability hoạt động. Sau khi
            generate, refresh stats và query logs để xem kết quả.
          </Paragraph>
          <Form
            form={testForm}
            layout="vertical"
            onFinish={handleGenerateTestLog}
            initialValues={{
              userInput: "What is the capital of France?",
              model: "openai/gpt-3.5-turbo",
            }}
          >
            <Form.Item
              name="userInput"
              label="User Input"
              rules={[{ required: true, message: "Vui lòng nhập input" }]}
            >
              <Input.TextArea rows={3} placeholder="Enter your prompt here" />
            </Form.Item>
            <Form.Item
              name="model"
              label="Model"
              rules={[{ required: true, message: "Vui lòng chọn model" }]}
            >
              <Select>
                <Select.Option value="openai/gpt-3.5-turbo">
                  GPT-3.5 Turbo
                </Select.Option>
                <Select.Option value="openai/gpt-4o">GPT-4o</Select.Option>
                <Select.Option value="anthropic/claude-3.5-sonnet">
                  Claude 3.5 Sonnet
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={isGenerating}>
                  Generate Test LLM Call
                </Button>
                <Button
                  onClick={() => {
                    queryClient.invalidateQueries({
                      queryKey: ["observability", "stats"],
                    });
                    if (shouldFetchLogs) {
                      refetchLogs();
                    }
                  }}
                >
                  Refresh Stats
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>

      <div>
        <Title level={3} className="mb-4">
          Statistics
        </Title>
        {statsLoading ? (
          <div>Loading...</div>
        ) : stats ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <Statistic title="Total Calls" value={stats.totalCalls} />
              </Card>
              <Card>
                <Statistic
                  title="Total Cost"
                  value={stats.totalCost}
                  prefix="$"
                  precision={2}
                  valueStyle={{ color: "#cf1322" }}
                />
              </Card>
              <Card>
                <Statistic
                  title="Total Tokens"
                  value={stats.totalTokens}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
              <Card>
                <Statistic
                  title="Avg Latency"
                  value={stats.averageLatency}
                  suffix="ms"
                  valueStyle={{ color: "#722ed1" }}
                />
              </Card>
            </div>

            {stats.byModel && Object.keys(stats.byModel).length > 0 && (
              <div className="mb-6">
                <Title level={4} className="mb-4">
                  Cost by Model
                </Title>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(stats.byModel).map(([model, data]) => (
                    <Card key={model} size="small">
                      <div className="flex justify-between items-center">
                        <Tag color="blue">{model}</Tag>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">
                            {data.calls} calls
                          </div>
                          <div className="text-lg font-semibold">
                            ${data.cost.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>

      <div>
        <Title level={3} className="mb-4">
          Query Logs
        </Title>
        <Card className="mb-4">
          <Form
            form={queryForm}
            layout="vertical"
            onFinish={handleQuery}
            initialValues={{}}
            className="pb-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item name="userId" label="User ID">
                <Input placeholder="Enter user ID" />
              </Form.Item>
              <Form.Item name="model" label="Model">
                <Select placeholder="Select model" allowClear>
                  <Select.Option value="openai/gpt-4o">GPT-4o</Select.Option>
                  <Select.Option value="openai/gpt-3.5-turbo">
                    GPT-3.5 Turbo
                  </Select.Option>
                  <Select.Option value="anthropic/claude-3-opus">
                    Claude 3 Opus
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="dateRange" label="Date Range">
                <RangePicker className="w-full" />
              </Form.Item>
            </div>
            <Form.Item>
              <Space className="w-full">
                <Button type="primary" htmlType="submit" style={{ flex: 1 }}>
                  Query Logs
                </Button>
                <Button
                  onClick={() => {
                    queryForm.resetFields();
                    setFilters({});
                    setShouldFetchLogs(true);
                    refetchLogs();
                  }}
                >
                  Show All Logs
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        <div className="pt-4">
          {logsLoading ? (
            <div>Loading logs...</div>
          ) : Array.isArray(logs) && logs.length > 0 ? (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Table
                dataSource={logs}
                columns={columns}
                rowKey={(record, index) => record.timestamp + index}
                pagination={{ pageSize: 10 }}
                scroll={{ x: true }}
                size="small"
              />
            </div>
          ) : shouldFetchLogs && (!logs || logs.length === 0) ? (
            <Alert
              description="Try querying with different filters or make some LLM calls first."
              type="info"
              showIcon
            />
          ) : !shouldFetchLogs ? (
            <Alert
              description="Use the form above to query logs or click 'Show All Logs' to see all available logs."
              type="info"
              showIcon
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
