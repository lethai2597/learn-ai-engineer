"use client";

import { useState, useMemo } from "react";
import { Typography, Input, Collapse, Tag, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

type Definition = {
  term: string;
  termEn?: string;
  definition: string;
  category: string;
  relatedRoutes?: string[];
};

const definitions: Definition[] = [
  {
    term: "LLM (Large Language Model)",
    termEn: "Large Language Model",
    definition: "Mô hình ngôn ngữ lớn được train trên lượng dữ liệu khổng lồ để hiểu và sinh ra text giống con người. Ví dụ: GPT-4, Claude, Gemini.",
    category: "Nền tảng",
    relatedRoutes: ["/prompt-engineering", "/model-comparison"],
  },
  {
    term: "Prompt",
    termEn: "Prompt",
    definition: "Input text mà bạn gửi cho LLM để hướng dẫn nó thực hiện task. Prompt engineering là kỹ thuật thiết kế prompt hiệu quả.",
    category: "Nền tảng",
    relatedRoutes: ["/prompt-engineering"],
  },
  {
    term: "Prompt Engineering",
    termEn: "Prompt Engineering",
    definition: "Kỹ thuật thiết kế input (prompt) để AI hiểu ngữ cảnh, vai trò và format mà không cần train lại model. Bao gồm: Zero-shot, Few-shot, Chain-of-Thought, Role-based prompting.",
    category: "LLM Fundamentals",
    relatedRoutes: ["/prompt-engineering"],
  },
  {
    term: "Zero-shot Prompting",
    termEn: "Zero-shot Prompting",
    definition: "Kỹ thuật hỏi AI trực tiếp không cần đưa ví dụ mẫu. AI dựa vào knowledge đã được train để trả lời.",
    category: "LLM Fundamentals",
    relatedRoutes: ["/prompt-engineering"],
  },
  {
    term: "Few-shot Prompting",
    termEn: "Few-shot Prompting",
    definition: "Kỹ thuật đưa 2-5 ví dụ mẫu trong prompt để AI học pattern và áp dụng cho input mới.",
    category: "LLM Fundamentals",
    relatedRoutes: ["/prompt-engineering"],
  },
  {
    term: "Chain-of-Thought (CoT)",
    termEn: "Chain-of-Thought",
    definition: "Kỹ thuật hướng dẫn AI suy nghĩ từng bước, giải thích reasoning process trước khi đưa ra kết quả cuối cùng.",
    category: "LLM Fundamentals",
    relatedRoutes: ["/prompt-engineering"],
  },
  {
    term: "Structured Output",
    termEn: "Structured Output",
    definition: "Ép AI trả về dữ liệu theo Schema JSON định sẵn, đảm bảo code có thể parse và validate được. Có 2 approaches: JSON Mode và Function Calling.",
    category: "LLM Fundamentals",
    relatedRoutes: ["/structured-output"],
  },
  {
    term: "JSON Mode",
    termEn: "JSON Mode",
    definition: "Chế độ đảm bảo output của LLM là JSON hợp lệ bằng cách set response_format trong API call. Đơn giản, nhanh nhưng không đảm bảo tuân theo schema chặt chẽ.",
    category: "LLM Fundamentals",
    relatedRoutes: ["/structured-output"],
  },
  {
    term: "Streaming",
    termEn: "Streaming",
    definition: "Kỹ thuật nhận response từ LLM từng chunk (phần nhỏ) thay vì đợi toàn bộ response. Cải thiện UX bằng cách hiển thị text dần dần, giảm perceived latency.",
    category: "LLM Fundamentals",
    relatedRoutes: ["/streaming"],
  },
  {
    term: "RAG",
    termEn: "Retrieval-Augmented Generation",
    definition: "Kỹ thuật cho phép LLM truy cập knowledge base và trả lời dựa trên dữ liệu thực tế. Flow: Query → Retrieve relevant docs → Augment prompt → Generate answer.",
    category: "RAG",
    relatedRoutes: ["/rag/embeddings", "/rag/vector-db", "/rag/chunking-strategy"],
  },
  {
    term: "Embedding",
    termEn: "Embedding",
    definition: "Vector representation của text trong không gian số chiều cao. Text tương tự sẽ có embeddings gần nhau. Dùng để tìm kiếm semantic similarity.",
    category: "RAG",
    relatedRoutes: ["/rag/embeddings"],
  },
  {
    term: "Vector Database",
    termEn: "Vector Database",
    definition: "Database chuyên dụng để lưu trữ và query vectors (embeddings) hiệu quả. Hỗ trợ similarity search nhanh. Ví dụ: Chroma, Pinecone, Weaviate.",
    category: "RAG",
    relatedRoutes: ["/rag/vector-db"],
  },
  {
    term: "Chunking",
    termEn: "Chunking",
    definition: "Kỹ thuật chia nhỏ documents thành các chunks nhỏ hơn để tối ưu retrieval. Có nhiều strategies: fixed-size, semantic, recursive, etc.",
    category: "RAG",
    relatedRoutes: ["/rag/chunking-strategy"],
  },
  {
    term: "Memory Management",
    termEn: "Memory Management",
    definition: "Kỹ thuật lưu trữ và quản lý conversation history để AI nhớ context trong các cuộc hội thoại dài. Bao gồm: short-term memory (buffer), long-term memory (vector store).",
    category: "Orchestration",
    relatedRoutes: ["/orchestration/memory-management"],
  },
  {
    term: "Chain",
    termEn: "Chain",
    definition: "Workflow xử lý tuần tự qua nhiều bước, output của bước trước là input của bước sau. Ví dụ: Translate → Summarize → Extract keywords.",
    category: "Orchestration",
    relatedRoutes: ["/orchestration/chains-routing"],
  },
  {
    term: "Routing",
    termEn: "Routing",
    definition: "Kỹ thuật phân loại input và route đến handler/model phù hợp. Áp dụng Strategy Pattern - chọn strategy dựa trên input.",
    category: "Orchestration",
    relatedRoutes: ["/orchestration/chains-routing"],
  },
  {
    term: "Function Calling",
    termEn: "Function Calling",
    definition: "Khả năng cho phép LLM gọi các functions/tools bên ngoài để thực hiện các tác vụ cụ thể. Flow: User query → LLM quyết định gọi function → Execute function → LLM trả về kết quả cuối cùng.",
    category: "Agents",
    relatedRoutes: ["/agents/function-calling"],
  },
  {
    term: "Agent",
    termEn: "Agent",
    definition: "AI system có khả năng tự động thực thi tasks bằng cách suy nghĩ, quyết định và hành động. Agent có thể gọi tools, truy cập data, và thực hiện multi-step reasoning.",
    category: "Agents",
    relatedRoutes: ["/agents/function-calling", "/agents/react-pattern"],
  },
  {
    term: "ReAct Pattern",
    termEn: "Reasoning + Acting",
    definition: "Pattern cho phép agent tự động giải quyết các bài toán nhiều bước bằng cách kết hợp suy luận (Reason) và hành động (Act). Flow: User query → Thought → Action (tool call) → Observation → Thought → Repeat hoặc Final Answer.",
    category: "Agents",
    relatedRoutes: ["/agents/react-pattern"],
  },
  {
    term: "Token",
    termEn: "Token",
    definition: "Đơn vị nhỏ nhất mà LLM xử lý. Một token có thể là một từ, một phần của từ, hoặc một ký tự. Token count ảnh hưởng trực tiếp đến cost và latency.",
    category: "Production",
  },
  {
    term: "Latency",
    termEn: "Latency",
    definition: "Thời gian từ khi gửi request đến khi nhận được response. Latency ảnh hưởng trực tiếp đến UX. Có thể cải thiện bằng streaming, caching, hoặc chọn model nhanh hơn.",
    category: "Production",
  },
  {
    term: "Fine-tuning",
    termEn: "Fine-tuning",
    definition: "Quá trình train lại pre-trained model trên dataset cụ thể để adapt vào domain hoặc task riêng. Tốn kém hơn training từ đầu nhưng vẫn cần resources đáng kể.",
    category: "Advanced",
    relatedRoutes: ["/advanced/fine-tuning"],
  },
  {
    term: "Multimodal",
    termEn: "Multimodal",
    definition: "Khả năng xử lý nhiều loại input cùng lúc: text, image, audio, video. Ví dụ: GPT-4 Vision có thể đọc và phân tích hình ảnh.",
    category: "Advanced",
    relatedRoutes: ["/advanced/multimodal"],
  },
];

const categories = Array.from(new Set(definitions.map((d) => d.category))).sort();

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

  const displayCategories = searchQuery
    ? Object.keys(definitionsByCategory)
    : categories.filter((cat) => definitionsByCategory[cat]?.length > 0);

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
              Không tìm thấy định nghĩa nào phù hợp với "{searchQuery}"
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






