import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class AnalyzeImageDto {
  @ApiProperty({
    description: 'Image URL hoặc base64 data URL',
    example: 'https://example.com/image.png',
  })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty({
    description: 'Prompt để phân tích image',
    example: 'What is in this image? Describe in detail.',
    required: false,
  })
  @IsString()
  @IsOptional()
  prompt?: string;
}

export class AnalyzeImageResponseDto {
  @ApiProperty({
    description: 'Kết quả phân tích từ Vision model',
  })
  analysis: string;

  @ApiProperty({
    description: 'Model được sử dụng',
  })
  model: string;

  @ApiProperty({
    description: 'Metadata về tokens',
  })
  tokens: {
    input: number;
    output: number;
    total: number;
  };
}
