"use client";

import { Typography } from "antd";
import { LearningSection } from "./components/LearningSection";
import { PracticeSection } from "./components/PracticeSection";
import { ProjectIdeaGuideline } from "@/components/ProjectIdeaGuideline";

const { Title, Paragraph } = Typography;

export default function EvaluationPage() {
  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full">
      <div className="flex-1 min-w-0 flex flex-col lg:h-screen">
        <div className="px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <Title level={4} style={{ marginBottom: 0 }}>
            Evaluation (Evals)
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
                  Đảm bảo chất lượng AI application bằng cách test tự động và đo lường hiệu suất output của LLM.
                </Paragraph>
              </div>

              <div>
                <Title level={5} className="mb-2">
                  Tổng quan
                </Title>
                <Paragraph className="text-gray-700 leading-relaxed mb-0 text-sm">
                  Evaluation là "Unit Test cho AI". Khi thay đổi prompt hoặc model, bạn cần biết chất lượng có giảm không. Bài học này giúp bạn hiểu cách tạo Golden Dataset, sử dụng Evaluation Metrics và chạy batch evaluation.
                </Paragraph>
              </div>

              <div>
                <Title level={5} className="mb-2">
                  Nội dung chính
                </Title>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                  <li>Golden Dataset với test cases chuẩn</li>
                  <li>Evaluation Metrics: Exact Match, Contains, LLM-as-a-Judge</li>
                  <li>Batch Evaluation và summary</li>
                  <li>Best Practices</li>
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

