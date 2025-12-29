"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Form, Input, Button, Alert, Tag, Typography } from "antd";
import { useStreaming, useNonStreaming } from "@/hooks/use-streaming";
import { StreamRequest } from "@/types/streaming";
import { ServiceCodeDisplay } from "@/components/ServiceCodeDisplay";

const { TextArea } = Input;
const { Paragraph } = Typography;

const DEFAULT_PROMPT = `Write a detailed explanation about how streaming works in AI applications. Include information about Server-Sent Events, token-by-token generation, and the benefits of streaming for user experience.`;

/**
 * StreamingExercise Component
 * So sánh Streaming vs Non-streaming
 */
export function StreamingExercise() {
  const [form] = Form.useForm();
  const streaming = useStreaming();
  const nonStreaming = useNonStreaming();
  const [startTime, setStartTime] = useState<{
    streaming?: number;
    nonStreaming?: number;
  }>({});
  const [timeToFirstToken, setTimeToFirstToken] = useState<{
    streaming?: number;
  }>({});
  const [endTime, setEndTime] = useState<{
    streaming?: number;
    nonStreaming?: number;
  }>({});
  const prevStreamingRef = useRef(streaming.isStreaming);
  const prevLoadingRef = useRef(nonStreaming.isLoading);

  const handleSubmit = async (values: { prompt: string }) => {
    const request: StreamRequest = {
      prompt: values.prompt,
    };

    // Reset states
    streaming.reset();
    nonStreaming.reset();
    setStartTime({});
    setTimeToFirstToken({});
    setEndTime({});
    prevStreamingRef.current = true;
    prevLoadingRef.current = true;

    // Start both simultaneously
    const streamingStartTime = Date.now();
    setStartTime({ streaming: streamingStartTime });

    const nonStreamingStartTime = Date.now();
    setStartTime((prev) => ({ ...prev, nonStreaming: nonStreamingStartTime }));

    // Start streaming
    streaming.startStreaming(request);

    // Start non-streaming
    nonStreaming.fetchText(request);
  };

  useEffect(() => {
    if (streaming.text && !timeToFirstToken.streaming && startTime.streaming) {
      const firstTokenTime = Date.now() - startTime.streaming;
      setTimeToFirstToken({ streaming: firstTokenTime });
    }
  }, [streaming.text, timeToFirstToken.streaming, startTime.streaming]);

  useEffect(() => {
    const wasStreaming = prevStreamingRef.current;
    const isStreaming = streaming.isStreaming;

    if (
      wasStreaming &&
      !isStreaming &&
      startTime.streaming &&
      !endTime.streaming
    ) {
      const completionTime = Date.now();
      setEndTime((prev) => ({ ...prev, streaming: completionTime }));
    }
    prevStreamingRef.current = isStreaming;
  }, [streaming.isStreaming, startTime.streaming, endTime.streaming]);

  useEffect(() => {
    const wasLoading = prevLoadingRef.current;
    const isLoading = nonStreaming.isLoading;

    if (
      wasLoading &&
      !isLoading &&
      startTime.nonStreaming &&
      !endTime.nonStreaming
    ) {
      const completionTime = Date.now();
      setEndTime((prev) => ({ ...prev, nonStreaming: completionTime }));
    }
    prevLoadingRef.current = isLoading;
  }, [nonStreaming.isLoading, startTime.nonStreaming, endTime.nonStreaming]);

  const streamingDuration = useMemo(() => {
    if (startTime.streaming && endTime.streaming) {
      return endTime.streaming - startTime.streaming;
    }
    return null;
  }, [startTime.streaming, endTime.streaming]);

  const nonStreamingDuration = useMemo(() => {
    if (startTime.nonStreaming && endTime.nonStreaming) {
      return endTime.nonStreaming - startTime.nonStreaming;
    }
    return null;
  }, [startTime.nonStreaming, endTime.nonStreaming]);

  return (
    <div>
      <div className="space-y-6 px-6 py-4 mt-4">
        <ServiceCodeDisplay code="llm fundamentals streaming 01" />
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            prompt: DEFAULT_PROMPT,
          }}
          className="mb-4"
        >
          <Form.Item
            label="Prompt"
            name="prompt"
            rules={[{ required: true, message: "Vui lòng nhập prompt" }]}
          >
            <TextArea rows={4} placeholder="Nhập prompt..." />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={streaming.isStreaming || nonStreaming.isLoading}
              block
            >
              Test và So sánh (Streaming vs Non-streaming)
            </Button>
          </Form.Item>
        </Form>

        {(streaming.error || nonStreaming.error) && (
          <Alert
            description={
              streaming.error?.message ||
              nonStreaming.error?.message ||
              "Có lỗi xảy ra"
            }
            type="error"
            showIcon
          />
        )}

        {(streaming.text ||
          nonStreaming.text ||
          streaming.isStreaming ||
          nonStreaming.isLoading) && (
          <div className="space-y-4 mt-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              So sánh kết quả
            </h3>
            <div className="flex flex-col gap-4">
              {/* Streaming Output */}
              <div className="h-[300px] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Tag color="blue">Streaming</Tag>
                    {streaming.isStreaming && (
                      <span className="text-sm text-gray-500">
                        Đang stream...
                      </span>
                    )}
                  </div>
                  {streaming.isStreaming && (
                    <Button size="small" onClick={streaming.cancel}>
                      Stop
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-2 text-xs text-gray-600">
                  {timeToFirstToken.streaming && (
                    <div>
                      Time to first token: {timeToFirstToken.streaming}ms
                    </div>
                  )}

                  {timeToFirstToken.streaming && streamingDuration && (
                    <div className="h-4 border-l border-gray-200"></div>
                  )}

                  {streamingDuration && (
                    <div>Total time: {streamingDuration}ms</div>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded border border-gray-100 flex-1 overflow-y-auto">
                  {streaming.isStreaming && !streaming.text && (
                    <div className="text-gray-400 text-sm">Đang xử lý...</div>
                  )}
                  {streaming.text && (
                    <Paragraph className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm mb-0">
                      {streaming.text}
                      {streaming.isStreaming && (
                        <span className="animate-pulse">▊</span>
                      )}
                    </Paragraph>
                  )}
                </div>
              </div>

              {/* Non-streaming Output */}
              <div className="h-[300px] flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <Tag color="green">Non-streaming</Tag>
                  {nonStreaming.isLoading && (
                    <span className="text-sm text-gray-500">Đang xử lý...</span>
                  )}
                </div>

                {nonStreamingDuration && (
                  <div className="text-xs text-gray-600 mb-2">
                    Total time: {nonStreamingDuration}ms
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded border border-gray-100 flex-1 overflow-y-auto">
                  {nonStreaming.isLoading && (
                    <div className="text-gray-400 text-sm">
                      Đang chờ response...
                    </div>
                  )}
                  {nonStreaming.text && (
                    <Paragraph className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm mb-0">
                      {nonStreaming.text}
                    </Paragraph>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
