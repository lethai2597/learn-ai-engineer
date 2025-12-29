"use client";

import { Typography } from "antd";
import { Tag } from "antd";

const { Title } = Typography;

interface ComparisonItem {
  key: string;
  feature: string;
  [key: string]: string;
}

interface ComparisonCardsProps {
  title?: string;
  data: ComparisonItem[];
  options: Array<{
    key: string;
    label: string;
    tagLabel?: string;
    color?: string;
  }>;
}

export function ComparisonCards({
  title,
  data,
  options,
}: ComparisonCardsProps) {
  return (
    <div className="space-y-4">
      {title && (
        <Title level={3} className="mb-4 text-xl">
          {title}
        </Title>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {options.map((option) => {
          const optionData = data.map((item) => ({
            feature: item.feature,
            value: item[option.key],
          }));

          return (
            <div
              key={option.key}
              className="border border-gray-200 rounded-lg p-4 bg-white hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <Title level={5} style={{ marginBottom: 0 }}>
                  {option.label}
                </Title>
                {option.color && option.tagLabel && (
                  <Tag color={option.color}>{option.tagLabel}</Tag>
                )}
              </div>
              <div className="space-y-2">
                {optionData.map((item, index) => (
                  <div key={index} className="border-b border-gray-100 pb-2 last:border-b-0">
                    <div className="text-xs text-gray-500 mb-1">
                      {item.feature}
                    </div>
                    <div className="text-sm text-gray-700 font-medium">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

