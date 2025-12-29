"use client";

import { useState } from "react";
import { Form, Input, Button, Alert, Typography, Card, Tag, Steps } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import { useConditionalChain } from "@/hooks/use-chains-routing";
import { ServiceCodeDisplay } from "@/components/ServiceCodeDisplay";

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

export function ConditionalChainExercise() {
  const [form] = Form.useForm();
  const conditionalChain = useConditionalChain();
  const [result, setResult] = useState<{
    detectedLanguage: string;
    wasTranslated: boolean;
    processedDocument: string;
    summary: string;
    entities: string[];
    totalTime: number;
  } | null>(null);

  const handleSubmit = async (values: { document: string }) => {
    if (!values.document?.trim()) {
      return;
    }

    try {
      const response = await conditionalChain.mutateAsync({
        document: values.document.trim(),
      });
      setResult(response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="">
      <div className="">
        <ServiceCodeDisplay code="orchestration chains routing 03" />
        <Title level={4} className="mb-2 mt-4">
          Conditional Chain: Detect Language → Translate (if needed) → Summarize
          → Extract Entities
        </Title>
        <Paragraph className="text-gray-600">
          Nhập document, hệ thống sẽ phát hiện ngôn ngữ, dịch sang tiếng Anh nếu
          cần, sau đó tóm tắt và extract entities.
        </Paragraph>
      </div>

      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={{
          document:
            "LangChain is a framework for developing applications powered by language models. It provides abstractions for chains, agents, and memory management. This framework is widely used in RAG and AI agent projects.",
        }}
      >
        <Form.Item
          name="document"
          label="Document Text"
          rules={[{ required: true, message: "Vui lòng nhập document" }]}
        >
          <TextArea
            rows={4}
            placeholder='Ví dụ: "LangChain is a framework for developing applications..." hoặc "Vector databases là công nghệ lưu trữ..."'
            disabled={conditionalChain.isPending}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={conditionalChain.isPending}
          >
            Chạy Conditional Chain
          </Button>
        </Form.Item>
      </Form>

      {conditionalChain.error && (
        <Alert
          description={conditionalChain.error.message || "Có lỗi xảy ra"}
          type="error"
          showIcon
        />
      )}

      {result && (
        <div className="mt-6">
          <Title level={4} className="mb-4">
            Kết quả
          </Title>

          <Steps
            orientation="vertical"
            current={4}
            items={[
              {
                title: "Step 1: Language Detection",
                description: (
                  <Card className="mt-2">
                    <div className="flex items-center gap-2">
                      <span>Detected Language:</span>
                      <Tag color="blue">{result.detectedLanguage}</Tag>
                    </div>
                  </Card>
                ),
              },
              {
                title: "Step 2: Translation (Conditional)",
                description: (
                  <Card className="mt-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span>Was Translated:</span>
                        <Tag color={result.wasTranslated ? "orange" : "green"}>
                          {result.wasTranslated
                            ? "Yes"
                            : "No (already English)"}
                        </Tag>
                      </div>
                      {result.wasTranslated && (
                        <div>
                          <Paragraph strong className="mb-1">
                            Translated Document:
                          </Paragraph>
                          <Paragraph className="mb-0 whitespace-pre-wrap text-gray-700">
                            {result.processedDocument}
                          </Paragraph>
                        </div>
                      )}
                    </div>
                  </Card>
                ),
              },
              {
                title: "Step 3: Summary",
                description: (
                  <Card className="mt-2">
                    <Paragraph
                      style={{ marginBottom: 0 }}
                      className="whitespace-pre-wrap"
                    >
                      {result.summary}
                    </Paragraph>
                  </Card>
                ),
              },
              {
                title: "Step 4: Entity Extraction",
                description: (
                  <Card className="mt-2">
                    <div className="flex flex-wrap gap-2">
                      {result.entities.length > 0 ? (
                        result.entities.map((entity, index) => (
                          <Tag key={index} color="purple">
                            {entity}
                          </Tag>
                        ))
                      ) : (
                        <span className="text-gray-500">No entities found</span>
                      )}
                    </div>
                  </Card>
                ),
              },
            ]}
          />

          <div className="mt-4">
            <Tag color="green">Total Time: {result.totalTime}ms</Tag>
          </div>
        </div>
      )}
    </div>
  );
}
