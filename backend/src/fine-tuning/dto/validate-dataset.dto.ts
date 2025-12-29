import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class FineTuneMessageDto {
  @ApiProperty({ description: 'Role: system, user, hoặc assistant' })
  @IsNotEmpty()
  role: 'system' | 'user' | 'assistant';

  @ApiProperty({ description: 'Nội dung message' })
  @IsNotEmpty()
  content: string;
}

export class FineTuneExampleDto {
  @ApiProperty({
    description: 'Array of messages theo format OpenAI',
    type: [FineTuneMessageDto],
  })
  @IsArray()
  @ArrayMinSize(2, { message: 'Mỗi example phải có ít nhất 2 messages' })
  @ValidateNested({ each: true })
  @Type(() => FineTuneMessageDto)
  messages: FineTuneMessageDto[];
}

export class ValidateDatasetDto {
  @ApiProperty({
    description: 'Array of training examples',
    type: [FineTuneExampleDto],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Dataset phải có ít nhất 1 example' })
  @ValidateNested({ each: true })
  @Type(() => FineTuneExampleDto)
  examples: FineTuneExampleDto[];
}

export class ValidateDatasetResponseDto {
  @ApiProperty({ description: 'Dataset có hợp lệ không' })
  isValid: boolean;

  @ApiProperty({ description: 'Số lượng examples' })
  exampleCount: number;

  @ApiProperty({ description: 'Số tokens trung bình mỗi example' })
  avgTokensPerExample: number;

  @ApiProperty({ description: 'Tổng số tokens' })
  totalTokens: number;

  @ApiProperty({ description: 'Các lỗi validation nếu có', required: false })
  errors?: string[];

  @ApiProperty({ description: 'Các cảnh báo', required: false })
  warnings?: string[];
}
