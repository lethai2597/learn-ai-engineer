"use client";

import { Typography, Divider, Table, Tag, Alert } from "antd";

const { Title, Paragraph } = Typography;

/**
 * LearningSection Component
 * Hiển thị phần lý thuyết về Streaming
 *
 * Design Pattern: Masonry Layout
 * - Cards được sắp xếp tự nhiên như gạch, chiều cao khác nhau
 * - Comparison table để so sánh nhanh
 * - Minimal design: border-based, không shadow
 */
export function LearningSection() {
  const concepts = [
    {
      title: "Token-by-token Streaming",
      description:
        "Thay vì chờ đợi toàn bộ response, LLM trả về từng token một. Giúp cải thiện UX đáng kể vì user thấy kết quả ngay lập tức thay vì phải chờ đợi. Đây là cách hoạt động cơ bản của streaming trong AI applications.",
      useCases: [
        "Long-form content generation",
        "Real-time chat applications",
        "Cải thiện perceived performance",
        "Better user experience",
      ],
      example: `// OpenAI Streaming API
const stream = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [...],
  stream: true,  // Enable streaming
});

// Receive tokens one by one
for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) {
    // Display each token immediately
    process.stdout.write(content);
  }
}`,
    },
    {
      title: "Server-Sent Events (SSE)",
      description:
        "SSE là một công nghệ cho phép server gửi dữ liệu đến client một cách tự động qua HTTP connection. Đơn giản hơn WebSocket, phù hợp cho one-way streaming như AI responses. Đây là cách phổ biến nhất để implement streaming cho AI applications.",
      useCases: [
        "AI text generation streaming",
        "Real-time notifications",
        "Live updates từ server",
        "One-way data streaming (server → client)",
      ],
      example: `// Backend: SSE Response
res.setHeader('Content-Type', 'text/event-stream');
res.setHeader('Cache-Control', 'no-cache');
res.setHeader('Connection', 'keep-alive');

// Send chunks as they arrive
res.write('data: {"content": "Hello"}\\n\\n');
res.write('data: {"content": " world"}\\n\\n');
res.write('data: [DONE]\\n\\n');

// Frontend: Consume SSE
const reader = response.body.getReader();
const decoder = new TextDecoder();
// Read and display chunks immediately`,
    },
    {
      title: "WebSocket - Khi nào cần?",
      description:
        "WebSocket là protocol two-way (client ↔ server), phức tạp hơn SSE nhưng mạnh mẽ hơn. Dùng WebSocket khi cần real-time chat hai chiều, gaming, hoặc khi client cũng cần gửi data liên tục. Với AI streaming (one-way), SSE đơn giản và đủ dùng.",
      useCases: [
        "Real-time chat applications (two-way)",
        "Gaming, collaborative editing",
        "Khi cần client gửi data liên tục",
        "Không phù hợp cho AI streaming đơn giản",
      ],
      example: `// WebSocket: Two-way communication
const ws = new WebSocket('ws://server');

// Client can send
ws.send('Hello server');

// Client can receive
ws.onmessage = (event) => {
  console.log(event.data);
};

// SSE: One-way (server → client)
// Chỉ server gửi, client nhận
// Đơn giản hơn, đủ cho AI streaming`,
    },
    {
      title: "Cancellation & Error Handling cho Streaming",
      description:
        "Khi streaming, cần xử lý các trường hợp: user cancel request (click Stop), network timeout, và errors trong stream. Sử dụng AbortController để cancel streaming requests. Quan trọng để cleanup resources và cải thiện UX.",
      useCases: [
        "User click Stop button khi streaming",
        "Network interruptions",
        "Timeout handling",
        "Error recovery và cleanup",
      ],
      example: `// Frontend: Cancel streaming request
const abortController = new AbortController();

fetch('/api/stream', {
  signal: abortController.signal,
});

// User clicks Stop
abortController.abort();

// Handle cancellation gracefully
try {
  await stream();
} catch (error) {
  if (error.name === 'AbortError') {
    // User cancelled - cleanup UI
    console.log('Stream cancelled');
  }
}`,
    },
  ];

  const comparisonData = [
    {
      key: "1",
      feature: "Protocol",
      sse: "HTTP (one-way)",
      websocket: "WebSocket (two-way)",
      polling: "HTTP (request/response)",
    },
    {
      key: "2",
      feature: "Độ phức tạp",
      sse: "Đơn giản",
      websocket: "Phức tạp",
      polling: "Rất đơn giản",
    },
    {
      key: "3",
      feature: "Use case tốt nhất",
      sse: "AI streaming, notifications",
      websocket: "Real-time chat, gaming",
      polling: "Simple updates",
    },
    {
      key: "4",
      feature: "Latency",
      sse: "Thấp (real-time)",
      websocket: "Rất thấp",
      polling: "Cao (phụ thuộc interval)",
    },
    {
      key: "5",
      feature: "Browser support",
      sse: "Tốt (EventSource API)",
      websocket: "Tốt",
      polling: "Tuyệt vời",
    },
  ];

  const comparisonColumns = [
    {
      title: "Đặc điểm",
      dataIndex: "feature",
      key: "feature",
      className: "font-medium",
    },
    {
      title: "SSE",
      dataIndex: "sse",
      key: "sse",
    },
    {
      title: "WebSocket",
      dataIndex: "websocket",
      key: "websocket",
    },
    {
      title: "Polling",
      dataIndex: "polling",
      key: "polling",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <Title level={3} className="mb-4 text-xl">
          Vị trí trong kiến trúc tổng thể
        </Title>
        <Paragraph className="text-gray-700 leading-relaxed mb-4">
          Streaming được implement ở <strong>Backend API layer</strong> và <strong>Frontend layer</strong>. Backend stream tokens từ LLM API, Frontend nhận và hiển thị từng token ngay lập tức.
        </Paragraph>
        <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-4">
          <div className="text-gray-700 text-sm font-mono mb-2">
            Flow: Frontend Request → Backend API → LLM API (streaming) → Backend (SSE) → Frontend (EventSource) → UI Update
          </div>
          <ol className="list-decimal list-inside space-y-2 text-gray-600 text-sm mt-3">
            <li>
              <strong>Frontend:</strong> Gửi request đến Backend API với streaming flag
            </li>
            <li>
              <strong>Backend API:</strong> Gọi LLM API với <code className="bg-gray-100 px-1 rounded">stream: true</code>
            </li>
            <li>
              <strong>LLM API:</strong> Stream tokens từng chunk một về Backend
            </li>
            <li>
              <strong>Backend:</strong> Forward tokens qua SSE (Server-Sent Events) đến Frontend
            </li>
            <li>
              <strong>Frontend:</strong> Nhận tokens qua EventSource API và hiển thị ngay lập tức
            </li>
          </ol>
        </div>
        <Alert
          description="Streaming không chỉ là feature của LLM API. Bạn cần implement cả backend (SSE) và frontend (EventSource) để có trải nghiệm streaming hoàn chỉnh."
          type="info"
          showIcon
        />
      </div>

      <Divider />

      <div className="space-y-6">
        {concepts.map((concept, index) => (
          <div key={index}>
            <div className="border border-gray-200 rounded-lg p-6 bg-white hover:border-gray-300 transition-colors">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Title level={4} style={{ marginBottom: 0 }}>
                      {concept.title}
                    </Title>
                    <Tag
                      color={
                        index === 0
                          ? "green"
                          : index === 1
                          ? "blue"
                          : index === 2
                          ? "orange"
                          : "purple"
                      }
                    >
                      {index === 0
                        ? "Khái niệm"
                        : index === 1
                        ? "SSE"
                        : index === 2
                        ? "WebSocket"
                        : "Error Handling"}
                    </Tag>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {concept.description}
                  </p>
                </div>

                <div>
                  <Title level={5}>Use Cases:</Title>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {concept.useCases.map((useCase, idx) => (
                      <li key={idx}>{useCase}</li>
                    ))}
                  </ul>
                </div>

                {concept.example && (
                  <div>
                    <Title level={5}>Ví dụ:</Title>
                    <div className="bg-gray-50 p-3 rounded border border-gray-100">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                        {concept.example}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Divider />

      {/* Comparison Table */}
      <div>
        <Title level={3} className="mb-4 text-xl">
          Bảng so sánh: SSE vs WebSocket vs Polling
        </Title>
        <div className="mb-4 text-gray-700">
          <p className="mb-2">
            <strong>Polling</strong> là cách đơn giản nhất: client gửi request
            định kỳ (ví dụ mỗi 1 giây) để check xem có update mới không. Đơn
            giản nhưng tốn tài nguyên và có latency cao, không phù hợp cho AI
            streaming.
          </p>
        </div>
        <Table
          dataSource={comparisonData}
          columns={comparisonColumns}
          pagination={false}
          bordered
        />
      </div>

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          Dùng 1 Protocol hay Kết hợp Nhiều Protocols?
        </Title>
        <div className="space-y-4">
          <div>
            <Title level={4} className="mb-2">
              Thông thường: Chỉ dùng 1 Protocol
            </Title>
            <Paragraph className="text-gray-700 leading-relaxed mb-3">
              Cho AI streaming, bạn <strong>chỉ cần chọn 1 protocol phù hợp</strong>:
            </Paragraph>
            <ul className="list-disc list-inside space-y-1 text-gray-600 mb-4">
              <li>
                <strong>SSE (Khuyến nghị):</strong> One-way streaming (server → client), đơn giản, đủ cho AI streaming → Dùng riêng
              </li>
              <li>
                <strong>WebSocket:</strong> Two-way communication, phức tạp hơn → Chỉ dùng khi cần client gửi data liên tục
              </li>
              <li>
                <strong>Polling:</strong> Không phù hợp cho AI streaming → Tránh dùng
              </li>
            </ul>
            <Alert
              description="SSE là lựa chọn tốt nhất cho AI streaming vì đơn giản, one-way, và đủ mạnh. WebSocket chỉ cần khi thực sự cần two-way communication."
              type="info"
              showIcon
              className="mb-4"
            />
          </div>

          <div>
            <Title level={4} className="mb-2">
              Khi nào cần Kết hợp?
            </Title>
            <Paragraph className="text-gray-700 leading-relaxed mb-3">
              Hiếm khi cần kết hợp protocols. Chỉ khi ứng dụng có <strong>nhiều use cases khác nhau</strong>:
            </Paragraph>
            <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-4">
              <Title level={5} className="mb-2">
                Ví dụ: Chat App với AI Streaming
              </Title>
              <div className="bg-white p-3 rounded border border-gray-100">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {`Use case 1: AI Response Streaming
→ Dùng SSE (one-way, server → client)

Use case 2: Real-time Chat (user ↔ user)
→ Dùng WebSocket (two-way)

Kết luận: Dùng cả SSE và WebSocket, nhưng cho
các use cases khác nhau, không kết hợp trong
cùng một feature.`}
                </pre>
              </div>
            </div>
            <Alert
              description="Mỗi protocol phục vụ một mục đích khác nhau. Không nên kết hợp trong cùng một feature, mà dùng protocol phù hợp cho từng use case."
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
          AI Model API vs Tự tích hợp
        </Title>
        <Paragraph className="text-gray-700 leading-relaxed mb-4">
          Streaming là sự kết hợp giữa <strong>AI Model API</strong> (stream tokens) và <strong>tự tích hợp</strong> (SSE implementation, frontend handling, error handling). Hiểu rõ phần nào từ API và phần nào tự implement giúp bạn xây dựng streaming system đúng cách.
        </Paragraph>
        <div className="space-y-4">
          <div>
            <Title level={4} className="mb-2">
              AI Model API (OpenAI/Anthropic)
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600 mb-3">
              <li>
                <strong>Streaming API:</strong> <code className="bg-gray-100 px-1 rounded">stream: true</code> parameter - LLM trả về tokens từng chunk một
              </li>
              <li>
                <strong>Stream Response Format:</strong> API trả về stream chunks với format <code className="bg-gray-100 px-1 rounded">{"{ choices: [{ delta: { content: '...' } }] }"}</code>
              </li>
              <li>
                <strong>Done Signal:</strong> API gửi <code className="bg-gray-100 px-1 rounded">[DONE]</code> khi stream kết thúc
              </li>
            </ul>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              <strong>Lưu ý:</strong> Streaming là tính năng có sẵn từ AI Model API. Bạn chỉ cần set <code className="bg-blue-100 px-1 rounded">stream: true</code>, API sẽ tự động stream tokens.
            </div>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Tự tích hợp (Your Code)
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600 mb-3">
              <li>
                <strong>SSE Implementation (Backend):</strong> Set headers, format SSE messages, forward chunks từ LLM API
              </li>
              <li>
                <strong>Frontend EventSource:</strong> Connect đến SSE endpoint, nhận và parse chunks, update UI
              </li>
              <li>
                <strong>Error Handling:</strong> Network errors, timeout, cancellation, partial responses
              </li>
              <li>
                <strong>Connection Management:</strong> Reconnect logic, retry mechanism, cleanup on disconnect
              </li>
              <li>
                <strong>Buffer Management:</strong> Không buffer quá nhiều, hiển thị ngay khi có token
              </li>
            </ul>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
              <strong>Lưu ý:</strong> SSE implementation, frontend handling, và error handling là phần bạn phải tự implement. AI Model API chỉ stream tokens, không có tính năng SSE hoặc frontend integration.
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
                {`// Backend: Tự tích hợp SSE + AI Model API
app.post('/api/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // AI Model API: Stream từ LLM
  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [...],
    stream: true, // API feature
  });
  
  // Tự tích hợp: Forward chunks qua SSE
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      res.write(\`data: {"content": "\${content}"}\\n\\n\`);
    }
  }
  res.write('data: [DONE]\\n\\n');
});

// Frontend: Tự tích hợp EventSource
const eventSource = new EventSource('/api/stream');
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.content) {
    // Tự tích hợp: Update UI ngay lập tức
    appendToUI(data.content);
  }
};`}
              </pre>
            </div>
            <Alert
              description="AI Model API stream tokens, tự tích hợp implement SSE và frontend handling. Kết hợp cả hai để có trải nghiệm streaming mượt mà và reliable."
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
              Implementation Tips
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Luôn có fallback:</strong> Nếu streaming fail, fallback về non-streaming
              </li>
              <li>
                <strong>Handle cancellation:</strong> User có thể cancel stream, cần cleanup resources
              </li>
              <li>
                <strong>Error handling:</strong> Network errors, timeout, và partial responses
              </li>
              <li>
                <strong>Buffer management:</strong> Không buffer quá nhiều tokens, hiển thị ngay khi có
              </li>
              <li>
                <strong>Connection management:</strong> Reconnect khi mất kết nối, retry logic
              </li>
            </ul>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Performance Considerations
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Time to First Token (TTFT):</strong> Quan trọng hơn total time, streaming giúp giảm TTFT
              </li>
              <li>
                <strong>Perceived performance:</strong> User thấy kết quả ngay → Cảm giác nhanh hơn
              </li>
              <li>
                <strong>Bandwidth:</strong> Streaming tốn bandwidth hơn nhưng UX tốt hơn
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}





