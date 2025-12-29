import { Injectable, BadRequestException } from '@nestjs/common';
import {
  ValidateDatasetDto,
  ValidateDatasetResponseDto,
} from './dto/validate-dataset.dto';
import {
  PrepareDatasetDto,
  PrepareDatasetResponseDto,
} from './dto/prepare-dataset.dto';

@Injectable()
export class FineTuningService {
  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  // advanced-fine-tuning-01
  validateDataset(dto: ValidateDatasetDto): ValidateDatasetResponseDto {
    // [BUSINESS] Validate fine-tuning dataset: Kiểm tra format, số lượng, và chất lượng examples
    const { examples } = dto;
    const errors: string[] = [];
    const warnings: string[] = [];

    // [BUSINESS] Kiểm tra số lượng examples (tối thiểu 10, khuyến nghị 50-100)
    if (examples.length < 10) {
      errors.push('Dataset phải có ít nhất 10 examples (khuyến nghị: 50-100)');
    } else if (examples.length < 50) {
      warnings.push(
        'Dataset có ít hơn 50 examples. Khuyến nghị ít nhất 50-100 examples để có kết quả tốt.',
      );
    }

    // [BUSINESS] Tính toán tokens cho từng example để estimate cost
    let totalTokens = 0;
    const tokenCounts: number[] = [];

    for (let i = 0; i < examples.length; i++) {
      const example = examples[i];
      const exampleText = JSON.stringify(example);
      const tokens = this.estimateTokens(exampleText);
      tokenCounts.push(tokens);
      totalTokens += tokens;

      // [BUSINESS] Validate structure: Phải có ít nhất user + assistant message
      if (example.messages.length < 2) {
        errors.push(
          `Example ${i + 1}: Phải có ít nhất 2 messages (user + assistant)`,
        );
      }

      const hasUser = example.messages.some((m) => m.role === 'user');
      const hasAssistant = example.messages.some((m) => m.role === 'assistant');

      if (!hasUser) {
        errors.push(`Example ${i + 1}: Thiếu message với role 'user'`);
      }

      if (!hasAssistant) {
        errors.push(`Example ${i + 1}: Thiếu message với role 'assistant'`);
      }

      // [BUSINESS] Validate token limits (max 4096 tokens per example)
      if (tokens > 4096) {
        errors.push(
          `Example ${i + 1}: Quá dài (${tokens} tokens). Giới hạn: 4096 tokens.`,
        );
      }

      if (tokens > 2048) {
        warnings.push(
          `Example ${i + 1}: Khá dài (${tokens} tokens). Cân nhắc rút gọn.`,
        );
      }

      // [BUSINESS] Validate message content không được rỗng
      example.messages.forEach((msg, msgIdx) => {
        if (!msg.content || msg.content.trim().length === 0) {
          errors.push(
            `Example ${i + 1}, Message ${msgIdx + 1}: Content không được để trống`,
          );
        }
      });
    }

    // [BUSINESS] Tính average tokens để đưa ra recommendations
    const avgTokens = totalTokens / examples.length;

    if (avgTokens > 2000) {
      warnings.push(
        `Trung bình ${Math.round(avgTokens)} tokens/example. Cân nhắc giảm độ dài để tối ưu cost.`,
      );
    }

    const isValid = errors.length === 0;

    return {
      isValid,
      exampleCount: examples.length,
      avgTokensPerExample: Math.round(avgTokens),
      totalTokens,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  // advanced-fine-tuning-02
  prepareDataset(dto: PrepareDatasetDto): Promise<PrepareDatasetResponseDto> {
    // [BUSINESS] Validate dataset trước khi prepare
    const validation = this.validateDataset(dto);

    if (!validation.isValid) {
      throw new BadRequestException({
        message: 'Dataset không hợp lệ',
        errors: validation.errors,
      });
    }

    // [BUSINESS] Convert dataset sang JSONL format (mỗi dòng là một JSON object)
    // JSONL format: Required cho fine-tuning APIs (OpenAI, Anthropic, etc.)
    const jsonlLines: string[] = [];

    for (const example of dto.examples) {
      // [BUSINESS] Mỗi dòng JSONL chứa messages array
      const jsonlLine = JSON.stringify({ messages: example.messages });
      jsonlLines.push(jsonlLine);
    }

    // [BUSINESS] Join tất cả lines với newline để tạo JSONL content
    const jsonlContent = jsonlLines.join('\n');
    // [FRONTEND] Preview 2 dòng đầu để user xem format
    const preview = jsonlLines.slice(0, 2);

    return Promise.resolve({
      jsonlContent,
      exampleCount: dto.examples.length,
      preview,
    });
  }
}
