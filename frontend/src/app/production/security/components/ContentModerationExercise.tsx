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
  Tag,
  Statistic,
} from "antd";
import { useModerateContent } from "@/hooks/use-security";
import { ServiceCodeDisplay } from "@/components/ServiceCodeDisplay";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const EXAMPLE_CONTENT = [
  "This is a normal message about technology and AI.",
  "I hate this product and want to destroy it completely.",
  "Can you help me with my homework?",
  "This content contains explicit sexual material.",
];

export function ContentModerationExercise() {
  const [form] = Form.useForm();
  const [result, setResult] = useState<any>(null);
  const moderateContent = useModerateContent();

  const handleSubmit = async (values: { text: string }) => {
    try {
      const response = await moderateContent.mutateAsync({
        text: values.text,
      });
      setResult(response);
    } catch (error) {
      console.error("Error moderating content:", error);
    }
  };

  const loadExample = (example: string) => {
    form.setFieldsValue({ text: example });
  };

  return (
    <div>
      <ServiceCodeDisplay code="production security 02" />
      <div className="space-y-6 mt-4">
        <div>
          <Title level={4} className="mb-2">
            Content Moderation
          </Title>
          <Paragraph className="text-gray-600 mb-4">
            Test content moderation với các loại content khác nhau. System sẽ
            detect harmful content và flag các categories.
          </Paragraph>
        </div>

        <div>
          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                text: "This is a normal message.",
              }}
            >
              <Form.Item
                name="text"
                label="Input Text"
                rules={[{ required: true, message: "Vui lòng nhập text" }]}
              >
                <TextArea
                  rows={6}
                  placeholder="Enter text to moderate..."
                  className="font-mono"
                />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={moderateContent.isPending}
                  >
                    Moderate Content
                  </Button>
                  <Button
                    onClick={() => {
                      form.resetFields();
                      setResult(null);
                    }}
                  >
                    Clear
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </div>

        <div>
          <Title level={5} className="mb-2">
            Example Content
          </Title>
          <div className="grid gap-2">
            {EXAMPLE_CONTENT.map((example, index) => (
              <Card
                key={index}
                size="small"
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => loadExample(example)}
              >
                <code className="text-sm text-gray-700">{example}</code>
              </Card>
            ))}
          </div>
        </div>

        {moderateContent.isError && (
          <div>
            <Alert
              description={
                moderateContent.error?.message ||
                "Có lỗi xảy ra khi moderate content"
              }
              type="error"
              showIcon
            />
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <Statistic
                  title="Flagged"
                  value={result.flagged ? "Yes" : "No"}
                />
              </Card>
              <Card>
                <Statistic title="Details" value={result.details} />
              </Card>
            </div>

            <div>
              <Title level={5} className="mb-2">
                Category Scores
              </Title>
              <Card>
                <div className="space-y-2">
                  {Object.entries(result.categoryScores).map(
                    ([category, score]: [string, any]) => (
                      <div
                        key={category}
                        className="flex justify-between items-center"
                      >
                        <span className="font-medium">{category}</span>
                        <Space>
                          <Tag
                            color={
                              result.categories[category] ? "red" : "green"
                            }
                          >
                            {result.categories[category] ? "Flagged" : "Safe"}
                          </Tag>
                          <span className="text-gray-600">
                            {(score * 100).toFixed(1)}%
                          </span>
                        </Space>
                      </div>
                    )
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
