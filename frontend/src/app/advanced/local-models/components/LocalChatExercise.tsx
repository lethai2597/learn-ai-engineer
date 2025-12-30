"use client";

import { useState, useEffect } from "react";
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
  Select,
  Spin,
} from "antd";
import { useLocalChat, useListModels } from "@/hooks/use-local-models";
import { ServiceCodeDisplay } from "@/components/ServiceCodeDisplay";

const { Title, Paragraph } = Typography;

export function LocalChatExercise() {
  const [form] = Form.useForm();
  const [result, setResult] = useState<{
    response: string;
    model: string;
    tokens?: {
      input: number;
      output: number;
      total: number;
    };
  } | null>(null);
  const localChat = useLocalChat();
  const listModels = useListModels();

  useEffect(() => {
    if (listModels.data?.models && listModels.data.models.length > 0) {
      form.setFieldsValue({ model: listModels.data.models[0] });
    }
  }, [listModels.data, form]);

  const handleSubmit = async (values: { message: string; model?: string }) => {
    try {
      const response = await localChat.mutateAsync({
        message: values.message,
        model: values.model,
      });
      setResult(response);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi chat với local model";
      message.error(errorMessage);
    }
  };

  return (
    <div>
      <div className="px-6 py-4 space-y-6 mt-4">
        <ServiceCodeDisplay code="advanced local models 01" />
        <div>
          <Title level={4} className="mb-2">
            Chat với Local Model (Ollama)
          </Title>
          <Paragraph className="text-gray-600 mb-4">
            Gửi message đến local model thông qua Ollama. Đảm bảo Ollama đang
            chạy:{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">ollama serve</code>
          </Paragraph>
          {!listModels.isLoading && listModels.isError && (
            <Alert
              message="Không thể kết nối đến Ollama"
              description="Vui lòng đảm bảo Ollama đang chạy. Chạy lệnh: ollama serve"
              type="warning"
              showIcon
              className="mb-4"
            />
          )}
        </div>

        <div>
          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                model: "llama3",
              }}
            >
              <Form.Item
                name="model"
                label="Model"
                help="Chọn model đã được pull trong Ollama"
              >
                {listModels.isLoading ? (
                  <Spin size="small" />
                ) : (
                  <Select
                    placeholder="Chọn model"
                    options={
                      listModels.data?.models?.map((model: string) => ({
                        label: model,
                        value: model,
                      })) || [{ label: "llama3", value: "llama3" }]
                    }
                    allowClear={false}
                  />
                )}
              </Form.Item>

              <Form.Item
                name="message"
                label="Message"
                rules={[{ required: true, message: "Vui lòng nhập message" }]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Nhập message để gửi đến local model..."
                />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={localChat.isPending}
                  >
                    Send Message
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

        {localChat.isError && (
          <div>
            <Alert
              description={
                localChat.error?.message ||
                "Có lỗi xảy ra khi chat với local model"
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
              {result.tokens && (
                <>
                  <Card>
                    <Statistic
                      title="Input Tokens"
                      value={result.tokens.input}
                    />
                  </Card>
                  <Card>
                    <Statistic
                      title="Output Tokens"
                      value={result.tokens.output}
                    />
                  </Card>
                </>
              )}
            </div>

            <div>
              <Title level={5} className="mb-2">
                Response
              </Title>
              <Card>
                <Paragraph className="text-gray-700 whitespace-pre-wrap">
                  {result.response}
                </Paragraph>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
