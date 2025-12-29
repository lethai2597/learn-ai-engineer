# Study Coach (Quiz/Flashcards)

## Mô tả

Tạo quiz và flashcards tự động từ tài liệu học tập. Chấm điểm, theo dõi tiến độ, gợi ý bài cần ôn lại dựa trên spaced repetition.

## Vấn đề thực tiễn

Dev học nhiều tài liệu nhưng khó nhớ lâu. Cần hệ thống tự động tạo quiz/flashcards, test kiến thức, và nhắc ôn lại đúng lúc để retention tốt hơn.

## Knowledge Base

Tutorial docs, course materials, personal notes, quiz history, performance data

## Tools/Functions

- `generate_quiz`
- `grade_answer`
- `schedule_review`
- `track_progress`
- `suggest_topics`

## Roadmap theo bài học

### 01. LLM Fundamentals

#### Prompt Engineering

**Mục tiêu:** Xác định persona và viết prompt baseline cho các intents chính của hệ thống

**Các bước thực hiện:**
- Xác định persona: 'Bạn là giáo viên tạo quiz chuyên nghiệp, giúp học sinh test và củng cố kiến thức thông qua questions chất lượng'
- Phân tích và xác định 3 intents chính: generate_quiz (tạo quiz), grade_answer (chấm điểm), suggest_review (gợi ý ôn lại)
- Viết prompt template cho từng intent với role-based prompting
- Few-shot examples cho different question types: multiple choice, true/false, short answer, với format rõ ràng
- Chain-of-Thought prompting: hướng dẫn AI suy nghĩ từng bước để tạo questions chất lượng
- Test prompt với 10 content samples và điều chỉnh để đạt question quality >85%

**Kết quả mong đợi:** Có được 3 prompt templates hoạt động tốt cho 3 intents chính, AI tạo questions chất lượng và phù hợp với content

#### Structured Output

**Mục tiêu:** Thiết kế và implement schema JSON cho output của hệ thống với validation chặt chẽ

**Các bước thực hiện:**
- Thiết kế schema JSON: {questions: {id, type, question, options[], correct_answer, explanation}[], difficulty_level: string, topic: string}
- Implement Zod schema để validate output từ LLM, đặc biệt quan trọng cho quiz generation
- Validate question format: ensure có đáp án đúng, explanations rõ ràng, options không trùng lặp
- Xử lý trường hợp LLM trả về invalid JSON: retry với stricter prompt hoặc fallback
- Test với 20 content samples khác nhau để đảm bảo schema luôn được tuân thủ

**Kết quả mong đợi:** Backend có thể parse và validate output từ LLM một cách reliable, questions có format chuẩn và đầy đủ thông tin

#### Streaming

**Mục tiêu:** Implement streaming response để cải thiện UX khi AI generate quiz và grade answers

**Các bước thực hiện:**
- Setup Server-Sent Events (SSE) endpoint trong backend để stream response từ LLM
- Frontend: implement EventSource hoặc fetch với stream để nhận chunks
- Streaming khi generate quiz: hiển thị từng câu hỏi khi AI tạo, không cần đợi toàn bộ quiz
- Streaming khi grade: hiển thị feedback từng câu khi user submit, real-time feedback
- Progress indicator: hiển thị progress (generating question 3/10, grading 5/10, etc.)
- Test với quiz 20+ questions để đảm bảo streaming mượt và UX tốt

**Kết quả mong đợi:** User thấy questions và feedback hiển thị dần dần thay vì đợi 10-15 giây, perceived latency giảm đáng kể

#### Model Comparison

**Mục tiêu:** So sánh và chọn model tối ưu cho từng use case để balance cost và quality

**Các bước thực hiện:**
- Tạo test set: 40 content samples (10 easy, 15 medium, 15 hard) với ground truth questions
- Test GPT-4 vs GPT-3.5 vs Claude-3 trên cùng test set
- Đo metrics: question quality (human evaluation), answer accuracy, explanation clarity, latency, cost per quiz
- Phân tích kết quả: GPT-4 tốt hơn cho complex questions, GPT-3.5 đủ cho simple recall questions, Claude tốt cho explanations
- Implement routing logic: easy quiz → GPT-3.5, medium/hard quiz → GPT-4, explanations → Claude
- Tính toán cost savings: dự kiến giảm 50-60% cost mà vẫn đảm bảo quality

**Kết quả mong đợi:** Có routing strategy rõ ràng, giảm cost đáng kể mà vẫn maintain quality cho different difficulty levels

### 02. RAG

#### Embeddings

**Mục tiêu:** Chuẩn hóa và tạo embeddings cho learning materials để enable semantic search

