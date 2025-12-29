"use client";

import { Typography, Divider, Table, Tag, Alert } from "antd";

const { Title, Paragraph } = Typography;

export function LearningSection() {
  const strategiesData = [
    {
      key: "1",
      strategy: "Fixed-size",
      description: "Cắt text theo kích thước cố định",
      pros: "Đơn giản, kiểm soát được kích thước",
      cons: "Có thể cắt giữa câu, mất ngữ cảnh",
      useCase: "Text đơn giản, không cần giữ cấu trúc",
    },
    {
      key: "2",
      strategy: "Recursive",
      description:
        "Cắt theo ranh giới tự nhiên (paragraph → sentence → character)",
      pros: "Giữ ngữ cảnh tốt, tự động xử lý",
      cons: "Kích thước có thể không đều",
      useCase: "Text thông thường, cần giữ ngữ cảnh",
    },
    {
      key: "3",
      strategy: "Semantic",
      description: "Cắt theo đơn vị ngữ nghĩa (paragraph, section)",
      pros: "Giữ nguyên cấu trúc, ngữ nghĩa tốt nhất",
      cons: "Kích thước không đồng đều",
      useCase: "Structured documents, cần giữ cấu trúc",
    },
    {
      key: "4",
      strategy: "Sentence",
      description: "Cắt theo câu, gom nhiều câu lại",
      pros: "Giữ nguyên câu, dễ đọc",
      cons: "Có thể quá dài hoặc quá ngắn",
      useCase: "Văn bản có cấu trúc câu rõ ràng",
    },
  ];

  const strategiesColumns = [
    {
      title: "Strategy",
      dataIndex: "strategy",
      key: "strategy",
      className: "font-medium",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Ưu điểm",
      dataIndex: "pros",
      key: "pros",
    },
    {
      title: "Nhược điểm",
      dataIndex: "cons",
      key: "cons",
    },
    {
      title: "Use Case",
      dataIndex: "useCase",
      key: "useCase",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <Title level={3} className="mb-4 text-xl">
          Vị trí trong kiến trúc tổng thể
        </Title>
        <Paragraph className="text-gray-700 leading-relaxed mb-4">
          Chunking Strategy nằm ở <strong>RAG Pipeline - Indexing phase</strong>, là bước đầu tiên trước khi tạo embeddings. Đây là component xử lý documents để chia nhỏ thành các chunks phù hợp cho embedding và retrieval.
        </Paragraph>
        <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-4">
          <div className="text-gray-700 text-sm font-mono mb-2">
            RAG Indexing Flow: Documents → Chunking Strategy → Chunks → Embeddings → Vector DB
          </div>
          <ol className="list-decimal list-inside space-y-2 text-gray-600 text-sm mt-3">
            <li>
              <strong>Documents:</strong> Raw documents (PDF, text, markdown, etc.)
            </li>
            <li>
              <strong>Chunking Strategy:</strong> Chia documents thành chunks nhỏ (200-500 tokens) với overlap (10-20%)
            </li>
            <li>
              <strong>Chunks:</strong> Các phần nhỏ của documents, sẵn sàng cho embedding
            </li>
            <li>
              <strong>Embeddings:</strong> Tạo embeddings cho mỗi chunk
            </li>
            <li>
              <strong>Vector DB:</strong> Lưu chunks và embeddings vào Vector DB
            </li>
          </ol>
        </div>
        <Alert
          description="Chunking Strategy không phải là feature của LLM API. Bạn phải tự implement logic để chia documents thành chunks phù hợp. Strategy tốt ảnh hưởng trực tiếp đến chất lượng retrieval."
          type="info"
          showIcon
        />
      </div>

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          Vấn đề của Chunking
        </Title>
        <Paragraph className="text-gray-700 leading-relaxed">
          Khi nạp tài liệu dài vào Vector DB, không thể đưa toàn bộ vào một lần.
          Cần cắt nhỏ nhưng phải cân bằng:
        </Paragraph>
        <ul className="list-disc list-inside space-y-2 text-gray-600 mt-2 mb-4">
          <li>
            <strong>Chunk quá lớn (&gt;1000 tokens):</strong> Tốn context
            window, nhiễu thông tin khi search
          </li>
          <li>
            <strong>Chunk quá nhỏ (&lt;100 tokens):</strong> Mất ngữ cảnh, không
            đủ thông tin
          </li>
          <li>
            <strong>Sweet spot:</strong> 200-500 tokens/chunk với overlap 10-20%
          </li>
        </ul>
        <Alert
          description="Overlap đảm bảo không mất thông tin ở ranh giới giữa các chunks. Ví dụ: chunk 1 kết thúc ở câu giữa, chunk 2 bắt đầu từ câu trước đó để giữ ngữ cảnh."
          type="info"
          showIcon
          className="mb-4"
        />
      </div>

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          Chunking Strategies
        </Title>
        <Table
          dataSource={strategiesData}
          columns={strategiesColumns}
          pagination={false}
          bordered
        />
      </div>

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          RecursiveCharacterTextSplitter
        </Title>
        <Paragraph className="text-gray-700 leading-relaxed">
          Thuật toán thông minh từ LangChain: Cố gắng cắt theo ranh giới tự
          nhiên.
        </Paragraph>
        <div className="bg-gray-50 p-4 rounded border border-gray-100 mt-4">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
            {`Cách hoạt động:
1. Ưu tiên cắt theo paragraph (\\n\\n)
2. Nếu không được, cắt theo sentence (., !, ?)
3. Nếu vẫn không được, cắt theo character

Ví dụ:
Text: "Đoạn 1. Câu 1. Câu 2.\\n\\nĐoạn 2. Câu 3."
→ Chunk 1: "Đoạn 1. Câu 1. Câu 2."
→ Chunk 2: "Đoạn 2. Câu 3."`}
          </pre>
        </div>
      </div>

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          Dùng 1 Strategy hay Kết hợp Nhiều Strategies?
        </Title>
        <div className="space-y-4">
          <div>
            <Title level={4} className="mb-2">
              Thông thường: Chỉ dùng 1 Strategy
            </Title>
            <Paragraph className="text-gray-700 leading-relaxed mb-3">
              Trong hầu hết trường hợp, bạn chỉ cần chọn <strong>1 chunking strategy phù hợp</strong> cho loại document của mình:
            </Paragraph>
            <ul className="list-disc list-inside space-y-1 text-gray-600 mb-4">
              <li>
                <strong>Fixed-size:</strong> Text đơn giản, không cần giữ cấu trúc → Dùng riêng
              </li>
              <li>
                <strong>Recursive:</strong> Text thông thường, cần giữ ngữ cảnh → Dùng riêng
              </li>
              <li>
                <strong>Semantic:</strong> Structured documents, cần giữ cấu trúc → Dùng riêng
              </li>
              <li>
                <strong>Sentence:</strong> Văn bản có cấu trúc câu rõ ràng → Dùng riêng
              </li>
            </ul>
            <Alert
              description="Mỗi strategy đã được thiết kế cho một loại document cụ thể. Dùng 1 strategy đơn giản và hiệu quả hơn."
              type="info"
              showIcon
            />
          </div>

          <div>
            <Title level={4} className="mb-2">
              Khi nào nên Kết hợp Strategies?
            </Title>
            <Paragraph className="text-gray-700 leading-relaxed mb-3">
              Có một số trường hợp bạn có thể <strong>kết hợp 2 strategies</strong> để xử lý documents phức tạp:
            </Paragraph>
            <div className="space-y-3 mb-6">
              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <Title level={5} className="mb-2">
                  Semantic + Recursive (Two-pass)
                </Title>
                <Paragraph className="text-gray-700 mb-2">
                  <strong>Use case:</strong> Document có cả structured sections và unstructured text
                </Paragraph>
                <div className="bg-white p-3 rounded border border-gray-100">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                    {`Flow:
1. Cắt theo semantic units (sections, headings) → Chunks lớn
2. Nếu chunk > maxSize → Dùng Recursive để cắt nhỏ hơn

Ví dụ:
- Document có sections rõ ràng
- Section 1: 2000 tokens → Cắt semantic → 3 chunks
- Section 2: 500 tokens → Giữ nguyên`}
                  </pre>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <Title level={5} className="mb-2">
                  Sentence + Fixed-size (Fallback)
                </Title>
                <Paragraph className="text-gray-700 mb-2">
                  <strong>Use case:</strong> Ưu tiên cắt theo câu, nhưng nếu câu quá dài thì cắt fixed-size
                </Paragraph>
                <div className="bg-white p-3 rounded border border-gray-100">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                    {`Flow:
1. Cắt theo sentence → Gom nhiều câu lại
2. Nếu sentence đơn lẻ > maxSize → Cắt fixed-size

Ví dụ:
- Câu 1-5: 400 tokens → OK
- Câu 6: 800 tokens → Cắt fixed-size thành 2 chunks`}
                  </pre>
                </div>
              </div>
            </div>
            <Alert
              description="Kết hợp strategies phức tạp hơn và tốn thêm processing time. Chỉ nên dùng khi document thực sự cần xử lý đặc biệt."
              type="warning"
              showIcon
              className="mb-4"
            />
          </div>
        </div>
      </div>

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          Best Practices
        </Title>
        <div className="space-y-4">
          <div>
            <Title level={4} className="mb-2">
              Chunk Size Recommendations
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Code documentation:</strong> 300-500 tokens (giữ nguyên
                function/class)
              </li>
              <li>
                <strong>Long-form articles:</strong> 500-800 tokens (giữ nguyên
                section)
              </li>
              <li>
                <strong>Chat logs:</strong> 200-400 tokens (giữ nguyên message)
              </li>
              <li>
                <strong>Structured data (tables):</strong> 100-300 tokens (giữ
                nguyên row/group)
              </li>
            </ul>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Overlap Recommendations
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>10-20% overlap:</strong> Phổ biến nhất, cân bằng giữa
                coverage và efficiency
              </li>
              <li>
                <strong>20-30% overlap:</strong> Khi thông tin quan trọng ở ranh
                giới (code, formulas)
              </li>
              <li>
                <strong>&lt;10% overlap:</strong> Khi chunks độc lập, không cần
                context
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Divider />

      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Title level={4} style={{ marginBottom: 0 }}>
                Ingestion Pipeline
              </Title>
              <Tag color="blue">RAG</Tag>
            </div>
            <Paragraph className="text-gray-700 leading-relaxed">
              Flow hoàn chỉnh từ file đến Vector DB:
            </Paragraph>
            <div className="bg-gray-50 p-4 rounded border border-gray-100 mt-2">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {`Upload File → Extract Text → Split into Chunks → 
Generate Embeddings → Store in Vector DB`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

