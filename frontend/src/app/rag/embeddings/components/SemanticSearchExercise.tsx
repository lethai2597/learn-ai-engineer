"use client";

import { useState } from "react";
import { Form, Input, Button, Alert, Typography, Tag, Progress } from "antd";
import { useSemanticSearch } from "@/hooks/use-embeddings";
import { ServiceCodeDisplay } from "@/components/ServiceCodeDisplay";

const { TextArea } = Input;
const { Paragraph, Text } = Typography;

const DEFAULT_QUERY = "Con chó";

const DEFAULT_TEXTS = [
  "Con chó đang chạy trong công viên",
  "The dog is running",
  "Mèo đang ngủ trên ghế",
  "The cat is sleeping",
  "Chó là động vật trung thành",
  "Dog is a loyal animal",
  "Tôi thích nuôi chó",
  "I love dogs",
  "Mèo thích bắt chuột",
  "Cats like to catch mice",
];

export function SemanticSearchExercise() {
  const [form] = Form.useForm();
  const semanticSearch = useSemanticSearch();
  const [results, setResults] = useState<{
    query: string;
    results: Array<{
      text: string;
      similarity: number;
      rank: number;
    }>;
    latency: number;
  } | null>(null);

  const handleSubmit = async (values: {
    query: string;
    texts: string;
    topK?: number;
  }) => {
    try {
      const texts = values.texts
        .split("\n")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const response = await semanticSearch.mutateAsync({
        query: values.query,
        texts,
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
      <ServiceCodeDisplay code="rag embeddings 02" />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          query: DEFAULT_QUERY,
          texts: DEFAULT_TEXTS.join("\n"),
          topK: 5,
        }}
      >
        <Form.Item
          label="Query text (tìm kiếm)"
          name="query"
          rules={[{ required: true, message: "Vui lòng nhập query" }]}
        >
          <Input placeholder="Con chó" />
        </Form.Item>

        <Form.Item
          label="Danh sách texts để search (mỗi text một dòng)"
          name="texts"
          rules={[{ required: true, message: "Vui lòng nhập ít nhất 1 text" }]}
          help="Nhập nhiều texts, mỗi text một dòng"
        >
          <TextArea
            rows={10}
            placeholder="Con chó đang chạy&#10;The dog is running"
          />
        </Form.Item>

        <Form.Item
          label="Top K (số lượng kết quả)"
          name="topK"
          rules={[{ required: true, message: "Vui lòng nhập topK" }]}
        >
          <Input type="number" min={1} max={20} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={semanticSearch.isPending}
            block
          >
            Tìm kiếm
          </Button>
        </Form.Item>
      </Form>

      {semanticSearch.error && (
        <Alert
          description={semanticSearch.error.message || "Có lỗi xảy ra"}
          type="error"
          showIcon
        />
      )}

      {results && (
        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Kết quả Semantic Search
              </h3>
              <Text className="text-sm text-gray-600">
                Query: <strong>{results.query}</strong>
              </Text>
            </div>
            <Tag color="green">Latency: {results.latency}ms</Tag>
          </div>

          <div className="space-y-4">
            {results.results.map((result) => (
              <div
                key={result.rank}
                className="border border-gray-200 rounded-lg p-6 bg-white"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag color="blue">Rank #{result.rank}</Tag>
                      <Tag color={getSimilarityColor(result.similarity)}>
                        {formatSimilarity(result.similarity)}% similar
                      </Tag>
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
        </div>
      )}
    </div>
  );
}
