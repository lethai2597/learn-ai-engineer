# Trợ lý sản phẩm (Product Assistant)

## Mô tả

Chatbot hỗ trợ khách hàng tìm kiếm sản phẩm, đọc thông tin chi tiết, so sánh, và đặt hàng. Sử dụng product catalog và FAQs làm knowledge base.

## Vấn đề thực tiễn

Khách hàng cần tìm sản phẩm phù hợp nhưng catalog lớn, khó navigate. Cần AI hỗ trợ tìm kiếm semantic, so sánh features, và hướng dẫn đặt hàng.

## Knowledge Base

Product catalog (JSON/CSV), FAQs, specifications, pricing rules

## Tools/Functions

- `search_products`
- `compare_products`
- `create_order`
- `get_order_status`
- `check_availability`

## Roadmap theo bài học

### 01. LLM Fundamentals

#### Prompt Engineering

**Mục tiêu:** Xác định persona và viết prompt baseline cho các intents chính của hệ thống

**Các bước thực hiện:**
- Xác định persona: 'Bạn là trợ lý bán hàng chuyên nghiệp, giúp khách hàng tìm sản phẩm phù hợp, so sánh features và đặt hàng'
- Phân tích và xác định 3 intents chính: search_products (tìm sản phẩm), compare_products (so sánh), create_order (đặt hàng)
- Viết prompt template cho từng intent với role-based prompting
- Thêm few-shot examples cho product recommendations: ví dụ 'Tôi cần laptop gaming' → suggest products với features phù hợp
- Test prompt với 15 queries mẫu về products và điều chỉnh để đạt accuracy >85%

**Kết quả mong đợi:** Có được 3 prompt templates hoạt động tốt cho 3 intents chính, AI hiểu được product queries và recommend phù hợp

#### Structured Output

**Mục tiêu:** Thiết kế và implement schema JSON cho output của hệ thống với validation chặt chẽ

**Các bước thực hiện:**
- Thiết kế schema JSON: {products: {id, name, price, features}[], comparison_table?: {feature, product1, product2}[], order_id?: string, suggested_actions: {action, params}[]}
- Implement Zod schema để validate output từ LLM, đặc biệt quan trọng cho order creation
- Validate product IDs, quantities, prices trước khi tạo order: verify product exists, quantity > 0, price matches
- Xử lý trường hợp LLM trả về invalid JSON: retry với stricter prompt hoặc fallback
- Test với 20 queries khác nhau (search, compare, order) để đảm bảo schema luôn được tuân thủ

**Kết quả mong đợi:** Backend có thể parse và validate output từ LLM một cách reliable, đảm bảo order data chính xác trước khi tạo order

#### Streaming

**Mục tiêu:** Implement streaming response để cải thiện UX khi AI tìm kiếm và hiển thị products

**Các bước thực hiện:**
- Setup Server-Sent Events (SSE) endpoint trong backend để stream response từ LLM
- Frontend: implement EventSource hoặc fetch với stream để nhận chunks
- Streaming cho product search: hiển thị từng sản phẩm khi AI tìm thấy, không cần đợi toàn bộ results
- Xử lý edge cases: connection timeout, partial responses, error handling trong stream
- Test với queries tìm nhiều products (10+) để đảm bảo streaming mượt và UX tốt

**Kết quả mong đợi:** User thấy products hiển thị từng cái một thay vì đợi 5-10 giây, perceived latency giảm đáng kể

#### Model Comparison

**Mục tiêu:** So sánh và chọn model tối ưu cho từng use case để balance cost và quality

**Các bước thực hiện:**
- Tạo test set: 40 queries (15 simple search, 15 complex search, 10 comparisons)
- Test GPT-3.5-turbo vs GPT-4 vs Claude-3 trên cùng test set
- Đo metrics: accuracy, latency, cost per query, user satisfaction
- Phân tích kết quả: GPT-3.5 đủ cho simple queries, GPT-4 tốt hơn cho complex comparisons, Claude tốt cho creative descriptions
- Implement routing logic: simple queries → GPT-3.5, complex comparisons → GPT-4, descriptions → Claude
- Tính toán cost savings: dự kiến giảm 50-60% cost mà vẫn đảm bảo quality

**Kết quả mong đợi:** Có routing strategy rõ ràng, giảm cost đáng kể mà vẫn maintain quality cho user experience

### 02. RAG

#### Embeddings

**Mục tiêu:** Chuẩn hóa và tạo embeddings cho product catalog để enable semantic search

