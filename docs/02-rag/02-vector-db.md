# Vector Databases

## Mục tiêu học tập

Lưu trữ và query vectors cực nhanh để thực hiện semantic search.

## Nội dung chính

### 1. Vector DB vs Traditional DB
- **SQL:** `SELECT * FROM docs WHERE content LIKE '%keyword%'` → Exact match
- **Vector DB:** `SELECT * FROM docs ORDER BY embedding <=> query_vector LIMIT 5` → Semantic match

### 2. Popular Vector Databases
- **Pinecone:** SaaS, dễ dùng, scale tốt (trả tiền)
- **Supabase (pgvector):** Postgres extension, đầy đủ features
- **ChromaDB:** Local, open-source, tốt cho dev
- **Weaviate:** Open-source, production-grade

### 3. Setup Supabase với pgvector
```sql
-- Enable extension
CREATE EXTENSION vector;

-- Create table
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  content TEXT,
  embedding VECTOR(1536)
);

-- Create index for fast similarity search
CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops);

-- Query
SELECT content, 1 - (embedding <=> '[0.1, 0.2, ...]') AS similarity
FROM documents
ORDER BY embedding <=> '[0.1, 0.2, ...]'
LIMIT 5;
```

### 4. Semantic Search Flow
```
User Query → Generate Embedding → Search Vector DB → Get Top K Results → Use in LLM Context
```

## Tài nguyên học tập

- [Supabase Vector Guide](https://supabase.com/docs/guides/ai)
- [pgvector Documentation](https://github.com/pgvector/pgvector)
- [Pinecone Quickstart](https://docs.pinecone.io/docs/quickstart)

## Bài tập thực hành

1. **Bài 1:** Setup Supabase project với pgvector
2. **Bài 2:** Ingest 100 documents vào vector DB
3. **Bài 3:** Build semantic search API endpoint

## Design Patterns áp dụng

- **Repository Pattern:** Abstract database operations
- **Factory Pattern:** Database client factory
- **Singleton Pattern:** Single database connection instance

## Checklist hoàn thành

- [ ] Hiểu sự khác biệt vector DB vs traditional DB
- [ ] Setup được một vector database
- [ ] Insert và query được vectors
- [ ] Build được semantic search API

