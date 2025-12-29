import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SimpleChainRequestDto {
  @ApiProperty({
    description: 'Input text để xử lý qua chain',
    example:
      'Vector databases là công nghệ lưu trữ và tìm kiếm dữ liệu dựa trên embeddings. Chúng cho phép semantic search hiệu quả hơn so với traditional keyword search. Một số vector DB phổ biến: ChromaDB, Pinecone, Weaviate.',
  })
  @IsString()
  text: string;
}

export class SimpleChainResponseDto {
  @ApiProperty({ description: 'Kết quả dịch sang tiếng Việt' })
  translation: string;

  @ApiProperty({ description: 'Tóm tắt của bản dịch' })
  summary: string;

  @ApiProperty({ description: 'Keywords được extract từ summary' })
  keywords: string[];

  @ApiProperty({ description: 'Tổng thời gian xử lý (ms)' })
  totalTime: number;
}