**Các bước thực hiện:**
- Preprocessing: chuẩn hóa product data, normalize text, extract features
- Combine text fields: name + description + features + category thành một embedding để search tốt hơn
- Tạo embeddings cho tất cả products bằng OpenAI text-embedding-3-small (1536 dimensions)
- Tạo embeddings riêng cho FAQs để search FAQs hiệu quả
- Batch processing: xử lý 1000+ products trong batches để optimize API calls
- Lưu embeddings vào file/DB để reuse, không cần re-embed khi product không đổi

**Kết quả mong đợi:** Có embeddings cho toàn bộ product catalog và FAQs, sẵn sàng cho semantic search

#### Vector Database

**Mục tiêu:** Setup vector database và implement retrieval system cho product catalog

**Các bước thực hiện:**
- Chọn vector DB: Chroma (local, free) hoặc Pinecone (cloud, scalable). Bắt đầu với Chroma cho MVP
- Setup Chroma: install, initialize collection với metadata schema (category, price, stock, brand)
- Ingest embeddings: insert tất cả products với embeddings và metadata vào vector DB
- Implement hybrid search: semantic search + filter by category/price/availability
- Retrieve top-10 relevant products với cosine similarity, kết hợp với metadata filters
- Test retrieval quality: 30 test queries về products, đo precision@10 (số products relevant trong top-10)

**Kết quả mong đợi:** Có vector DB chứa toàn bộ products, retrieval API trả về top-10 relevant products trong <100ms với filters

#### Chunking Strategy

**Mục tiêu:** Tối ưu chunking strategy để improve retrieval accuracy cho products

**Các bước thực hiện:**
- Chunking strategy: mỗi product = 1 chunk (vì products thường không quá dài)
- Tune chunk size cho long product descriptions: nếu description >1000 tokens, split thành features chunk và description chunk
- Handle edge cases: products với nhiều features (giữ nguyên), products ngắn (combine với similar products)
- Đo retrieval quality: 50 test queries về products, so sánh precision@10 với different chunking strategies
- Implement overlap strategy nếu cần: 50 tokens overlap giữa chunks để không mất context

**Kết quả mong đợi:** Retrieval accuracy tăng từ 65% lên 85%+, products được chunk tối ưu cho search

### 03. Orchestration

#### Memory Management

**Mục tiêu:** Implement conversation memory để AI nhớ context trong các cuộc hội thoại dài

**Các bước thực hiện:**
- Design memory storage: lưu conversation history trong database (user_id, messages[], cart_items[], preferences)
- Implement sliding window: giữ 10 messages gần nhất trong context, archive messages cũ hơn
- Token budget management: tính toán token count cho RAG context (products) + chat history, đảm bảo không vượt model limit
- Summarization strategy: khi context >80% token limit, summarize 5 oldest messages thành 1 message
- Long-term memory: lưu user preferences (price range, categories) vào vector DB để retrieve khi cần
- Test với conversation 50+ messages và cart với 10+ items để đảm bảo memory hoạt động tốt

**Kết quả mong đợi:** AI nhớ được preferences, cart items, và context trong conversations dài, không bị mất thông tin quan trọng

#### Chains & Routing

**Mục tiêu:** Xây dựng workflow chain và routing logic để xử lý các loại queries khác nhau

**Các bước thực hiện:**
- Design chain: search products → filter by criteria → rank by relevance → format response → suggest related products
- Implement intent classification: phân loại query thành search, compare, order, general_qa
- Routing logic: mỗi intent → handler riêng với prompt và processing logic phù hợp
- Chain execution: sequential processing với error handling ở mỗi step
- Add conditional logic: nếu không tìm thấy products → suggest popular products hoặc ask for clarification
- Test với 25 queries mỗi intent để đảm bảo routing chính xác và chain hoạt động tốt

**Kết quả mong đợi:** Có workflow chain hoàn chỉnh, routing chính xác >90%, xử lý được các loại queries khác nhau

### 04. Agents

#### Function Calling

**Mục tiêu:** Implement function calling để AI có thể thực thi các actions trong product system

**Các bước thực hiện:**
- Define function schemas: search_products(query, filters), compare_products(ids[]), create_order(items[]), get_order_status(order_id), check_availability(product_id)
- Implement tool registry pattern: central registry quản lý tất cả available tools
- Function implementations: mỗi function có handler riêng, validate inputs, execute action, return result
- Tool selection logic: LLM quyết định khi nào gọi function nào dựa trên user query
- Error handling: xử lý invalid function calls, missing parameters, execution errors (ví dụ: product out of stock)
- Test với 20 queries yêu cầu different functions để đảm bảo AI gọi đúng function

