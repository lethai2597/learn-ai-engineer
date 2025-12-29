# Meeting Notes & Action Items

## Mô tả

Hệ thống tự động xử lý meeting notes/transcripts: tóm tắt, trích xuất action items, assign tasks, tạo agenda cho follow-up meetings.

## Vấn đề thực tiễn

Sau meetings, cần thời gian để tổng hợp notes, xác định action items, assign tasks. AI có thể tự động hóa việc này, tiết kiệm thời gian và đảm bảo không bỏ sót.

## Knowledge Base

Meeting transcripts, historical meeting notes, team member info, project context

## Tools/Functions

- `create_tasks`
- `update_tasks`
- `assign_tasks`
- `export_minutes`
- `schedule_followup`

## Roadmap theo bài học

### 01. LLM Fundamentals

#### Prompt Engineering

**Mục tiêu:** Xác định persona và viết prompt baseline cho các intents chính của hệ thống

**Các bước thực hiện:**
- Xác định persona: 'Bạn là trợ lý tổng hợp meeting notes chuyên nghiệp, giúp extract summary, action items, decisions, và next steps từ meeting transcripts'
- Phân tích và xác định 3 intents chính: summarize_meeting (tóm tắt), extract_actions (trích action items), generate_agenda (tạo agenda follow-up)
- Viết prompt template cho từng intent với role-based prompting
- Chain-of-Thought prompting: hướng dẫn AI suy nghĩ từng bước để identify action items chính xác
- Thêm few-shot examples cho mỗi intent để AI hiểu rõ format mong muốn
- Test prompt với 10 meeting transcripts mẫu và điều chỉnh để đạt accuracy >85%

**Kết quả mong đợi:** Có được 3 prompt templates hoạt động tốt cho 3 intents chính, AI extract action items và summary chính xác

#### Structured Output

**Mục tiêu:** Thiết kế và implement schema JSON cho output của hệ thống với validation chặt chẽ

**Các bước thực hiện:**
- Thiết kế schema JSON: {summary: string, action_items: {task, assignee, due_date, priority}[], decisions: string[], attendees: string[], next_meeting_suggestions: {date, agenda}[]}
- Implement Zod schema để validate output từ LLM, đặc biệt quan trọng cho action items
- Validate action items: đảm bảo có assignee và due date, validate date format
- Xử lý trường hợp LLM trả về invalid JSON: retry với stricter prompt hoặc fallback
- Test với 20 meeting transcripts khác nhau để đảm bảo schema luôn được tuân thủ

**Kết quả mong đợi:** Backend có thể parse và validate output từ LLM một cách reliable, action items có đầy đủ thông tin cần thiết

#### Streaming

**Mục tiêu:** Implement streaming response để cải thiện UX khi AI xử lý long transcripts

**Các bước thực hiện:**
- Setup Server-Sent Events (SSE) endpoint trong backend để stream response từ LLM
- Frontend: implement EventSource hoặc fetch với stream để nhận chunks
- Streaming khi process long transcripts: hiển thị summary và action items từng phần khi AI đang xử lý
- Progress indicator: hiển thị progress bar hoặc status messages (processing summary, extracting actions, etc.)
- Xử lý edge cases: connection timeout, partial responses, error handling trong stream
- Test với long transcripts (5000+ words) để đảm bảo streaming mượt và UX tốt

**Kết quả mong đợi:** User thấy summary và action items hiển thị dần dần thay vì đợi 10-20 giây, perceived latency giảm đáng kể

#### Model Comparison

**Mục tiêu:** So sánh và chọn model tối ưu cho từng use case để balance cost và quality

**Các bước thực hiện:**
- Tạo test set: 30 meeting transcripts (10 short, 10 medium, 10 long) với ground truth summaries và action items
- Test GPT-4 vs Claude-3 vs GPT-3.5 trên cùng test set
- Đo metrics: action item extraction accuracy, summary quality (ROUGE score), latency, cost per transcript
- Phân tích kết quả: GPT-4 tốt cho structured extraction, Claude tốt cho creative summaries, GPT-3.5 đủ cho short meetings
- Implement routing logic: short meetings → GPT-3.5, long/structured → GPT-4, creative summaries → Claude
- Tính toán cost savings: dự kiến giảm 40-50% cost mà vẫn đảm bảo quality

**Kết quả mong đợi:** Có routing strategy rõ ràng, giảm cost đáng kể mà vẫn maintain quality cho different meeting types

### 02. RAG

#### Embeddings

**Mục tiêu:** Chuẩn hóa và tạo embeddings cho historical meeting notes để enable semantic search

