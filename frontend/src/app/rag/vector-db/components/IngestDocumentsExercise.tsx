"use client";

import { useState } from "react";
import { Form, Input, Button, Alert, Typography, Tag, Table } from "antd";
import { useIngestDocuments } from "@/hooks/use-vector-db";
import { ServiceCodeDisplay } from "@/components/ServiceCodeDisplay";

const { TextArea } = Input;
const { Paragraph, Text } = Typography;

const DEFAULT_TEXTS = [
  "Con chó đang chạy",
  "The dog is running",
  "Mèo đang ngủ",
  "The cat is sleeping",
  "Chó là động vật",
  "Dog is an animal",
  "Mèo là thú cưng",
  "Cat is a pet",
  "Chó và mèo đều là động vật",
  "Dogs and cats are both animals",
];

export function IngestDocumentsExercise() {
  const [form] = Form.useForm();
  const ingestDocuments = useIngestDocuments();
  const [results, setResults] = useState<{
    documentIds: string[];
    texts: string[];
    count: number;
    collectionName: string;
    latency: number;
  } | null>(null);

  const handleSubmit = async (values: {
    texts: string;
    collectionName?: string;
  }) => {
    try {
      const texts = values.texts
        .split("\n")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      if (texts.length === 0) {
        return;
      }

      const response = await ingestDocuments.mutateAsync({
        texts,
        collectionName: values.collectionName || undefined,
      });
      setResults(response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <ServiceCodeDisplay code="rag vector db 01" />
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          texts: DEFAULT_TEXTS.join("\n"),
          collectionName: "documents",
        }}
      >
        <Form.Item
          label="Danh sách texts (mỗi text một dòng)"
          name="texts"
          rules={[{ required: true, message: "Vui lòng nhập ít nhất 1 text" }]}
          help="Nhập nhiều texts, mỗi text một dòng. Texts sẽ được tạo embeddings và lưu vào vector database"
        >
          <TextArea
            rows={10}
            placeholder="Con chó đang chạy&#10;The dog is running&#10;Mèo đang ngủ"
          />
        </Form.Item>

        <Form.Item
          label="Collection Name (tùy chọn)"
          name="collectionName"
          help="Tên collection để lưu documents. Mặc định: 'documents'"
        >
          <Input placeholder="documents" />
        </Form.Item>

        <div className="pt-4">
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={ingestDocuments.isPending}
              block
            >
              Ingest Documents
            </Button>
          </Form.Item>
        </div>
      </Form>

      {ingestDocuments.error && (
        <Alert
          description={ingestDocuments.error.message || "Có lỗi xảy ra"}
          type="error"
          showIcon
        />
      )}

      {results && (
        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Kết quả Ingest
            </h3>
            <div className="flex items-center gap-2">
              <Tag color="blue">Collection: {results.collectionName}</Tag>
              <Tag color="green">Latency: {results.latency}ms</Tag>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <div className="space-y-4">
              <div>
                <Text strong className="text-sm text-gray-600">
                  Số lượng documents đã ingest:
                </Text>
                <Paragraph className="text-gray-900 font-medium mt-1 mb-0">
                  {results.count} documents
                </Paragraph>
              </div>

              <div>
                <Text strong className="text-sm text-gray-600 mb-2 block">
                  Danh sách documents đã ingest:
                </Text>
                <div className="bg-gray-50 rounded border border-gray-100 overflow-hidden">
                  <Table
                    dataSource={results.documentIds.map((id, index) => ({
                      key: id,
                      index: index + 1,
                      id,
                      text: results.texts[index] || "",
                    }))}
                    columns={[
                      {
                        title: "#",
                        dataIndex: "index",
                        key: "index",
                        width: 60,
                        align: "center",
                      },
                      {
                        title: "Document ID",
                        dataIndex: "id",
                        key: "id",
                        width: 200,
                        render: (id: string) => (
                          <Tag color="blue" className="font-mono text-xs">
                            {id}
                          </Tag>
                        ),
                      },
                      {
                        title: "Text",
                        dataIndex: "text",
                        key: "text",
                        render: (text: string) => (
                          <Paragraph className="mb-0 text-gray-900">
                            {text}
                          </Paragraph>
                        ),
                      },
                    ]}
                    pagination={false}
                    size="small"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