**Các bước thực hiện:**
- Preprocessing: chuẩn hóa tutorial docs, course materials, normalize text, extract key concepts
- Tạo embeddings cho tutorial docs và course materials bằng OpenAI text-embedding-3-small (1536 dimensions)
- Tạo embeddings cho quiz history và performance data để analyze weak areas
- Combine text fields: title + content + key concepts thành một embedding để search tốt hơn
- Batch processing: xử lý 500+ documents trong batches để optimize API calls
- Lưu embeddings vào file/DB để reuse, không cần re-embed khi document không đổi

**Kết quả mong đợi:** Có embeddings cho toàn bộ learning materials, sẵn sàng cho semantic search và content retrieval

#### Vector Database

**Mục tiêu:** Setup vector database và implement retrieval system cho learning materials

**Các bước thực hiện:**
- Chọn vector DB: Chroma (local, free) hoặc Pinecone (cloud, scalable). Bắt đầu với Chroma cho MVP
- Setup Chroma: install, initialize collection với metadata schema (topic, difficulty, document_type)
- Ingest embeddings: insert tất cả learning materials với embeddings và metadata vào vector DB
- Implement similarity search: query embedding → retrieve top-5 relevant sections với cosine similarity
- Search past quizzes: store quiz embeddings để avoid duplicates khi generate new quizzes
- Test retrieval quality: 25 test queries về topics, đo precision@5 (số sections relevant trong top-5)

**Kết quả mong đợi:** Có vector DB chứa toàn bộ learning materials, retrieval API trả về top-5 relevant sections trong <100ms

#### Chunking Strategy

**Mục tiêu:** Tối ưu chunking strategy để improve retrieval accuracy cho learning materials

**Các bước thực hiện:**
- Phân tích tutorial structure: identify sections, chapters, code blocks, examples
- Implement semantic chunking: split theo sections/chapters, giữ nguyên code blocks và examples
- Tune chunk size: test 300, 500, 1000 tokens, chọn size để mỗi chunk = 1 concept có thể tạo 2-3 questions
- Handle edge cases: long code examples (giữ nguyên), short sections (combine với related sections)
- Đo retrieval quality: 30 test topics, so sánh precision@5 với different chunk sizes
- Implement overlap strategy: 50 tokens overlap giữa chunks để không mất context

**Kết quả mong đợi:** Retrieval accuracy tăng từ 65% lên 85%+, chunks có size và structure tối ưu cho question generation

### 03. Orchestration

#### Memory Management

**Mục tiêu:** Implement conversation memory để AI nhớ context trong các cuộc hội thoại dài

**Các bước thực hiện:**
- Design memory storage: lưu learning progress trong database (user_id, topics_learned[], quiz_history[], weak_areas[], performance_data[])
- Memory cho learning progress: track topics đã học, quiz history, weak areas để personalize quiz generation
- Token budget management: tính toán token count cho RAG context (learning materials) + progress tracking, đảm bảo không vượt model limit
- Summarization strategy: khi context >80% token limit, summarize old quiz history thành performance summary
- Long-term memory: lưu important learning milestones và weak areas vào vector DB để retrieve khi cần
- Test với user có 50+ quizzes và 20+ topics để đảm bảo memory hoạt động tốt

**Kết quả mong đợi:** AI nhớ được learning progress, weak areas, và quiz history, có thể personalize quiz generation dựa trên performance

#### Chains & Routing

**Mục tiêu:** Xây dựng workflow chain và routing logic để xử lý các loại requests khác nhau

**Các bước thực hiện:**
- Design chain: retrieve relevant content → generate questions → validate → format quiz → track performance
- Implement intent classification: phân loại request thành generate_quiz, grade_answer, suggest_review, track_progress
- Routing logic: easy quiz → GPT-3.5 handler, hard quiz → GPT-4 handler, adaptive difficulty based on user performance
- Chain execution: sequential processing với error handling ở mỗi step
- Add conditional logic: nếu không tìm thấy relevant content → suggest different topic hoặc ask for clarification
- Test với 20 requests mỗi intent để đảm bảo routing chính xác và chain hoạt động tốt

**Kết quả mong đợi:** Có workflow chain hoàn chỉnh, routing chính xác >90%, adaptive difficulty hoạt động tốt

### 04. Agents

#### Function Calling

**Mục tiêu:** Implement function calling để AI có thể thực thi các actions trong learning system

**Các bước thực hiện:**
- Define function schemas: generate_quiz(topic, difficulty, num_questions), grade_answer(question_id, user_answer), schedule_review(topic, date), track_progress(user_id)
- Implement tool registry pattern: central registry quản lý tất cả available tools
- Function implementations: mỗi function có handler riêng, validate inputs, execute action, return result
- Tool selection logic: LLM quyết định khi nào gọi function nào dựa trên user query
- Error handling: xử lý invalid function calls, missing parameters, execution errors
- Test với 18 queries yêu cầu different functions để đảm bảo AI gọi đúng function

**Kết quả mong đợi:** AI có thể tự động generate quiz, grade answers, schedule reviews, và track progress, user có thể tương tác với learning system qua natural language

