"use client";

import { Typography } from "antd";
import { LearningSection } from "./components/LearningSection";
import { PracticeSection } from "./components/PracticeSection";

const { Title, Paragraph } = Typography;

export default function FineTuningPage() {
  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full">
      <div className="flex-1 min-w-0 flex flex-col lg:h-screen">
        <div className="px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <Title level={4} style={{ marginBottom: 0 }}>
            Fine-tuning & Custom Models
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
                  Huấn luyện thêm (fine-tune) LLM với dữ liệu riêng để chuyên môn hóa cho task cụ thể. Hiểu khi nào nên fine-tune, cách chuẩn bị dataset, và quy trình fine-tuning với OpenAI.
                </Paragraph>
              </div>

              <div>
                <Title level={5} className="mb-2">
                  Tổng quan
                </Title>
                <Paragraph className="text-gray-700 leading-relaxed mb-0 text-sm">
                  Fine-tuning cho phép bạn train thêm một base model với dataset riêng để model học được patterns và behaviors cụ thể cho task của bạn. Khác với prompt engineering (chỉ guide model), fine-tuning thực sự thay đổi weights của model.
                </Paragraph>
              </div>

              <div>
                <Title level={5} className="mb-2">
                  Nội dung chính
                </Title>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                  <li>Khi nào nên/không nên fine-tune</li>
                  <li>Chuẩn bị dataset đúng format</li>
                  <li>Fine-tune với OpenAI API</li>
                  <li>Evaluation và best practices</li>
                </ul>
              </div>
            </div>

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




