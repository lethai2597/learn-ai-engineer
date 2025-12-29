import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ExtractionMethod } from './parse-person.dto';

export class GenericExtractDto {
  @ApiProperty({
    description: 'Text to extract information from',
    example:
      'Title: Vector Database\nCategory: Technology\nKey Points: Semantic search, embeddings, similarity\nTags: database, AI, search\nSource: Learning notes',
  })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'Zod schema definition as string',
    example:
      'z.object({ title: z.string(), category: z.string(), key_points: z.array(z.string()), tags: z.array(z.string()) })',
  })
  @IsString()
  schema: string;

  @ApiProperty({
    description: 'Extraction method to use',
    enum: ExtractionMethod,
    example: ExtractionMethod.JSON_MODE,
  })
  @IsEnum(ExtractionMethod)
  method: ExtractionMethod;
}

export class GenericExtractResponseDto {
  @ApiProperty({ description: 'Parsed data according to schema' })
  data: Record<string, unknown>;

  @ApiProperty({ description: 'Raw response from LLM' })
  rawResponse: string;

  @ApiProperty({ description: 'Extraction method used' })
  method: string;

  @ApiProperty({ description: 'Validation errors if any', required: false })
  errors?: string[];
}
