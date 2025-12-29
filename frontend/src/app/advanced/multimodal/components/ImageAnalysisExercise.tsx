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
  message,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useAnalyzeImage } from "@/hooks/use-multimodal";
import { ServiceCodeDisplay } from "@/components/ServiceCodeDisplay";

const { Title, Paragraph } = Typography;

export function ImageAnalysisExercise() {
  const [form] = Form.useForm();
  const [result, setResult] = useState<{
    analysis: string;
    model: string;
    tokens: {
      input: number;
      output: number;
      total: number;
    };
  } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const analyzeImage = useAnalyzeImage();

  const handleImageUrlChange = (url: string) => {
    form.setFieldsValue({ imageUrl: url });
    if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const handleClearImage = () => {
    form.setFieldsValue({ imageUrl: "" });
    setImagePreview(null);
  };

  const handleSubmit = async (values: {
    imageUrl: string;
    prompt?: string;
  }) => {
    try {
      const response = await analyzeImage.mutateAsync({
        imageUrl: values.imageUrl,
        prompt: values.prompt || "What is in this image? Describe in detail.",
      });
      setResult(response);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi phân tích image";
      message.error(errorMessage);
    }
  };

  return (
    <div>
      <ServiceCodeDisplay code="advanced multimodal 01" />
      <div className="space-y-6 mt-4">
        <div>
          <Title level={4} className="mb-2">
            Image Analysis với GPT-4 Vision
          </Title>
          <Paragraph className="text-gray-600 mb-4">
            Nhập image URL (HTTP/HTTPS), sau đó phân tích với GPT-4 Vision. Bạn
            có thể customize prompt để focus vào những gì muốn analyze.
          </Paragraph>
        </div>

        <div>
          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                prompt: "What is in this image? Describe in detail.",
              }}
            >
              <Form.Item
                name="imageUrl"
                label="Image URL"
                rules={[
                  { required: true, message: "Vui lòng nhập image URL" },
                  {
                    pattern: /^https?:\/\/.+/,
                    message: "URL phải bắt đầu bằng http:// hoặc https://",
                  },
                ]}
              >
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://example.com/image.png"
                      value={form.getFieldValue("imageUrl")}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                      className="flex-1"
                    />
                    {form.getFieldValue("imageUrl") && (
                      <Button onClick={handleClearImage} danger>
                        Xóa ảnh
                      </Button>
                    )}
                  </div>
                  {imagePreview && (
                    <div className="mt-4 relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-full h-auto rounded border border-gray-200"
                        style={{ maxHeight: "300px" }}
                        onError={() => {
                          setImagePreview(null);
                          message.error("Không thể load image từ URL này");
                        }}
                      />
                    </div>
                  )}
                </div>
              </Form.Item>

              <Form.Item
                name="prompt"
                label="Prompt"
                rules={[{ required: true, message: "Vui lòng nhập prompt" }]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="What is in this image? Describe in detail."
                />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={analyzeImage.isPending}
                  >
                    Analyze Image
                  </Button>
                  <Button
                    onClick={() => {
                      form.resetFields();
                      setResult(null);
                      setImagePreview(null);
                    }}
                  >
                    Clear
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </div>

        {analyzeImage.isError && (
          <div>
            <Alert
              description={
                analyzeImage.error?.message ||
                "Có lỗi xảy ra khi phân tích image"
              }
              type="error"
              showIcon
            />
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <Statistic title="Model" value={result.model} />
              </Card>
              <Card>
                <Statistic title="Input Tokens" value={result.tokens.input} />
              </Card>
              <Card>
                <Statistic
                  title="Output Tokens"
                  value={result.tokens.output}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </div>

            <div>
              <Title level={5} className="mb-2">
                Analysis Result
              </Title>
              <Card>
                <Paragraph className="text-gray-700 whitespace-pre-wrap">
                  {result.analysis}
                </Paragraph>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
