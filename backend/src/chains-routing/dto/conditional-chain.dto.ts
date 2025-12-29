import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConditionalChainRequestDto {
  @ApiProperty({
    description: 'Document text để xử lý',
    example:
      'LangChain is a framework for developing applications powered by language models. It provides abstractions for chains, agents, and memory management.',
  })
  @IsString()
  document: string;
}

export class ConditionalChainResponseDto {
  @ApiProperty({ description: 'Ngôn ngữ được phát hiện' })
  detectedLanguage: string;

  @ApiProperty({ description: 'Có được dịch hay không' })
  wasTranslated: boolean;

  @ApiProperty({ description: 'Document sau khi xử lý (có thể đã dịch)' })
  processedDocument: string;

  @ApiProperty({ description: 'Tóm tắt của document' })
  summary: string;

  @ApiProperty({ description: 'Entities được extract' })
  entities: string[];

  @ApiProperty({ description: 'Tổng thời gian xử lý (ms)' })
  totalTime: number;
}
