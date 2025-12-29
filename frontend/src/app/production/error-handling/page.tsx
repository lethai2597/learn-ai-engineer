"use client";

import { Typography } from "antd";
import { LearningSection } from "./components/LearningSection";
import { PracticeSection } from "./components/PracticeSection";
import { ProjectIdeaGuideline } from "@/components/ProjectIdeaGuideline";

const { Title, Paragraph } = Typography;

export default function ErrorHandlingPage() {
  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full">
      <div className="flex-1 min-w-0 flex flex-col lg:h-screen">
        <div className="px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <Title level={4} style={{ marginBottom: 0 }}>
            Error Handling & Retry Logic
          </Title>
        </div>

        <div className="flex-1 lg:overflow-auto column-scroll">
          <div className="px-6 py-4 space-y-4">
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div>
                <Title level={5} className="mb-2">
                  Mục tiêu học tập
                </Title>
                <Paragraph className="text-gray-700 leading-relaxed mb-0 text-sm">
                  Xử lý lỗi thông minh khi gọi API LLM để tăng độ ổn định của application với retry logic, circuit breaker, và fallback strategies.
                </Paragraph>
              </div>

              <div>
                <Title level={5} className="mb-2">
                  Tổng quan
                </Title>
                <Paragraph className="text-gray-700 leading-relaxed mb-0 text-sm">
                  LLM APIs có thể fail vì nhiều lý do: rate limits, timeouts, server errors. Bài học này giúp bạn hiểu cách implement retry với exponential backoff, circuit breaker pattern để tránh cascade failures, và fallback strategies để đảm bảo availability.
                </Paragraph>
              </div>

              <div>
                <Title level={5} className="mb-2">
                  Nội dung chính
                </Title>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                  <li>Exponential Backoff với Jitter: Retry với delay tăng dần và jitter để tránh thundering herd</li>
                  <li>Circuit Breaker Pattern: Tự động stop calling failing services để tránh cascade failures</li>
                  <li>Fallback Models: Chuyển sang model khác khi primary model fail</li>
                  <li>Timeout Configuration: Set timeout hợp lý để tránh hanging requests</li>
                  <li>Graceful Degradation: Fallback to simpler methods khi LLM không available</li>
                </ul>
              </div>
            </div>

            <ProjectIdeaGuideline />

            <div className="border-t border-gray-200 pt-6">
              <LearningSection />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col lg:h-screen border-l border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <Title level={4} style={{ marginBottom: 0 }}>
            Thực hành
          </Title>
        </div>

        <div className="flex-1 lg:overflow-auto column-scroll">
          <PracticeSection />
        </div>
      </div>
    </div>
  );
}




