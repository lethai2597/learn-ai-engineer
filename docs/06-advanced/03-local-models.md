# Local Models & Privacy

## Mục tiêu học tập

Chạy LLM hoàn toàn trên server của bạn để đảm bảo privacy và giảm cost.

## Nội dung chính

### 1. Tại sao chạy Local?
✅ **Ưu điểm:**
- **Privacy:** Dữ liệu không rời khỏi server
- **Cost:** Miễn phí sau khi setup (không giới hạn requests)
- **Latency:** Không phụ thuộc internet
- **Compliance:** Đáp ứng yêu cầu GDPR, HIPAA

❌ **Nhược điểm:**
- Cần GPU mạnh (8GB+ VRAM)
- Chất lượng kém hơn GPT-4
- Khó scale

### 2. Hardware Requirements

| Model Size | VRAM Required | Quality | Speed |
|------------|---------------|---------|-------|
| 7B (Llama 3 8B) | 8GB | Tốt | Nhanh |
| 13B (Llama 2 13B) | 16GB | Rất tốt | Trung bình |
| 70B (Llama 2 70B) | 80GB | Xuất sắc | Chậm |

### 3. Setup Ollama (Đơn giản nhất)

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Download model
ollama pull llama3         # 8B model
ollama pull llama3:70b     # 70B model
ollama pull mistral        # Mistral 7B
ollama pull codellama      # Code specialist

# Run model
ollama run llama3
>>> Hello! How are you?

# Run as API server
ollama serve
```

#### API Usage
```typescript
async function callOllama(prompt: string): Promise<string> {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3',
      prompt: prompt,
      stream: false,
    }),
  });
  
  const data = await response.json();
  return data.response;
}
```

### 4. Setup llama.cpp (Production)

```bash
# Clone repo
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp

# Build
make

# Download model (GGUF format)
wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.Q4_K_M.gguf

# Run server
./server -m llama-2-7b-chat.Q4_K_M.gguf --port 8080 --ctx-size 4096
```

### 5. Setup vLLM (High Throughput)

```bash
# Install
pip install vllm

# Run server
vllm serve meta-llama/Llama-3-8B-Instruct \
  --port 8000 \
  --tensor-parallel-size 2  # Use 2 GPUs

# Compatible with OpenAI API
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "meta-llama/Llama-3-8B-Instruct",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

### 6. Integration với Code

```typescript
// OpenAI SDK compatible
import OpenAI from 'openai';

const ollama = new OpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama', // Dummy key
});

const response = await ollama.chat.completions.create({
  model: 'llama3',
  messages: [
    { role: 'user', content: 'Explain quantum computing' },
  ],
});

console.log(response.choices[0].message.content);
```

### 7. Quantization (Giảm VRAM)

```typescript
// Q4: 4-bit quantization - Fast, 8GB VRAM, quality OK
ollama pull llama3:q4

// Q8: 8-bit - Slower, 16GB VRAM, quality excellent
ollama pull llama3:q8

// FP16: Full precision - Slowest, 32GB VRAM, quality best
ollama pull llama3:fp16
```

### 8. Model Comparison

| Model | Size | Strengths | Best For |
|-------|------|-----------|----------|
| Llama 3 8B | 8GB | General purpose, fast | Chatbots, QA |
| Mistral 7B | 8GB | Multilingual, good at coding | International apps |
| CodeLlama 7B | 8GB | Code generation | Developer tools |
| Llama 3 70B | 80GB | GPT-4 level quality | High-end tasks |

## Tài nguyên học tập

- [Ollama](https://ollama.com/)
- [llama.cpp](https://github.com/ggerganov/llama.cpp)
- [vLLM](https://github.com/vllm-project/vllm)
- [Hugging Face Models](https://huggingface.co/models)

## Bài tập thực hành

1. **Bài 1:** Setup Ollama và chạy Llama 3
2. **Bài 2:** Build API endpoint sử dụng local model
3. **Bài 3:** Compare performance: Local vs OpenAI

## Design Patterns áp dụng

- **Adapter Pattern:** Adapt local model API to OpenAI-compatible interface
- **Singleton Pattern:** Single model instance
- **Factory Pattern:** Model factory for different use cases

## Checklist hoàn thành

- [ ] Setup được Ollama và chạy local model
- [ ] Integrate local model vào application
- [ ] So sánh được performance vs cloud models
- [ ] Hiểu trade-offs: local vs cloud

