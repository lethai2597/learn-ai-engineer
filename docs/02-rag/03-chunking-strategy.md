# Chunking & Ingestion Strategy

## Mục tiêu học tập

Chiến thuật cắt nhỏ dữ liệu lớn (file PDF 100 trang) thành các miếng nhỏ (chunks) để nạp vào Vector DB. Hiểu trade-offs và chọn strategy phù hợp.

## Nội dung chính

### 1. Vấn đề của Chunking

Khi nạp tài liệu dài vào Vector DB, không thể đưa toàn bộ vào một lần. Cần cắt nhỏ nhưng phải cân bằng:

- **Chunk quá lớn (>1000 tokens):**
  - Tốn context window của LLM (mỗi chunk chiếm nhiều tokens)
  - Nhiễu thông tin: Khi search, trả về chunk lớn chứa nhiều thông tin không liên quan
  - Ví dụ: Chunk 2000 tokens về "React hooks" nhưng user chỉ hỏi về "useState"

- **Chunk quá nhỏ (<100 tokens):**
  - Mất ngữ cảnh: Câu văn bị cắt giữa chừng, mất ý nghĩa
  - Không đủ thông tin: LLM không có đủ context để trả lời chính xác
  - Ví dụ: Chunk chỉ có "useState là hook" → thiếu cách dùng, ví dụ

- **Sweet spot:** 200-500 tokens/chunk với overlap 10-20%
  - Đủ ngữ cảnh để hiểu ý nghĩa
  - Đủ nhỏ để tìm kiếm chính xác
  - Overlap đảm bảo không mất thông tin ở ranh giới

### 2. Chunking Strategies

#### 2.1. Fixed-size Chunking

Cắt text theo kích thước cố định (character hoặc token count).

```typescript
function chunkBySize(text: string, size: number, overlap: number): string[] {
  const chunks = [];
  for (let i = 0; i < text.length; i += size - overlap) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}

const text = "Đây là một đoạn văn dài...";
const chunks = chunkBySize(text, 500, 50);
```

**Ưu điểm:** Đơn giản, dễ implement, kiểm soát được kích thước

**Nhược điểm:** Có thể cắt giữa câu, mất ngữ cảnh

#### 2.2. RecursiveCharacterTextSplitter (LangChain)

Thuật toán thông minh: Cố gắng cắt theo ranh giới tự nhiên (paragraph → sentence → character).

**Cách hoạt động:**
1. Ưu tiên cắt theo paragraph (`\n\n`)
2. Nếu không được, cắt theo sentence (`.`, `!`, `?`)
3. Nếu vẫn không được, cắt theo character

```typescript
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 50,
  separators: ['\n\n', '\n', '. ', ' ', ''],
});

const docs = await splitter.createDocuments([longText]);
```

**Ưu điểm:** Giữ được ngữ cảnh tốt hơn fixed-size, tự động xử lý nhiều loại text

**Nhược điểm:** Phức tạp hơn, có thể không đúng kích thước mong muốn

#### 2.3. Semantic Chunking

Cắt theo đơn vị ngữ nghĩa (paragraph, section, heading).

```typescript
function chunkByParagraph(text: string, maxSize: number): string[] {
  const paragraphs = text.split('\n\n');
  const chunks = [];
  let currentChunk = '';

  for (const para of paragraphs) {
    if (currentChunk.length + para.length > maxSize && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = para;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + para;
    }
  }
  if (currentChunk) chunks.push(currentChunk.trim());
  return chunks;
}
```

**Ưu điểm:** Giữ nguyên cấu trúc, ngữ nghĩa tốt nhất

**Nhược điểm:** Kích thước không đồng đều, phức tạp với structured documents

#### 2.4. Sentence-based Chunking

Cắt theo câu, gom nhiều câu lại cho đến khi đạt kích thước.

```typescript
function chunkBySentence(text: string, maxSize: number): string[] {
  const sentences = text.split(/[.!?]+\s+/);
  const chunks = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > maxSize && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? '. ' : '') + sentence;
    }
  }
  if (currentChunk) chunks.push(currentChunk.trim());
  return chunks;
}
```

**Use case:** Tốt cho văn bản có cấu trúc câu rõ ràng

### 3. Document Loaders

#### 3.1. PDF Loader

