# Personal Knowledge Base

## Mô tả

Xây dựng hệ thống lưu trữ và khai thác tri thức cá nhân. Lưu ghi chú, tài liệu, đoạn code, bookmarks và có thể hỏi đáp, tìm kiếm semantic, nhắc lại kiến thức đã học.

## Vấn đề thực tiễn

Dev thường lưu kiến thức rải rác ở nhiều nơi (notes, bookmarks, code snippets). Khó tìm lại khi cần, không có cách nào để AI hỗ trợ tìm kiếm và nhắc lại kiến thức.

## Knowledge Base

Markdown notes, code snippets, bookmarks, tài liệu học tập cá nhân

## Tools/Functions

- `add_note`
- `search_notes`
- `summarize_topic`
- `create_reminder`

## Roadmap theo bài học

### 01. LLM Fundamentals

#### Prompt Engineering

**Mục tiêu:** Xác định persona và viết prompt baseline cho các intents chính của hệ thống

**Các bước thực hiện:**
- Xác định persona: 'Bạn là trợ lý quản lý tri thức cá nhân chuyên nghiệp, giúp người dùng tìm kiếm, tổng hợp và quản lý ghi chú của họ'
- Phân tích và xác định 3 intents chính: search_notes (tìm kiếm note), summarize_topic (tóm tắt chủ đề), create_reminder (tạo nhắc nhở)
- Viết prompt template cho từng intent với role-based prompting
- Thêm few-shot examples cho mỗi intent để AI hiểu rõ format mong muốn
- Test prompt với 10 queries mẫu và điều chỉnh để đạt accuracy >85%

**Kết quả mong đợi:** Có được 3 prompt templates hoạt động tốt cho 3 intents chính, sẵn sàng tích hợp vào hệ thống

#### Structured Output

**Mục tiêu:** Thiết kế và implement schema JSON cho output của hệ thống với validation chặt chẽ

**Các bước thực hiện:**
- Thiết kế schema JSON: {answer: string, citations: string[], related_notes: {id, title, snippet}[], suggested_actions: {action, params}[]}
- Implement Zod schema để validate output từ LLM
- Xử lý trường hợp LLM trả về invalid JSON: retry với stricter prompt hoặc fallback
- Test với 20 queries khác nhau để đảm bảo schema luôn được tuân thủ
- Tạo TypeScript types từ Zod schema để type-safe trong codebase

**Kết quả mong đợi:** Backend có thể parse và validate output từ LLM một cách reliable, không cần manual parsing

#### Streaming

**Mục tiêu:** Implement streaming response để cải thiện UX khi AI xử lý queries dài

**Các bước thực hiện:**
- Setup Server-Sent Events (SSE) endpoint trong backend để stream response từ LLM
- Frontend: implement EventSource hoặc fetch với stream để nhận chunks
- Hiển thị answer từng chunk trong real-time, với loading indicator khi đang stream
- Xử lý edge cases: connection timeout, partial responses, error handling trong stream
- Test với queries dài (tìm kiếm và tổng hợp 10+ notes) để đảm bảo streaming mượt

**Kết quả mong đợi:** User thấy answer hiển thị dần dần thay vì đợi 5-10 giây, perceived latency giảm đáng kể

#### Model Comparison

**Mục tiêu:** So sánh và chọn model tối ưu cho từng use case để balance cost và quality

**Các bước thực hiện:**
- Tạo test set: 30 queries (10 simple search, 10 complex search, 10 summarization)
- Test GPT-3.5-turbo vs GPT-4 vs Claude-3 trên cùng test set
- Đo metrics: accuracy, latency, cost per query, user satisfaction
- Phân tích kết quả: GPT-3.5 đủ cho simple queries, GPT-4 tốt hơn cho complex summarization
- Implement routing logic: simple queries → GPT-3.5, complex → GPT-4
- Tính toán cost savings: dự kiến giảm 50-60% cost mà vẫn đảm bảo quality

**Kết quả mong đợi:** Có routing strategy rõ ràng, giảm cost đáng kể mà vẫn maintain quality cho user experience

### 02. RAG

#### Embeddings

**Mục tiêu:** Chuẩn hóa và tạo embeddings cho knowledge base để enable semantic search

**Các bước thực hiện:**
- Preprocessing: loại bỏ markdown syntax không cần thiết, normalize whitespace, extract code blocks riêng
- Chuẩn hóa format: đảm bảo mỗi note có title, content, tags, metadata
- Tạo embeddings cho tất cả notes bằng OpenAI text-embedding-3-small (1536 dimensions)
- Xử lý code snippets: tạo embeddings riêng cho code blocks để search code tốt hơn
- Batch processing: xử lý 1000 notes trong batches để optimize API calls
- Lưu embeddings vào file/DB để reuse, không cần re-embed khi note không đổi

