"use client";

import {
  Typography,
  Card,
  Tabs,
  Space,
  Button,
  Tag,
  Divider,
  Alert,
} from "antd";
import {
  BookOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  ReadOutlined,
  ArrowRightOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useState, useEffect } from "react";

const { Title, Paragraph } = Typography;

export const STORAGE_KEY = "project-ideas-selected-idea";

export type RoadmapMilestone = {
  lessonRoute: string;
  lessonTitle: string;
  action: string;
  details?: string[];
  expectedOutcome?: string;
};

export type ProjectIdea = {
  id: string;
  title: string;
  description: string;
  problem: string;
  knowledgeBase: string;
  tools: string[];
  roadmap: RoadmapMilestone[];
  icon: React.ReactNode;
};

export const projectIdeas: ProjectIdea[] = [
  {
    id: "personal-knowledge-base",
    title: "Personal Knowledge Base",
    description:
      "Xây dựng hệ thống lưu trữ và khai thác tri thức cá nhân. Lưu ghi chú, tài liệu, đoạn code, bookmarks và có thể hỏi đáp, tìm kiếm semantic, nhắc lại kiến thức đã học.",
    problem:
      "Dev thường lưu kiến thức rải rác ở nhiều nơi (notes, bookmarks, code snippets). Khó tìm lại khi cần, không có cách nào để AI hỗ trợ tìm kiếm và nhắc lại kiến thức.",
    knowledgeBase:
      "Markdown notes, code snippets, bookmarks, tài liệu học tập cá nhân",
    tools: ["add_note", "search_notes", "summarize_topic", "create_reminder"],
    icon: <BookOutlined />,
    roadmap: [
      {
        lessonRoute: "/prompt-engineering",
        lessonTitle: "Prompt Engineering",
        action:
          "Xác định persona và viết prompt baseline cho các intents chính của hệ thống",
        details: [
          "Xác định persona: 'Bạn là trợ lý quản lý tri thức cá nhân chuyên nghiệp, giúp người dùng tìm kiếm, tổng hợp và quản lý ghi chú của họ'",
          "Phân tích và xác định 3 intents chính: search_notes (tìm kiếm note), summarize_topic (tóm tắt chủ đề), create_reminder (tạo nhắc nhở)",
          "Viết prompt template cho từng intent với role-based prompting",
          "Thêm few-shot examples cho mỗi intent để AI hiểu rõ format mong muốn",
          "Test prompt với 10 queries mẫu và điều chỉnh để đạt accuracy >85%",
        ],
        expectedOutcome:
          "Có được 3 prompt templates hoạt động tốt cho 3 intents chính, sẵn sàng tích hợp vào hệ thống",
      },
      {
        lessonRoute: "/structured-output",
        lessonTitle: "Structured Output",
        action:
          "Thiết kế và implement schema JSON cho output của hệ thống với validation chặt chẽ",
        details: [
          "Thiết kế schema JSON: {answer: string, citations: string[], related_notes: {id, title, snippet}[], suggested_actions: {action, params}[]}",
          "Implement Zod schema để validate output từ LLM",
          "Xử lý trường hợp LLM trả về invalid JSON: retry với stricter prompt hoặc fallback",
          "Test với 20 queries khác nhau để đảm bảo schema luôn được tuân thủ",
          "Tạo TypeScript types từ Zod schema để type-safe trong codebase",
        ],
        expectedOutcome:
          "Backend có thể parse và validate output từ LLM một cách reliable, không cần manual parsing",
      },
      {
        lessonRoute: "/streaming",
        lessonTitle: "Streaming",
        action:
          "Implement streaming response để cải thiện UX khi AI xử lý queries dài",
        details: [
          "Setup Server-Sent Events (SSE) endpoint trong backend để stream response từ LLM",
          "Frontend: implement EventSource hoặc fetch với stream để nhận chunks",
          "Hiển thị answer từng chunk trong real-time, với loading indicator khi đang stream",
          "Xử lý edge cases: connection timeout, partial responses, error handling trong stream",
          "Test với queries dài (tìm kiếm và tổng hợp 10+ notes) để đảm bảo streaming mượt",
        ],
        expectedOutcome:
          "User thấy answer hiển thị dần dần thay vì đợi 5-10 giây, perceived latency giảm đáng kể",
      },
      {
        lessonRoute: "/model-comparison",
        lessonTitle: "Model Comparison",
        action:
          "So sánh và chọn model tối ưu cho từng use case để balance cost và quality",
        details: [
          "Tạo test set: 30 queries (10 simple search, 10 complex search, 10 summarization)",
          "Test GPT-3.5-turbo vs GPT-4 vs Claude-3 trên cùng test set",
          "Đo metrics: accuracy, latency, cost per query, user satisfaction",
          "Phân tích kết quả: GPT-3.5 đủ cho simple queries, GPT-4 tốt hơn cho complex summarization",
          "Implement routing logic: simple queries → GPT-3.5, complex → GPT-4",
          "Tính toán cost savings: dự kiến giảm 50-60% cost mà vẫn đảm bảo quality",
        ],
        expectedOutcome:
          "Có routing strategy rõ ràng, giảm cost đáng kể mà vẫn maintain quality cho user experience",
      },
      {
        lessonRoute: "/rag/embeddings",
        lessonTitle: "Embeddings",
        action:
          "Chuẩn hóa và tạo embeddings cho knowledge base để enable semantic search",
        details: [
          "Preprocessing: loại bỏ markdown syntax không cần thiết, normalize whitespace, extract code blocks riêng",
          "Chuẩn hóa format: đảm bảo mỗi note có title, content, tags, metadata",
          "Tạo embeddings cho tất cả notes bằng OpenAI text-embedding-3-small (1536 dimensions)",
          "Xử lý code snippets: tạo embeddings riêng cho code blocks để search code tốt hơn",
          "Batch processing: xử lý 1000 notes trong batches để optimize API calls",
          "Lưu embeddings vào file/DB để reuse, không cần re-embed khi note không đổi",
        ],
        expectedOutcome:
          "Có embeddings cho toàn bộ knowledge base, sẵn sàng cho semantic search",
      },
      {
        lessonRoute: "/rag/vector-db",
        lessonTitle: "Vector Database",
        action:
          "Setup vector database và implement retrieval system cho knowledge base",
        details: [
          "Chọn vector DB: Chroma (local, free) hoặc Pinecone (cloud, scalable). Bắt đầu với Chroma cho MVP",
          "Setup Chroma: install, initialize collection với metadata schema (title, tags, created_at)",
          "Ingest embeddings: insert tất cả notes với embeddings và metadata vào vector DB",
          "Implement similarity search: query embedding → retrieve top-5 relevant notes với cosine similarity",
          "Add metadata filtering: filter by tags, date range khi search",
          "Test retrieval quality: 20 test queries, đo precision@5 (số notes relevant trong top-5)",
        ],
        expectedOutcome:
          "Có vector DB chứa toàn bộ notes, retrieval API trả về top-5 relevant notes trong <100ms",
      },
      {
        lessonRoute: "/rag/chunking-strategy",
        lessonTitle: "Chunking Strategy",
        action: "Tối ưu chunking strategy để improve retrieval accuracy",
        details: [
          "Phân tích markdown structure: identify headers, code blocks, lists, paragraphs",
          "Implement semantic chunking: split theo headers (H1, H2), giữ nguyên code blocks như một chunk",
          "Tune chunk size: test 200, 500, 1000 tokens, chọn size cho retrieval accuracy tốt nhất",
          "Handle edge cases: long code blocks (giữ nguyên), short notes (combine với related notes)",
          "Đo retrieval quality: 30 test queries, so sánh precision@5 với different chunk sizes",
          "Implement overlap strategy: 50 tokens overlap giữa chunks để không mất context",
        ],
        expectedOutcome:
          "Retrieval accuracy tăng từ 60% lên 85%+, chunks có size và structure tối ưu",
      },
      {
        lessonRoute: "/orchestration/memory-management",
        lessonTitle: "Memory Management",
        action:
          "Implement conversation memory để AI nhớ context trong các cuộc hội thoại dài",
        details: [
          "Design memory storage: lưu conversation history trong database (user_id, messages[], timestamps)",
          "Implement sliding window: giữ 10 messages gần nhất trong context, archive messages cũ hơn",
          "Token budget management: tính toán token count cho RAG context + chat history, đảm bảo không vượt model limit",
          "Summarization strategy: khi context >80% token limit, summarize 5 oldest messages thành 1 message",
          "Long-term memory: lưu important facts vào vector DB để retrieve khi cần (ví dụ: user preferences)",
          "Test với conversation 50+ messages để đảm bảo memory hoạt động tốt",
        ],
        expectedOutcome:
          "AI nhớ được context trong conversations dài, không bị mất thông tin quan trọng",
      },
      {
        lessonRoute: "/orchestration/chains-routing",
        lessonTitle: "Chains & Routing",
        action:
          "Xây dựng workflow chain và routing logic để xử lý các loại queries khác nhau",
        details: [
          "Design chain: retrieve relevant notes → generate answer with citations → suggest related topics → format response",
          "Implement intent classification: phân loại query thành search, summarize, create_note, general_qa",
          "Routing logic: mỗi intent → handler riêng với prompt và processing logic phù hợp",
          "Chain execution: sequential processing với error handling ở mỗi step",
          "Add conditional logic: nếu không tìm thấy relevant notes → suggest creating new note",
          "Test với 20 queries mỗi intent để đảm bảo routing chính xác và chain hoạt động tốt",
        ],
        expectedOutcome:
          "Có workflow chain hoàn chỉnh, routing chính xác >90%, xử lý được các loại queries khác nhau",
      },
      {
        lessonRoute: "/agents/function-calling",
        lessonTitle: "Function Calling",
        action:
          "Implement function calling để AI có thể thực thi các actions trong knowledge base",
        details: [
          "Define function schemas: add_note(title, content, tags[]), search_notes(query, filters), summarize_topic(topic), create_reminder(note_id, date, message)",
          "Implement tool registry pattern: central registry quản lý tất cả available tools",
          "Function implementations: mỗi function có handler riêng, validate inputs, execute action, return result",
          "Tool selection logic: LLM quyết định khi nào gọi function nào dựa trên user query",
          "Error handling: xử lý invalid function calls, missing parameters, execution errors",
          "Test với 15 queries yêu cầu different functions để đảm bảo AI gọi đúng function",
        ],
        expectedOutcome:
          "AI có thể tự động gọi functions để thực thi actions, user có thể tương tác với knowledge base qua natural language",
      },
      {
        lessonRoute: "/agents/react-pattern",
        lessonTitle: "ReAct Pattern",
        action:
          "Implement ReAct agent để tự động giải quyết các queries phức tạp nhiều bước",
        details: [
          "Design agent loop: Thought → Action (function call) → Observation → Thought → Repeat hoặc Final Answer",
          "Implement reasoning: agent suy nghĩ về query, quyết định cần làm gì, gọi function nào",
          "Multi-step reasoning: ví dụ 'Tìm tất cả notes về React, tóm tắt chúng, và tạo reminder học lại sau 1 tuần'",
          "Max iterations: set limit = 5 để tránh infinite loops, return best answer sau 5 iterations",
          "Guardrails: detect circular reasoning, invalid actions, timeout sau 30s",
          "Test với 10 complex queries yêu cầu nhiều bước để đảm bảo agent hoạt động đúng",
        ],
        expectedOutcome:
          "Agent có thể tự động giải quyết complex queries nhiều bước mà không cần user hướng dẫn chi tiết",
      },
      {
        lessonRoute: "/production/evaluation",
        lessonTitle: "Evaluation",
        action:
          "Xây dựng evaluation framework để đánh giá và cải thiện chất lượng hệ thống",
        details: [
          "Tạo evaluation dataset: 50 test questions về các notes đã lưu, có ground truth answers",
          "Metrics: accuracy (% câu trả lời đúng), retrieval precision@5, latency, cost per query",
          "Implement automated evaluation: chạy test set, so sánh answers với ground truth, tính metrics",
          "Human evaluation: 10 questions được đánh giá bởi human để validate automated metrics",
          "Regression testing: chạy evaluation sau mỗi thay đổi prompt/model để đảm bảo không degrade",
          "A/B testing framework: so sánh 2 versions của system để chọn version tốt hơn",
        ],
        expectedOutcome:
          "Có evaluation framework hoàn chỉnh, biết chính xác chất lượng hệ thống và có thể cải thiện liên tục",
      },
      {
        lessonRoute: "/production/observability",
        lessonTitle: "Observability",
        action:
          "Implement logging và monitoring để có full visibility vào system performance",
        details: [
          "Logging strategy: log mọi query với prompt, retrieved notes, answer, token usage, latency, user_id, timestamp",
          "Structured logging: dùng JSON format để dễ query và analyze",
          "Error logging: log errors với stack traces, context, để debug nhanh",
          "Metrics collection: queries/day, average latency, token usage, cost, error rate",
          "Dashboard: visualize metrics, top searched topics, user activity, system health",
          "Alerting: alert khi error rate >5%, latency >3s, hoặc cost vượt budget",
        ],
        expectedOutcome:
          "Có full visibility vào system, có thể debug issues nhanh, track performance và cost trends",
      },
      {
        lessonRoute: "/production/cost-optimization",
        lessonTitle: "Cost Optimization",
        action: "Tối ưu cost bằng caching, batching, và smart model selection",
        details: [
          "Embedding cache: cache embeddings của notes, chỉ re-embed khi note thay đổi (check hash)",
          "Query cache: cache answers cho common queries (exact match), TTL = 1 hour",
          "Semantic cache: cache similar queries (cosine similarity >0.95), reuse answers",
          "Model fallback: nếu GPT-4 rate limit → fallback sang GPT-3.5, log để track",
          "Batch processing: batch multiple embedding requests khi có thể",
          "Cost tracking: track cost per user, per feature, set budgets và alerts",
        ],
        expectedOutcome:
          "Giảm cost 50-70% so với baseline, vẫn maintain quality và user experience",
      },
      {
        lessonRoute: "/production/security",
        lessonTitle: "Security",
        action: "Implement security measures để protect system và user data",
        details: [
          "Prompt injection defense: validate và sanitize user input, detect suspicious patterns, escape special characters",
          "Input validation: validate query length, content, reject malicious inputs",
          "Data privacy: đảm bảo notes chỉ accessible bởi owner (user_id check), encrypt sensitive data",
          "Authentication & authorization: verify user identity, check permissions trước khi access notes",
          "Rate limiting: max 100 queries/day/user, 10 queries/minute để prevent abuse",
          "Output sanitization: sanitize AI output trước khi trả về user để tránh XSS",
        ],
        expectedOutcome:
          "System an toàn trước các attacks phổ biến, user data được protect, có rate limiting để prevent abuse",
      },
      {
        lessonRoute: "/production/error-handling",
        lessonTitle: "Error Handling",
        action:
          "Implement robust error handling để system resilient và user experience tốt",
        details: [
          "Retry logic: retry API calls với exponential backoff (1s, 2s, 4s), max 3 retries",
          "Timeout handling: set timeout 30s cho LLM calls, return timeout error nếu quá lâu",
          "Graceful degradation: nếu vector DB down → fallback sang keyword search trong database",
          "Partial failures: nếu một số notes không retrieve được → vẫn trả về notes available",
          "User-friendly errors: translate technical errors thành messages dễ hiểu cho user",
          "Error recovery: log errors, notify admin, tự động recover khi service available lại",
        ],
        expectedOutcome:
          "System resilient, handle errors gracefully, user vẫn có experience tốt ngay cả khi có issues",
      },
    ],
  },
  {
    id: "product-assistant",
    title: "Trợ lý sản phẩm (Product Assistant)",
    description:
      "Chatbot hỗ trợ khách hàng tìm kiếm sản phẩm, đọc thông tin chi tiết, so sánh, và đặt hàng. Sử dụng product catalog và FAQs làm knowledge base.",
    problem:
      "Khách hàng cần tìm sản phẩm phù hợp nhưng catalog lớn, khó navigate. Cần AI hỗ trợ tìm kiếm semantic, so sánh features, và hướng dẫn đặt hàng.",
    knowledgeBase:
      "Product catalog (JSON/CSV), FAQs, specifications, pricing rules",
    tools: [
      "search_products",
      "compare_products",
      "create_order",
      "get_order_status",
      "check_availability",
    ],
    icon: <ShoppingOutlined />,
    roadmap: [
      {
        lessonRoute: "/prompt-engineering",
        lessonTitle: "Prompt Engineering",
        action:
          "Xác định persona và viết prompt baseline cho các intents chính của hệ thống",
        details: [
          "Xác định persona: 'Bạn là trợ lý bán hàng chuyên nghiệp, giúp khách hàng tìm sản phẩm phù hợp, so sánh features và đặt hàng'",
          "Phân tích và xác định 3 intents chính: search_products (tìm sản phẩm), compare_products (so sánh), create_order (đặt hàng)",
          "Viết prompt template cho từng intent với role-based prompting",
          "Thêm few-shot examples cho product recommendations: ví dụ 'Tôi cần laptop gaming' → suggest products với features phù hợp",
          "Test prompt với 15 queries mẫu về products và điều chỉnh để đạt accuracy >85%",
        ],
        expectedOutcome:
          "Có được 3 prompt templates hoạt động tốt cho 3 intents chính, AI hiểu được product queries và recommend phù hợp",
      },
      {
        lessonRoute: "/structured-output",
        lessonTitle: "Structured Output",
        action:
          "Thiết kế và implement schema JSON cho output của hệ thống với validation chặt chẽ",
        details: [
          "Thiết kế schema JSON: {products: {id, name, price, features}[], comparison_table?: {feature, product1, product2}[], order_id?: string, suggested_actions: {action, params}[]}",
          "Implement Zod schema để validate output từ LLM, đặc biệt quan trọng cho order creation",
          "Validate product IDs, quantities, prices trước khi tạo order: verify product exists, quantity > 0, price matches",
          "Xử lý trường hợp LLM trả về invalid JSON: retry với stricter prompt hoặc fallback",
          "Test với 20 queries khác nhau (search, compare, order) để đảm bảo schema luôn được tuân thủ",
        ],
        expectedOutcome:
          "Backend có thể parse và validate output từ LLM một cách reliable, đảm bảo order data chính xác trước khi tạo order",
      },
      {
        lessonRoute: "/streaming",
        lessonTitle: "Streaming",
        action:
          "Implement streaming response để cải thiện UX khi AI tìm kiếm và hiển thị products",
        details: [
          "Setup Server-Sent Events (SSE) endpoint trong backend để stream response từ LLM",
          "Frontend: implement EventSource hoặc fetch với stream để nhận chunks",
          "Streaming cho product search: hiển thị từng sản phẩm khi AI tìm thấy, không cần đợi toàn bộ results",
          "Xử lý edge cases: connection timeout, partial responses, error handling trong stream",
          "Test với queries tìm nhiều products (10+) để đảm bảo streaming mượt và UX tốt",
        ],
        expectedOutcome:
          "User thấy products hiển thị từng cái một thay vì đợi 5-10 giây, perceived latency giảm đáng kể",
      },
      {
        lessonRoute: "/model-comparison",
        lessonTitle: "Model Comparison",
        action:
          "So sánh và chọn model tối ưu cho từng use case để balance cost và quality",
        details: [
          "Tạo test set: 40 queries (15 simple search, 15 complex search, 10 comparisons)",
          "Test GPT-3.5-turbo vs GPT-4 vs Claude-3 trên cùng test set",
          "Đo metrics: accuracy, latency, cost per query, user satisfaction",
          "Phân tích kết quả: GPT-3.5 đủ cho simple queries, GPT-4 tốt hơn cho complex comparisons, Claude tốt cho creative descriptions",
          "Implement routing logic: simple queries → GPT-3.5, complex comparisons → GPT-4, descriptions → Claude",
          "Tính toán cost savings: dự kiến giảm 50-60% cost mà vẫn đảm bảo quality",
        ],
        expectedOutcome:
          "Có routing strategy rõ ràng, giảm cost đáng kể mà vẫn maintain quality cho user experience",
      },
      {
        lessonRoute: "/rag/embeddings",
        lessonTitle: "Embeddings",
        action:
          "Chuẩn hóa và tạo embeddings cho product catalog để enable semantic search",
        details: [
          "Preprocessing: chuẩn hóa product data, normalize text, extract features",
          "Combine text fields: name + description + features + category thành một embedding để search tốt hơn",
          "Tạo embeddings cho tất cả products bằng OpenAI text-embedding-3-small (1536 dimensions)",
          "Tạo embeddings riêng cho FAQs để search FAQs hiệu quả",
          "Batch processing: xử lý 1000+ products trong batches để optimize API calls",
          "Lưu embeddings vào file/DB để reuse, không cần re-embed khi product không đổi",
        ],
        expectedOutcome:
          "Có embeddings cho toàn bộ product catalog và FAQs, sẵn sàng cho semantic search",
      },
      {
        lessonRoute: "/rag/vector-db",
        lessonTitle: "Vector Database",
        action:
          "Setup vector database và implement retrieval system cho product catalog",
        details: [
          "Chọn vector DB: Chroma (local, free) hoặc Pinecone (cloud, scalable). Bắt đầu với Chroma cho MVP",
          "Setup Chroma: install, initialize collection với metadata schema (category, price, stock, brand)",
          "Ingest embeddings: insert tất cả products với embeddings và metadata vào vector DB",
          "Implement hybrid search: semantic search + filter by category/price/availability",
          "Retrieve top-10 relevant products với cosine similarity, kết hợp với metadata filters",
          "Test retrieval quality: 30 test queries về products, đo precision@10 (số products relevant trong top-10)",
        ],
        expectedOutcome:
          "Có vector DB chứa toàn bộ products, retrieval API trả về top-10 relevant products trong <100ms với filters",
      },
      {
        lessonRoute: "/rag/chunking-strategy",
        lessonTitle: "Chunking Strategy",
        action:
          "Tối ưu chunking strategy để improve retrieval accuracy cho products",
        details: [
          "Chunking strategy: mỗi product = 1 chunk (vì products thường không quá dài)",
          "Tune chunk size cho long product descriptions: nếu description >1000 tokens, split thành features chunk và description chunk",
          "Handle edge cases: products với nhiều features (giữ nguyên), products ngắn (combine với similar products)",
          "Đo retrieval quality: 50 test queries về products, so sánh precision@10 với different chunking strategies",
          "Implement overlap strategy nếu cần: 50 tokens overlap giữa chunks để không mất context",
        ],
        expectedOutcome:
          "Retrieval accuracy tăng từ 65% lên 85%+, products được chunk tối ưu cho search",
      },
      {
        lessonRoute: "/orchestration/memory-management",
        lessonTitle: "Memory Management",
        action:
          "Implement conversation memory để AI nhớ context trong các cuộc hội thoại dài",
        details: [
          "Design memory storage: lưu conversation history trong database (user_id, messages[], cart_items[], preferences)",
          "Implement sliding window: giữ 10 messages gần nhất trong context, archive messages cũ hơn",
          "Token budget management: tính toán token count cho RAG context (products) + chat history, đảm bảo không vượt model limit",
          "Summarization strategy: khi context >80% token limit, summarize 5 oldest messages thành 1 message",
          "Long-term memory: lưu user preferences (price range, categories) vào vector DB để retrieve khi cần",
          "Test với conversation 50+ messages và cart với 10+ items để đảm bảo memory hoạt động tốt",
        ],
        expectedOutcome:
          "AI nhớ được preferences, cart items, và context trong conversations dài, không bị mất thông tin quan trọng",
      },
      {
        lessonRoute: "/orchestration/chains-routing",
        lessonTitle: "Chains & Routing",
        action:
          "Xây dựng workflow chain và routing logic để xử lý các loại queries khác nhau",
        details: [
          "Design chain: search products → filter by criteria → rank by relevance → format response → suggest related products",
          "Implement intent classification: phân loại query thành search, compare, order, general_qa",
          "Routing logic: mỗi intent → handler riêng với prompt và processing logic phù hợp",
          "Chain execution: sequential processing với error handling ở mỗi step",
          "Add conditional logic: nếu không tìm thấy products → suggest popular products hoặc ask for clarification",
          "Test với 25 queries mỗi intent để đảm bảo routing chính xác và chain hoạt động tốt",
        ],
        expectedOutcome:
          "Có workflow chain hoàn chỉnh, routing chính xác >90%, xử lý được các loại queries khác nhau",
      },
      {
        lessonRoute: "/agents/function-calling",
        lessonTitle: "Function Calling",
        action:
          "Implement function calling để AI có thể thực thi các actions trong product system",
        details: [
          "Define function schemas: search_products(query, filters), compare_products(ids[]), create_order(items[]), get_order_status(order_id), check_availability(product_id)",
          "Implement tool registry pattern: central registry quản lý tất cả available tools",
          "Function implementations: mỗi function có handler riêng, validate inputs, execute action, return result",
          "Tool selection logic: LLM quyết định khi nào gọi function nào dựa trên user query",
          "Error handling: xử lý invalid function calls, missing parameters, execution errors (ví dụ: product out of stock)",
          "Test với 20 queries yêu cầu different functions để đảm bảo AI gọi đúng function",
        ],
        expectedOutcome:
          "AI có thể tự động gọi functions để search, compare, và create orders, user có thể tương tác với product system qua natural language",
      },
      {
        lessonRoute: "/agents/react-pattern",
        lessonTitle: "ReAct Pattern",
        action:
          "Implement ReAct agent để tự động giải quyết các queries phức tạp nhiều bước",
        details: [
          "Design agent loop: Thought → Action (function call) → Observation → Thought → Repeat hoặc Final Answer",
          "Implement reasoning: agent suy nghĩ về query, quyết định cần làm gì, gọi function nào",
          "Multi-step reasoning: ví dụ 'Tìm laptop gaming dưới 20tr, so sánh top 3, check availability' → agent tự động search → compare → check → recommend",
          "Max iterations: set limit = 5 để tránh infinite loops, return best answer sau 5 iterations",
          "Guardrails: detect circular reasoning, invalid actions, timeout sau 30s",
          "Test với 12 complex queries yêu cầu nhiều bước để đảm bảo agent hoạt động đúng",
        ],
        expectedOutcome:
          "Agent có thể tự động giải quyết complex queries nhiều bước mà không cần user hướng dẫn chi tiết",
      },
      {
        lessonRoute: "/production/evaluation",
        lessonTitle: "Evaluation",
        action:
          "Xây dựng evaluation framework để đánh giá và cải thiện chất lượng hệ thống",
        details: [
          "Tạo evaluation dataset: 100 test queries về products (search, compare, order), có ground truth answers",
          "Metrics: retrieval accuracy (precision@10), order creation success rate, user satisfaction score, conversion rate",
          "Implement automated evaluation: chạy test set, so sánh results với ground truth, tính metrics",
          "Human evaluation: 20 queries được đánh giá bởi human để validate automated metrics",
          "Regression testing: chạy evaluation sau mỗi thay đổi prompt/model để đảm bảo không degrade",
          "A/B testing framework: so sánh 2 versions của system để chọn version tốt hơn",
        ],
        expectedOutcome:
          "Có evaluation framework hoàn chỉnh, biết chính xác chất lượng hệ thống và có thể cải thiện liên tục",
      },
      {
        lessonRoute: "/production/observability",
        lessonTitle: "Observability",
        action:
          "Implement logging và monitoring để có full visibility vào system performance",
        details: [
          "Logging strategy: log mọi query với prompt, retrieved products, orders created, conversion rate, user_id, timestamp",
          "Structured logging: dùng JSON format để dễ query và analyze",
          "Error logging: log errors với stack traces, context, để debug nhanh",
          "Metrics collection: queries/day, average latency, token usage, cost, error rate, conversion rate",
          "Dashboard: visualize metrics, popular products, common queries, order success rate, average session length",
          "Alerting: alert khi error rate >5%, latency >3s, conversion rate giảm, hoặc cost vượt budget",
        ],
        expectedOutcome:
          "Có full visibility vào system, có thể debug issues nhanh, track performance và business metrics",
      },
      {
        lessonRoute: "/production/cost-optimization",
        lessonTitle: "Cost Optimization",
        action:
          "Tối ưu cost bằng caching, batching, và smart model selection",
        details: [
          "Embedding cache: cache embeddings của products, chỉ re-embed khi product thay đổi (check hash)",
          "Query cache: cache answers cho common queries (exact match), TTL = 1 hour",
          "Semantic cache: cache similar queries (cosine similarity >0.95), reuse answers",
          "Model fallback: nếu GPT-4 rate limit → fallback sang GPT-3.5, log để track",
          "Batch processing: batch multiple embedding requests khi có thể",
          "Cost tracking: track cost per user, per feature, set budgets và alerts",
        ],
        expectedOutcome:
          "Giảm cost 50-70% so với baseline, vẫn maintain quality và user experience",
      },
      {
        lessonRoute: "/production/security",
        lessonTitle: "Security",
        action:
          "Implement security measures để protect system và user data",
        details: [
          "Prompt injection defense: validate và sanitize user input, detect suspicious patterns, escape special characters",
          "Input validation: validate query length, content, reject malicious inputs",
          "Order validation: verify product IDs, quantities, prices server-side trước khi tạo order",
          "Authentication & authorization: verify user identity, check permissions trước khi access orders",
          "Rate limiting: max 50 queries/hour/user, 10 queries/minute để prevent abuse",
          "Output sanitization: sanitize AI output trước khi trả về user để tránh XSS",
        ],
        expectedOutcome:
          "System an toàn trước các attacks phổ biến, order data được validate chặt chẽ, có rate limiting để prevent abuse",
      },
      {
        lessonRoute: "/production/error-handling",
        lessonTitle: "Error Handling",
        action:
          "Implement robust error handling để system resilient và user experience tốt",
        details: [
          "Retry logic: retry API calls với exponential backoff (1s, 2s, 4s), max 3 retries",
          "Timeout handling: set timeout 30s cho LLM calls, return timeout error nếu quá lâu",
          "Graceful degradation: nếu product search fail → suggest popular products, nếu vector DB down → fallback sang keyword search",
          "Partial failures: nếu một số products không retrieve được → vẫn trả về products available",
          "Order errors: nếu order creation fail → show user-friendly error và suggest retry, log để admin xử lý",
          "User-friendly errors: translate technical errors thành messages dễ hiểu cho user",
        ],
        expectedOutcome:
          "System resilient, handle errors gracefully, user vẫn có experience tốt ngay cả khi có issues",
      },
    ],
  },
  {
    id: "meeting-notes",
    title: "Meeting Notes & Action Items",
    description:
      "Hệ thống tự động xử lý meeting notes/transcripts: tóm tắt, trích xuất action items, assign tasks, tạo agenda cho follow-up meetings.",
    problem:
      "Sau meetings, cần thời gian để tổng hợp notes, xác định action items, assign tasks. AI có thể tự động hóa việc này, tiết kiệm thời gian và đảm bảo không bỏ sót.",
    knowledgeBase:
      "Meeting transcripts, historical meeting notes, team member info, project context",
    tools: [
      "create_tasks",
      "update_tasks",
      "assign_tasks",
      "export_minutes",
      "schedule_followup",
    ],
    icon: <FileTextOutlined />,
    roadmap: [
      {
        lessonRoute: "/prompt-engineering",
        lessonTitle: "Prompt Engineering",
        action:
          "Xác định persona và viết prompt baseline cho các intents chính của hệ thống",
        details: [
          "Xác định persona: 'Bạn là trợ lý tổng hợp meeting notes chuyên nghiệp, giúp extract summary, action items, decisions, và next steps từ meeting transcripts'",
          "Phân tích và xác định 3 intents chính: summarize_meeting (tóm tắt), extract_actions (trích action items), generate_agenda (tạo agenda follow-up)",
          "Viết prompt template cho từng intent với role-based prompting",
          "Chain-of-Thought prompting: hướng dẫn AI suy nghĩ từng bước để identify action items chính xác",
          "Thêm few-shot examples cho mỗi intent để AI hiểu rõ format mong muốn",
          "Test prompt với 10 meeting transcripts mẫu và điều chỉnh để đạt accuracy >85%",
        ],
        expectedOutcome:
          "Có được 3 prompt templates hoạt động tốt cho 3 intents chính, AI extract action items và summary chính xác",
      },
      {
        lessonRoute: "/structured-output",
        lessonTitle: "Structured Output",
        action:
          "Thiết kế và implement schema JSON cho output của hệ thống với validation chặt chẽ",
        details: [
          "Thiết kế schema JSON: {summary: string, action_items: {task, assignee, due_date, priority}[], decisions: string[], attendees: string[], next_meeting_suggestions: {date, agenda}[]}",
          "Implement Zod schema để validate output từ LLM, đặc biệt quan trọng cho action items",
          "Validate action items: đảm bảo có assignee và due date, validate date format",
          "Xử lý trường hợp LLM trả về invalid JSON: retry với stricter prompt hoặc fallback",
          "Test với 20 meeting transcripts khác nhau để đảm bảo schema luôn được tuân thủ",
        ],
        expectedOutcome:
          "Backend có thể parse và validate output từ LLM một cách reliable, action items có đầy đủ thông tin cần thiết",
      },
      {
        lessonRoute: "/streaming",
        lessonTitle: "Streaming",
        action:
          "Implement streaming response để cải thiện UX khi AI xử lý long transcripts",
        details: [
          "Setup Server-Sent Events (SSE) endpoint trong backend để stream response từ LLM",
          "Frontend: implement EventSource hoặc fetch với stream để nhận chunks",
          "Streaming khi process long transcripts: hiển thị summary và action items từng phần khi AI đang xử lý",
          "Progress indicator: hiển thị progress bar hoặc status messages (processing summary, extracting actions, etc.)",
          "Xử lý edge cases: connection timeout, partial responses, error handling trong stream",
          "Test với long transcripts (5000+ words) để đảm bảo streaming mượt và UX tốt",
        ],
        expectedOutcome:
          "User thấy summary và action items hiển thị dần dần thay vì đợi 10-20 giây, perceived latency giảm đáng kể",
      },
      {
        lessonRoute: "/model-comparison",
        lessonTitle: "Model Comparison",
        action:
          "So sánh và chọn model tối ưu cho từng use case để balance cost và quality",
        details: [
          "Tạo test set: 30 meeting transcripts (10 short, 10 medium, 10 long) với ground truth summaries và action items",
          "Test GPT-4 vs Claude-3 vs GPT-3.5 trên cùng test set",
          "Đo metrics: action item extraction accuracy, summary quality (ROUGE score), latency, cost per transcript",
          "Phân tích kết quả: GPT-4 tốt cho structured extraction, Claude tốt cho creative summaries, GPT-3.5 đủ cho short meetings",
          "Implement routing logic: short meetings → GPT-3.5, long/structured → GPT-4, creative summaries → Claude",
          "Tính toán cost savings: dự kiến giảm 40-50% cost mà vẫn đảm bảo quality",
        ],
        expectedOutcome:
          "Có routing strategy rõ ràng, giảm cost đáng kể mà vẫn maintain quality cho different meeting types",
      },
      {
        lessonRoute: "/rag/embeddings",
        lessonTitle: "Embeddings",
        action:
          "Chuẩn hóa và tạo embeddings cho historical meeting notes để enable semantic search",
        details: [
          "Preprocessing: chuẩn hóa meeting transcripts, normalize text, extract key information",
          "Tạo embeddings cho historical meeting notes bằng OpenAI text-embedding-3-small (1536 dimensions)",
          "Tạo embeddings cho team member info và project context để retrieve khi cần",
          "Combine text fields: summary + action items + decisions thành một embedding để search tốt hơn",
          "Batch processing: xử lý 500+ meeting notes trong batches để optimize API calls",
          "Lưu embeddings vào file/DB để reuse, không cần re-embed khi meeting note không đổi",
        ],
        expectedOutcome:
          "Có embeddings cho toàn bộ historical meetings, sẵn sàng cho semantic search và context retrieval",
      },
      {
        lessonRoute: "/rag/vector-db",
        lessonTitle: "Vector Database",
        action:
          "Setup vector database và implement retrieval system cho meeting notes",
        details: [
          "Chọn vector DB: Chroma (local, free) hoặc Pinecone (cloud, scalable). Bắt đầu với Chroma cho MVP",
          "Setup Chroma: install, initialize collection với metadata schema (date, project, attendees, meeting_type)",
          "Ingest embeddings: insert tất cả meeting notes với embeddings và metadata vào vector DB",
          "Implement similarity search: query embedding → retrieve top-5 relevant past meetings với cosine similarity",
          "Add metadata filtering: filter by project, date range, attendees khi search",
          "Test retrieval quality: 20 test queries về past meetings, đo precision@5 (số meetings relevant trong top-5)",
        ],
        expectedOutcome:
          "Có vector DB chứa toàn bộ meeting notes, retrieval API trả về top-5 relevant past meetings trong <100ms",
      },
      {
        lessonRoute: "/rag/chunking-strategy",
        lessonTitle: "Chunking Strategy",
        action:
          "Tối ưu chunking strategy để improve retrieval accuracy cho meeting transcripts",
        details: [
          "Phân tích transcript structure: identify speaker turns, time segments, topics",
          "Implement semantic chunking: split theo speaker turns hoặc time segments (5-10 minutes), giữ nguyên context",
          "Tune chunk size: test 500, 1000, 2000 tokens, chọn size cho retrieval accuracy tốt nhất",
          "Handle edge cases: long discussions (giữ nguyên), short meetings (combine với related meetings)",
          "Đo retrieval quality: 30 test queries về past meetings, so sánh precision@5 với different chunk sizes",
          "Implement overlap strategy: 100 tokens overlap giữa chunks để không mất context của discussions",
        ],
        expectedOutcome:
          "Retrieval accuracy tăng từ 60% lên 85%+, chunks có size và structure tối ưu cho meeting context",
      },
      {
        lessonRoute: "/orchestration/memory-management",
        lessonTitle: "Memory Management",
        action:
          "Implement conversation memory để AI nhớ context trong các cuộc hội thoại dài",
        details: [
          "Design memory storage: lưu meeting series trong database (project_id, meetings[], summaries[], action_items[])",
          "Memory cho meeting series: nhớ context từ previous meetings trong cùng project để có continuity",
          "Token budget management: tính toán token count cho RAG context (past meetings) + current transcript, đảm bảo không vượt model limit",
          "Summarization strategy: khi context >80% token limit, summarize 3 oldest meetings thành 1 summary",
          "Long-term memory: lưu important decisions và action items vào vector DB để retrieve khi cần",
          "Test với meeting series 10+ meetings trong cùng project để đảm bảo memory hoạt động tốt",
        ],
        expectedOutcome:
          "AI nhớ được context từ previous meetings trong cùng project, có continuity và không bị mất thông tin quan trọng",
      },
      {
        lessonRoute: "/orchestration/chains-routing",
        lessonTitle: "Chains & Routing",
        action:
          "Xây dựng workflow chain và routing logic để xử lý các loại meetings khác nhau",
        details: [
          "Design chain: transcribe → summarize → extract actions → assign tasks → generate agenda → format response",
          "Implement intent classification: phân loại meeting thành short, long, structured, creative",
          "Routing logic: short meeting → simple summary handler, long meeting → detailed breakdown handler",
          "Chain execution: sequential processing với error handling ở mỗi step",
          "Add conditional logic: nếu không extract được action items → ask for clarification hoặc use fallback",
          "Test với 20 meetings mỗi type để đảm bảo routing chính xác và chain hoạt động tốt",
        ],
        expectedOutcome:
          "Có workflow chain hoàn chỉnh, routing chính xác >90%, xử lý được các loại meetings khác nhau",
      },
      {
        lessonRoute: "/agents/function-calling",
        lessonTitle: "Function Calling",
        action:
          "Implement function calling để AI có thể thực thi các actions trong meeting system",
        details: [
          "Define function schemas: create_tasks(action_items[]), assign_tasks(task_id, assignee), export_minutes(format), schedule_followup(date, agenda)",
          "Implement tool registry pattern: central registry quản lý tất cả available tools",
          "Function implementations: mỗi function có handler riêng, validate inputs, execute action, return result",
          "Tool selection logic: LLM quyết định khi nào gọi function nào dựa trên extracted action items",
          "Integrate với task management system: connect với Jira, Asana, hoặc custom task system",
          "Error handling: xử lý invalid function calls, missing parameters, execution errors",
        ],
        expectedOutcome:
          "AI có thể tự động tạo tasks, assign cho team members, và schedule follow-up meetings, integrate với task management system",
      },
      {
        lessonRoute: "/agents/react-pattern",
        lessonTitle: "ReAct Pattern",
        action:
          "Implement ReAct agent để tự động giải quyết các tasks phức tạp nhiều bước",
        details: [
          "Design agent loop: Thought → Action (function call) → Observation → Thought → Repeat hoặc Final Answer",
          "Implement reasoning: agent suy nghĩ về transcript, quyết định cần làm gì, gọi function nào",
          "Multi-step reasoning: ví dụ 'Process transcript → identify unclear items → search past meetings for context → clarify → finalize summary'",
          "Max iterations: set limit = 3 để tránh infinite loops, return best answer sau 3 iterations",
          "Guardrails: detect circular reasoning, invalid actions, timeout sau 60s (vì transcripts có thể dài)",
          "Test với 10 complex transcripts yêu cầu nhiều bước để đảm bảo agent hoạt động đúng",
        ],
        expectedOutcome:
          "Agent có thể tự động xử lý complex transcripts, tìm context từ past meetings, và finalize summary mà không cần user hướng dẫn",
      },
      {
        lessonRoute: "/production/evaluation",
        lessonTitle: "Evaluation",
        action:
          "Xây dựng evaluation framework để đánh giá và cải thiện chất lượng hệ thống",
        details: [
          "Tạo evaluation dataset: 50 meeting transcripts với ground truth summaries và action items",
          "Metrics: action item extraction accuracy (% action items được extract đúng), summary quality (ROUGE score), assignment correctness (% assignments đúng)",
          "Implement automated evaluation: chạy test set, so sánh results với ground truth, tính metrics",
          "Human evaluation: 15 transcripts được đánh giá bởi human để validate automated metrics",
          "Regression testing: chạy evaluation sau mỗi thay đổi prompt/model để đảm bảo không degrade",
          "A/B testing framework: so sánh 2 versions của system để chọn version tốt hơn",
        ],
        expectedOutcome:
          "Có evaluation framework hoàn chỉnh, biết chính xác chất lượng hệ thống và có thể cải thiện liên tục",
      },
      {
        lessonRoute: "/production/observability",
        lessonTitle: "Observability",
        action:
          "Implement logging và monitoring để có full visibility vào system performance",
        details: [
          "Logging strategy: log mọi transcript với prompt, extracted summary, action items, tasks created, processing time, user_id, timestamp",
          "Structured logging: dùng JSON format để dễ query và analyze",
          "Error logging: log errors với stack traces, context, để debug nhanh",
          "Metrics collection: meetings processed/day, average processing time, action items per meeting, task creation success rate",
          "Dashboard: visualize metrics, top projects, common action items, average meeting length, system health",
          "Alerting: alert khi error rate >5%, processing time >60s, hoặc task creation fail rate >10%",
        ],
        expectedOutcome:
          "Có full visibility vào system, có thể debug issues nhanh, track performance và business metrics",
      },
      {
        lessonRoute: "/production/cost-optimization",
        lessonTitle: "Cost Optimization",
        action:
          "Tối ưu cost bằng caching, batching, và smart model selection",
        details: [
          "Summary cache: cache summaries của common meeting types (standup, review, planning), TTL = 1 day",
          "Embedding cache: cache embeddings của meeting notes, chỉ re-embed khi note thay đổi",
          "Batch processing: batch multiple meeting processing requests khi có thể",
          "Model fallback: nếu GPT-4 rate limit → fallback sang GPT-3.5, log để track",
          "Smart routing: use GPT-3.5 cho short meetings (<30 min), GPT-4 cho long/complex meetings",
          "Cost tracking: track cost per meeting, per project, set budgets và alerts",
        ],
        expectedOutcome:
          "Giảm cost 50-70% so với baseline, vẫn maintain quality và user experience",
      },
      {
        lessonRoute: "/production/security",
        lessonTitle: "Security",
        action:
          "Implement security measures để protect system và user data",
        details: [
          "Prompt injection defense: validate và sanitize transcript input, detect suspicious patterns, escape special characters",
          "Input validation: validate transcript length, content, reject malicious inputs",
          "Data privacy: encrypt meeting transcripts, access control per team (chỉ team members mới access được)",
          "Authentication & authorization: verify user identity, check permissions trước khi access meeting notes",
          "Rate limiting: max 20 meetings/day/user, 5 meetings/hour để prevent abuse",
          "Output sanitization: sanitize AI output trước khi trả về user để tránh XSS",
        ],
        expectedOutcome:
          "System an toàn trước các attacks phổ biến, meeting data được encrypt và protect, có rate limiting để prevent abuse",
      },
      {
        lessonRoute: "/production/error-handling",
        lessonTitle: "Error Handling",
        action:
          "Implement robust error handling để system resilient và user experience tốt",
        details: [
          "Retry logic: retry API calls với exponential backoff (1s, 2s, 4s), max 3 retries",
          "Timeout handling: set timeout 60s cho LLM calls (vì transcripts có thể dài), return timeout error nếu quá lâu",
          "Graceful degradation: nếu extraction fail → return raw summary, nếu vector DB down → skip context retrieval",
          "Partial failures: nếu một số action items không extract được → vẫn trả về action items available",
          "User-friendly errors: translate technical errors thành messages dễ hiểu cho user",
          "Error recovery: log errors, notify admin, tự động recover khi service available lại",
        ],
        expectedOutcome:
          "System resilient, handle errors gracefully, user vẫn có experience tốt ngay cả khi có issues",
      },
    ],
  },
  {
    id: "study-coach",
    title: "Study Coach (Quiz/Flashcards)",
    description:
      "Tạo quiz và flashcards tự động từ tài liệu học tập. Chấm điểm, theo dõi tiến độ, gợi ý bài cần ôn lại dựa trên spaced repetition.",
    problem:
      "Dev học nhiều tài liệu nhưng khó nhớ lâu. Cần hệ thống tự động tạo quiz/flashcards, test kiến thức, và nhắc ôn lại đúng lúc để retention tốt hơn.",
    knowledgeBase:
      "Tutorial docs, course materials, personal notes, quiz history, performance data",
    tools: [
      "generate_quiz",
      "grade_answer",
      "schedule_review",
      "track_progress",
      "suggest_topics",
    ],
    icon: <ReadOutlined />,
    roadmap: [
      {
        lessonRoute: "/prompt-engineering",
        lessonTitle: "Prompt Engineering",
        action:
          "Xác định persona và viết prompt baseline cho các intents chính của hệ thống",
        details: [
          "Xác định persona: 'Bạn là giáo viên tạo quiz chuyên nghiệp, giúp học sinh test và củng cố kiến thức thông qua questions chất lượng'",
          "Phân tích và xác định 3 intents chính: generate_quiz (tạo quiz), grade_answer (chấm điểm), suggest_review (gợi ý ôn lại)",
          "Viết prompt template cho từng intent với role-based prompting",
          "Few-shot examples cho different question types: multiple choice, true/false, short answer, với format rõ ràng",
          "Chain-of-Thought prompting: hướng dẫn AI suy nghĩ từng bước để tạo questions chất lượng",
          "Test prompt với 10 content samples và điều chỉnh để đạt question quality >85%",
        ],
        expectedOutcome:
          "Có được 3 prompt templates hoạt động tốt cho 3 intents chính, AI tạo questions chất lượng và phù hợp với content",
      },
      {
        lessonRoute: "/structured-output",
        lessonTitle: "Structured Output",
        action:
          "Thiết kế và implement schema JSON cho output của hệ thống với validation chặt chẽ",
        details: [
          "Thiết kế schema JSON: {questions: {id, type, question, options[], correct_answer, explanation}[], difficulty_level: string, topic: string}",
          "Implement Zod schema để validate output từ LLM, đặc biệt quan trọng cho quiz generation",
          "Validate question format: ensure có đáp án đúng, explanations rõ ràng, options không trùng lặp",
          "Xử lý trường hợp LLM trả về invalid JSON: retry với stricter prompt hoặc fallback",
          "Test với 20 content samples khác nhau để đảm bảo schema luôn được tuân thủ",
        ],
        expectedOutcome:
          "Backend có thể parse và validate output từ LLM một cách reliable, questions có format chuẩn và đầy đủ thông tin",
      },
      {
        lessonRoute: "/streaming",
        lessonTitle: "Streaming",
        action:
          "Implement streaming response để cải thiện UX khi AI generate quiz và grade answers",
        details: [
          "Setup Server-Sent Events (SSE) endpoint trong backend để stream response từ LLM",
          "Frontend: implement EventSource hoặc fetch với stream để nhận chunks",
          "Streaming khi generate quiz: hiển thị từng câu hỏi khi AI tạo, không cần đợi toàn bộ quiz",
          "Streaming khi grade: hiển thị feedback từng câu khi user submit, real-time feedback",
          "Progress indicator: hiển thị progress (generating question 3/10, grading 5/10, etc.)",
          "Test với quiz 20+ questions để đảm bảo streaming mượt và UX tốt",
        ],
        expectedOutcome:
          "User thấy questions và feedback hiển thị dần dần thay vì đợi 10-15 giây, perceived latency giảm đáng kể",
      },
      {
        lessonRoute: "/model-comparison",
        lessonTitle: "Model Comparison",
        action:
          "So sánh và chọn model tối ưu cho từng use case để balance cost và quality",
        details: [
          "Tạo test set: 40 content samples (10 easy, 15 medium, 15 hard) với ground truth questions",
          "Test GPT-4 vs GPT-3.5 vs Claude-3 trên cùng test set",
          "Đo metrics: question quality (human evaluation), answer accuracy, explanation clarity, latency, cost per quiz",
          "Phân tích kết quả: GPT-4 tốt hơn cho complex questions, GPT-3.5 đủ cho simple recall questions, Claude tốt cho explanations",
          "Implement routing logic: easy quiz → GPT-3.5, medium/hard quiz → GPT-4, explanations → Claude",
          "Tính toán cost savings: dự kiến giảm 50-60% cost mà vẫn đảm bảo quality",
        ],
        expectedOutcome:
          "Có routing strategy rõ ràng, giảm cost đáng kể mà vẫn maintain quality cho different difficulty levels",
      },
      {
        lessonRoute: "/rag/embeddings",
        lessonTitle: "Embeddings",
        action:
          "Chuẩn hóa và tạo embeddings cho learning materials để enable semantic search",
        details: [
          "Preprocessing: chuẩn hóa tutorial docs, course materials, normalize text, extract key concepts",
          "Tạo embeddings cho tutorial docs và course materials bằng OpenAI text-embedding-3-small (1536 dimensions)",
          "Tạo embeddings cho quiz history và performance data để analyze weak areas",
          "Combine text fields: title + content + key concepts thành một embedding để search tốt hơn",
          "Batch processing: xử lý 500+ documents trong batches để optimize API calls",
          "Lưu embeddings vào file/DB để reuse, không cần re-embed khi document không đổi",
        ],
        expectedOutcome:
          "Có embeddings cho toàn bộ learning materials, sẵn sàng cho semantic search và content retrieval",
      },
      {
        lessonRoute: "/rag/vector-db",
        lessonTitle: "Vector Database",
        action:
          "Setup vector database và implement retrieval system cho learning materials",
        details: [
          "Chọn vector DB: Chroma (local, free) hoặc Pinecone (cloud, scalable). Bắt đầu với Chroma cho MVP",
          "Setup Chroma: install, initialize collection với metadata schema (topic, difficulty, document_type)",
          "Ingest embeddings: insert tất cả learning materials với embeddings và metadata vào vector DB",
          "Implement similarity search: query embedding → retrieve top-5 relevant sections với cosine similarity",
          "Search past quizzes: store quiz embeddings để avoid duplicates khi generate new quizzes",
          "Test retrieval quality: 25 test queries về topics, đo precision@5 (số sections relevant trong top-5)",
        ],
        expectedOutcome:
          "Có vector DB chứa toàn bộ learning materials, retrieval API trả về top-5 relevant sections trong <100ms",
      },
      {
        lessonRoute: "/rag/chunking-strategy",
        lessonTitle: "Chunking Strategy",
        action:
          "Tối ưu chunking strategy để improve retrieval accuracy cho learning materials",
        details: [
          "Phân tích tutorial structure: identify sections, chapters, code blocks, examples",
          "Implement semantic chunking: split theo sections/chapters, giữ nguyên code blocks và examples",
          "Tune chunk size: test 300, 500, 1000 tokens, chọn size để mỗi chunk = 1 concept có thể tạo 2-3 questions",
          "Handle edge cases: long code examples (giữ nguyên), short sections (combine với related sections)",
          "Đo retrieval quality: 30 test topics, so sánh precision@5 với different chunk sizes",
          "Implement overlap strategy: 50 tokens overlap giữa chunks để không mất context",
        ],
        expectedOutcome:
          "Retrieval accuracy tăng từ 65% lên 85%+, chunks có size và structure tối ưu cho question generation",
      },
      {
        lessonRoute: "/orchestration/memory-management",
        lessonTitle: "Memory Management",
        action:
          "Implement conversation memory để AI nhớ context trong các cuộc hội thoại dài",
        details: [
          "Design memory storage: lưu learning progress trong database (user_id, topics_learned[], quiz_history[], weak_areas[], performance_data[])",
          "Memory cho learning progress: track topics đã học, quiz history, weak areas để personalize quiz generation",
          "Token budget management: tính toán token count cho RAG context (learning materials) + progress tracking, đảm bảo không vượt model limit",
          "Summarization strategy: khi context >80% token limit, summarize old quiz history thành performance summary",
          "Long-term memory: lưu important learning milestones và weak areas vào vector DB để retrieve khi cần",
          "Test với user có 50+ quizzes và 20+ topics để đảm bảo memory hoạt động tốt",
        ],
        expectedOutcome:
          "AI nhớ được learning progress, weak areas, và quiz history, có thể personalize quiz generation dựa trên performance",
      },
      {
        lessonRoute: "/orchestration/chains-routing",
        lessonTitle: "Chains & Routing",
        action:
          "Xây dựng workflow chain và routing logic để xử lý các loại requests khác nhau",
        details: [
          "Design chain: retrieve relevant content → generate questions → validate → format quiz → track performance",
          "Implement intent classification: phân loại request thành generate_quiz, grade_answer, suggest_review, track_progress",
          "Routing logic: easy quiz → GPT-3.5 handler, hard quiz → GPT-4 handler, adaptive difficulty based on user performance",
          "Chain execution: sequential processing với error handling ở mỗi step",
          "Add conditional logic: nếu không tìm thấy relevant content → suggest different topic hoặc ask for clarification",
          "Test với 20 requests mỗi intent để đảm bảo routing chính xác và chain hoạt động tốt",
        ],
        expectedOutcome:
          "Có workflow chain hoàn chỉnh, routing chính xác >90%, adaptive difficulty hoạt động tốt",
      },
      {
        lessonRoute: "/agents/function-calling",
        lessonTitle: "Function Calling",
        action:
          "Implement function calling để AI có thể thực thi các actions trong learning system",
        details: [
          "Define function schemas: generate_quiz(topic, difficulty, num_questions), grade_answer(question_id, user_answer), schedule_review(topic, date), track_progress(user_id)",
          "Implement tool registry pattern: central registry quản lý tất cả available tools",
          "Function implementations: mỗi function có handler riêng, validate inputs, execute action, return result",
          "Tool selection logic: LLM quyết định khi nào gọi function nào dựa trên user query",
          "Error handling: xử lý invalid function calls, missing parameters, execution errors",
          "Test với 18 queries yêu cầu different functions để đảm bảo AI gọi đúng function",
        ],
        expectedOutcome:
          "AI có thể tự động generate quiz, grade answers, schedule reviews, và track progress, user có thể tương tác với learning system qua natural language",
      },
      {
        lessonRoute: "/agents/react-pattern",
        lessonTitle: "ReAct Pattern",
        action:
          "Implement ReAct agent để tự động giải quyết các tasks phức tạp nhiều bước",
        details: [
          "Design agent loop: Thought → Action (function call) → Observation → Thought → Repeat hoặc Final Answer",
          "Implement reasoning: agent suy nghĩ về learning progress, quyết định cần làm gì, gọi function nào",
          "Multi-step reasoning: ví dụ 'Analyze weak topics → generate personalized quiz → grade → suggest review schedule'",
          "Max iterations: set limit = 5 để tránh infinite loops, return best answer sau 5 iterations",
          "Guardrails: detect circular reasoning, invalid actions, timeout sau 30s",
          "Adaptive difficulty: agent tự động adapt difficulty based on performance, adjust quiz difficulty dynamically",
        ],
        expectedOutcome:
          "Agent có thể tự động analyze performance, generate personalized quizzes, và suggest review schedule mà không cần user hướng dẫn",
      },
      {
        lessonRoute: "/production/evaluation",
        lessonTitle: "Evaluation",
        action:
          "Xây dựng evaluation framework để đánh giá và cải thiện chất lượng hệ thống",
        details: [
          "Tạo evaluation dataset: 100 generated quizzes với ground truth questions và answers",
          "Metrics: question quality (human evaluation), answer accuracy, explanation clarity, difficulty appropriateness",
          "Implement automated evaluation: chạy test set, so sánh questions với ground truth, tính metrics",
          "Human evaluation: 20 quizzes được đánh giá bởi human để validate automated metrics",
          "Regression testing: chạy evaluation sau mỗi thay đổi prompt/model để đảm bảo không degrade",
          "A/B testing framework: so sánh 2 versions của system để chọn version tốt hơn",
        ],
        expectedOutcome:
          "Có evaluation framework hoàn chỉnh, biết chính xác chất lượng hệ thống và có thể cải thiện liên tục",
      },
      {
        lessonRoute: "/production/observability",
        lessonTitle: "Observability",
        action:
          "Implement logging và monitoring để có full visibility vào system performance",
        details: [
          "Logging strategy: log mọi request với prompt, generated questions, answers graded, review schedules, user_id, timestamp",
          "Structured logging: dùng JSON format để dễ query và analyze",
          "Error logging: log errors với stack traces, context, để debug nhanh",
          "Metrics collection: quizzes generated/day, average score, topics needing review, user progress trends, retention rate",
          "Dashboard: visualize metrics, top topics, common mistakes, user progress trends, system health",
          "Alerting: alert khi error rate >5%, question quality giảm, hoặc user retention rate giảm",
        ],
        expectedOutcome:
          "Có full visibility vào system, có thể debug issues nhanh, track learning progress và system performance",
      },
      {
        lessonRoute: "/production/cost-optimization",
        lessonTitle: "Cost Optimization",
        action:
          "Tối ưu cost bằng caching, batching, và smart model selection",
        details: [
          "Quiz cache: cache generated quizzes (reuse cho cùng topic và difficulty), TTL = 1 day",
          "Embedding cache: cache embeddings của learning materials, chỉ re-embed khi document thay đổi",
          "Batch processing: batch multiple quiz generation requests khi có thể",
          "Model fallback: nếu GPT-4 rate limit → fallback sang GPT-3.5, log để track",
          "Smart routing: use GPT-3.5 cho simple questions, GPT-4 cho complex questions và explanations",
          "Cost tracking: track cost per quiz, per user, set budgets và alerts",
        ],
        expectedOutcome:
          "Giảm cost 50-70% so với baseline, vẫn maintain quality và user experience",
      },
      {
        lessonRoute: "/production/security",
        lessonTitle: "Security",
        action:
          "Implement security measures để protect system và user data",
        details: [
          "Prompt injection defense: validate và sanitize user input, detect suspicious patterns, escape special characters",
          "Input validation: validate answer length, content, reject malicious inputs",
          "Data privacy: encrypt quiz history, progress data, đảm bảo data chỉ accessible bởi owner",
          "Authentication & authorization: verify user identity, check permissions trước khi access quiz data",
          "Rate limiting: max 50 quizzes/day/user, 10 quizzes/hour để prevent abuse",
          "Output sanitization: sanitize AI output trước khi trả về user để tránh XSS",
        ],
        expectedOutcome:
          "System an toàn trước các attacks phổ biến, user data được encrypt và protect, có rate limiting để prevent abuse",
      },
      {
        lessonRoute: "/production/error-handling",
        lessonTitle: "Error Handling",
        action:
          "Implement robust error handling để system resilient và user experience tốt",
        details: [
          "Retry logic: retry API calls với exponential backoff (1s, 2s, 4s), max 3 retries",
          "Timeout handling: set timeout 30s cho LLM calls, return timeout error nếu quá lâu",
          "Graceful degradation: nếu generation fail → use pre-generated questions, nếu vector DB down → skip content retrieval",
          "Partial failures: nếu một số questions không generate được → vẫn trả về questions available",
          "User-friendly errors: translate technical errors thành messages dễ hiểu cho user",
          "Error recovery: log errors, notify admin, tự động recover khi service available lại",
        ],
        expectedOutcome:
          "System resilient, handle errors gracefully, user vẫn có experience tốt ngay cả khi có issues",
      },
    ],
  },
];

