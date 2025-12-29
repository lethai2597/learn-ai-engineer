"use client";

import { Typography, Divider, Alert, Tag } from "antd";

const { Title, Paragraph } = Typography;

export function LearningSection() {
  const concepts = [
    {
      title: "Vision (Image Input)",
      description:
        "Vision models có thể phân tích và hiểu nội dung trong images. GPT-4 Vision và Claude 3.5 Vision hỗ trợ image input cùng với text prompt. Bạn có thể dùng image URL hoặc base64 encoded image.",
      useCases: [
        "Analyze charts, graphs, diagrams",
        "Describe images in detail",
        "Extract text from images (OCR)",
        "Object detection và classification",
      ],
      example: `// GPT-4 Vision
const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'What is in this image?' },
        {
          type: 'image_url',
          image_url: {
            url: 'https://example.com/image.png',
          },
        },
      ],
    },
  ],
});`,
    },
    {
      title: "Audio Input (Speech-to-Text)",
      description:
        "Whisper API có thể transcribe audio thành text với độ chính xác cao. Hỗ trợ nhiều ngôn ngữ và có thể trả về timestamps cho từng segment.",
      useCases: [
        "Transcribe meetings, interviews",
        "Voice commands processing",
        "Audio content indexing",
        "Real-time transcription",
      ],
      example: `// Whisper API
const transcription = await openai.audio.transcriptions.create({
  file: fs.createReadStream('audio.mp3'),
  model: 'whisper-1',
  language: 'vi',
  response_format: 'verbose_json',
  timestamp_granularities: ['segment'],
});

// Output với timestamps
transcription.segments.forEach(segment => {
  console.log(\`[\${segment.start}s - \${segment.end}s]: \${segment.text}\`);
});`,
    },
    {
      title: "Audio Output (Text-to-Speech)",
      description:
        "TTS APIs có thể generate speech từ text với nhiều voices khác nhau. OpenAI TTS và ElevenLabs là các options phổ biến.",
      useCases: [
        "Voice assistants",
        "Audiobook generation",
        "Accessibility features",
        "Multilingual content",
      ],
      example: `// OpenAI TTS
const mp3 = await openai.audio.speech.create({
  model: 'tts-1',
  voice: 'alloy', // alloy, echo, fable, onyx, nova, shimmer
  input: 'Hello, this is a test.',
});

const buffer = Buffer.from(await mp3.arrayBuffer());
await fs.promises.writeFile('speech.mp3', buffer);`,
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
                        ? "Vision"
                        : index === 1
                        ? "Audio Input"
                        : "Audio Output"}
                    </Tag>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {concept.description}
                  </p>
                </div>

                <div>
                  <Title level={5}>Use Cases:</Title>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {concept.useCases.map((useCase, idx) => (
                      <li key={idx}>{useCase}</li>
                    ))}
                  </ul>
                </div>

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
          Complete Multimodal Pipeline
        </Title>
        <Paragraph className="text-gray-700 leading-relaxed">
          Kết hợp nhiều modal để xây dựng pipeline phức tạp. Ví dụ: extract audio từ video, transcribe với Whisper, extract frames, analyze với Vision, và combine kết quả.
        </Paragraph>
        <div className="bg-gray-50 p-4 rounded border border-gray-100 my-4">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
            {`async function analyzeMeetingRecording(videoPath: string) {
  // 1. Extract audio
  const audioPath = await extractAudio(videoPath);
  
  // 2. Transcribe with Whisper
  const transcription = await whisper.transcribe(audioPath);
  
  // 3. Extract key frames
  const frames = await extractFrames(videoPath);
  
  // 4. Analyze frames with Vision
  const visualContext = await Promise.all(
    frames.map(frame => gpt4Vision.analyze(frame))
  );
  
  // 5. Combine and summarize
  const summary = await llm.invoke(\`
    Transcription: \${transcription}
    Visual context: \${visualContext}
    
    Summarize this meeting in bullet points.
  \`);
  
  return summary;
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
              Adapter Pattern
            </Title>
            <Paragraph className="text-gray-700 leading-relaxed">
              Convert different media types (image URL → base64, audio file → stream) để chuẩn hóa input format cho models.
            </Paragraph>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Pipeline Pattern
            </Title>
            <Paragraph className="text-gray-700 leading-relaxed">
              Multi-step media processing: extract → transform → analyze → combine. Mỗi step xử lý một aspect của media.
            </Paragraph>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Factory Pattern
            </Title>
            <Paragraph className="text-gray-700 leading-relaxed">
              Create processors cho different media types. Factory chọn processor phù hợp dựa trên media type (image, audio, video).
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
              Image Processing
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Image size:</strong> Resize images lớn trước khi gửi để giảm cost và latency
              </li>
              <li>
                <strong>Format:</strong> Hỗ trợ PNG, JPEG, WebP. Base64 encoding cho local images.
              </li>
              <li>
                <strong>Prompt:</strong> Be specific về những gì bạn muốn analyze (objects, text, layout, etc.)
              </li>
            </ul>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Audio Processing
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>File size:</strong> Whisper có limit 25MB. Compress audio nếu cần.
              </li>
              <li>
                <strong>Language detection:</strong> Specify language nếu biết để tăng accuracy.
              </li>
              <li>
                <strong>Timestamps:</strong> Dùng verbose_json format để có timestamps cho segments.
              </li>
            </ul>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Cost Optimization
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Vision:</strong> GPT-4 Vision đắt hơn text-only models. Chỉ dùng khi thực sự cần.
              </li>
              <li>
                <strong>Audio:</strong> Whisper pricing theo duration. Optimize audio length khi có thể.
              </li>
              <li>
                <strong>Caching:</strong> Cache kết quả analysis cho images/audio không đổi.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Alert
        description="Multimodal AI mở ra nhiều use cases mới: document analysis, video understanding, voice assistants. Tuy nhiên, cost và latency cao hơn text-only models. Chỉ dùng khi thực sự cần multimodal capabilities."
        type="info"
        showIcon
        className="mb-4"
      />
    </div>
  );
}




