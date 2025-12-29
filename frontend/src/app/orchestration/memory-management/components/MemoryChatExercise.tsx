"use client";

import { useState, useEffect, useRef } from "react";
import {
  Form,
  Input,
  Button,
  Alert,
  Tag,
  Typography,
  Select,
  InputNumber,
  Space,
} from "antd";
import {
  UserOutlined,
  RobotOutlined,
  MessageOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { useMemoryChat } from "@/hooks/use-memory-chat";
import {
  MemoryStrategy,
  ChatMessage,
  MessageRole,
} from "@/types/memory-management";
import { ServiceCodeDisplay } from "@/components/ServiceCodeDisplay";

const { TextArea } = Input;
const { Paragraph, Text } = Typography;

export function MemoryChatExercise() {
  const [form] = Form.useForm();
  const memoryChat = useMemoryChat();
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStrategy, setCurrentStrategy] = useState<MemoryStrategy>(
    MemoryStrategy.SLIDING_WINDOW
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [tokenCount, setTokenCount] = useState<number>(0);
  const selectedStrategy =
    Form.useWatch("strategy", form) || MemoryStrategy.SLIDING_WINDOW;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (values: { message: string }) => {
    if (!values.message?.trim()) {
      return;
    }

    const formValues = form.getFieldsValue();
    const strategy = formValues.strategy || MemoryStrategy.SLIDING_WINDOW;
    const maxMessages =
      strategy === MemoryStrategy.SLIDING_WINDOW ||
      strategy === MemoryStrategy.SUMMARIZATION
        ? formValues.maxMessages || 5
        : undefined;
    const maxTokens =
      strategy === MemoryStrategy.TOKEN_TRUNCATION
        ? formValues.maxTokens || 2000
        : undefined;

    try {
      const response = await memoryChat.mutateAsync({
        message: values.message.trim(),
        sessionId: sessionId,
        strategy: strategy,
        maxMessages: maxMessages,
        maxTokens: maxTokens,
      });

      setSessionId(response.sessionId);
      setMessages(response.messages);
      setCurrentStrategy(response.strategy);
      setTokenCount(response.tokenCount);
      form.setFieldsValue({ message: "" });
      setTimeout(() => {
        const textarea = document.querySelector(
          'textarea[placeholder*="Nhập message"]'
        ) as HTMLTextAreaElement;
        textarea?.focus();
      }, 100);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleNewSession = () => {
    setSessionId(undefined);
    setMessages([]);
    setTokenCount(0);
    form.resetFields();
  };

  const handleClearHistory = () => {
    setMessages([]);
    setTokenCount(0);
  };

  const getStrategyLabel = (strategy: MemoryStrategy) => {
    switch (strategy) {
      case MemoryStrategy.SLIDING_WINDOW:
        return "Sliding Window";
      case MemoryStrategy.SUMMARIZATION:
        return "Summarization";
      case MemoryStrategy.TOKEN_TRUNCATION:
        return "Token Truncation";
      default:
        return strategy;
    }
  };

  const getSystemSummary = () => {
    return messages.find((msg) => msg.role === MessageRole.SYSTEM);
  };

  return (
    <div className="px-6 py-4">
      <ServiceCodeDisplay code="orchestration memory management 01" />
      <div className="flex items-center justify-between mt-4">
        <div>
          <Text strong className="text-lg">
            Chat với Memory Management
          </Text>
          {sessionId && (
            <div className="mt-2 flex items-center gap-2">
              <Text type="secondary" className="text-sm">
                Session: {sessionId.slice(0, 8)}...
              </Text>
              <Tag color="blue">{getStrategyLabel(currentStrategy)}</Tag>
              {tokenCount > 0 && <Tag color="green">{tokenCount} tokens</Tag>}
            </div>
          )}
        </div>
        <Space>
          <Button
            onClick={handleClearHistory}
            disabled={messages.length === 0}
          >
            Xóa lịch sử
          </Button>
          <Button
            onClick={handleNewSession}
            disabled={!sessionId}
          >
            Session mới
          </Button>
        </Space>
      </div>

      {messages.length === 0 && (
        <div className="my-4 border border-gray-200 rounded-lg bg-white p-4">
          <Text strong className="block mb-2">
            Hướng dẫn sử dụng
          </Text>
          <div className="text-sm space-y-2">
            <Paragraph className="mb-2">
              Thử nghiệm Memory Management với các bước sau:
            </Paragraph>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>
                Cho AI biết tên của bạn (ví dụ: &quot;Tên tôi là Thái&quot;)
              </li>
              <li>
                Hỏi lại AI tên của bạn (ví dụ: &quot;Tên tôi là gì?&quot;)
              </li>
              <li>
                Cùng AI đếm từ 1 đến 10 (ví dụ: &quot;Hãy đếm từ 1 đến 10&quot;)
              </li>
              <li>
                Sau đó hỏi lại AI tên của bạn (ví dụ: &quot;Tên tôi là gì?&quot;)
              </li>
              <li>
                Load lại trang, thử nghiệm với các strategy khác nhau
              </li>
            </ol>
            <Paragraph className="mb-0 mt-3 text-xs">
              Qua các bước này, bạn sẽ thấy cách các Memory Strategy khác nhau
              xử lý context dài và giữ lại thông tin quan trọng.
            </Paragraph>
          </div>
        </div>
      )}

      <div className="my-4 border border-gray-200 rounded-lg bg-gray-50 p-4">
        <div className="mb-4">
          <Text strong>Cấu hình Memory Strategy</Text>
        </div>
        <Form
          form={form}
          layout="vertical"
          className="mt-3"
          initialValues={{
            strategy: MemoryStrategy.SLIDING_WINDOW,
            maxMessages: 5,
            maxTokens: 2000,
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Memory Strategy"
              name="strategy"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value={MemoryStrategy.SLIDING_WINDOW}>
                  Sliding Window
                </Select.Option>
                <Select.Option value={MemoryStrategy.SUMMARIZATION}>
                  Summarization
                </Select.Option>
                <Select.Option value={MemoryStrategy.TOKEN_TRUNCATION}>
                  Token Truncation
                </Select.Option>
              </Select>
            </Form.Item>

            {selectedStrategy === MemoryStrategy.SLIDING_WINDOW ||
            selectedStrategy === MemoryStrategy.SUMMARIZATION ? (
              <Form.Item
                label="Max Messages"
                name="maxMessages"
                rules={[{ required: true, type: "number", min: 1, max: 100 }]}
              >
                <InputNumber min={1} max={100} style={{ width: "100%" }} />
              </Form.Item>
            ) : selectedStrategy === MemoryStrategy.TOKEN_TRUNCATION ? (
              <Form.Item
                label="Max Tokens"
                name="maxTokens"
                rules={[
                  { required: true, type: "number", min: 100, max: 8000 },
                ]}
              >
                <InputNumber min={100} max={8000} style={{ width: "100%" }} />
              </Form.Item>
            ) : null}
          </div>
        </Form>
      </div>

      <div className="flex flex-col border border-gray-200 rounded-lg bg-white overflow-hidden">
        {(() => {
          const systemSummary = getSystemSummary();
          return systemSummary ? (
            <div className="sticky top-0 z-10 bg-yellow-50 border-b border-yellow-200 p-4">
              <div className="flex items-start gap-3">
                <Tag color="orange" className="mb-0">
                  System Summary
                </Tag>
                <Paragraph className="mb-0 text-yellow-900 flex-1">
                  {systemSummary.content}
                </Paragraph>
              </div>
            </div>
          ) : null;
        })()}
        <div
          className="flex-1 overflow-y-auto p-6"
          style={{ minHeight: "600px", maxHeight: "600px" }}
        >
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center text-gray-400">
                <MessageOutlined className="text-5xl mb-4 opacity-50" />
                <Paragraph className="text-gray-400 mb-0 text-base">
                  Bắt đầu cuộc hội thoại bằng cách gửi message
                </Paragraph>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages
                .filter((msg) => msg.role !== MessageRole.SYSTEM)
                .map((msg, index) => {
                  const isUser = msg.role === MessageRole.USER;

                return (
                  <div
                    key={index}
                    className={`flex gap-4 ${
                      isUser ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        isUser ? "bg-blue-500" : "bg-gray-500"
                      }`}
                    >
                      {isUser ? (
                        <UserOutlined style={{ color: "white" }} />
                      ) : (
                        <RobotOutlined style={{ color: "white" }} />
                      )}
                    </div>
                    <div
                      className={`flex-1 max-w-[75%] ${
                        isUser ? "items-end" : "items-start"
                      } flex flex-col space-y-1`}
                    >
                      <div
                        className={`inline-block rounded-lg px-4 py-3 ${
                          isUser ? "bg-blue-500" : "bg-gray-100"
                        }`}
                      >
                        <Paragraph
                          className="mb-0 whitespace-pre-wrap"
                          style={{
                            marginBottom: 0,
                            color: isUser ? "white" : "#111827",
                          }}
                        >
                          {msg.content}
                        </Paragraph>
                      </div>
                      {msg.timestamp && (
                        <Text
                          type="secondary"
                          className={`text-xs ${
                            isUser ? "text-right" : "text-left"
                          }`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-4 bg-gray-50">
          {memoryChat.error && (
            <Alert
              description={memoryChat.error.message || "Có lỗi xảy ra"}
              type="error"
              showIcon
              className="mb-4"
            />
          )}
          <Form form={form} onFinish={handleSubmit} className="w-full">
            <div className="flex gap-3 items-center">
              <Form.Item
                name="message"
                rules={[{ required: true, message: "Vui lòng nhập message" }]}
                className="flex-1 mb-0"
              >
                <TextArea
                  rows={3}
                  placeholder="Nhập message của bạn... (Shift+Enter để xuống dòng, Enter để gửi)"
                  onPressEnter={(e) => {
                    if (e.shiftKey) return;
                    e.preventDefault();
                    if (!memoryChat.isPending) {
                      form.submit();
                    }
                  }}
                  disabled={memoryChat.isPending}
                  style={{ resize: "none" }}
                />
              </Form.Item>
              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={memoryChat.isPending}
                  size="large"
                  icon={<SendOutlined />}
                  shape="circle"
                />
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
