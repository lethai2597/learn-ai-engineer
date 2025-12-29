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
  Divider,
} from "antd";
import { useValidateDataset, usePrepareDataset } from "@/hooks/use-fine-tuning";
import type { FineTuneExample } from "@/types/fine-tuning";
import { ServiceCodeDisplay } from "@/components/ServiceCodeDisplay";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

export function FineTuningExercise() {
  const [form] = Form.useForm();
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    exampleCount: number;
    avgTokensPerExample: number;
    totalTokens: number;
    errors?: string[];
    warnings?: string[];
  } | null>(null);
  const [preparedDataset, setPreparedDataset] = useState<{
    jsonlContent: string;
    exampleCount: number;
    preview: string[];
  } | null>(null);

  const validateDataset = useValidateDataset();
  const prepareDataset = usePrepareDataset();

  const parseExamples = (text: string): FineTuneExample[] => {
    try {
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) {
        throw new Error("Dataset phải là một array");
      }
      return parsed;
    } catch (error) {
      throw new Error(
        `Invalid JSON: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  const handleValidate = async () => {
    try {
      const values = form.getFieldsValue();
      const examples = parseExamples(values.dataset);
      const result = await validateDataset.mutateAsync({ examples });
      setValidationResult(result);
      setPreparedDataset(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Có lỗi xảy ra khi validate dataset";
      message.error(errorMessage);
    }
  };

  const handlePrepare = async () => {
    try {
      const values = form.getFieldsValue();
      const examples = parseExamples(values.dataset);
      const result = await prepareDataset.mutateAsync({ examples });
      setPreparedDataset(result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Có lỗi xảy ra khi prepare dataset";
      message.error(errorMessage);
    }
  };

  const exampleDataset = `[
  {
    "messages": [
      { "role": "system", "content": "You are a helpful customer service assistant." },
      { "role": "user", "content": "I want to cancel my order" },
      { "role": "assistant", "content": "I'll help you cancel your order. Could you provide your order number?" }
    ]
  },
  {
    "messages": [
      { "role": "system", "content": "You are a helpful customer service assistant." },
      { "role": "user", "content": "Where is my package?" },
      { "role": "assistant", "content": "Let me check your shipping status. What's your tracking number?" }
    ]
  }
]`;

  return (
    <div>
      <ServiceCodeDisplay code="advanced fine tuning 01" />
      <div className="space-y-6 mt-4">
        <div>
          <Title level={4} className="mb-2">
            Validate và Prepare Fine-tuning Dataset
        </Title>
        <Paragraph className="text-gray-600 mb-4">
          Nhập dataset dạng JSON array. Mỗi example phải có format messages theo chuẩn OpenAI. Validate để kiểm tra dataset có hợp lệ, sau đó prepare để convert sang JSONL format.
        </Paragraph>
      </div>

      <Card>
        <Form form={form} layout="vertical" initialValues={{ dataset: exampleDataset }}>
          <Form.Item
            name="dataset"
            label="Dataset (JSON Array)"
            rules={[
              { required: true, message: "Vui lòng nhập dataset" },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  try {
                    parseExamples(value);
                    return Promise.resolve();
                  } catch (error) {
                    return Promise.reject(
                      new Error(
                        error instanceof Error ? error.message : "Invalid JSON format"
                      )
                    );
                  }
                },
              },
            ]}
          >
            <TextArea
              rows={12}
              placeholder="Paste JSON array here..."
              className="font-mono text-sm"
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                onClick={handleValidate}
                loading={validateDataset.isPending}
              >
                Validate Dataset
              </Button>
              <Button
                onClick={handlePrepare}
                loading={prepareDataset.isPending}
                disabled={!validationResult?.isValid}
              >
                Prepare JSONL
              </Button>
              <Button
                onClick={() => {
                  form.resetFields();
                  setValidationResult(null);
                  setPreparedDataset(null);
                }}
              >
                Clear
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {validateDataset.isError && (
        <Alert
          description={
            validateDataset.error?.message || "Có lỗi xảy ra khi validate dataset"
          }
          type="error"
          showIcon
        />
      )}

      {validationResult && (
        <div className="space-y-4">
          <Card>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Statistic
                  title="Validation Status"
                  value={validationResult.isValid ? "Valid" : "Invalid"}
                  valueStyle={{
                    color: validationResult.isValid ? "#3f8600" : "#cf1322",
                  }}
                />
                <Statistic
                  title="Examples"
                  value={validationResult.exampleCount}
                />
                <Statistic
                  title="Avg Tokens/Example"
                  value={validationResult.avgTokensPerExample}
                />
                <Statistic
                  title="Total Tokens"
                  value={validationResult.totalTokens}
                />
              </div>

              {validationResult.errors && validationResult.errors.length > 0 && (
                <div>
                  <Title level={5} className="mb-2">
                    Errors:
                  </Title>
                  <Alert
                    description={
                      <ul className="list-disc list-inside space-y-1">
                        {validationResult.errors.map((error, idx) => (
                          <li key={idx}>{error}</li>
                        ))}
                      </ul>
                    }
                    type="error"
                    showIcon
                  />
                </div>
              )}

              {validationResult.warnings && validationResult.warnings.length > 0 && (
                <div>
                  <Title level={5} className="mb-2">
                    Warnings:
                  </Title>
                  <Alert
                    description={
                      <ul className="list-disc list-inside space-y-1">
                        {validationResult.warnings.map((warning, idx) => (
                          <li key={idx}>{warning}</li>
                        ))}
                      </ul>
                    }
                    type="warning"
                    showIcon
                  />
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {preparedDataset && (
        <div className="space-y-4">
          <Card>
            <Title level={5} className="mb-4">
              Prepared JSONL Dataset
            </Title>
            <Paragraph className="text-gray-600 mb-4">
              Dataset đã được convert sang JSONL format. Bạn có thể copy và save vào file để upload lên OpenAI Fine-tuning API.
            </Paragraph>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <div className="mb-2">
                <Text strong>Preview (2 dòng đầu):</Text>
              </div>
              <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono overflow-x-auto">
                {preparedDataset.preview.join("\n")}
              </pre>
            </div>
            <Divider />
            <div className="bg-gray-50 p-4 rounded border border-gray-200 max-h-96 overflow-auto">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                {preparedDataset.jsonlContent}
              </pre>
            </div>
            <div className="mt-4">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(preparedDataset.jsonlContent);
                  message.success("Đã copy JSONL content vào clipboard");
                }}
              >
                Copy JSONL
              </Button>
            </div>
          </Card>
        </div>
      )}
      </div>
    </div>
  );
}




