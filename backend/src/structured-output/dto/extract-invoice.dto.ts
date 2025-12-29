import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ExtractionMethod } from './parse-person.dto';

export class ExtractInvoiceDto {
  @ApiProperty({
    description: 'Text containing document/meeting notes information',
    example:
      'Meeting Notes - Architecture Design\nDate: 2024-01-15\nTopic: RAG System Architecture\n\nKey Points:\n- Vector DB: ChromaDB\n- Embedding Model: OpenAI text-embedding-3-small\n- Chunking Strategy: Recursive with 500 tokens\n\nAction Items:\n- Setup ChromaDB instance\n- Implement chunking service',
  })
  @IsString()
  invoiceText: string;

  @ApiProperty({
    description: 'Extraction method to use',
    enum: ExtractionMethod,
    example: ExtractionMethod.JSON_MODE,
  })
  @IsEnum(ExtractionMethod)
  method: ExtractionMethod;
}

export class ExtractInvoiceResponseDto {
  @ApiProperty({ description: 'Parsed invoice data' })
  data: {
    invoiceNumber: string;
    date: string;
    customerName: string;
    items: Array<{
      description: string;
      quantity: number;
      price: number;
    }>;
    total: number;
    tax?: number;
    subtotal?: number;
  };

  @ApiProperty({ description: 'Raw response from LLM' })
  rawResponse: string;

  @ApiProperty({ description: 'Extraction method used' })
  method: string;
}
