import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { FineTuneExampleDto } from './validate-dataset.dto';

export class PrepareDatasetDto {
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

export class PrepareDatasetResponseDto {
  @ApiProperty({ description: 'JSONL format string để upload lên OpenAI' })
  jsonlContent: string;

  @ApiProperty({ description: 'Số lượng examples' })
  exampleCount: number;

  @ApiProperty({ description: 'Preview 2 dòng đầu tiên' })
  preview: string[];
}
