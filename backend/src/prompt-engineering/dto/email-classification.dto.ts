import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PromptTechnique } from '../prompts/prompt-builder';

export class ClassifyEmailDto {
  @ApiProperty({
    description: 'Document/note text to classify',
    example:
      'Ghi chú về meeting với team về architecture design của hệ thống RAG. Đã thảo luận về vector database, chunking strategy, và embedding models.',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Prompt technique to use',
    enum: PromptTechnique,
    example: PromptTechnique.ZERO_SHOT,
  })
  @IsEnum(PromptTechnique)
  technique: PromptTechnique;
}

export class ClassifyEmailResponseDto {
  @ApiProperty({ description: 'Classification result' })
  category: string;

  @ApiProperty({ description: 'Full AI response' })
  response: string;

  @ApiProperty({ description: 'Prompt technique used' })
  technique: string;
}