const getModuleNameFromRoute = (route: string): string => {
  if (
    route.startsWith("/prompt-engineering") ||
    route.startsWith("/structured-output") ||
    route.startsWith("/streaming") ||
    route.startsWith("/model-comparison")
  ) {
    return "01. LLM Fundamentals";
  }
  if (route.startsWith("/rag/")) {
    return "02. RAG";
  }
  if (route.startsWith("/orchestration/")) {
    return "03. Orchestration";
  }
  if (route.startsWith("/agents/")) {
    return "04. Agents";
  }
  if (route.startsWith("/production/")) {
    return "05. Production";
  }
  if (route.startsWith("/advanced/")) {
    return "06. Advanced";
  }
  return "Unknown";
};

export default function ProjectIdeasPage() {
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved || "personal-knowledge-base";
    }
    return "personal-knowledge-base";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, activeTab);
    }
  }, [activeTab]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, key);
    }
  };

  const tabItems = projectIdeas.map((idea) => ({
    key: idea.id,
    label: (
      <Space>
        <span className="text-lg">{idea.icon}</span>
        <span>{idea.title}</span>
      </Space>
    ),
    children: (
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <Title level={4} className="mb-3">
              Mô tả dự án
            </Title>
            <Paragraph className="text-gray-700 leading-relaxed text-base mb-4">
              {idea.description}
            </Paragraph>
          </div>

          <div>
            <Title level={4} className="mb-3">
              Vấn đề thực tiễn
            </Title>
            <Paragraph className="text-gray-700 leading-relaxed text-base mb-0">
              {idea.problem}
            </Paragraph>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card size="small" title="Knowledge Base">
              <Paragraph className="text-gray-700 leading-relaxed mb-0">
                {idea.knowledgeBase}
              </Paragraph>
            </Card>
            <Card size="small" title="Tools/Functions">
              <div className="flex flex-wrap gap-2">
                {idea.tools.map((tool) => (
                  <Tag key={tool} color="blue">
                    {tool}
                  </Tag>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <Divider />

        <div>
          <Title level={4} className="mb-4">
            Roadmap theo bài học
          </Title>
          <Paragraph className="text-gray-600 text-sm mb-6">
            Học xong mỗi bài, bạn sẽ làm thêm các bước sau cho dự án này. Mỗi
            bài học là một milestone với các bước chi tiết và kết quả mong đợi.
          </Paragraph>

          <div className="space-y-4">
            {idea.roadmap.map((milestone, index) => {
              const moduleName = getModuleNameFromRoute(milestone.lessonRoute);
              const isFirstInModule =
                index === 0 ||
                getModuleNameFromRoute(idea.roadmap[index - 1].lessonRoute) !==
                  moduleName;

              return (
                <div key={milestone.lessonRoute}>
                  {isFirstInModule && (
                    <div className="mb-4 mt-6 first:mt-0">
                      <Tag
                        color="blue"
                        className="text-sm font-medium px-3 py-1"
                      >
                        {moduleName}
                      </Tag>
                    </div>
                  )}
                  <Card
                    className="border border-gray-200"
                    title={
                      <div className="flex items-center justify-between">
                        <Space>
                          <span className="text-gray-500 font-normal text-sm">
                            Bài {index + 1}
                          </span>
                          <Link href={milestone.lessonRoute}>
                            <Title
                              level={5}
                              style={{ marginBottom: 0, display: "inline" }}
                            >
                              {milestone.lessonTitle}
                            </Title>
                          </Link>
                        </Space>
                        <Link href={milestone.lessonRoute}>
                          <Button
                            type="primary"
                            size="small"
                            icon={<ArrowRightOutlined />}
                          >
                            Học bài này
                          </Button>
                        </Link>
                      </div>
                    }
                  >
                    <div className="space-y-3">
                      <div>
                        <Title level={5} className="mb-2 text-gray-700">
                          Mục tiêu
                        </Title>
                        <Paragraph className="text-gray-700 leading-relaxed mb-0">
                          {milestone.action}
                        </Paragraph>
                      </div>

                      {milestone.details && milestone.details.length > 0 && (
                        <div>
                          <Title level={5} className="mb-2 text-gray-700">
                            Các bước thực hiện
                          </Title>
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {milestone.details.map((detail, idx) => (
                              <li key={idx} className="leading-relaxed">
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {milestone.expectedOutcome && (
                        <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-r">
                          <Title level={5} className="mb-1 text-green-800">
                            Kết quả mong đợi
                          </Title>
                          <Paragraph className="text-green-700 leading-relaxed mb-0 text-sm">
                            {milestone.expectedOutcome}
                          </Paragraph>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    ),
  }));

  return (
    <div className="flex-1">
      <div className="px-8 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <Title level={4} style={{ marginBottom: 0 }}>
          Project Ideas
        </Title>
      </div>

      <div className="px-8 py-6 space-y-8">
        <div className="space-y-4">
          <div>
            <Title level={3} className="mb-4">
              Ý tưởng dự án thực hành
            </Title>
            <Paragraph className="text-gray-700 leading-relaxed text-base mb-4">
              Dưới đây là 4 ý tưởng project thực tế để bạn vừa học vừa hành. Mỗi
              ý tưởng đều tích hợp <strong>toàn bộ kiến thức</strong> trong
              tutorial này, từ LLM fundamentals đến Advanced topics. Chỉ khác
              nhau ở <strong>domain/vấn đề thực tiễn</strong> mà chúng giải
              quyết.
            </Paragraph>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r mb-4">
              <Paragraph className="text-gray-700 leading-relaxed mb-0">
                <strong>Cách sử dụng:</strong> Chọn một ý tưởng dự án phù hợp
                với bạn bằng cách active tab phù hợp. Sau khi chọn, guideline
                chi tiết cho dự án này sẽ xuất hiện ở mỗi bài học. Khi bạn vào
                học bất kỳ bài nào, bạn sẽ thấy section{" "}
                <strong>&quot;Áp dụng cho dự án&quot;</strong> với các bước cụ
                thể để áp dụng kiến thức vào dự án của mình.
              </Paragraph>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r mb-6">
              <Paragraph className="text-gray-700 leading-relaxed mb-0">
                <strong>Kiến trúc lõi chung:</strong> Tất cả 4 ý tưởng đều sử
                dụng cùng một pipeline: LLM fundamentals (prompt engineering,
                structured output, streaming, model comparison) → RAG
                (embeddings, vector DB, chunking) → Orchestration (memory,
                chains, routing) → Agents (function calling, ReAct) → Production
                (evaluation, observability, cost optimization, security, error
                handling) → Advanced (multimodal, fine-tuning, local models).
              </Paragraph>
            </div>
          </div>
        </div>

        <Card className="bg-blue-50 border border-blue-200">
          <Title level={4} className="mb-3">
            <RocketOutlined className="mr-2" />
            Bắt đầu như thế nào?
          </Title>
          <div className="space-y-3">
            <Paragraph className="text-gray-700 leading-relaxed mb-0">
              Trước khi bắt đầu với bất kỳ ý tưởng dự án nào, bạn cần tạo một base project có khả năng gọi
              tới AI API. Đây là bước cơ bản nhất để bắt đầu.
            </Paragraph>
            <div>
              <Title level={5} className="mb-2">
                Setup cơ bản
              </Title>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Tạo project structure: frontend (Next.js) + backend (NestJS hoặc Express)</li>
                <li>Setup environment variables: API key cho AI provider (OpenAI, OpenRouter, Anthropic, ...)</li>
                <li>Install dependencies: AI SDK hoặc HTTP client để gọi API</li>
                <li>Tạo một API endpoint đơn giản có thể gọi tới AI API và nhận response</li>
                <li>Test với một prompt đơn giản để đảm bảo kết nối hoạt động</li>
              </ul>
            </div>
            <div className="bg-white p-3 rounded border border-gray-200 mt-3">
              <Title level={5} className="mb-2">
                Kết quả cần đạt được
              </Title>
              <Paragraph className="text-gray-700 leading-relaxed mb-0 text-sm">
                Có một base project hoàn chỉnh với khả năng gọi tới AI API thành công. Bạn có thể gửi prompt
                và nhận response từ AI. Đây là foundation để build các tính năng phức tạp hơn trong các bài
                học tiếp theo.
              </Paragraph>
            </div>
          </div>
        </Card>

        {activeTab && (
          <div className="mt-4">
            <Alert
              description={
                <span>
                  Bạn đang chọn:{" "}
                  <strong>
                    {projectIdeas.find((idea) => idea.id === activeTab)?.title}
                  </strong>
                </span>
              }
              type="info"
              showIcon
              closable={false}
            />
          </div>
        )}

        <Divider />

        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={tabItems}
        />
      </div>
    </div>
  );
}
