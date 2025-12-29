"use client";

import { Typography, Tag, Spin } from "antd";
import {
  PromptTechnique,
  PromptTechniqueLabels,
} from "@/types/prompt-engineering";

const { Paragraph } = Typography;

interface ResultItem {
  technique: PromptTechnique;
  response: string;
  isLoading?: boolean;
  error?: string;
}

interface ResultComparisonProps {
  results: ResultItem[];
}

/**
 * ResultComparison Component
 * Hiển thị kết quả so sánh với masonry layout
 *
 * Design Pattern: Presentational Component
 * - Minimal design: border-based cards với spacing hợp lý
 * - Masonry layout: cards được sắp xếp tự nhiên như gạch, chiều cao khác nhau
 */
export function ResultComparison({ results }: ResultComparisonProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 mt-4">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Kết quả so sánh
      </h3>
      <div className="space-y-3">
        {results.map((result, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 bg-white"
          >
            <div className="flex items-center gap-2 mb-4">
              <Tag color="blue">{PromptTechniqueLabels[result.technique]}</Tag>
              {result.isLoading && <Spin size="small" />}
            </div>

            {result.error ? (
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <div className="text-red-600 text-sm font-medium mb-1">
                  Lỗi:
                </div>
                <div className="text-red-700 text-sm">{result.error}</div>
              </div>
            ) : result.isLoading ? (
              <div className="bg-gray-50 p-4 rounded border border-gray-100">
                <div className="text-gray-400 text-sm">Đang xử lý...</div>
              </div>
            ) : result.response && result.response.trim() ? (
              <div className="bg-gray-50 p-4 rounded border border-gray-100">
                <Paragraph className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                  {result.response}
                </Paragraph>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                <div className="text-yellow-700 text-sm">
                  Không có kết quả trả về từ API
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}