**Kết quả mong đợi:** Có embeddings cho toàn bộ knowledge base, sẵn sàng cho semantic search

#### Vector Database

**Mục tiêu:** Setup vector database và implement retrieval system cho knowledge base

**Các bước thực hiện:**
- Chọn vector DB: Chroma (local, free) hoặc Pinecone (cloud, scalable). Bắt đầu với Chroma cho MVP
- Setup Chroma: install, initialize collection với metadata schema (title, tags, created_at)
- Ingest embeddings: insert tất cả notes với embeddings và metadata vào vector DB
- Implement similarity search: query embedding → retrieve top-5 relevant notes với cosine similarity
- Add metadata filtering: filter by tags, date range khi search
- Test retrieval quality: 20 test queries, đo precision@5 (số notes relevant trong top-5)

**Kết quả mong đợi:** Có vector DB chứa toàn bộ notes, retrieval API trả về top-5 relevant notes trong <100ms

#### Chunking Strategy

**Mục tiêu:** Tối ưu chunking strategy để improve retrieval accuracy

**Các bước thực hiện:**
- Phân tích markdown structure: identify headers, code blocks, lists, paragraphs
- Implement semantic chunking: split theo headers (H1, H2), giữ nguyên code blocks như một chunk
- Tune chunk size: test 200, 500, 1000 tokens, chọn size cho retrieval accuracy tốt nhất
- Handle edge cases: long code blocks (giữ nguyên), short notes (combine với related notes)
- Đo retrieval quality: 30 test queries, so sánh precision@5 với different chunk sizes
- Implement overlap strategy: 50 tokens overlap giữa chunks để không mất context

**Kết quả mong đợi:** Retrieval accuracy tăng từ 60% lên 85%+, chunks có size và structure tối ưu

### 03. Orchestration

#### Memory Management

**Mục tiêu:** Implement conversation memory để AI nhớ context trong các cuộc hội thoại dài

**Các bước thực hiện:**
- Design memory storage: lưu conversation history trong database (user_id, messages[], timestamps)
- Implement sliding window: giữ 10 messages gần nhất trong context, archive messages cũ hơn
- Token budget management: tính toán token count cho RAG context + chat history, đảm bảo không vượt model limit
- Summarization strategy: khi context >80% token limit, summarize 5 oldest messages thành 1 message
- Long-term memory: lưu important facts vào vector DB để retrieve khi cần (ví dụ: user preferences)
- Test với conversation 50+ messages để đảm bảo memory hoạt động tốt

**Kết quả mong đợi:** AI nhớ được context trong conversations dài, không bị mất thông tin quan trọng

#### Chains & Routing

**Mục tiêu:** Xây dựng workflow chain và routing logic để xử lý các loại queries khác nhau

**Các bước thực hiện:**
- Design chain: retrieve relevant notes → generate answer with citations → suggest related topics → format response
- Implement intent classification: phân loại query thành search, summarize, create_note, general_qa
- Routing logic: mỗi intent → handler riêng với prompt và processing logic phù hợp
- Chain execution: sequential processing với error handling ở mỗi step
- Add conditional logic: nếu không tìm thấy relevant notes → suggest creating new note
- Test với 20 queries mỗi intent để đảm bảo routing chính xác và chain hoạt động tốt

**Kết quả mong đợi:** Có workflow chain hoàn chỉnh, routing chính xác >90%, xử lý được các loại queries khác nhau

### 04. Agents

#### Function Calling

**Mục tiêu:** Implement function calling để AI có thể thực thi các actions trong knowledge base

**Các bước thực hiện:**
- Define function schemas: add_note(title, content, tags[]), search_notes(query, filters), summarize_topic(topic), create_reminder(note_id, date, message)
- Implement tool registry pattern: central registry quản lý tất cả available tools
- Function implementations: mỗi function có handler riêng, validate inputs, execute action, return result
- Tool selection logic: LLM quyết định khi nào gọi function nào dựa trên user query
- Error handling: xử lý invalid function calls, missing parameters, execution errors
- Test với 15 queries yêu cầu different functions để đảm bảo AI gọi đúng function

**Kết quả mong đợi:** AI có thể tự động gọi functions để thực thi actions, user có thể tương tác với knowledge base qua natural language

#### ReAct Pattern

**Mục tiêu:** Implement ReAct agent để tự động giải quyết các queries phức tạp nhiều bước

