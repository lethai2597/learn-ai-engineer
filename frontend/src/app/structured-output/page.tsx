"use client";

import { Typography } from "antd";
import { LearningSection } from "./components/LearningSection";
import { PracticeSection } from "./components/PracticeSection";
import { ProjectIdeaGuideline } from "@/components/ProjectIdeaGuideline";

const { Title, Paragraph } = Typography;

export default function StructuredOutputPage() {
  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full">
      <div className="flex-1 min-w-0 flex flex-col lg:h-screen">
        <div className="px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <Title level={4} style={{ marginBottom: 0 }}>
            Structured Output (JSON Mode & Zod)
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
                  Ép AI trả về dữ liệu theo Schema JSON định sẵn, đảm bảo code có thể parse và validate được.
                </Paragraph>
              </div>

              <div>
                <Title level={5} className="mb-2">
                  Tổng quan
                </Title>
                <Paragraph className="text-gray-700 leading-relaxed mb-0 text-sm">
                  Khi làm việc với LLM trong production, bạn cần đảm bảo output có cấu trúc nhất quán. Bài học này giúp bạn hiểu 2 approaches: <strong>JSON Mode</strong> (đơn giản) và <strong>Function Calling</strong> (type-safe), cùng với <strong>Zod</strong> để validate data.
                </Paragraph>
              </div>

              <div>
                <Title level={5} className="mb-2">
                  Nội dung chính
                </Title>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                  <li>JSON Mode với response_format</li>
                  <li>Function Calling với tools parameter</li>
                  <li>Zod Schema cho type-safe validation</li>
                  <li>So sánh 2 approaches</li>
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





