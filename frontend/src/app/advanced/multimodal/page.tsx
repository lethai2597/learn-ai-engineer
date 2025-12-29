"use client";

import { Typography } from "antd";
import { LearningSection } from "./components/LearningSection";
import { PracticeSection } from "./components/PracticeSection";

const { Title, Paragraph } = Typography;

export default function MultimodalPage() {
  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full">
      <div className="flex-1 min-w-0 flex flex-col lg:h-screen">
        <div className="px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <Title level={4} style={{ marginBottom: 0 }}>
            Multimodal AI
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
                  Xử lý và kết hợp nhiều loại dữ liệu (text, image, audio, video) trong AI applications. Hiểu cách sử dụng Vision models để phân tích images, Audio APIs để transcribe và generate speech.
                </Paragraph>
              </div>

              <div>
                <Title level={5} className="mb-2">
                  Tổng quan
                </Title>
                <Paragraph className="text-gray-700 leading-relaxed mb-0 text-sm">
                  Multimodal AI cho phép bạn xử lý nhiều loại dữ liệu đầu vào: text, images, audio, video. GPT-4 Vision có thể phân tích images, Whisper API transcribe audio, và TTS APIs generate speech từ text.
                </Paragraph>
              </div>

              <div>
                <Title level={5} className="mb-2">
                  Nội dung chính
                </Title>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                  <li>Vision (Image Input): GPT-4 Vision, Claude 3.5 Vision</li>
                  <li>Audio Input: Whisper API (Speech-to-Text)</li>
                  <li>Audio Output: TTS APIs (Text-to-Speech)</li>
                  <li>Complete Multimodal Pipeline</li>
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