**Các bước thực hiện:**
- Design agent loop: Thought → Action (function call) → Observation → Thought → Repeat hoặc Final Answer
- Implement reasoning: agent suy nghĩ về query, quyết định cần làm gì, gọi function nào
- Multi-step reasoning: ví dụ 'Tìm tất cả notes về React, tóm tắt chúng, và tạo reminder học lại sau 1 tuần'
- Max iterations: set limit = 5 để tránh infinite loops, return best answer sau 5 iterations
- Guardrails: detect circular reasoning, invalid actions, timeout sau 30s
- Test với 10 complex queries yêu cầu nhiều bước để đảm bảo agent hoạt động đúng

**Kết quả mong đợi:** Agent có thể tự động giải quyết complex queries nhiều bước mà không cần user hướng dẫn chi tiết

### 05. Production

#### Evaluation

**Mục tiêu:** Xây dựng evaluation framework để đánh giá và cải thiện chất lượng hệ thống

**Các bước thực hiện:**
- Tạo evaluation dataset: 50 test questions về các notes đã lưu, có ground truth answers
- Metrics: accuracy (% câu trả lời đúng), retrieval precision@5, latency, cost per query
- Implement automated evaluation: chạy test set, so sánh answers với ground truth, tính metrics
- Human evaluation: 10 questions được đánh giá bởi human để validate automated metrics
- Regression testing: chạy evaluation sau mỗi thay đổi prompt/model để đảm bảo không degrade
- A/B testing framework: so sánh 2 versions của system để chọn version tốt hơn

**Kết quả mong đợi:** Có evaluation framework hoàn chỉnh, biết chính xác chất lượng hệ thống và có thể cải thiện liên tục

#### Observability

**Mục tiêu:** Implement logging và monitoring để có full visibility vào system performance

**Các bước thực hiện:**
- Logging strategy: log mọi query với prompt, retrieved notes, answer, token usage, latency, user_id, timestamp
- Structured logging: dùng JSON format để dễ query và analyze
- Error logging: log errors với stack traces, context, để debug nhanh
- Metrics collection: queries/day, average latency, token usage, cost, error rate
- Dashboard: visualize metrics, top searched topics, user activity, system health
- Alerting: alert khi error rate >5%, latency >3s, hoặc cost vượt budget

**Kết quả mong đợi:** Có full visibility vào system, có thể debug issues nhanh, track performance và cost trends

#### Cost Optimization

**Mục tiêu:** Tối ưu cost bằng caching, batching, và smart model selection

**Các bước thực hiện:**
- Embedding cache: cache embeddings của notes, chỉ re-embed khi note thay đổi (check hash)
- Query cache: cache answers cho common queries (exact match), TTL = 1 hour
- Semantic cache: cache similar queries (cosine similarity >0.95), reuse answers
- Model fallback: nếu GPT-4 rate limit → fallback sang GPT-3.5, log để track
- Batch processing: batch multiple embedding requests khi có thể
- Cost tracking: track cost per user, per feature, set budgets và alerts

**Kết quả mong đợi:** Giảm cost 50-70% so với baseline, vẫn maintain quality và user experience

#### Security

**Mục tiêu:** Implement security measures để protect system và user data

**Các bước thực hiện:**
- Prompt injection defense: validate và sanitize user input, detect suspicious patterns, escape special characters
- Input validation: validate query length, content, reject malicious inputs
- Data privacy: đảm bảo notes chỉ accessible bởi owner (user_id check), encrypt sensitive data
- Authentication & authorization: verify user identity, check permissions trước khi access notes
- Rate limiting: max 100 queries/day/user, 10 queries/minute để prevent abuse
- Output sanitization: sanitize AI output trước khi trả về user để tránh XSS

**Kết quả mong đợi:** System an toàn trước các attacks phổ biến, user data được protect, có rate limiting để prevent abuse

#### Error Handling

**Mục tiêu:** Implement robust error handling để system resilient và user experience tốt

**Các bước thực hiện:**
- Retry logic: retry API calls với exponential backoff (1s, 2s, 4s), max 3 retries
- Timeout handling: set timeout 30s cho LLM calls, return timeout error nếu quá lâu
- Graceful degradation: nếu vector DB down → fallback sang keyword search trong database
- Partial failures: nếu một số notes không retrieve được → vẫn trả về notes available
- User-friendly errors: translate technical errors thành messages dễ hiểu cho user
- Error recovery: log errors, notify admin, tự động recover khi service available lại

**Kết quả mong đợi:** System resilient, handle errors gracefully, user vẫn có experience tốt ngay cả khi có issues

