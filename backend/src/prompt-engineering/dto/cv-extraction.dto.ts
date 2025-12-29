import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PromptTechnique } from '../prompts/prompt-builder';

export class ExtractCVDto {
  @ApiProperty({
    description: 'Document/note text to extract information from',
    example:
      'Vector Database\n\nVector databases là công nghệ lưu trữ và tìm kiếm dữ liệu dựa trên embeddings. Chúng cho phép semantic search hiệu quả hơn so với traditional keyword search.\n\nNguồn: Learning notes về RAG systems',
  })
  @IsString()
  cvText: string;

  @ApiProperty({
    description: 'Prompt technique to use',
    enum: PromptTechnique,
    example: PromptTechnique.ZERO_SHOT,
  })
  @IsEnum(PromptTechnique)
  technique: PromptTechnique;
}

export class ExtractCVResponseDto {
  @ApiProperty({ description: 'Extracted CV data as JSON' })
  data: Record<string, any>;

  @ApiProperty({ description: 'Full AI response' })
  response: string;

  @ApiProperty({ description: 'Prompt technique used' })
  technique: string;
}
