"use client";

import { Typography, Divider, Table, Tag, Alert } from "antd";

const { Title, Paragraph } = Typography;

export function LearningSection() {
  const useCasesData = [
    {
      key: "1",
      useCase: "Semantic Search",
      description: "Tìm kiếm theo ý nghĩa thay vì từ khóa chính xác",
      example: "Tìm 'con chó' sẽ trả về 'dog', 'puppy', 'canine'",
    },
    {
      key: "2",
      useCase: "Recommendation Systems",
      description: "Gợi ý sản phẩm/nội dung tương tự",
      example: "Người xem phim A sẽ được gợi ý phim B có nội dung tương tự",
    },
    {
      key: "3",
      useCase: "Clustering Documents",
      description: "Nhóm các documents có nội dung tương tự",
      example: "Nhóm các bài báo về cùng một chủ đề",
    },
    {
      key: "4",
      useCase: "Duplicate Detection",
      description: "Phát hiện nội dung trùng lặp hoặc tương tự",
      example: "Tìm các bài viết có nội dung tương tự nhau",
    },
  ];

  const useCasesColumns = [
    {
      title: "Use Case",
      dataIndex: "useCase",
      key: "useCase",
      className: "font-medium",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Ví dụ",
      dataIndex: "example",
      key: "example",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <Title level={3} className="mb-4 text-xl">
          Vị trí trong kiến trúc tổng thể
        </Title>
        <Paragraph className="text-gray-700 leading-relaxed mb-4">
          Embeddings nằm ở <strong>RAG Pipeline - Indexing phase</strong> và <strong>Query phase</strong>. Đây là bước quan trọng để biến text thành vectors có thể tìm kiếm được.
        </Paragraph>
        <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-4">
          <div className="text-gray-700 text-sm font-mono mb-2">
            RAG Flow: Documents → Chunking → Embeddings API → Vector DB → (Query) → Query Embedding → Vector Search → LLM Context
          </div>
          <div className="space-y-3 mt-3">
            <div>
              <strong className="text-gray-700">Indexing Phase (Một lần):</strong>
              <ol className="list-decimal list-inside space-y-1 text-gray-600 text-sm mt-1 ml-2">
                <li>Documents được chunk thành các phần nhỏ</li>
                <li>Mỗi chunk được gửi đến Embeddings API để tạo vector</li>
                <li>Vectors được lưu vào Vector Database cùng với metadata</li>
              </ol>
            </div>
            <div>
              <strong className="text-gray-700">Query Phase (Mỗi lần user query):</strong>
              <ol className="list-decimal list-inside space-y-1 text-gray-600 text-sm mt-1 ml-2">
                <li>User query được gửi đến Embeddings API để tạo query vector</li>
                <li>Query vector được dùng để search trong Vector DB</li>
                <li>Top K documents được retrieve và dùng làm context cho LLM</li>
              </ol>
            </div>
          </div>
        </div>
        <Alert
          description="Embeddings không chỉ dùng một lần. Bạn cần tạo embeddings cho documents khi indexing (một lần) và cho user queries (mỗi lần query)."
          type="info"
          showIcon
        />
      </div>

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          Embeddings là gì?
        </Title>
        <Paragraph className="text-gray-700 leading-relaxed">
          Embeddings là cách biến văn bản thành vector (mảng số) để máy tính
          hiểu được &quot;ngữ nghĩa&quot;. Các câu có nghĩa tương tự sẽ có vectors gần
          nhau trong không gian toán học.
        </Paragraph>
        <div className="bg-gray-50 p-4 rounded border border-gray-100 mt-4">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
            {`Text: "Con chó"
→ Embedding: [0.012, -0.231, 0.88, ..., 0.045]
  (3072 dimensions)

Text: "The dog"
→ Embedding: [0.015, -0.228, 0.879, ..., 0.044]
  (vectors gần nhau vì nghĩa tương tự)`}
          </pre>
        </div>
      </div>

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          Cosine Similarity
        </Title>
        <Paragraph className="text-gray-700 leading-relaxed">
          Cosine Similarity đo độ tương đồng giữa 2 vectors. Giá trị từ 0 đến 1:
        </Paragraph>
        <ul className="list-disc list-inside space-y-1 text-gray-600 mt-2">
          <li>
            <strong>1.0:</strong> Hoàn toàn giống nhau
          </li>
          <li>
            <strong>0.8-0.9:</strong> Rất tương tự
          </li>
          <li>
            <strong>0.5-0.7:</strong> Có liên quan
          </li>
          <li>
            <strong>0.0-0.3:</strong> Không liên quan
          </li>
        </ul>
        <div className="bg-gray-50 p-4 rounded border border-gray-100 mt-4">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
            {`function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}`}
          </pre>
        </div>
      </div>

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          OpenAI Embeddings API
        </Title>
        <Paragraph className="text-gray-700 leading-relaxed">
          OpenAI cung cấp API để tạo embeddings với model{" "}
          <strong>text-embedding-3-large</strong>:
        </Paragraph>
        <ul className="list-disc list-inside space-y-1 text-gray-600 mt-2">
          <li>
            <strong>Model:</strong> text-embedding-3-large
          </li>
          <li>
            <strong>Dimensions:</strong> 3072
          </li>
          <li>
            <strong>Cost:</strong> ~$0.13 per 1M tokens
          </li>
          <li>
            <strong>Quality:</strong> Tốt hơn cho cross-lingual (đa ngôn ngữ)
          </li>
        </ul>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
          <div className="text-yellow-800 text-sm">
            <strong>Lưu ý về Cross-lingual:</strong> Model{" "}
            <code className="bg-yellow-100 px-1 rounded">text-embedding-3-small</code>{" "}
            không hỗ trợ tốt tìm kiếm đa ngôn ngữ (ví dụ: &quot;con chó&quot; vs &quot;the dog&quot;).
            Model <code className="bg-yellow-100 px-1 rounded">text-embedding-3-large</code>{" "}
            có khả năng cross-lingual tốt hơn, nhưng vẫn có giới hạn. Để tìm kiếm
            đa ngôn ngữ tốt nhất, nên sử dụng các model chuyên biệt như{" "}
            <code className="bg-yellow-100 px-1 rounded">multilingual-e5-large</code>.
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded border border-gray-100 mt-4">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
            {`const response = await openai.embeddings.create({
  model: 'text-embedding-3-large',
  input: 'Con chó đang chạy',
});

const vector = response.data[0].embedding;
// [0.012, -0.231, 0.88, ..., 0.045] (3072 numbers)`}
          </pre>
        </div>
      </div>

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          Use Cases
        </Title>
        <Table
          dataSource={useCasesData}
          columns={useCasesColumns}
          pagination={false}
          bordered
        />
      </div>

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          AI Model API vs Tự tích hợp
        </Title>
        <Paragraph className="text-gray-700 leading-relaxed mb-4">
          Embeddings là sự kết hợp giữa <strong>AI Model API</strong> (tạo vectors) và <strong>tự tích hợp</strong> (similarity search, batch processing, caching). Hiểu rõ phần nào từ API và phần nào tự implement giúp bạn tối ưu cost và performance.
        </Paragraph>
        <div className="space-y-4">
          <div>
            <Title level={4} className="mb-2">
              AI Model API (OpenAI/Anthropic)
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600 mb-3">
              <li>
                <strong>Embeddings API:</strong> <code className="bg-gray-100 px-1 rounded">openai.embeddings.create()</code> - Tạo vector từ text
              </li>
              <li>
                <strong>Model:</strong> text-embedding-3-large, text-embedding-3-small (OpenAI) hoặc các model tương tự
              </li>
              <li>
                <strong>Output:</strong> Vector array (3072 dimensions cho text-embedding-3-large)
              </li>
              <li>
                <strong>Batch support:</strong> API hỗ trợ batch multiple texts trong một request
              </li>
            </ul>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              <strong>Lưu ý:</strong> Embeddings API là tính năng có sẵn từ AI Model API. Bạn chỉ cần gọi API với text input, sẽ nhận được vector array.
            </div>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Tự tích hợp (Your Code)
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600 mb-3">
              <li>
                <strong>Cosine Similarity Calculation:</strong> Tính độ tương đồng giữa 2 vectors (tự implement hoặc dùng library)
              </li>
              <li>
                <strong>Batch Processing Logic:</strong> Chia documents thành batches, gọi API theo batch để tối ưu cost
              </li>
              <li>
                <strong>Caching Logic:</strong> Lưu embeddings vào database để tránh tạo lại (hash-based caching)
              </li>
              <li>
                <strong>Vector Search:</strong> Tìm kiếm vectors gần nhất (thường dùng Vector DB, nhưng logic search là tự implement)
              </li>
              <li>
                <strong>Error Handling:</strong> Retry logic, rate limiting, error recovery
              </li>
            </ul>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
              <strong>Lưu ý:</strong> Cosine similarity, batch processing, và caching là phần bạn phải tự implement. AI Model API chỉ tạo vectors, không có tính năng search hoặc cache.
            </div>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Kết hợp cả hai
            </Title>
            <Paragraph className="text-gray-700 leading-relaxed mb-3">
              Trong production, bạn <strong>luôn kết hợp</strong> cả AI Model API và tự tích hợp:
            </Paragraph>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {`// 1. Tự tích hợp: Batch processing logic
const batchSize = 100;
for (let i = 0; i < documents.length; i += batchSize) {
  const batch = documents.slice(i, i + batchSize);
  
  // 2. AI Model API: Tạo embeddings cho batch
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-large',
    input: batch.map(doc => doc.content), // API feature
  });
  
  // 3. Tự tích hợp: Lưu vào Vector DB và cache
  await vectorDB.add(embeddings, metadata);
  await cache.set(hash, embeddings);
}

// 4. Query: Tự tích hợp tạo query embedding
const queryEmbedding = await openai.embeddings.create({
  model: 'text-embedding-3-large',
  input: userQuery, // API feature
});

// 5. Tự tích hợp: Cosine similarity search
const results = await vectorDB.search(queryEmbedding, topK: 5);`}
              </pre>
            </div>
            <Alert
              description="AI Model API tạo vectors, tự tích hợp xử lý batch, cache, và search. Kết hợp cả hai để có hệ thống RAG hiệu quả và tiết kiệm cost."
              type="info"
              showIcon
              className="mt-3"
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
              Chọn Embedding Model
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>text-embedding-3-small:</strong> Rẻ ($0.02/1M tokens), đủ cho single-language search
              </li>
              <li>
                <strong>text-embedding-3-large:</strong> Đắt hơn ($0.13/1M tokens), tốt cho cross-lingual search
              </li>
              <li>
                <strong>multilingual-e5-large:</strong> Chuyên biệt cho đa ngôn ngữ, tốt nhất cho tiếng Việt
              </li>
              <li>
                <strong>Rule of thumb:</strong> Nếu chỉ search tiếng Anh → dùng small. Nếu cần đa ngôn ngữ → dùng large hoặc multilingual model
              </li>
            </ul>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Batch Processing
            </Title>
            <Paragraph className="text-gray-700 leading-relaxed mb-2">
              Khi tạo embeddings cho nhiều documents, nên batch để tối ưu cost và performance:
            </Paragraph>
            <div className="bg-gray-50 p-4 rounded border border-gray-100">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {`// Batch 100 documents một lần
const documents = [...]; // 1000 documents
const batchSize = 100;

for (let i = 0; i < documents.length; i += batchSize) {
  const batch = documents.slice(i, i + batchSize);
  const embeddings = await openai.embeddings.create({
    model: 'text-embedding-3-large',
    input: batch.map(doc => doc.content),
  });
  // Process embeddings...
}`}
              </pre>
            </div>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Caching Embeddings
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Cache embeddings:</strong> Lưu embeddings vào database để tránh tạo lại
              </li>
              <li>
                <strong>Hash-based caching:</strong> Dùng hash của text để check xem đã có embedding chưa
              </li>
              <li>
                <strong>Cost savings:</strong> Có thể tiết kiệm 50-80% chi phí nếu documents lặp lại
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
                RAG (Retrieval-Augmented Generation)
              </Title>
              <Tag color="blue">RAG</Tag>
            </div>
            <Paragraph className="text-gray-700 leading-relaxed">
              Embeddings là nền tảng của RAG. Quy trình:
            </Paragraph>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 mt-2">
              <li>
                <strong>Indexing:</strong> Tạo embeddings cho documents và lưu
                vào vector database
              </li>
              <li>
                <strong>Query:</strong> Tạo embedding cho query của user
              </li>
              <li>
                <strong>Retrieval:</strong> Tìm documents có embeddings gần nhất
                với query
              </li>
              <li>
                <strong>Generation:</strong> Dùng retrieved documents làm
                context cho LLM
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
