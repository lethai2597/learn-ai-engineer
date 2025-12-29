"use client";

import { Typography, Divider, Table, Tag, Alert } from "antd";

const { Title, Paragraph } = Typography;

export function LearningSection() {
  const comparisonData = [
    {
      key: "1",
      aspect: "Query Method",
      traditionalDb: "SELECT * FROM docs WHERE content LIKE '%keyword%'",
      vectorDb: "SELECT * FROM docs ORDER BY embedding <=> query_vector LIMIT 5",
    },
    {
      key: "2",
      aspect: "Matching",
      traditionalDb: "Exact match (từ khóa chính xác)",
      vectorDb: "Semantic match (theo ý nghĩa)",
    },
    {
      key: "3",
      aspect: "Performance",
      traditionalDb: "Chậm với full-text search lớn",
      vectorDb: "Nhanh với vector indexes (IVFFlat, HNSW)",
    },
    {
      key: "4",
      aspect: "Use Case",
      traditionalDb: "Tìm kiếm từ khóa, structured data",
      vectorDb: "Semantic search, RAG, recommendations",
    },
  ];

  const comparisonColumns = [
    {
      title: "Aspect",
      dataIndex: "aspect",
      key: "aspect",
      className: "font-medium",
    },
    {
      title: "Traditional DB (SQL)",
      dataIndex: "traditionalDb",
      key: "traditionalDb",
    },
    {
      title: "Vector DB",
      dataIndex: "vectorDb",
      key: "vectorDb",
    },
  ];

  const vectorDbOptionsData = [
    {
      key: "1",
      name: "ChromaDB",
      type: "Local/Open-source",
      pros: "Dễ setup, không cần Postgres, tốt cho dev",
      cons: "Cần tự quản lý infrastructure cho production",
    },
    {
      key: "2",
      name: "Supabase (pgvector)",
      type: "Postgres Extension",
      pros: "Full-featured, production-ready, SQL queries",
      cons: "Cần setup Postgres, phức tạp hơn",
    },
    {
      key: "3",
      name: "Pinecone",
      type: "SaaS",
      pros: "Managed service, scale tốt, dễ dùng",
      cons: "Trả tiền, vendor lock-in",
    },
    {
      key: "4",
      name: "Weaviate",
      type: "Open-source",
      pros: "Production-grade, GraphQL API",
      cons: "Phức tạp hơn ChromaDB",
    },
  ];

  const vectorDbOptionsColumns = [
    {
      title: "Vector DB",
      dataIndex: "name",
      key: "name",
      className: "font-medium",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
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
  ];

  return (
    <div className="space-y-8">
      <div>
        <Title level={3} className="mb-4 text-xl">
          Vị trí trong kiến trúc tổng thể
        </Title>
        <Paragraph className="text-gray-700 leading-relaxed mb-4">
          Vector Database nằm ở <strong>RAG Pipeline</strong> như một storage layer để lưu trữ và query vectors (embeddings). Đây là component trung tâm của RAG system, kết nối giữa embeddings và retrieval.
        </Paragraph>
        <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-4">
          <div className="text-gray-700 text-sm font-mono mb-2">
            RAG Pipeline: Documents → Chunking → Embeddings → Vector DB → (Query) → Query Embedding → Vector Search → Top K Results → LLM Context
          </div>
          <div className="space-y-3 mt-3">
            <div>
              <strong className="text-gray-700">Indexing Phase (Một lần):</strong>
              <ol className="list-decimal list-inside space-y-1 text-gray-600 text-sm mt-1 ml-2">
                <li>Documents được chunk và tạo embeddings</li>
                <li>Vectors được lưu vào Vector DB cùng với metadata và original text</li>
                <li>Vector DB index vectors để enable fast similarity search</li>
              </ol>
            </div>
            <div>
              <strong className="text-gray-700">Query Phase (Mỗi lần user query):</strong>
              <ol className="list-decimal list-inside space-y-1 text-gray-600 text-sm mt-1 ml-2">
                <li>User query được convert thành query embedding</li>
                <li>Vector DB search vectors gần nhất với query embedding (cosine similarity)</li>
                <li>Top K documents được retrieve và return</li>
                <li>Retrieved documents được dùng làm context cho LLM</li>
              </ol>
            </div>
          </div>
        </div>
        <Alert
          description="Vector Database không phải là feature của LLM API. Bạn cần setup và quản lý Vector DB riêng (ChromaDB, Pinecone, Supabase pgvector) để lưu trữ và search vectors."
          type="info"
          showIcon
        />
      </div>

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          Vector Database là gì?
        </Title>
        <Paragraph className="text-gray-700 leading-relaxed">
          Vector Database là database được thiết kế đặc biệt để lưu trữ và query
          vectors (embeddings) cực nhanh. Khác với traditional database tìm kiếm
          theo từ khóa chính xác, vector database tìm kiếm theo{" "}
          <strong>semantic similarity</strong> (độ tương đồng ngữ nghĩa).
        </Paragraph>
      </div>

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          Vector DB vs Traditional DB
        </Title>
        <Table
          dataSource={comparisonData}
          columns={comparisonColumns}
          pagination={false}
          bordered
        />
        <div className="bg-gray-50 p-4 rounded border border-gray-100 mt-4">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
            {`-- Traditional DB (SQL)
SELECT * FROM documents 
WHERE content LIKE '%con chó%';
-- Chỉ tìm thấy documents có chứa "con chó" chính xác

-- Vector DB (pgvector example)
SELECT content, 1 - (embedding <=> query_embedding) AS similarity
FROM documents
ORDER BY embedding <=> query_embedding
LIMIT 5;
-- Tìm thấy documents về "dog", "puppy", "canine" dù không có từ "con chó"`}
          </pre>
        </div>
      </div>

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          Popular Vector Databases
        </Title>
        <Table
          dataSource={vectorDbOptionsData}
          columns={vectorDbOptionsColumns}
          pagination={false}
          bordered
        />
      </div>

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          Dùng 1 Vector DB hay Nhiều Vector DBs?
        </Title>
        <div className="space-y-4">
          <div>
            <Title level={4} className="mb-2">
              Thông thường: Chỉ dùng 1 Vector DB
            </Title>
            <Paragraph className="text-gray-700 leading-relaxed mb-3">
              Trong hầu hết trường hợp, bạn <strong>chỉ cần 1 vector database</strong> cho toàn bộ ứng dụng:
            </Paragraph>
            <ul className="list-disc list-inside space-y-1 text-gray-600 mb-4">
              <li>
                <strong>Single collection/namespace:</strong> Tất cả documents trong 1 collection, filter bằng metadata
              </li>
              <li>
                <strong>Metadata filtering:</strong> Dùng metadata để phân loại thay vì dùng nhiều DBs
              </li>
              <li>
                <strong>Đơn giản và hiệu quả:</strong> Dễ quản lý, không cần sync giữa các DBs
              </li>
            </ul>
            <Alert
              description="Ví dụ: Thay vì dùng 2 vector DBs (1 cho documents, 1 cho code), dùng 1 DB với metadata { type: 'document' } và { type: 'code' }."
              type="info"
              showIcon
              className="mb-4"
            />
          </div>

          <div>
            <Title level={4} className="mb-2">
              Khi nào cần Nhiều Vector DBs?
            </Title>
            <Paragraph className="text-gray-700 leading-relaxed mb-3">
              Chỉ khi có <strong>yêu cầu đặc biệt về isolation hoặc scale</strong>:
            </Paragraph>
            <div className="space-y-3 mb-4">
              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <Title level={5} className="mb-2">
                  Multi-tenant Applications
                </Title>
                <Paragraph className="text-gray-700 mb-2">
                  <strong>Use case:</strong> Mỗi tenant cần data hoàn toàn isolated
                </Paragraph>
                <div className="bg-white p-3 rounded border border-gray-100">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                    {`Tenant A → Vector DB A (isolated)
Tenant B → Vector DB B (isolated)

Hoặc dùng 1 DB với tenant_id trong metadata
(nhưng cần đảm bảo security)`}
                  </pre>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <Title level={5} className="mb-2">
                  Different Embedding Models
                </Title>
                <Paragraph className="text-gray-700 mb-2">
                  <strong>Use case:</strong> Cần dùng embedding models khác nhau cho các loại data khác nhau
                </Paragraph>
                <div className="bg-white p-3 rounded border border-gray-100">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                    {`Text documents → text-embedding-3-large → DB 1
Code snippets → code-embedding model → DB 2
Images → vision-embedding model → DB 3

Lý do: Mỗi model có dimensions khác nhau,
không thể mix trong cùng 1 collection`}
                  </pre>
                </div>
              </div>
            </div>
            <Alert
              description="Trong hầu hết trường hợp, dùng 1 vector DB với metadata filtering là đủ. Chỉ dùng nhiều DBs khi thực sự cần isolation hoặc different embedding models."
              type="warning"
              showIcon
              className="mb-4"
            />
          </div>
        </div>
      </div>

      <Divider />

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          ChromaDB
        </Title>
        <Paragraph className="text-gray-700 leading-relaxed">
          ChromaDB là vector database open-source, được thiết kế đặc biệt cho các
          ứng dụng LLM. Trong bài học này, chúng ta sử dụng ChromaDB vì:
        </Paragraph>
        <ul className="list-disc list-inside space-y-1 text-gray-600 mt-2">
          <li>
            <strong>Dễ setup:</strong> Chạy in-memory hoặc persistent, không cần
            Postgres
          </li>
          <li>
            <strong>Python/JavaScript support:</strong> Có client cho cả Python và
            Node.js
          </li>
          <li>
            <strong>Tốt cho development:</strong> Phù hợp cho prototyping và học
            tập
          </li>
          <li>
            <strong>Metadata filtering:</strong> Hỗ trợ filter documents theo
            metadata
          </li>
        </ul>
        <div className="bg-gray-50 p-4 rounded border border-gray-100 mt-4">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
            {`// ChromaDB Setup (in-memory)
import { ChromaClient } from 'chromadb';
const client = new ChromaClient();

// Create collection
const collection = await client.createCollection({
  name: 'documents',
});

// Add documents with embeddings
await collection.add({
  ids: ['doc-1', 'doc-2'],
  embeddings: [[0.1, 0.2, ...], [0.3, 0.4, ...]],
  metadatas: [{ text: 'Con chó' }, { text: 'The dog' }],
});

// Search
const results = await collection.query({
  queryEmbeddings: [[0.15, 0.25, ...]],
  nResults: 5,
});`}
          </pre>
        </div>
      </div>

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          Semantic Search Flow
        </Title>
        <Paragraph className="text-gray-700 leading-relaxed">
          Quy trình semantic search với vector database:
        </Paragraph>
        <ol className="list-decimal list-inside space-y-2 text-gray-600 mt-2">
          <li>
            <strong>Ingest Documents:</strong> Tạo embeddings cho documents và lưu
            vào vector DB
          </li>
          <li>
            <strong>User Query:</strong> User nhập query text
          </li>
          <li>
            <strong>Generate Query Embedding:</strong> Tạo embedding cho query
          </li>
          <li>
            <strong>Vector Search:</strong> Tìm documents có embeddings gần nhất
            với query embedding
          </li>
          <li>
            <strong>Return Top K Results:</strong> Trả về K documents có similarity
            cao nhất
          </li>
          <li>
            <strong>Use in LLM Context:</strong> (Optional) Dùng retrieved
            documents làm context cho LLM trong RAG
          </li>
        </ol>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <div className="text-blue-800 text-sm font-mono">
            User Query → Generate Embedding → Search Vector DB → Get Top K Results
            → Use in LLM Context
          </div>
        </div>
      </div>

      <Divider />

      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Title level={4} style={{ marginBottom: 0 }}>
                Design Patterns áp dụng
              </Title>
              <Tag color="purple">Patterns</Tag>
            </div>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mt-2">
              <li>
                <strong>Repository Pattern:</strong> Abstract database operations qua
                IVectorRepository interface, dễ dàng thay thế vector DB khác
              </li>
              <li>
                <strong>Factory Pattern:</strong> VectorDatabaseFactory tạo
                repository instances, hỗ trợ multiple providers
              </li>
              <li>
                <strong>Singleton Pattern:</strong> ChromaDB client instance duy nhất
                cho toàn bộ application
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}





