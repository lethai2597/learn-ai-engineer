# Embeddings & Vector Space

## Mục tiêu học tập

Biến văn bản thành vector (array of numbers) để máy tính hiểu được "ngữ nghĩa".

## Nội dung chính

### 1. Embeddings là gì?
- Text → Vector: `"Con chó"` → `[0.012, -0.231, 0.88, ...]`
- Các câu có nghĩa tương tự → Vectors gần nhau trong không gian toán học

### 2. Cosine Similarity
```typescript
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}
```

### 3. OpenAI Embeddings API
```typescript
const response = await openai.embeddings.create({
  model: 'text-embedding-3-large',
  input: 'Con chó đang chạy',
});

const vector = response.data[0].embedding; // [0.012, -0.231, ...] (3072 dimensions)
```

**Lưu ý về Cross-lingual (Đa ngôn ngữ):**
- `text-embedding-3-small`: Rẻ (~$0.02/1M tokens) nhưng không hỗ trợ tốt cross-lingual
- `text-embedding-3-large`: Đắt hơn (~$0.13/1M tokens) nhưng tốt hơn cho cross-lingual
- Để tìm kiếm đa ngôn ngữ tốt nhất, nên dùng model chuyên biệt như `multilingual-e5-large`

### 4. Use Cases
- Semantic search (tìm kiếm theo ý nghĩa)
- Recommendation systems
- Clustering documents
- Duplicate detection

## Tài nguyên học tập

- [OpenAI Embeddings Guide](https://platform.openai.com/docs/guides/embeddings)
- [DeepLearning.AI - Vector Databases](https://www.deeplearning.ai/short-courses/)

## Bài tập thực hành

1. **Bài 1:** Gọi OpenAI API tạo embeddings cho 10 câu
2. **Bài 2:** Implement hàm cosine similarity
3. **Bài 3:** Tìm câu gần nghĩa nhất với "Con chó" trong list 100 câu

## Checklist hoàn thành

- [ ] Hiểu embeddings là gì và tại sao cần
- [ ] Biết cách gọi OpenAI Embeddings API
- [ ] Implement được cosine similarity
- [ ] Hiểu use cases của embeddings

