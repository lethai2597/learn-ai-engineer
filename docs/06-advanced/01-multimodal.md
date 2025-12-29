# Multi-modal AI

## Mục tiêu học tập

Xử lý và kết hợp nhiều loại dữ liệu (text, image, audio, video) trong AI applications.

## Nội dung chính

### 1. Vision (Image Input)

#### GPT-4 Vision
```typescript
const response = await openai.chat.completions.create({
  model: 'gpt-4-vision-preview',
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'What is in this image?' },
        {
          type: 'image_url',
          image_url: {
            url: 'https://example.com/chart.png',
            // or base64: 'data:image/png;base64,...'
          },
        },
      ],
    },
  ],
});
```

#### Claude 3.5 Vision
```typescript
const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: 'image/png',
            data: base64Image,
          },
        },
        { type: 'text', text: 'Analyze this chart' },
      ],
    },
  ],
});
```

### 2. Audio Input (Speech-to-Text)

#### Whisper API
```typescript
import fs from 'fs';

const transcription = await openai.audio.transcriptions.create({
  file: fs.createReadStream('meeting.mp3'),
  model: 'whisper-1',
  language: 'vi', // Optional
});

console.log(transcription.text);
```

#### With Timestamps
```typescript
const transcription = await openai.audio.transcriptions.create({
  file: fs.createReadStream('meeting.mp3'),
  model: 'whisper-1',
  response_format: 'verbose_json',
  timestamp_granularities: ['segment'],
});

transcription.segments.forEach(segment => {
  console.log(`[${segment.start}s - ${segment.end}s]: ${segment.text}`);
});
```

### 3. Audio Output (Text-to-Speech)

#### OpenAI TTS
```typescript
const mp3 = await openai.audio.speech.create({
  model: 'tts-1',
  voice: 'alloy', // alloy, echo, fable, onyx, nova, shimmer
  input: 'Hello, this is a test of text to speech.',
});

const buffer = Buffer.from(await mp3.arrayBuffer());
await fs.promises.writeFile('speech.mp3', buffer);
```

#### ElevenLabs (Premium Quality)
```typescript
import ElevenLabs from 'elevenlabs-node';

const voice = new ElevenLabs({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

await voice.textToSpeech({
  voiceId: 'pNInz6obpgDQGcFmaJgB', // Adam voice
  text: 'Hello, this is ElevenLabs.',
  fileName: 'output.mp3',
});
```

### 4. Video Understanding
```typescript
// Extract frames from video
import ffmpeg from 'fluent-ffmpeg';

async function extractFrames(videoPath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const frames: string[] = [];
    ffmpeg(videoPath)
      .on('end', () => resolve(frames))
      .on('error', reject)
      .screenshots({
        count: 10, // Extract 10 frames
        folder: './frames',
        filename: 'frame-%i.png',
      });
  });
}

// Analyze each frame
const frames = await extractFrames('video.mp4');
for (const frame of frames) {
  const analysis = await analyzeImage(frame);
  console.log(analysis);
}
```

### 5. Complete Multi-modal Pipeline
```typescript
async function analyzeMeetingRecording(videoPath: string) {
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
  const summary = await llm.invoke(`
    Transcription: ${transcription}
    Visual context: ${visualContext}
    
    Summarize this meeting in bullet points.
  `);
  
  return summary;
}
```

## Tài nguyên học tập

- [OpenAI Vision Guide](https://platform.openai.com/docs/guides/vision)
- [Whisper Documentation](https://platform.openai.com/docs/guides/speech-to-text)
- [ElevenLabs](https://elevenlabs.io/)

## Bài tập thực hành

1. **Bài 1:** Build image analyzer với GPT-4 Vision
2. **Bài 2:** Build audio transcription service với Whisper
3. **Bài 3:** Build TTS API với voice selection

## Design Patterns áp dụng

- **Adapter Pattern:** Convert different media types
- **Pipeline Pattern:** Multi-step media processing
- **Factory Pattern:** Create processors for different media types

## Checklist hoàn thành

- [ ] Analyze được images với Vision models
- [ ] Transcribe được audio với Whisper
- [ ] Generate được speech với TTS
- [ ] Build được complete multimodal pipeline

