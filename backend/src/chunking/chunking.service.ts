import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { assertNever } from '../common/utils/assert-never';
import {
  ChunkTextRequestDto,
  ChunkTextResponseDto,
  ChunkResultDto,
  ChunkingStrategy,
} from './dto/chunking.dto';

@Injectable()
export class ChunkingService {
  // rag-chunking-01
  async chunkText(dto: ChunkTextRequestDto): Promise<ChunkTextResponseDto> {
    // [FRONTEND] Đo thời gian bắt đầu để tính latency hiển thị cho user
    const startTime = Date.now();

    try {
      const chunks = await this.buildChunks(dto);

      // [FRONTEND] Tính latency để hiển thị cho user biết thời gian xử lý
      const latency = Date.now() - startTime;

      return {
        chunks,
        totalChunks: chunks.length,
        strategy: dto.strategy,
        latency,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Failed to chunk text: ${errorMessage}`,
          error: 'Chunking error',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async buildChunks(
    dto: ChunkTextRequestDto,
  ): Promise<ChunkResultDto[]> {
    switch (dto.strategy) {
      case ChunkingStrategy.FIXED_SIZE:
        return this.fixedSizeChunking(
          dto.text,
          dto.chunkSize,
          dto.chunkOverlap || 0,
        );
      case ChunkingStrategy.RECURSIVE:
        return this.recursiveChunkingWithLangChain(
          dto.text,
          dto.chunkSize,
          dto.chunkOverlap || Math.floor(dto.chunkSize * 0.1),
        );
      case ChunkingStrategy.SEMANTIC:
        return this.semanticChunking(dto.text, dto.chunkSize);
      case ChunkingStrategy.SENTENCE:
        return this.sentenceChunking(dto.text, dto.chunkSize);
      default:
        return assertNever(dto.strategy);
    }
  }

  // [BUSINESS] Fixed-size chunking: Cắt text thành các chunks có kích thước cố định
  // Đơn giản nhất, cắt theo số ký tự với overlap để giữ context
  private fixedSizeChunking(
    text: string,
    size: number,
    overlap: number,
  ): ChunkResultDto[] {
    const chunks: ChunkResultDto[] = [];
    let index = 0;

    // [BUSINESS] Cắt text với step = size - overlap để tạo overlap giữa các chunks
    for (let i = 0; i < text.length; i += size - overlap) {
      const chunk = text.slice(i, i + size);
      if (chunk.trim().length > 0) {
        chunks.push({
          content: chunk,
          index: index++,
          size: chunk.length,
        });
      }
    }

    return chunks;
  }

  // [BUSINESS] Recursive chunking: Cắt theo ranh giới tự nhiên với thứ tự ưu tiên
  // Sử dụng LangChain RecursiveCharacterTextSplitter
  // Thứ tự ưu tiên: paragraph (\n\n) > sentence (\n) > sentence end (. ! ?) > word > character
  private async recursiveChunkingWithLangChain(
    text: string,
    chunkSize: number,
    overlap: number,
  ): Promise<ChunkResultDto[]> {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize,
      chunkOverlap: overlap,
      separators: ['\n\n', '\n', '. ', '! ', '? ', ' ', ''],
    });

    const documents = await splitter.createDocuments([text]);
    const chunks: ChunkResultDto[] = documents.map((doc, index) => ({
      content: doc.pageContent,
      index,
      size: doc.pageContent.length,
    }));

    return chunks;
  }

  // [BUSINESS] Semantic chunking: Cắt theo đơn vị ngữ nghĩa (paragraph)
  // Giữ nguyên paragraph, chỉ cắt khi vượt quá maxSize
  // Giúp giữ nguyên ý nghĩa của từng đoạn văn
  private semanticChunking(text: string, maxSize: number): ChunkResultDto[] {
    const paragraphs = text.split('\n\n').filter((p) => p.trim().length > 0);
    const chunks: ChunkResultDto[] = [];
    let index = 0;
    let currentChunk = '';

    // [BUSINESS] Gộp các paragraph lại, chỉ cắt khi vượt quá maxSize
    for (const para of paragraphs) {
      if (currentChunk.length + para.length + 2 > maxSize && currentChunk) {
        chunks.push({
          content: currentChunk.trim(),
          index: index++,
          size: currentChunk.trim().length,
        });
        currentChunk = para;
      } else {
        currentChunk += (currentChunk ? '\n\n' : '') + para;
      }
    }

    if (currentChunk.trim().length > 0) {
      chunks.push({
        content: currentChunk.trim(),
        index: index,
        size: currentChunk.trim().length,
      });
    }

    return chunks;
  }

  // [BUSINESS] Sentence chunking: Cắt theo câu
  // Giữ nguyên câu, chỉ cắt khi vượt quá maxSize
  // Giúp giữ nguyên cấu trúc câu văn
  private sentenceChunking(text: string, maxSize: number): ChunkResultDto[] {
    // [BUSINESS] Tách text thành các câu dựa trên dấu chấm, chấm hỏi, chấm than
    const sentences = text
      .split(/([.!?]+\s+)/)
      .filter((s) => s.trim().length > 0);
    const chunks: ChunkResultDto[] = [];
    let index = 0;
    let currentChunk = '';

    // [BUSINESS] Gộp các câu lại, chỉ cắt khi vượt quá maxSize
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];

      if (currentChunk.length + sentence.length > maxSize && currentChunk) {
        chunks.push({
          content: currentChunk.trim(),
          index: index++,
          size: currentChunk.trim().length,
        });
        currentChunk = sentence;
      } else {
        currentChunk += sentence;
      }
    }

    if (currentChunk.trim().length > 0) {
      chunks.push({
        content: currentChunk.trim(),
        index: index,
        size: currentChunk.trim().length,
      });
    }

    return chunks;
  }
}
