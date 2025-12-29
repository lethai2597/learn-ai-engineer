"use client";

import { Typography, Divider, Alert, Tag } from "antd";

const { Title, Paragraph } = Typography;

export function LearningSection() {
  const concepts = [
    {
      title: "Khi nào NÊN Fine-tune?",
      description:
        "Fine-tuning phù hợp khi bạn cần độ chính xác cực cao (>95%), có dataset lớn (1000+ examples), task lặp đi lặp lại với format cố định, hoặc cần giảm latency với model nhỏ hơn. Không nên fine-tune nếu prompt engineering + RAG đã đủ tốt, dataset nhỏ (<100 examples), task thay đổi thường xuyên, hoặc chưa thử optimize prompt.",
      shouldUse: [
        "Cần độ chính xác cực cao (>95%)",
        "Có dataset lớn (1000+ examples)",
        "Task lặp đi lặp lại, format cố định",
        "Cần giảm latency (model nhỏ hơn)",
      ],
      shouldNotUse: [
        "Prompt engineering + RAG đã đủ tốt",
        "Dataset nhỏ (<100 examples)",
        "Task thay đổi thường xuyên",
        "Chưa thử optimize prompt",
      ],
    },
    {
      title: "Chuẩn bị Dataset",
      description:
        "Dataset phải theo format OpenAI Fine-tuning: mỗi example là một object với key 'messages' chứa array of messages. Mỗi message có 'role' (system/user/assistant) và 'content'. Minimum 10 examples, recommended 50-100. Mỗi example không nên quá 4096 tokens.",
      format: `{"messages": [
  {"role": "system", "content": "You are a helpful assistant."},
  {"role": "user", "content": "Question here"},
  {"role": "assistant", "content": "Answer here"}
]}`,
    },
    {
      title: "Fine-tune với OpenAI",
      description:
        "Quy trình: 1) Upload training file (JSONL format), 2) Create fine-tuning job với base model (gpt-3.5-turbo), 3) Wait for completion (có thể mất vài giờ), 4) Use fine-tuned model. Hyperparameters: n_epochs (3-5), learning_rate (auto hoặc custom).",
      example: `// 1. Upload file
const file = await openai.files.create({
  file: fs.createReadStream('training_data.jsonl'),
  purpose: 'fine-tune',
});

// 2. Create fine-tuning job
const fineTune = await openai.fineTuning.jobs.create({
  training_file: file.id,
  model: 'gpt-3.5-turbo',
  hyperparameters: {
    n_epochs: 3,
  },
});

// 3. Use fine-tuned model
const response = await openai.chat.completions.create({
  model: fineTune.fine_tuned_model,
  messages: [{ role: 'user', content: 'Test query' }],
});`,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        {concepts.map((concept, index) => (
          <div key={index}>
            <div className="border border-gray-200 rounded-lg p-6 bg-white hover:border-gray-300 transition-colors">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Title level={4} style={{ marginBottom: 0 }}>
                      {concept.title}
                    </Title>
                    <Tag
                      color={
                        index === 0
                          ? "blue"
                          : index === 1
                          ? "green"
                          : "orange"
                      }
                    >
                      {index === 0
                        ? "Decision"
                        : index === 1
                        ? "Preparation"
                        : "Implementation"}
                    </Tag>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {concept.description}
                  </p>
                </div>

                {concept.shouldUse && (
                  <div>
                    <Title level={5}>Nên Fine-tune khi:</Title>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {concept.shouldUse.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {concept.shouldNotUse && (
                  <div>
                    <Title level={5}>Không nên Fine-tune khi:</Title>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {concept.shouldNotUse.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {concept.format && (
                  <div>
                    <Title level={5}>Format:</Title>
                    <div className="bg-gray-50 p-3 rounded border border-gray-100">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                        {concept.format}
                      </pre>
                    </div>
                  </div>
                )}

                {concept.example && (
                  <div>
                    <Title level={5}>Ví dụ:</Title>
                    <div className="bg-gray-50 p-3 rounded border border-gray-100">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                        {concept.example}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          Evaluation
        </Title>
        <Paragraph className="text-gray-700 leading-relaxed">
          Sau khi fine-tune, cần evaluate model performance trên test set. So sánh với base model để đảm bảo fine-tuned model tốt hơn. Metrics: accuracy, F1 score, hoặc custom metrics phù hợp với task.
        </Paragraph>
        <div className="bg-gray-50 p-4 rounded border border-gray-100 my-4">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
            {`async function evaluateFineTunedModel(
  model: string,
  testSet: Example[]
): Promise<number> {
  let correct = 0;
  
  for (const example of testSet) {
    const response = await openai.chat.completions.create({
      model,
      messages: example.messages.slice(0, -1),
    });
    
    const predicted = response.choices[0].message.content;
    const expected = example.messages.at(-1).content;
    
    if (predicted === expected) correct++;
  }
  
  return correct / testSet.length;
}`}
          </pre>
        </div>
      </div>

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          Design Patterns
        </Title>
        <div className="space-y-4">
          <div>
            <Title level={4} className="mb-2">
              Template Method Pattern
            </Title>
            <Paragraph className="text-gray-700 leading-relaxed">
              Define training pipeline skeleton: prepare dataset → validate → upload → train → evaluate. Mỗi step có thể customize nhưng flow chung giữ nguyên.
            </Paragraph>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Strategy Pattern
            </Title>
            <Paragraph className="text-gray-700 leading-relaxed">
              Different training strategies: full fine-tuning, LoRA, QLoRA. Strategy được chọn dựa trên requirements (cost, quality, speed).
            </Paragraph>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Factory Pattern
            </Title>
            <Paragraph className="text-gray-700 leading-relaxed">
              Create model instances dựa trên task type. Factory chọn base model và hyperparameters phù hợp cho từng task.
            </Paragraph>
          </div>
        </div>
      </div>

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          Best Practices
        </Title>
        <div className="space-y-4">
          <div>
            <Title level={4} className="mb-2">
              Dataset Quality
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Diversity:</strong> Dataset phải cover nhiều scenarios và edge cases
              </li>
              <li>
                <strong>Quality over quantity:</strong> 50 examples chất lượng tốt hơn 500 examples kém chất lượng
              </li>
              <li>
                <strong>Consistency:</strong> Format và style phải nhất quán trong toàn bộ dataset
              </li>
            </ul>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Cost Optimization
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Start small:</strong> Fine-tune với subset nhỏ trước, evaluate, rồi mới scale up
              </li>
              <li>
                <strong>Monitor tokens:</strong> Giảm token count mỗi example để giảm cost
              </li>
              <li>
                <strong>Use LoRA:</strong> LoRA (Low-Rank Adaptation) giảm cost và thời gian training
              </li>
            </ul>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Evaluation
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Hold-out test set:</strong> Giữ 20% dataset làm test set, không dùng để train
              </li>
              <li>
                <strong>Compare với base model:</strong> Fine-tuned model phải tốt hơn base model
              </li>
              <li>
                <strong>Monitor overfitting:</strong> Nếu validation loss tăng trong khi training loss giảm, model đang overfit
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Alert
        description="Fine-tuning là powerful technique nhưng tốn kém và mất thời gian. Chỉ dùng khi prompt engineering và RAG không đủ. Luôn evaluate kỹ trước khi deploy vào production."
        type="info"
        showIcon
        className="mb-4"
      />
    </div>
  );
}




