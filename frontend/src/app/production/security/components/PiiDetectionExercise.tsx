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
  Tabs,
} from "antd";
import { useDetectPii, useRedactPii } from "@/hooks/use-security";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const EXAMPLE_TEXT = [
  "My email is john@example.com and phone is 555-1234",
  "Contact me at jane.doe@company.com or call 1-800-555-0199",
  "My SSN is 123-45-6789 and credit card is 4532-1234-5678-9010",
  "Send to admin@test.com or IP 192.168.1.1",
];

import { DetectPiiResponse, RedactPiiResponse } from "@/types/security";
import { ServiceCodeDisplay } from "@/components/ServiceCodeDisplay";

export function PiiDetectionExercise() {
  const [detectForm] = Form.useForm();
  const [redactForm] = Form.useForm();
  const [detectionResult, setDetectionResult] =
    useState<DetectPiiResponse | null>(null);
  const [redactionResult, setRedactionResult] =
    useState<RedactPiiResponse | null>(null);
  const [activeTab, setActiveTab] = useState<string>("detect");
  const detectPii = useDetectPii();
  const redactPii = useRedactPii();

  const handleDetect = async (values: { text: string }) => {
    try {
      const response = await detectPii.mutateAsync({
        text: values.text,
      });
      setDetectionResult(response);
    } catch (error) {
      console.error("Error detecting PII:", error);
    }
  };

  const handleRedact = async (values: { text: string }) => {
    try {
      const response = await redactPii.mutateAsync({
        text: values.text,
      });
      setRedactionResult(response);
    } catch (error) {
      console.error("Error redacting PII:", error);
    }
  };

  const loadExample = (example: string) => {
    if (activeTab === "detect") {
      detectForm.setFieldsValue({ text: example });
    } else {
      redactForm.setFieldsValue({ text: example });
    }
  };

  const tabItems = [
    {
      key: "detect",
      label: "Detect PII",
      children: (
        <div className="space-y-4">
          <Form
            form={detectForm}
            layout="vertical"
            onFinish={handleDetect}
            initialValues={{
              text: "My email is john@example.com",
            }}
          >
            <Form.Item
              name="text"
              label="Input Text"
              rules={[{ required: true, message: "Vui lòng nhập text" }]}
            >
              <TextArea
                rows={6}
                placeholder="Enter text to detect PII..."
                className="font-mono"
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={detectPii.isPending}
                >
                  Detect PII
                </Button>
                <Button
                  onClick={() => {
                    detectForm.resetFields();
                    setDetectionResult(null);
                  }}
                >
                  Clear
                </Button>
              </Space>
            </Form.Item>
          </Form>

          {detectPii.isError && (
            <Alert
              description={
                detectPii.error?.message || "Có lỗi xảy ra khi detect PII"
              }
              type="error"
              showIcon
            />
          )}

          {detectionResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <Statistic
                    title="Has PII"
                    value={detectionResult.hasPii ? "Yes" : "No"}
                    valueStyle={{
                      color: detectionResult.hasPii ? "#cf1322" : "#3f8600",
                    }}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Entities Found"
                    value={detectionResult.detectedEntities.length}
                  />
                </Card>
              </div>

              <div>
                <Title level={5} className="mb-2">
                  Detection Result
                </Title>
                <Card>
                  <div className="space-y-3">
                    <div>
                      <strong>Details:</strong>{" "}
                      <span className="text-gray-700">
                        {detectionResult.details}
                      </span>
                    </div>
                    {detectionResult.detectedEntities.length > 0 && (
                      <div>
                        <strong>Detected Entities:</strong>
                        <div className="mt-2 space-y-2">
                          {detectionResult.detectedEntities.map(
                            (entity, idx: number) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                              >
                                <Tag color="blue">{entity.type}</Tag>
                                <code className="text-sm">{entity.value}</code>
                                <span className="text-gray-500 text-xs">
                                  ({entity.startIndex}-{entity.endIndex})
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "redact",
      label: "Redact PII",
      children: (
        <div className="space-y-4">
          <Form
            form={redactForm}
            layout="vertical"
            onFinish={handleRedact}
            initialValues={{
              text: "My email is john@example.com and phone is 555-1234",
            }}
          >
            <Form.Item
              name="text"
              label="Input Text"
              rules={[{ required: true, message: "Vui lòng nhập text" }]}
            >
              <TextArea
                rows={6}
                placeholder="Enter text to redact PII..."
                className="font-mono"
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={redactPii.isPending}
                >
                  Redact PII
                </Button>
                <Button
                  onClick={() => {
                    redactForm.resetFields();
                    setRedactionResult(null);
                  }}
                >
                  Clear
                </Button>
              </Space>
            </Form.Item>
          </Form>

          {redactPii.isError && (
            <Alert
              description={
                redactPii.error?.message || "Có lỗi xảy ra khi redact PII"
              }
              type="error"
              showIcon
            />
          )}

          {redactionResult && (
            <div className="space-y-4">
              <Card>
                <Statistic
                  title="Redacted Count"
                  value={redactionResult.redactedCount}
                />
              </Card>

              <div>
                <Title level={5} className="mb-2">
                  Original Text
                </Title>
                <Card>
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                    {redactForm.getFieldValue("text")}
                  </pre>
                </Card>
              </div>

              <div>
                <Title level={5} className="mb-2">
                  Redacted Text
                </Title>
                <Card>
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                    {redactionResult.redactedText}
                  </pre>
                </Card>
              </div>

              <div>
                <Title level={5} className="mb-2">
                  Details
                </Title>
                <Card>
                  <p className="text-gray-700">{redactionResult.details}</p>
                </Card>
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <ServiceCodeDisplay code="production security 03" />
      <div className="space-y-6 mt-4">
        <div>
          <Title level={4} className="mb-2">
            PII Detection & Redaction
          </Title>
          <Paragraph className="text-gray-600 mb-4">
            Detect và redact thông tin cá nhân (PII) như email, phone, SSN,
            credit card, IP address.
          </Paragraph>
        </div>

        <div>
          <Title level={5} className="mb-2">
            Example Text
          </Title>
          <div className="grid gap-2">
            {EXAMPLE_TEXT.map((example, index) => (
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

        <div>
          <Tabs items={tabItems} onChange={(key) => setActiveTab(key)} />
        </div>
      </div>
    </div>
  );
}
