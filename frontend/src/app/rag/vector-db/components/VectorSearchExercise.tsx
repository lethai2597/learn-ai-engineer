"use client";

import { useState } from "react";
import { Form, Input, Button, Alert, Typography, Tag, Progress } from "antd";
import { useVectorSearch } from "@/hooks/use-vector-db";
import { ServiceCodeDisplay } from "@/components/ServiceCodeDisplay";

const { Paragraph, Text } = Typography;

const DEFAULT_QUERY = "Con chó";
const DEFAULT_COLLECTION = "documents";

export function VectorSearchExercise() {
  const [form] = Form.useForm();
  const vectorSearch = useVectorSearch();
  const [results, setResults] = useState<{
    query: string;
    collectionName: string;
    results: Array<{
      id: string;
      text: string;
      similarity: number;
      rank: number;
    }>;
    latency: number;
  } | null>(null);

  const handleSubmit = async (values: {
    query: string;
    collectionName: string;
    topK?: number;
  }) => {
    try {
      const response = await vectorSearch.mutateAsync({
        query: values.query,
        collectionName: values.collectionName,
        topK: values.topK || 5,
      });
      setResults(response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const formatSimilarity = (similarity: number): string => {
    return (similarity * 100).toFixed(2);
  };

  const getSimilarityColor = (similarity: number): string => {
    if (similarity >= 0.8) return "green";
    if (similarity >= 0.6) return "blue";
    if (similarity >= 0.4) return "orange";
    return "red";
  };

  return (
    <div className="space-y-6">
      <ServiceCodeDisplay code="rag vector db 02" />
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          query: DEFAULT_QUERY,
          collectionName: DEFAULT_COLLECTION,
          topK: 5,
        }}
      >
        <Form.Item
          label="Query text (tìm kiếm semantic)"
          name="query"
          rules={[{ required: true, message: "Vui lòng nhập query" }]}
          help="Nhập query text để tìm kiếm trong vector database"
        >
          <Input placeholder="Con chó" />
        </Form.Item>

        <Form.Item
          label="Collection Name"
          name="collectionName"
          rules={[
            { required: true, message: "Vui lòng nhập collection name" },
          ]}
          help="Tên collection chứa documents đã được ingest"
        >
          <Input placeholder="documents" />
        </Form.Item>

        <Form.Item
          label="Top K (số lượng kết quả)"
          name="topK"
          rules={[{ required: true, message: "Vui lòng nhập topK" }]}
        >
          <Input type="number" min={1} max={100} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={vectorSearch.isPending}
            block
          >
            Tìm kiếm trong Vector DB
          </Button>
        </Form.Item>
      </Form>

      {vectorSearch.error && (
        <Alert
          description={vectorSearch.error.message || "Có lỗi xảy ra"}
          type="error"
          showIcon
        />
      )}

      {results && (
        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Kết quả Vector Search
              </h3>
              <Text className="text-sm text-gray-600">
                Query: <strong>{results.query}</strong> | Collection:{" "}
                <strong>{results.collectionName}</strong>
              </Text>
            </div>
            <Tag color="green">Latency: {results.latency}ms</Tag>
          </div>

          {results.results.length === 0 ? (
            <Alert
              message="Không tìm thấy kết quả"
              description="Không có documents nào trong collection hoặc query không khớp với documents nào."
              type="warning"
              showIcon
            />
          ) : (
            <div className="space-y-4">
              {results.results.map((result) => (
                <div
                  key={result.id}
                  className="border border-gray-200 rounded-lg p-6 bg-white"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag color="blue">Rank #{result.rank}</Tag>
                        <Tag color={getSimilarityColor(result.similarity)}>
                          {formatSimilarity(result.similarity)}% similar
                        </Tag>
                        <Tag color="default">ID: {result.id}</Tag>
                      </div>
                    </div>

                    <Paragraph className="text-gray-900 font-medium mb-0">
                      {result.text}
                    </Paragraph>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Text className="text-xs text-gray-600">
                          Similarity Score: {result.similarity.toFixed(4)}
                        </Text>
                        <Text className="text-xs text-gray-600">
                          {formatSimilarity(result.similarity)}%
                        </Text>
                      </div>
                      <Progress
                        percent={parseFloat(formatSimilarity(result.similarity))}
                        strokeColor={
                          result.similarity >= 0.8
                            ? "#52c41a"
                            : result.similarity >= 0.6
                            ? "#1890ff"
                            : result.similarity >= 0.4
                            ? "#faad14"
                            : "#ff4d4f"
                        }
                        showInfo={false}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}





