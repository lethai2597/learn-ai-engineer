"use client";

import { Typography } from "antd";
import { LearningSection } from "./components/LearningSection";
import { PracticeSection } from "./components/PracticeSection";
import { ProjectIdeaGuideline } from "@/components/ProjectIdeaGuideline";

const { Title, Paragraph } = Typography;

export default function FunctionCallingPage() {
  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full">
      <div className="flex-1 min-w-0 flex flex-col lg:h-screen">
        <div className="px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <Title level={4} style={{ marginBottom: 0 }}>
            Function Calling (Tool Calling)
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
                  Biến AI từ &quot;người tư vấn&quot; thành &quot;trợ lý thực thi&quot; bằng cách cho phép gọi functions/tools.
                </Paragraph>
              </div>

              <div>
                <Title level={5} className="mb-2">
                  Tổng quan
                </Title>
                <Paragraph className="text-gray-700 leading-relaxed mb-0 text-sm">
                  Function Calling cho phép LLM gọi các functions/tools bên ngoài để thực hiện các tác vụ cụ thể.
                  <strong>Flow:</strong> User query → LLM quyết định gọi function → Execute function → LLM trả về kết quả.
                </Paragraph>
              </div>

              <div>
                <Title level={5} className="mb-2">
                  Nội dung chính
                </Title>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                  <li>Function Calling Flow và cách define function schemas</li>
                  <li>Best Practices cho function descriptions</li>
                  <li>Multiple Tools và Tool Registry Pattern</li>
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