**Kết quả mong đợi:** AI có thể tự động gọi functions để search, compare, và create orders, user có thể tương tác với product system qua natural language

#### ReAct Pattern

**Mục tiêu:** Implement ReAct agent để tự động giải quyết các queries phức tạp nhiều bước

**Các bước thực hiện:**
- Design agent loop: Thought → Action (function call) → Observation → Thought → Repeat hoặc Final Answer
- Implement reasoning: agent suy nghĩ về query, quyết định cần làm gì, gọi function nào
- Multi-step reasoning: ví dụ 'Tìm laptop gaming dưới 20tr, so sánh top 3, check availability' → agent tự động search → compare → check → recommend
- Max iterations: set limit = 5 để tránh infinite loops, return best answer sau 5 iterations
- Guardrails: detect circular reasoning, invalid actions, timeout sau 30s
- Test với 12 complex queries yêu cầu nhiều bước để đảm bảo agent hoạt động đúng

**Kết quả mong đợi:** Agent có thể tự động giải quyết complex queries nhiều bước mà không cần user hướng dẫn chi tiết

### 05. Production

#### Evaluation

**Mục tiêu:** Xây dựng evaluation framework để đánh giá và cải thiện chất lượng hệ thống

**Các bước thực hiện:**
- Tạo evaluation dataset: 100 test queries về products (search, compare, order), có ground truth answers
- Metrics: retrieval accuracy (precision@10), order creation success rate, user satisfaction score, conversion rate
- Implement automated evaluation: chạy test set, so sánh results với ground truth, tính metrics
- Human evaluation: 20 queries được đánh giá bởi human để validate automated metrics
- Regression testing: chạy evaluation sau mỗi thay đổi prompt/model để đảm bảo không degrade
- A/B testing framework: so sánh 2 versions của system để chọn version tốt hơn

**Kết quả mong đợi:** Có evaluation framework hoàn chỉnh, biết chính xác chất lượng hệ thống và có thể cải thiện liên tục

#### Observability

**Mục tiêu:** Implement logging và monitoring để có full visibility vào system performance

**Các bước thực hiện:**
- Logging strategy: log mọi query với prompt, retrieved products, orders created, conversion rate, user_id, timestamp
- Structured logging: dùng JSON format để dễ query và analyze
- Error logging: log errors với stack traces, context, để debug nhanh
- Metrics collection: queries/day, average latency, token usage, cost, error rate, conversion rate
- Dashboard: visualize metrics, popular products, common queries, order success rate, average session length
- Alerting: alert khi error rate >5%, latency >3s, conversion rate giảm, hoặc cost vượt budget

**Kết quả mong đợi:** Có full visibility vào system, có thể debug issues nhanh, track performance và business metrics

#### Cost Optimization

**Mục tiêu:** Tối ưu cost bằng caching, batching, và smart model selection

**Các bước thực hiện:**
- Embedding cache: cache embeddings của products, chỉ re-embed khi product thay đổi (check hash)
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
- Order validation: verify product IDs, quantities, prices server-side trước khi tạo order
- Authentication & authorization: verify user identity, check permissions trước khi access orders
- Rate limiting: max 50 queries/hour/user, 10 queries/minute để prevent abuse
- Output sanitization: sanitize AI output trước khi trả về user để tránh XSS

**Kết quả mong đợi:** System an toàn trước các attacks phổ biến, order data được validate chặt chẽ, có rate limiting để prevent abuse

#### Error Handling

**Mục tiêu:** Implement robust error handling để system resilient và user experience tốt

**Các bước thực hiện:**
- Retry logic: retry API calls với exponential backoff (1s, 2s, 4s), max 3 retries
- Timeout handling: set timeout 30s cho LLM calls, return timeout error nếu quá lâu
- Graceful degradation: nếu product search fail → suggest popular products, nếu vector DB down → fallback sang keyword search
- Partial failures: nếu một số products không retrieve được → vẫn trả về products available
- Order errors: nếu order creation fail → show user-friendly error và suggest retry, log để admin xử lý
- User-friendly errors: translate technical errors thành messages dễ hiểu cho user

**Kết quả mong đợi:** System resilient, handle errors gracefully, user vẫn có experience tốt ngay cả khi có issues