**Các bước thực hiện:**
- Preprocessing: chuẩn hóa meeting transcripts, normalize text, extract key information
- Tạo embeddings cho historical meeting notes bằng OpenAI text-embedding-3-small (1536 dimensions)
- Tạo embeddings cho team member info và project context để retrieve khi cần
- Combine text fields: summary + action items + decisions thành một embedding để search tốt hơn
- Batch processing: xử lý 500+ meeting notes trong batches để optimize API calls
- Lưu embeddings vào file/DB để reuse, không cần re-embed khi meeting note không đổi

**Kết quả mong đợi:** Có embeddings cho toàn bộ historical meetings, sẵn sàng cho semantic search và context retrieval

#### Vector Database

**Mục tiêu:** Setup vector database và implement retrieval system cho meeting notes

**Các bước thực hiện:**
- Chọn vector DB: Chroma (local, free) hoặc Pinecone (cloud, scalable). Bắt đầu với Chroma cho MVP
- Setup Chroma: install, initialize collection với metadata schema (date, project, attendees, meeting_type)
- Ingest embeddings: insert tất cả meeting notes với embeddings và metadata vào vector DB
- Implement similarity search: query embedding → retrieve top-5 relevant past meetings với cosine similarity
- Add metadata filtering: filter by project, date range, attendees khi search
- Test retrieval quality: 20 test queries về past meetings, đo precision@5 (số meetings relevant trong top-5)

**Kết quả mong đợi:** Có vector DB chứa toàn bộ meeting notes, retrieval API trả về top-5 relevant past meetings trong <100ms

#### Chunking Strategy

**Mục tiêu:** Tối ưu chunking strategy để improve retrieval accuracy cho meeting transcripts

**Các bước thực hiện:**
- Phân tích transcript structure: identify speaker turns, time segments, topics
- Implement semantic chunking: split theo speaker turns hoặc time segments (5-10 minutes), giữ nguyên context
- Tune chunk size: test 500, 1000, 2000 tokens, chọn size cho retrieval accuracy tốt nhất
- Handle edge cases: long discussions (giữ nguyên), short meetings (combine với related meetings)
- Đo retrieval quality: 30 test queries về past meetings, so sánh precision@5 với different chunk sizes
- Implement overlap strategy: 100 tokens overlap giữa chunks để không mất context của discussions

**Kết quả mong đợi:** Retrieval accuracy tăng từ 60% lên 85%+, chunks có size và structure tối ưu cho meeting context

### 03. Orchestration

#### Memory Management

**Mục tiêu:** Implement conversation memory để AI nhớ context trong các cuộc hội thoại dài

**Các bước thực hiện:**
- Design memory storage: lưu meeting series trong database (project_id, meetings[], summaries[], action_items[])
- Memory cho meeting series: nhớ context từ previous meetings trong cùng project để có continuity
- Token budget management: tính toán token count cho RAG context (past meetings) + current transcript, đảm bảo không vượt model limit
- Summarization strategy: khi context >80% token limit, summarize 3 oldest meetings thành 1 summary
- Long-term memory: lưu important decisions và action items vào vector DB để retrieve khi cần
- Test với meeting series 10+ meetings trong cùng project để đảm bảo memory hoạt động tốt

**Kết quả mong đợi:** AI nhớ được context từ previous meetings trong cùng project, có continuity và không bị mất thông tin quan trọng

#### Chains & Routing

**Mục tiêu:** Xây dựng workflow chain và routing logic để xử lý các loại meetings khác nhau

**Các bước thực hiện:**
- Design chain: transcribe → summarize → extract actions → assign tasks → generate agenda → format response
- Implement intent classification: phân loại meeting thành short, long, structured, creative
- Routing logic: short meeting → simple summary handler, long meeting → detailed breakdown handler
- Chain execution: sequential processing với error handling ở mỗi step
- Add conditional logic: nếu không extract được action items → ask for clarification hoặc use fallback
- Test với 20 meetings mỗi type để đảm bảo routing chính xác và chain hoạt động tốt

**Kết quả mong đợi:** Có workflow chain hoàn chỉnh, routing chính xác >90%, xử lý được các loại meetings khác nhau

### 04. Agents

#### Function Calling

**Mục tiêu:** Implement function calling để AI có thể thực thi các actions trong meeting system

**Các bước thực hiện:**
- Define function schemas: create_tasks(action_items[]), assign_tasks(task_id, assignee), export_minutes(format), schedule_followup(date, agenda)
- Implement tool registry pattern: central registry quản lý tất cả available tools
- Function implementations: mỗi function có handler riêng, validate inputs, execute action, return result
- Tool selection logic: LLM quyết định khi nào gọi function nào dựa trên extracted action items
- Integrate với task management system: connect với Jira, Asana, hoặc custom task system
- Error handling: xử lý invalid function calls, missing parameters, execution errors

**Kết quả mong đợi:** AI có thể tự động tạo tasks, assign cho team members, và schedule follow-up meetings, integrate với task management system

#### ReAct Pattern

**Mục tiêu:** Implement ReAct agent để tự động giải quyết các tasks phức tạp nhiều bước

