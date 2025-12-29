"use client";

import { Typography, Divider, Table, Alert } from "antd";

const { Title, Paragraph } = Typography;

export function LearningSection() {
  const strategiesData = [
    {
      key: "1",
      strategy: "Sliding Window",
      description: "Giữ N messages mới nhất, loại bỏ messages cũ",
      pros: "Đơn giản, nhanh, không tốn token cho summarization",
      cons: "Mất hoàn toàn thông tin cũ, không phù hợp conversation dài",
      useCase: "Conversation ngắn, không cần nhớ lâu",
    },
    {
      key: "2",
      strategy: "Summarization",
      description: "Tóm tắt messages cũ, giữ messages mới",
      pros: "Giữ được thông tin quan trọng, phù hợp conversation dài",
      cons: "Tốn token và thời gian để summarize, có thể mất chi tiết",
      useCase: "Conversation dài, cần nhớ context lâu",
    },
    {
      key: "3",
      strategy: "Token Truncation",
      description: "Truncate messages khi vượt quá token limit",
      pros: "Kiểm soát chính xác token count, đảm bảo không vượt context window",
      cons: "Có thể cắt giữa chừng message, mất ngữ cảnh",
      useCase: "Cần kiểm soát chặt chẽ token budget",
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
          Memory Management được implement ở <strong>Backend API layer</strong> như một middleware layer giữa user requests và LLM API. Đây là lớp quản lý conversation history để đảm bảo LLM nhớ được context trong các cuộc hội thoại dài.
        </Paragraph>
        <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-4">
          <div className="text-gray-700 text-sm font-mono mb-2">
            Flow: User Message → Memory Manager → (Load History) → LLM API (với history) → (Save History) → Response
          </div>
          <ol className="list-decimal list-inside space-y-2 text-gray-600 text-sm mt-3">
            <li>
              <strong>User Message:</strong> User gửi message mới trong conversation
            </li>
            <li>
              <strong>Memory Manager:</strong> Load conversation history từ database (session-based)
            </li>
            <li>
              <strong>Memory Strategy:</strong> Áp dụng strategy (Sliding Window, Summarization, Token Truncation) để quản lý history
            </li>
            <li>
              <strong>LLM API:</strong> Gọi LLM với messages bao gồm history và message mới
            </li>
            <li>
              <strong>Save History:</strong> Lưu message mới và response vào database
            </li>
            <li>
              <strong>Response:</strong> Trả về response cho user
            </li>
          </ol>
        </div>
        <Alert
          description="Memory Management không phải là feature của LLM API. LLM là stateless, bạn phải tự implement logic để lưu trữ, quản lý, và gửi conversation history vào mỗi request."
          type="info"
          showIcon
        />
      </div>

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          Tại sao cần Memory Management?
        </Title>
        <Paragraph className="text-gray-700 leading-relaxed">
          LLM là <strong>stateless</strong> (không có trạng thái). Mỗi request độc lập,
          không &quot;nhớ&quot; request trước. Để LLM có thể nhớ được context của cuộc hội thoại,
          bạn phải tự quản lý việc gửi kèm lịch sử chat vào mỗi request mới.
        </Paragraph>
        <ul className="list-disc list-inside space-y-2 text-gray-600 mt-2 pb-4">
          <li>
            <strong>Vấn đề:</strong> Context window có giới hạn (GPT-4: 128K tokens,
            GPT-3.5: 16K tokens)
          </li>
          <li>
            <strong>Giải pháp:</strong> Cần strategies để quản lý memory khi conversation
            dài
          </li>
          <li>
            <strong>Mục tiêu:</strong> Giữ được thông tin quan trọng trong giới hạn token
          </li>
        </ul>
        <Alert
          description="Nếu không có memory management, LLM sẽ không nhớ được những gì đã nói trước đó. Ví dụ: User nói 'Tên tôi là Huy', sau đó hỏi 'Tên tôi là gì?' - LLM sẽ không biết trả lời."
          type="info"
          showIcon
          className="mb-4"
        />
      </div>

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          Memory Strategies
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
          Sliding Window Strategy
        </Title>
        <Paragraph className="text-gray-700 leading-relaxed">
          Giữ N messages mới nhất, tự động loại bỏ messages cũ khi vượt quá limit.
        </Paragraph>
        <div className="bg-gray-50 p-4 rounded border border-gray-100 mt-4">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
            {`Ví dụ với maxMessages = 5:
Messages: [1, 2, 3, 4, 5, 6, 7]
→ Giữ lại: [3, 4, 5, 6, 7] (loại bỏ 1, 2)

Ưu điểm: Đơn giản, nhanh
Nhược điểm: Mất hoàn toàn thông tin cũ`}
          </pre>
        </div>
      </div>

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          Summarization Strategy
        </Title>
        <Paragraph className="text-gray-700 leading-relaxed">
          Tóm tắt các messages cũ bằng LLM, giữ lại messages mới. Giúp giữ được thông
          tin quan trọng trong khi tiết kiệm tokens.
        </Paragraph>
        <div className="bg-gray-50 p-4 rounded border border-gray-100 mt-4">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
            {`Ví dụ với maxMessages = 5:
Messages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
→ Summarize [1-5] thành summary message
→ Giữ lại: [summary, 6, 7, 8, 9, 10]

Ưu điểm: Giữ được thông tin quan trọng
Nhược điểm: Tốn token và thời gian để summarize`}
          </pre>
        </div>
      </div>

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          Token Truncation Strategy
        </Title>
        <Paragraph className="text-gray-700 leading-relaxed">
          Truncate messages từ đầu khi tổng số tokens vượt quá limit. Đảm bảo không bao
          giờ vượt quá context window.
        </Paragraph>
        <div className="bg-gray-50 p-4 rounded border border-gray-100 mt-4">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
            {`Ví dụ với maxTokens = 1000:
Messages có tổng 1500 tokens
→ Truncate từ đầu cho đến khi còn 1000 tokens
→ Giữ lại messages mới nhất

Ưu điểm: Kiểm soát chính xác token count
Nhược điểm: Có thể cắt giữa chừng message`}
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
              Trong hầu hết trường hợp, bạn chỉ cần chọn <strong>1 strategy phù hợp</strong> cho use case của mình.
            </Paragraph>
            <ul className="list-disc list-inside space-y-1 text-gray-600 mb-4">
              <li>
                <strong>Sliding Window:</strong> Conversation ngắn (&lt;20 messages), không
                cần nhớ lâu → Dùng riêng
              </li>
              <li>
                <strong>Summarization:</strong> Conversation dài, cần nhớ context lâu → Dùng riêng
              </li>
              <li>
                <strong>Token Truncation:</strong> Cần kiểm soát chặt chẽ token budget → Dùng riêng
              </li>
            </ul>
            <Alert
              description="Mỗi strategy đã được thiết kế để giải quyết một vấn đề cụ thể. Dùng 1 strategy đơn giản hơn, dễ debug và maintain hơn."
              type="info"
              showIcon
            />
          </div>

          <div>
            <Title level={4} className="mb-2">
              Khi nào nên Kết hợp Strategies?
            </Title>
            <Paragraph className="text-gray-700 leading-relaxed mb-3">
              Có một số trường hợp bạn có thể <strong>kết hợp 2 strategies</strong> để đạt kết quả tốt hơn:
            </Paragraph>
            <div className="space-y-3 mb-4">
              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <Title level={5} className="mb-2">
                  Summarization + Token Truncation
                </Title>
                <Paragraph className="text-gray-700 mb-2">
                  <strong>Use case:</strong> Conversation rất dài, sau khi summarize vẫn có thể vượt token limit
                </Paragraph>
                <div className="bg-white p-3 rounded border border-gray-100">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                    {`Flow:
1. Summarize messages cũ → Giảm số lượng messages
2. Nếu summary + messages mới vẫn > maxTokens → Truncate

Ví dụ:
- 50 messages → Summarize → 1 summary + 10 messages mới
- Nếu vẫn > 4000 tokens → Truncate từ đầu`}
                  </pre>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <Title level={5} className="mb-2">
                  Sliding Window + Token Truncation
                </Title>
                <Paragraph className="text-gray-700 mb-2">
                  <strong>Use case:</strong> Giữ N messages nhưng đảm bảo không vượt token limit
                </Paragraph>
                <div className="bg-white p-3 rounded border border-gray-100">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                    {`Flow:
1. Giữ 10 messages mới nhất (Sliding Window)
2. Nếu 10 messages vẫn > maxTokens → Truncate từ đầu

Ví dụ:
- Giữ 10 messages → Tổng 5000 tokens
- maxTokens = 4000 → Truncate cho đến khi còn 4000 tokens`}
                  </pre>
                </div>
              </div>
            </div>
            <Alert
              description="Kết hợp strategies phức tạp hơn và tốn thêm resources. Chỉ nên dùng khi thực sự cần thiết."
              type="warning"
              showIcon
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
              Khi nào dùng strategy nào?
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Sliding Window:</strong> Conversation ngắn (&lt;20 messages), không
                cần nhớ lâu
              </li>
              <li>
                <strong>Summarization:</strong> Conversation dài, cần nhớ context lâu, có
                budget cho summarization
              </li>
              <li>
                <strong>Token Truncation:</strong> Cần kiểm soát chặt chẽ token budget, có
                giới hạn context window nghiêm ngặt
              </li>
            </ul>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Recommendations
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>maxMessages:</strong> 10-20 cho sliding window, 5-10 cho
                summarization
              </li>
              <li>
                <strong>maxTokens:</strong> 2000-4000 cho token truncation (tùy model)
              </li>
              <li>
                <strong>Session Management:</strong> Sử dụng sessionId để quản lý nhiều
                conversations đồng thời
              </li>
              <li>
                <strong>Rule of thumb:</strong> Bắt đầu với 1 strategy đơn giản, chỉ kết hợp khi thực sự cần thiết
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

