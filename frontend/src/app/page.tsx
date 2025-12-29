"use client";

import { Typography, Timeline, Tag, Space, Button } from "antd";
import {
  BookOutlined,
  DatabaseOutlined,
  ApiOutlined,
  RocketOutlined,
  SafetyOutlined,
  ExperimentOutlined,
  ArrowRightOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { Title, Paragraph } = Typography;

type ModuleLesson = {
  route: string;
  title: string;
  description: string;
  purpose: string;
};

type LearningModule = {
  id: string;
  title: string;
  description: string;
  purpose: string;
  icon: React.ReactNode;
  lessons: ModuleLesson[];
  order: number;
};

const learningModules: LearningModule[] = [
  {
    id: "llm-fundamentals",
    title: "01. LLM Fundamentals",
    description: "Nền tảng làm việc với Large Language Models",
    purpose:
      "Module này giúp bạn kiểm soát 'bộ não' (LLM) - đảm bảo input chuẩn và output dùng được trong code. Đây là bước đầu tiên khi chuyển từ Web Dev sang AI Dev: thay vì parse HTML/JSON từ API, bạn sẽ parse và validate output từ LLM. Use cases: Chatbots, content generation, data extraction, classification systems.",
    icon: <BookOutlined />,
    order: 1,
    lessons: [
      {
        route: "/prompt-engineering",
        title: "Prompt Engineering",
        description: "Kỹ thuật thiết kế prompt để AI hiểu ngữ cảnh và format",
        purpose:
          "Học để giảm thiểu AI trả lời sai (hallucination) và tăng độ chính xác cho các tác vụ suy luận logic. Bạn sẽ học các pattern: Zero-shot (hỏi luôn), Few-shot (đưa ví dụ mẫu), Chain-of-Thought (bảo AI suy nghĩ từng bước), Role-based prompting. Kết quả: Viết được prompt phân loại email, trích xuất thông tin từ CV, giải bài toán logic với độ chính xác >90%.",
      },
      {
        route: "/structured-output",
        title: "Structured Output",
        description: "Ép AI trả về JSON theo schema định sẵn",
        purpose:
          "Đây là cầu nối quan trọng nhất với Web Dev. Code backend của bạn cần JSON.parse() chứ không thể parse một đoạn văn. Bạn sẽ học 2 approaches: JSON Mode (đơn giản, nhanh) và Function Calling (type-safe, chặt chẽ hơn). Kết quả: Build được API endpoint nhận text, trả về structured JSON với Zod validation.",
      },
      {
        route: "/streaming",
        title: "Streaming",
        description: "Xử lý response từng chunk để cải thiện UX",
        purpose:
          "Thay vì đợi toàn bộ response (có thể mất 5-10 giây), bạn nhận từng chunk và hiển thị dần. Cải thiện perceived latency và UX đáng kể. Bạn sẽ học cách implement streaming với OpenAI API và xử lý SSE (Server-Sent Events) trong Next.js. Kết quả: Chatbot hiển thị text dần dần như ChatGPT.",
      },
      {
        route: "/model-comparison",
        title: "Model Comparison",
        description: "So sánh và chọn model phù hợp cho từng use case",
        purpose:
          "Không phải lúc nào cũng dùng GPT-4 (đắt, chậm). Bạn cần biết khi nào dùng GPT-3.5 (rẻ, nhanh), khi nào dùng Claude (tốt cho creative), khi nào dùng Gemini (tốt cho code). Bạn sẽ học cách so sánh cost, latency, quality và chọn model tối ưu. Kết quả: Giảm cost 50-70% mà vẫn đảm bảo quality.",
      },
    ],
  },
  {
    id: "rag",
    title: "02. RAG (Retrieval-Augmented Generation)",
    description: "Kỹ thuật RAG để AI truy cập knowledge base",
    purpose:
      "Module này giúp bạn xây dựng 'bộ nhớ dài hạn' cho AI. Thay vì chỉ dựa vào knowledge đã được train, AI có thể truy cập documents, databases, và trả lời dựa trên dữ liệu thực tế. Use cases: Q&A systems với company docs, chatbots với product knowledge, research assistants, document analysis. Đây là kỹ thuật quan trọng nhất để AI trả lời chính xác về domain cụ thể.",
    icon: <DatabaseOutlined />,
    order: 2,
    lessons: [
      {
        route: "/rag/embeddings",
        title: "Embeddings",
        description: "Chuyển đổi text thành vector để tìm kiếm semantic",
        purpose:
          "Học cách biến text thành vectors (array of numbers) để máy tính hiểu được 'ngữ nghĩa'. Các câu có nghĩa tương tự sẽ có vectors gần nhau. Bạn sẽ học Cosine Similarity, OpenAI Embeddings API, và use cases: semantic search, recommendation systems, clustering. Kết quả: Tìm được documents liên quan dựa trên ý nghĩa, không chỉ từ khóa chính xác.",
      },
      {
        route: "/rag/vector-db",
        title: "Vector Database",
        description: "Lưu trữ và query vectors hiệu quả",
        purpose:
          "Vector Database là nơi lưu trữ embeddings và thực hiện similarity search nhanh. Bạn sẽ học cách setup Chroma, Pinecone, hoặc Weaviate, insert documents, và query relevant chunks. Kết quả: Build được knowledge base với hàng nghìn documents, query trong <100ms.",
      },
      {
        route: "/rag/chunking-strategy",
        title: "Chunking Strategy",
        description: "Chia nhỏ documents để tối ưu retrieval",
        purpose:
          "Không thể đưa toàn bộ document (10,000 words) vào prompt. Bạn cần chia nhỏ thành chunks và chỉ retrieve chunks liên quan. Bạn sẽ học các strategies: fixed-size, semantic, recursive, và cách chọn chunk size tối ưu. Kết quả: Tăng độ chính xác retrieval từ 60% lên 85%+.",
      },
    ],
  },
  {
    id: "orchestration",
    title: "03. Orchestration",
    description: "Quản lý memory, chains và routing để xây dựng AI workflows",
    purpose:
      "Module này giúp bạn xây dựng 'dây thần kinh' (orchestration) - kết nối các components lại với nhau. Bạn sẽ học cách quản lý conversation history, xây dựng chains (workflows tuần tự), và routing (chọn model/handler phù hợp). Use cases: Multi-step workflows, dynamic model selection, conversation management. Đây là foundation để build AI applications phức tạp.",
    icon: <ApiOutlined />,
    order: 3,
    lessons: [
      {
        route: "/orchestration/memory-management",
        title: "Memory Management",
        description: "Lưu trữ và quản lý conversation history",
        purpose:
          "AI cần nhớ context trong các cuộc hội thoại dài. Bạn sẽ học cách implement short-term memory (buffer window), long-term memory (vector store), và summary memory. Bạn sẽ học cách quản lý token limits, khi nào nên summarize, và cách optimize context window. Kết quả: Chatbot nhớ được toàn bộ conversation 50+ messages mà không vượt token limit.",
      },
      {
        route: "/orchestration/chains-routing",
        title: "Chains & Routing",
        description: "Xây dựng chains và route đến models phù hợp",
        purpose:
          "Học cách kết nối các bước xử lý tuần tự (Simple Chain) hoặc rẽ nhánh (Router Pattern). Ví dụ: Translate → Summarize → Extract keywords, hoặc phân loại intent và route đến model phù hợp (code tasks → Code model, creative → Creative model). Bạn sẽ học khi nào nên dùng LangChain và khi nào code thuần đủ. Kết quả: Build được multi-step workflows với conditional logic.",
      },
    ],
  },
  {
    id: "agents",
    title: "04. Agents",
    description: "Xây dựng AI agents tự động thực thi tasks",
    purpose:
      "Module này giúp bạn xây dựng 'tay chân' (tools/actions) cho AI - khả năng gọi API, lướt web, truy xuất database. Agent có thể tự động suy nghĩ, quyết định và hành động để hoàn thành tasks phức tạp. Use cases: Research assistants, automation tools, AI copilots, task automation. Đây là bước tiến từ 'AI trả lời câu hỏi' sang 'AI thực thi công việc'.",
    icon: <RocketOutlined />,
    order: 4,
    lessons: [
      {
        route: "/agents/function-calling",
        title: "Function Calling",
        description: "Cho phép AI gọi functions/tools bên ngoài",
        purpose:
          "Biến AI từ 'người tư vấn' thành 'trợ lý thực thi'. AI có thể gọi functions để lấy thời tiết, tìm kiếm web, query database, gửi email. Bạn sẽ học cách define function schemas, handle tool calls, và implement tool registry pattern. Kết quả: Build được assistant có thể thực thi 5+ tools khác nhau (search, calculator, email, etc.).",
      },
      {
        route: "/agents/react-pattern",
        title: "ReAct Pattern",
        description: "Agent tự động suy nghĩ và hành động trong vòng lặp",
        purpose:
          "ReAct (Reasoning + Acting) cho phép agent tự động giải quyết các bài toán nhiều bước bằng vòng lặp: Thought → Action → Observation → Repeat hoặc Final Answer. Bạn sẽ học cách implement với LangGraph, xử lý infinite loops, error handling, và max iterations. Kết quả: Build được research agent tự động tìm kiếm, phân tích và tổng hợp thông tin từ nhiều nguồn.",
      },
    ],
  },
  {
    id: "production",
    title: "05. Production",
    description: "Best practices cho production AI applications",
    purpose:
      "Module này giúp bạn đưa AI applications lên production với confidence. Bạn sẽ học cách đánh giá chất lượng, monitor performance, optimize cost, đảm bảo security, và xử lý errors gracefully. Use cases: Production chatbots, AI APIs, enterprise AI systems. Đây là phần quan trọng nhất để chuyển từ prototype sang production-ready system.",
    icon: <SafetyOutlined />,
    order: 5,
    lessons: [
      {
        route: "/production/evaluation",
        title: "Evaluation",
        description: "Đánh giá chất lượng AI applications",
        purpose:
          "Làm sao biết AI application của bạn tốt hay không? Bạn sẽ học cách build evaluation datasets, metrics (accuracy, latency, cost), và automated testing. Kết quả: Có được evaluation framework để đánh giá và cải thiện AI applications liên tục.",
      },
      {
        route: "/production/observability",
        title: "Observability",
        description: "Monitoring và logging cho AI systems",
        purpose:
          "AI systems cần monitoring đặc biệt: track prompts, responses, token usage, errors, và user feedback. Bạn sẽ học cách setup logging, tracing, và dashboards. Kết quả: Có được full visibility vào AI system performance và user experience.",
      },
      {
        route: "/production/cost-optimization",
        title: "Cost Optimization",
        description: "Tối ưu chi phí khi scale",
        purpose:
          "AI applications có thể tốn rất nhiều tiền khi scale. Bạn sẽ học cách optimize: chọn model phù hợp, caching, batching, và rate limiting. Kết quả: Giảm cost 50-80% mà vẫn đảm bảo quality và latency.",
      },
      {
        route: "/production/security",
        title: "Security",
        description: "Bảo mật AI applications",
        purpose:
          "AI applications có các rủi ro bảo mật đặc biệt: prompt injection, data leakage, model poisoning. Bạn sẽ học cách protect: input validation, output sanitization, rate limiting, và access control. Kết quả: AI application an toàn trước các attacks phổ biến.",
      },
      {
        route: "/production/error-handling",
        title: "Error Handling",
        description: "Xử lý lỗi và fallback strategies",
        purpose:
          "LLM có thể fail vì nhiều lý do: rate limits, timeouts, invalid responses. Bạn sẽ học cách handle: retries, fallbacks, graceful degradation, và user-friendly error messages. Kết quả: AI application resilient và user experience tốt ngay cả khi có lỗi.",
      },
    ],
  },
  {
    id: "advanced",
    title: "06. Advanced",
    description: "Các chủ đề nâng cao trong AI development",
    purpose:
      "Module này dành cho những bạn muốn đi sâu hơn: xử lý multimodal (text + image + audio), fine-tuning models cho domain cụ thể, và chạy models trên local infrastructure. Use cases: Custom AI models, on-premise deployments, specialized applications. Đây là bước tiến từ 'dùng AI' sang 'build AI'.",
    icon: <ExperimentOutlined />,
    order: 6,
    lessons: [
      {
        route: "/advanced/multimodal",
        title: "Multimodal",
        description: "Xử lý text, image, audio cùng lúc",
        purpose:
          "Học cách xử lý nhiều loại input cùng lúc: text, image, audio, video. Bạn sẽ học cách sử dụng GPT-4 Vision, Claude với images, và audio processing. Kết quả: Build được applications phân tích images, transcribe audio, và hiểu context đa phương tiện.",
      },
      {
        route: "/advanced/fine-tuning",
        title: "Fine-tuning",
        description: "Train lại models cho domain cụ thể",
        purpose:
          "Khi prompt engineering không đủ, bạn có thể fine-tune model trên dataset của riêng mình. Bạn sẽ học cách prepare data, train model, và deploy fine-tuned model. Kết quả: Có được model chuyên biệt cho domain của bạn với accuracy cao hơn 20-30%.",
      },
      {
        route: "/advanced/local-models",
        title: "Local Models",
        description: "Chạy models trên local infrastructure",
        purpose:
          "Không phải lúc nào cũng muốn gọi API (cost, privacy, latency). Bạn sẽ học cách chạy models như Llama, Mistral trên local hoặc self-hosted infrastructure. Bạn sẽ học về quantization, GPU requirements, và deployment strategies. Kết quả: Có được AI system hoàn toàn private và không phụ thuộc vào external APIs.",
      },
    ],
  },
];

export default function Home() {
  return (
    <div className="flex-1">
      <div className="px-8 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <Title level={4} style={{ marginBottom: 0 }}>
          Tổng quan
        </Title>
      </div>

      <div className="px-8 py-6 space-y-8">
        <div className="space-y-6">
          <div>
            <Title level={3} className="mb-4">
              Tổng quan về AI Application Developer
            </Title>
            <Paragraph className="text-gray-700 leading-relaxed text-base mb-4">
              Một ứng dụng AI không chỉ đơn giản là{" "}
              <code>User → Prompt → LLM → Response</code>. Để xây dựng AI
              applications thực sự hữu ích, bạn cần hiểu kiến trúc tổng thể với
              5 thành phần cốt lõi:
            </Paragraph>

            <div className="space-y-4">
              <div className="border-l-2 border-gray-300 pl-4 py-2">
                <Title
                  level={5}
                  className="mb-2"
                  style={{ marginBottom: "8px" }}
                >
                  <Space>
                    <BookOutlined className="text-gray-600" />
                    <span>Bộ não (The Brain): LLM</span>
                  </Space>
                </Title>
                <Paragraph className="text-gray-700 leading-relaxed mb-0">
                  <strong>LLM (Large Language Model)</strong> là &quot;bộ
                  não&quot; của ứng dụng AI - nơi xử lý và sinh ra text. Các
                  model phổ biến: GPT-4, Claude, Gemini, Llama. Bạn cần học cách{" "}
                  <strong>kiểm soát input</strong> (prompt engineering) và{" "}
                  <strong>đảm bảo output</strong> (structured output) để code có
                  thể xử lý được.
                </Paragraph>
              </div>

              <div className="border-l-2 border-gray-300 pl-4 py-2">
                <Title
                  level={5}
                  className="mb-2"
                  style={{ marginBottom: "8px" }}
                >
                  <Space>
                    <DatabaseOutlined className="text-gray-600" />
                    <span>Bộ nhớ dài hạn (Long-term Memory): RAG</span>
                  </Space>
                </Title>
                <Paragraph className="text-gray-700 leading-relaxed mb-0">
                  <strong>RAG (Retrieval-Augmented Generation)</strong> là kỹ
                  thuật cho AI truy cập knowledge base riêng của bạn. Thay vì
                  chỉ dựa vào knowledge đã được train, AI có thể đọc documents,
                  databases và trả lời dựa trên dữ liệu thực tế. Bao gồm:{" "}
                  <strong>Embeddings</strong> (chuyển text thành vectors),{" "}
                  <strong>Vector Database</strong> (lưu trữ và tìm kiếm
                  semantic), và <strong>Chunking Strategy</strong> (chia nhỏ
                  documents để tối ưu).
                </Paragraph>
              </div>

              <div className="border-l-2 border-gray-300 pl-4 py-2">
                <Title
                  level={5}
                  className="mb-2"
                  style={{ marginBottom: "8px" }}
                >
                  <Space>
                    <FileTextOutlined className="text-gray-600" />
                    <span>
                      Bộ nhớ ngắn hạn (Short-term Memory): Context Management
                    </span>
                  </Space>
                </Title>
                <Paragraph className="text-gray-700 leading-relaxed mb-0">
                  <strong>Context</strong> là toàn bộ thông tin bạn gửi cho LLM
                  trong một request (prompt + conversation history). LLM là
                  stateless - không tự nhớ được cuộc hội thoại trước đó. Bạn cần
                  quản lý <strong>conversation history</strong>, xử lý khi
                  context quá dài (vượt token limit), và tối ưu context window
                  để giảm cost.
                </Paragraph>
              </div>

              <div className="border-l-2 border-gray-300 pl-4 py-2">
                <Title
                  level={5}
                  className="mb-2"
                  style={{ marginBottom: "8px" }}
                >
                  <Space>
                    <RocketOutlined className="text-gray-600" />
                    <span>Tay chân (Tools/Actions): Agents</span>
                  </Space>
                </Title>
                <Paragraph className="text-gray-700 leading-relaxed mb-0">
                  <strong>Agent</strong> là AI system có khả năng tự động thực
                  thi tasks bằng cách suy nghĩ, quyết định và hành động. Agent
                  có thể gọi <strong>functions/tools</strong> (API, database,
                  web search) và thực hiện <strong>multi-step reasoning</strong>
                  .<strong>ReAct Pattern</strong> (Reasoning + Acting) cho phép
                  agent tự động giải quyết các bài toán phức tạp trong vòng lặp:
                  Thought → Action → Observation → Repeat hoặc Final Answer.
                </Paragraph>
              </div>

              <div className="border-l-2 border-gray-300 pl-4 py-2">
                <Title
                  level={5}
                  className="mb-2"
                  style={{ marginBottom: "8px" }}
                >
                  <Space>
                    <ApiOutlined className="text-gray-600" />
                    <span>
                      Dây thần kinh (Orchestration): Workflows & Routing
                    </span>
                  </Space>
                </Title>
                <Paragraph className="text-gray-700 leading-relaxed mb-0">
                  <strong>Orchestration</strong> là framework kết nối tất cả các
                  phần trên lại với nhau. Bao gồm: <strong>Chains</strong>{" "}
                  (workflows tuần tự: Translate → Summarize → Extract),
                  <strong>Routing</strong> (phân loại input và chọn
                  model/handler phù hợp), và <strong>Memory Management</strong>{" "}
                  (quản lý conversation history, context window). Đây là
                  foundation để build AI applications phức tạp và
                  production-ready.
                </Paragraph>
              </div>
            </div>

            <Paragraph className="text-gray-700 leading-relaxed text-base mt-6">
              Lộ trình học tập dưới đây sẽ giúp bạn nắm vững từng thành phần, từ
              cơ bản đến nâng cao. Mỗi module xây dựng dựa trên kiến thức của
              module trước đó, tạo nên một nền tảng vững chắc để trở thành AI
              Application Developer.
            </Paragraph>
          </div>
        </div>

        <div>
          <Title level={3} className="mb-6">
            Lộ trình học tập (Roadmap)
          </Title>
          <Paragraph className="text-gray-700 leading-relaxed text-base mb-6">
            Học theo thứ tự từ <strong>01. LLM Fundamentals</strong> đến{" "}
            <strong>06. Advanced</strong> để có nền tảng vững chắc. Mỗi module
            xây dựng dựa trên kiến thức của module trước đó.
          </Paragraph>

          <Timeline
            mode="start"
            items={learningModules.map((module) => ({
              dot: <div className="text-2xl text-gray-600">{module.icon}</div>,
              content: (
                <div className="pb-8">
                  <div className="mb-4">
                    <Space className="mb-2">
                      <Title level={4} style={{ marginBottom: 0 }}>
                        {module.title}
                      </Title>
                      <Tag color="blue">Module {module.order}</Tag>
                    </Space>
                    <Paragraph
                      className="text-gray-600 mb-3"
                      style={{ marginTop: "8px" }}
                    >
                      {module.description}
                    </Paragraph>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r mb-4">
                      <Paragraph className="text-gray-700 leading-relaxed mb-0">
                        {module.purpose}
                      </Paragraph>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {module.lessons.map((lesson, index) => (
                      <div
                        key={lesson.route}
                        className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors bg-white"
                      >
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <Space className="mb-2">
                              <span className="text-sm font-medium text-gray-500">
                                Bài {index + 1}
                              </span>
                              <Link href={lesson.route}>
                                <Title
                                  level={5}
                                  style={{ marginBottom: 0, display: "inline" }}
                                >
                                  {lesson.title}
                                </Title>
                              </Link>
                            </Space>
                            <Paragraph
                              className="text-gray-600 text-sm mb-2"
                              style={{ marginTop: "4px" }}
                            >
                              {lesson.description}
                            </Paragraph>
                          </div>
                          <Link href={lesson.route}>
                            <Button
                              type="link"
                              size="small"
                            >
                              Học ngay
                            </Button>
                          </Link>
                        </div>
                        <div className="bg-gray-50 p-4 rounded border border-gray-100">
                          <Paragraph
                            style={{ marginBottom: 0 }}
                            className="text-gray-700 text-sm leading-relaxed"
                          >
                            {lesson.purpose}
                          </Paragraph>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            }))}
          />
        </div>
      </div>
    </div>
  );
}
