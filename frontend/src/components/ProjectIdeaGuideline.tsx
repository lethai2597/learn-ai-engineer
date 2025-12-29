"use client";

import { Typography, Space } from "antd";
import { BookOutlined, ShoppingOutlined, FileTextOutlined, ReadOutlined } from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getSelectedProjectIdea } from "@/lib/project-ideas";
import { projectIdeas } from "@/app/project-ideas/page";

const { Title, Paragraph } = Typography;

const iconMap: Record<string, React.ReactNode> = {
  "personal-knowledge-base": <BookOutlined />,
  "product-assistant": <ShoppingOutlined />,
  "meeting-notes": <FileTextOutlined />,
  "study-coach": <ReadOutlined />,
};

export function ProjectIdeaGuideline() {
  const pathname = usePathname();
  const selectedIdeaId = getSelectedProjectIdea();

  if (!selectedIdeaId) {
    return null;
  }

  const selectedIdea = projectIdeas.find((idea) => idea.id === selectedIdeaId);
  if (!selectedIdea) {
    return null;
  }

  const milestone = selectedIdea.roadmap.find((m) => m.lessonRoute === pathname);
  if (!milestone) {
    return null;
  }

  const icon = iconMap[selectedIdeaId] || <BookOutlined />;

  return (
    <div className="space-y-3 bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
      <div>
        <Title level={5} className="mb-2">
          <Space>
            <span className="text-blue-600">{icon}</span>
            <span>Áp dụng cho dự án: {selectedIdea.title}</span>
          </Space>
        </Title>
        <Paragraph className="text-gray-700 leading-relaxed mb-0 text-sm">
          {milestone.action}
        </Paragraph>
      </div>

      {milestone.details && milestone.details.length > 0 && (
        <div>
          <Title level={5} className="mb-2">
            Các bước thực hiện
          </Title>
          <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
            {milestone.details.map((detail, idx) => (
              <li key={idx} className="leading-relaxed">
                {detail}
              </li>
            ))}
          </ul>
        </div>
      )}

      {milestone.expectedOutcome && (
        <div>
          <Title level={5} className="mb-2">
            Kết quả mong đợi
          </Title>
          <Paragraph className="text-gray-700 leading-relaxed mb-0 text-sm">
            {milestone.expectedOutcome}
          </Paragraph>
        </div>
      )}

      <div className="pt-2 border-t border-blue-200">
        <Paragraph className="text-xs text-gray-600 mb-0">
          <Link href="/project-ideas" className="text-blue-600 hover:text-blue-800">
            Xem roadmap đầy đủ cho dự án này
          </Link>
        </Paragraph>
      </div>
    </div>
  );
}

