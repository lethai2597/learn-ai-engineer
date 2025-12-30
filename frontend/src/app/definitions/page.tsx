"use client";

import { useState, useMemo } from "react";
import { Typography, Input, Collapse, Tag, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Link from "next/link";
import { definitions, categoryOrder, type Definition } from "./definitions-data";

const { Title, Paragraph } = Typography;

function filterDefinitions(definitions: Definition[], searchQuery: string): Definition[] {
  if (!searchQuery.trim()) {
    return definitions;
  }
  const query = searchQuery.toLowerCase();
  return definitions.filter(
    (def) =>
      def.term.toLowerCase().includes(query) ||
      def.termEn?.toLowerCase().includes(query) ||
      def.definition.toLowerCase().includes(query) ||
      def.category.toLowerCase().includes(query)
  );
}

export default function DefinitionsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDefinitions = useMemo(
    () => filterDefinitions(definitions, searchQuery),
    [searchQuery]
  );

  const definitionsByCategory = useMemo(() => {
    const grouped: Record<string, Definition[]> = {};
    filteredDefinitions.forEach((def) => {
      if (!grouped[def.category]) {
        grouped[def.category] = [];
      }
      grouped[def.category].push(def);
    });
    return grouped;
  }, [filteredDefinitions]);

  const displayCategories = useMemo(() => {
    if (searchQuery) {
      return Object.keys(definitionsByCategory);
    }
    return categoryOrder.filter((cat) => definitionsByCategory[cat]?.length > 0);
  }, [searchQuery, definitionsByCategory]);

  return (
    <div className="flex-1">
      <div className="px-8 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <Title level={4} style={{ marginBottom: 0 }}>
          Định nghĩa
        </Title>
      </div>

      <div className="px-8 py-6 space-y-6">
        <div className="space-y-3">
          <div>
            <Title level={5} className="mb-2">
              Mục đích
            </Title>
            <Paragraph className="text-gray-700 leading-relaxed mb-0">
              Trang này tập hợp các thuật ngữ cốt lõi trong ngành AI/LLM để bạn tra cứu nhanh và thống nhất ngôn ngữ khi học.
            </Paragraph>
          </div>
        </div>

        <div>
          <Input
            placeholder="Tìm kiếm thuật ngữ, định nghĩa..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
          />
        </div>

        {filteredDefinitions.length === 0 ? (
          <div className="text-center py-12">
            <Paragraph className="text-gray-500">
              Không tìm thấy định nghĩa nào phù hợp với &quot;{searchQuery}&quot;
            </Paragraph>
          </div>
        ) : (
          <Collapse
            defaultActiveKey={displayCategories}
            items={displayCategories.map((category) => ({
              key: category,
              label: (
                <span className="font-medium">
                  {category} <Tag className="ml-2">{definitionsByCategory[category]?.length || 0}</Tag>
                </span>
              ),
              children: (
                <div className="space-y-4">
                  {definitionsByCategory[category]?.map((def, index) => (
                    <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="mb-2">
                        <Space>
                          <Title level={5} style={{ marginBottom: 0, display: "inline" }}>
                            {def.term}
                          </Title>
                          {def.termEn && (
                            <Tag color="blue" className="m-0">
                              {def.termEn}
                            </Tag>
                          )}
                        </Space>
                      </div>
                      <Paragraph className="text-gray-700 leading-relaxed mb-2">
                        {def.definition}
                      </Paragraph>
                      {def.relatedRoutes && def.relatedRoutes.length > 0 && (
                        <div className="mt-3">
                          <span className="text-sm text-gray-500 mr-2">Xem thêm:</span>
                          <Space size="small">
                            {def.relatedRoutes.map((route) => (
                              <Link key={route} href={route} className="text-sm text-blue-600 hover:text-blue-800">
                                {route}
                              </Link>
                            ))}
                          </Space>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ),
            }))}
          />
        )}
      </div>
    </div>
  );
}