#### ReAct Pattern

**Mục tiêu:** Implement ReAct agent để tự động giải quyết các tasks phức tạp nhiều bước

**Các bước thực hiện:**
- Design agent loop: Thought → Action (function call) → Observation → Thought → Repeat hoặc Final Answer
- Implement reasoning: agent suy nghĩ về learning progress, quyết định cần làm gì, gọi function nào
- Multi-step reasoning: ví dụ 'Analyze weak topics → generate personalized quiz → grade → suggest review schedule'
- Max iterations: set limit = 5 để tránh infinite loops, return best answer sau 5 iterations
- Guardrails: detect circular reasoning, invalid actions, timeout sau 30s
- Adaptive difficulty: agent tự động adapt difficulty based on performance, adjust quiz difficulty dynamically

**Kết quả mong đợi:** Agent có thể tự động analyze performance, generate personalized quizzes, và suggest review schedule mà không cần user hướng dẫn

### 05. Production

#### Evaluation

**Mục tiêu:** Xây dựng evaluation framework để đánh giá và cải thiện chất lượng hệ thống

**Các bước thực hiện:**
- Tạo evaluation dataset: 100 generated quizzes với ground truth questions và answers
- Metrics: question quality (human evaluation), answer accuracy, explanation clarity, difficulty appropriateness
- Implement automated evaluation: chạy test set, so sánh questions với ground truth, tính metrics
- Human evaluation: 20 quizzes được đánh giá bởi human để validate automated metrics
- Regression testing: chạy evaluation sau mỗi thay đổi prompt/model để đảm bảo không degrade
- A/B testing framework: so sánh 2 versions của system để chọn version tốt hơn

**Kết quả mong đợi:** Có evaluation framework hoàn chỉnh, biết chính xác chất lượng hệ thống và có thể cải thiện liên tục

#### Observability

**Mục tiêu:** Implement logging và monitoring để có full visibility vào system performance

**Các bước thực hiện:**
- Logging strategy: log mọi request với prompt, generated questions, answers graded, review schedules, user_id, timestamp
- Structured logging: dùng JSON format để dễ query và analyze
- Error logging: log errors với stack traces, context, để debug nhanh
- Metrics collection: quizzes generated/day, average score, topics needing review, user progress trends, retention rate
- Dashboard: visualize metrics, top topics, common mistakes, user progress trends, system health
- Alerting: alert khi error rate >5%, question quality giảm, hoặc user retention rate giảm

**Kết quả mong đợi:** Có full visibility vào system, có thể debug issues nhanh, track learning progress và system performance

#### Cost Optimization

**Mục tiêu:** Tối ưu cost bằng caching, batching, và smart model selection

**Các bước thực hiện:**
- Quiz cache: cache generated quizzes (reuse cho cùng topic và difficulty), TTL = 1 day
- Embedding cache: cache embeddings của learning materials, chỉ re-embed khi document thay đổi
- Batch processing: batch multiple quiz generation requests khi có thể
- Model fallback: nếu GPT-4 rate limit → fallback sang GPT-3.5, log để track
- Smart routing: use GPT-3.5 cho simple questions, GPT-4 cho complex questions và explanations
- Cost tracking: track cost per quiz, per user, set budgets và alerts

**Kết quả mong đợi:** Giảm cost 50-70% so với baseline, vẫn maintain quality và user experience

#### Security

**Mục tiêu:** Implement security measures để protect system và user data

**Các bước thực hiện:**
- Prompt injection defense: validate và sanitize user input, detect suspicious patterns, escape special characters
- Input validation: validate answer length, content, reject malicious inputs
- Data privacy: encrypt quiz history, progress data, đảm bảo data chỉ accessible bởi owner
- Authentication & authorization: verify user identity, check permissions trước khi access quiz data
- Rate limiting: max 50 quizzes/day/user, 10 quizzes/hour để prevent abuse
- Output sanitization: sanitize AI output trước khi trả về user để tránh XSS

**Kết quả mong đợi:** System an toàn trước các attacks phổ biến, user data được encrypt và protect, có rate limiting để prevent abuse

#### Error Handling

**Mục tiêu:** Implement robust error handling để system resilient và user experience tốt

**Các bước thực hiện:**
- Retry logic: retry API calls với exponential backoff (1s, 2s, 4s), max 3 retries
- Timeout handling: set timeout 30s cho LLM calls, return timeout error nếu quá lâu
- Graceful degradation: nếu generation fail → use pre-generated questions, nếu vector DB down → skip content retrieval
- Partial failures: nếu một số questions không generate được → vẫn trả về questions available
- User-friendly errors: translate technical errors thành messages dễ hiểu cho user
- Error recovery: log errors, notify admin, tự động recover khi service available lại

**Kết quả mong đợi:** System resilient, handle errors gracefully, user vẫn có experience tốt ngay cả khi có issues

