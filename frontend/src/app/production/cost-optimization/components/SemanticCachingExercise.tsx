"use client";

import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Space,
  Alert,
  Statistic,
  Tag,
  message,
} from "antd";
import {
  useSemanticCache,
  useCostAnalysis,
} from "@/hooks/use-cost-optimization";
import { useQueryClient } from "@tanstack/react-query";
import { ServiceCodeDisplay } from "@/components/ServiceCodeDisplay";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

export function SemanticCachingExercise() {
  const [checkForm] = Form.useForm();
  const [storeForm] = Form.useForm();
  const [checkResult, setCheckResult] = useState<{
    cached: boolean;
    response?: string;
    similarity?: number;
  } | null>(null);
  const queryClient = useQueryClient();
  const semanticCache = useSemanticCache();
  const costAnalysis = useCostAnalysis();

  const handleCheck = async (values: { query: string; threshold?: number }) => {
    try {
      const response = await semanticCache.check.mutateAsync({
        query: values.query,
        threshold: values.threshold,
      });
      setCheckResult(response);
    } catch (error) {
      console.error("Error checking cache:", error);
    }
  };

  const handleStore = async (values: { query: string; response: string }) => {
    try {
      await semanticCache.store.mutateAsync(values);
      queryClient.invalidateQueries({
        queryKey: ["cost-optimization", "cache-stats"],
      });
      storeForm.resetFields();
      message.success("Cache stored successfully");
    } catch (error) {
      console.error("Error storing cache:", error);
    }
  };

  const handleGenerateResponse = async (values: { query: string }) => {
    try {
      const analysis = await costAnalysis.mutateAsync({
        prompt: values.query,
        model: "gpt-4o",
        maxTokens: 500,
      });
      storeForm.setFieldsValue({
        query: values.query,
        response: `Generated response (estimated cost: $${analysis.estimatedCost.toFixed(
          6
        )})`,
      });
    } catch (error) {
      console.error("Error generating response:", error);
    }
  };

  const { data: stats } = semanticCache.stats;

  return (
    <div>
      <ServiceCodeDisplay code="production cost optimization 02" />
      <div className="space-y-6 mt-4">
        <div>
          <Title level={4} className="mb-2">
            Semantic Caching
          </Title>
          <Paragraph className="text-gray-600 mb-4">
            Kiểm tra cache cho queries tương tự. Cache responses để tái sử dụng
            và giảm cost.
          </Paragraph>
        </div>

        {stats && (
          <div>
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <Statistic title="Total Entries" value={stats.totalEntries} />
              </Card>
              <Card>
                <Statistic
                  title="Hit Rate"
                  value={stats.hitRate * 100}
                  suffix="%"
                  precision={2}
                />
              </Card>
              <Card>
                <Statistic
                  title="Total Savings"
                  value={stats.savings}
                  prefix="$"
                  precision={2}
                />
              </Card>
            </div>
          </div>
        )}

        <div>
          <Card>
            <Title level={5} className="mb-4">
              Check Cache
            </Title>
            <Form
              form={checkForm}
              layout="vertical"
              onFinish={handleCheck}
              initialValues={{
                query: "What is the capital of France?",
                threshold: 0.95,
              }}
            >
              <Form.Item
                name="query"
                label="Query"
                rules={[{ required: true, message: "Vui lòng nhập query" }]}
              >
                <TextArea
                  rows={4}
                  placeholder="Enter query to check cache..."
                />
              </Form.Item>

              <Form.Item name="threshold" label="Similarity Threshold">
                <Input type="number" step="0.01" min="0" max="1" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={semanticCache.check.isPending}
                >
                  Check Cache
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>

        {checkResult && (
          <div>
            <Card>
              <Title level={5} className="mb-4">
                Cache Result
              </Title>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  <Tag color={checkResult.cached ? "green" : "red"}>
                    {checkResult.cached ? "Cache Hit" : "Cache Miss"}
                  </Tag>
                </div>
                {checkResult.similarity !== undefined && (
                  <div>
                    <span className="font-medium">Similarity: </span>
                    <span>{(checkResult.similarity * 100).toFixed(2)}%</span>
                  </div>
                )}
                {checkResult.response && (
                  <div>
                    <span className="font-medium">Cached Response:</span>
                    <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-100">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                        {checkResult.response}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        <div>
          <Card>
            <Title level={5} className="mb-4">
              Store Cache
            </Title>
            <Form
              form={storeForm}
              layout="vertical"
              onFinish={handleStore}
              initialValues={{}}
            >
              <Form.Item
                name="query"
                label="Query"
                rules={[{ required: true, message: "Vui lòng nhập query" }]}
              >
                <TextArea rows={3} placeholder="Enter query to cache..." />
              </Form.Item>

              <Form.Item
                name="response"
                label="Response"
                rules={[{ required: true, message: "Vui lòng nhập response" }]}
              >
                <TextArea rows={4} placeholder="Enter response to cache..." />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={semanticCache.store.isPending}
                  >
                    Store Cache
                  </Button>
                  <Button
                    onClick={() => {
                      const query = storeForm.getFieldValue("query");
                      if (query) {
                        handleGenerateResponse({ query });
                      }
                    }}
                    loading={costAnalysis.isPending}
                  >
                    Generate Response (Mock)
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </div>

        {(semanticCache.check.isError || semanticCache.store.isError) && (
          <div>
            <Alert
              description="Có lỗi xảy ra khi thao tác với cache"
              type="error"
              showIcon
            />
          </div>
        )}
      </div>
    </div>
  );
}
