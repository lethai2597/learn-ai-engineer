"use client";

import { Typography } from "antd";
import { LearningSection } from "./components/LearningSection";
import { PracticeSection } from "./components/PracticeSection";
import { ProjectIdeaGuideline } from "@/components/ProjectIdeaGuideline";

const { Title, Paragraph } = Typography;

export default function SecurityPage() {
  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full">
      <div className="flex-1 min-w-0 flex flex-col lg:h-screen">
        <div className="px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <Title level={4} style={{ marginBottom: 0 }}>
            Security & Safety
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
                  Bảo vệ AI application khỏi prompt injection, data leakage và các rủi ro bảo mật khác.
                </Paragraph>
              </div>

              <div>
                <Title level={5} className="mb-2">
                  Tổng quan
                </Title>
                <Paragraph className="text-gray-700 leading-relaxed mb-0 text-sm">
                  Security là một phần quan trọng của production AI systems. Bài học này giúp bạn hiểu cách phát hiện prompt injection, moderate content, detect và redact PII, và implement rate limiting để bảo vệ application.
                </Paragraph>
              </div>

              <div>
                <Title level={5} className="mb-2">
                  Nội dung chính
                </Title>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                  <li>Prompt Injection Detection: Phát hiện các attempts để override system prompts</li>
                  <li>Content Moderation: Kiểm tra nội dung có vi phạm không</li>
                  <li>PII Detection & Redaction: Phát hiện và xóa thông tin cá nhân</li>
                  <li>Rate Limiting: Giới hạn số requests để tránh abuse</li>
                  <li>System Prompt Protection: Bảo vệ system prompts khỏi injection</li>
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