**Các bước thực hiện:**
- Design agent loop: Thought → Action (function call) → Observation → Thought → Repeat hoặc Final Answer
- Implement reasoning: agent suy nghĩ về transcript, quyết định cần làm gì, gọi function nào
- Multi-step reasoning: ví dụ 'Process transcript → identify unclear items → search past meetings for context → clarify → finalize summary'
- Max iterations: set limit = 3 để tránh infinite loops, return best answer sau 3 iterations
- Guardrails: detect circular reasoning, invalid actions, timeout sau 60s (vì transcripts có thể dài)
- Test với 10 complex transcripts yêu cầu nhiều bước để đảm bảo agent hoạt động đúng

**Kết quả mong đợi:** Agent có thể tự động xử lý complex transcripts, tìm context từ past meetings, và finalize summary mà không cần user hướng dẫn

### 05. Production

#### Evaluation

**Mục tiêu:** Xây dựng evaluation framework để đánh giá và cải thiện chất lượng hệ thống

**Các bước thực hiện:**
- Tạo evaluation dataset: 50 meeting transcripts với ground truth summaries và action items
- Metrics: action item extraction accuracy (% action items được extract đúng), summary quality (ROUGE score), assignment correctness (% assignments đúng)
- Implement automated evaluation: chạy test set, so sánh results với ground truth, tính metrics
- Human evaluation: 15 transcripts được đánh giá bởi human để validate automated metrics
- Regression testing: chạy evaluation sau mỗi thay đổi prompt/model để đảm bảo không degrade
- A/B testing framework: so sánh 2 versions của system để chọn version tốt hơn

**Kết quả mong đợi:** Có evaluation framework hoàn chỉnh, biết chính xác chất lượng hệ thống và có thể cải thiện liên tục

#### Observability

**Mục tiêu:** Implement logging và monitoring để có full visibility vào system performance

**Các bước thực hiện:**
- Logging strategy: log mọi transcript với prompt, extracted summary, action items, tasks created, processing time, user_id, timestamp
- Structured logging: dùng JSON format để dễ query và analyze
- Error logging: log errors với stack traces, context, để debug nhanh
- Metrics collection: meetings processed/day, average processing time, action items per meeting, task creation success rate
- Dashboard: visualize metrics, top projects, common action items, average meeting length, system health
- Alerting: alert khi error rate >5%, processing time >60s, hoặc task creation fail rate >10%

**Kết quả mong đợi:** Có full visibility vào system, có thể debug issues nhanh, track performance và business metrics

#### Cost Optimization

**Mục tiêu:** Tối ưu cost bằng caching, batching, và smart model selection

**Các bước thực hiện:**
- Summary cache: cache summaries của common meeting types (standup, review, planning), TTL = 1 day
- Embedding cache: cache embeddings của meeting notes, chỉ re-embed khi note thay đổi
- Batch processing: batch multiple meeting processing requests khi có thể
- Model fallback: nếu GPT-4 rate limit → fallback sang GPT-3.5, log để track
- Smart routing: use GPT-3.5 cho short meetings (<30 min), GPT-4 cho long/complex meetings
- Cost tracking: track cost per meeting, per project, set budgets và alerts

**Kết quả mong đợi:** Giảm cost 50-70% so với baseline, vẫn maintain quality và user experience

#### Security

**Mục tiêu:** Implement security measures để protect system và user data

**Các bước thực hiện:**
- Prompt injection defense: validate và sanitize transcript input, detect suspicious patterns, escape special characters
- Input validation: validate transcript length, content, reject malicious inputs
- Data privacy: encrypt meeting transcripts, access control per team (chỉ team members mới access được)
- Authentication & authorization: verify user identity, check permissions trước khi access meeting notes
- Rate limiting: max 20 meetings/day/user, 5 meetings/hour để prevent abuse
- Output sanitization: sanitize AI output trước khi trả về user để tránh XSS

**Kết quả mong đợi:** System an toàn trước các attacks phổ biến, meeting data được encrypt và protect, có rate limiting để prevent abuse

#### Error Handling

**Mục tiêu:** Implement robust error handling để system resilient và user experience tốt

**Các bước thực hiện:**
- Retry logic: retry API calls với exponential backoff (1s, 2s, 4s), max 3 retries
- Timeout handling: set timeout 60s cho LLM calls (vì transcripts có thể dài), return timeout error nếu quá lâu
- Graceful degradation: nếu extraction fail → return raw summary, nếu vector DB down → skip context retrieval
- Partial failures: nếu một số action items không extract được → vẫn trả về action items available
- User-friendly errors: translate technical errors thành messages dễ hiểu cho user
- Error recovery: log errors, notify admin, tự động recover khi service available lại

**Kết quả mong đợi:** System resilient, handle errors gracefully, user vẫn có experience tốt ngay cả khi có issues

