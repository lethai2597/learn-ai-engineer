# Fine-tuning & Custom Models

## Mục tiêu học tập

Huấn luyện thêm (fine-tune) LLM với dữ liệu riêng để chuyên môn hóa cho task cụ thể.

## Nội dung chính

### 1. Khi nào NÊN Fine-tune?
✅ **Nên:**
- Cần độ chính xác cực cao (>95%)
- Có dataset lớn (1000+ examples)
- Task lặp đi lặp lại, format cố định
- Cần giảm latency (model nhỏ hơn)

❌ **Không nên:**
- Prompt engineering + RAG đã đủ tốt
- Dataset nhỏ (<100 examples)
- Task thay đổi thường xuyên
- Chưa thử optimize prompt

### 2. Chuẩn bị Dataset

#### Format cho OpenAI Fine-tuning
```jsonl
{"messages": [{"role": "system", "content": "You are a customer service bot."}, {"role": "user", "content": "I want to cancel my order"}, {"role": "assistant", "content": "I'll help you cancel your order. Could you provide your order number?"}]}
{"messages": [{"role": "system", "content": "You are a customer service bot."}, {"role": "user", "content": "Where is my package?"}, {"role": "assistant", "content": "Let me check your shipping status. What's your tracking number?"}]}
```

#### Validation
```typescript
// Minimum 10 examples, recommended 50-100
// Check diversity and quality
function validateDataset(data: FineTuneExample[]) {
  if (data.length < 10) throw new Error('Need at least 10 examples');
  
  // Check token count
  const avgTokens = data.reduce((sum, ex) => 
    sum + countTokens(JSON.stringify(ex)), 0
  ) / data.length;
  
  if (avgTokens > 4096) throw new Error('Examples too long');
  
  return true;
}
```

### 3. Fine-tune với OpenAI

```typescript
import OpenAI from 'openai';
import fs from 'fs';

const openai = new OpenAI();

// 1. Upload training file
const file = await openai.files.create({
  file: fs.createReadStream('training_data.jsonl'),
  purpose: 'fine-tune',
});

// 2. Create fine-tuning job
const fineTune = await openai.fineTuning.jobs.create({
  training_file: file.id,
  model: 'gpt-3.5-turbo',
  hyperparameters: {
    n_epochs: 3, // Number of training epochs
  },
});

// 3. Wait for completion
let status = fineTune.status;
while (status !== 'succeeded' && status !== 'failed') {
  await sleep(60000); // Check every minute
  const job = await openai.fineTuning.jobs.retrieve(fineTune.id);
  status = job.status;
  console.log(`Status: ${status}`);
}

// 4. Use fine-tuned model
const response = await openai.chat.completions.create({
  model: fineTune.fine_tuned_model,
  messages: [{ role: 'user', content: 'Test query' }],
});
```

### 4. Fine-tune Llama với Axolotl

```yaml
# config.yml
base_model: meta-llama/Llama-2-7b-hf
model_type: LlamaForCausalLM
tokenizer_type: LlamaTokenizer

datasets:
  - path: training_data.jsonl
    type: alpaca

sequence_len: 2048
sample_packing: true

adapter: lora  # LoRA for efficient training
lora_r: 8
lora_alpha: 16
lora_dropout: 0.05

batch_size: 4
micro_batch_size: 1
num_epochs: 3
learning_rate: 0.0002

output_dir: ./output
```

```bash
# Train
accelerate launch -m axolotl.cli.train config.yml

# Merge adapter with base model
python -m axolotl.cli.merge_lora config.yml --lora_model_dir ./output
```

### 5. Evaluation

```typescript
async function evaluateFineTunedModel(
  model: string,
  testSet: Example[]
): Promise<number> {
  let correct = 0;
  
  for (const example of testSet) {
    const response = await openai.chat.completions.create({
      model,
      messages: example.messages.slice(0, -1), // Exclude expected answer
    });
    
    const predicted = response.choices[0].message.content;
    const expected = example.messages.at(-1).content;
    
    if (predicted === expected) correct++;
  }
  
  return correct / testSet.length;
}
```

## Tài nguyên học tập

- [OpenAI Fine-tuning Guide](https://platform.openai.com/docs/guides/fine-tuning)
- [Hugging Face AutoTrain](https://huggingface.co/autotrain)
- [Axolotl](https://github.com/OpenAccess-AI-Collective/axolotl)

## Bài tập thực hành

1. **Bài 1:** Chuẩn bị dataset 50+ examples cho task của bạn
2. **Bài 2:** Fine-tune GPT-3.5 với OpenAI
3. **Bài 3:** Evaluate và compare với base model

## Design Patterns áp dụng

- **Template Method:** Define training pipeline skeleton
- **Strategy Pattern:** Different training strategies
- **Factory Pattern:** Model factory based on task

## Checklist hoàn thành

- [ ] Hiểu khi nào nên/không nên fine-tune
- [ ] Chuẩn bị được dataset đúng format
- [ ] Fine-tune được model với OpenAI
- [ ] Evaluate được model performance