```typescript
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';

const loader = new PDFLoader('document.pdf');
const docs = await loader.load();

docs.forEach((doc) => {
  console.log(doc.pageContent);
  console.log(doc.metadata); // { source: 'document.pdf', page: 1 }
});
```

#### 3.2. Text Loader

```typescript
import { TextLoader } from 'langchain/document_loaders/fs/text';

const loader = new TextLoader('document.txt');
const docs = await loader.load();
```

#### 3.3. Markdown Loader

```typescript
import { MarkdownTextSplitter } from 'langchain/text_splitter';

const splitter = new MarkdownTextSplitter({
  chunkSize: 500,
  chunkOverlap: 50,
});
```

#### 3.4. Metadata Handling

Giữ metadata để traceback nguồn gốc chunk:

```typescript
const docs = await loader.load();

const chunksWithMetadata = docs.flatMap((doc) => {
  const chunks = splitter.splitText(doc.pageContent);
  return chunks.map((chunk, index) => ({
    content: chunk,
    metadata: {
      ...doc.metadata,
      chunkIndex: index,
      totalChunks: chunks.length,
    },
  }));
});
```

### 4. Ingestion Pipeline

Flow hoàn chỉnh từ file đến Vector DB:

```
Upload File → Extract Text → Split into Chunks → Generate Embeddings → Store in Vector DB
```

**Code example:**

```typescript
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { Chroma } from 'langchain/vectorstores/chroma';

async function ingestDocument(filePath: string, collectionName: string) {
  const loader = new PDFLoader(filePath);
  const rawDocs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });
  const docs = await splitter.splitDocuments(rawDocs);

  const embeddings = new OpenAIEmbeddings();
  const vectorStore = await Chroma.fromDocuments(docs, embeddings, {
    collectionName,
  });

  return { count: docs.length, collectionName };
}

await ingestDocument('handbook.pdf', 'company-handbook');
```

### 5. Best Practices

#### 5.1. Chunk Size Recommendations

- **Code documentation:** 300-500 tokens (giữ nguyên function/class)
- **Long-form articles:** 500-800 tokens (giữ nguyên section)
- **Chat logs/Conversations:** 200-400 tokens (giữ nguyên message)
- **Structured data (tables):** 100-300 tokens (giữ nguyên row/group)

#### 5.2. Overlap Recommendations

- **10-20% overlap:** Phổ biến nhất, cân bằng giữa coverage và efficiency
- **20-30% overlap:** Khi thông tin quan trọng ở ranh giới (code, formulas)
- **<10% overlap:** Khi chunks độc lập, không cần context

#### 5.3. Metadata Strategy

Luôn giữ metadata để:
- Traceback nguồn gốc (file, page, section)
- Filter theo loại document
- Debug khi search không chính xác

```typescript
{
  source: 'handbook.pdf',
  page: 5,
  section: 'Benefits',
  chunkIndex: 12,
  timestamp: '2024-01-15T10:30:00Z'
}
```

## Tài nguyên học tập

- [LangChain Text Splitters](https://js.langchain.com/docs/modules/data_connection/document_transformers/)
- [LlamaIndex Chunking Guide](https://docs.llamaindex.ai/en/stable/module_guides/loading/node_parsers/)
- [Chunking Strategies for RAG](https://www.pinecone.io/learn/chunking-strategies/)

## Bài tập thực hành

1. **Bài 1:** Implement fixed-size chunking với overlap và test với text dài
2. **Bài 2:** Load PDF và split thành chunks với RecursiveCharacterTextSplitter
3. **Bài 3:** Build complete ingestion pipeline: PDF → Chunks → Embeddings → Vector DB

## Design Patterns áp dụng

- **Strategy Pattern:** Chọn chunking strategy khác nhau (Fixed-size, Recursive, Semantic) dựa trên use case
- **Template Method Pattern:** Định nghĩa pipeline skeleton (load → split → embed → store), override từng bước
- **Builder Pattern:** Xây dựng document processing pipeline với các options (chunkSize, overlap, metadata)

## Checklist hoàn thành

- [ ] Hiểu trade-off của chunk size và overlap
- [ ] Implement được ít nhất 2 chunking algorithms
- [ ] Sử dụng được LangChain text splitters
- [ ] Load được documents từ nhiều format (PDF, Text, Markdown)
- [ ] Build được complete ingestion pipeline với metadata
- [ ] Áp dụng best practices cho use case cụ thể

