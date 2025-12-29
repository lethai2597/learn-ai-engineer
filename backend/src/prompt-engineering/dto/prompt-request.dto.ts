import {
  IsEnum,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PromptTechnique } from '../prompts/prompt-builder';

class ExampleDto {
  @ApiProperty({ description: 'Input example' })
  @IsString()
  input: string;

  @ApiProperty({ description: 'Output example' })
  @IsString()
  output: string;
}

export class PromptRequestDto {
  @ApiProperty({
    description: 'Prompt technique to use',
    enum: PromptTechnique,
    example: PromptTechnique.ZERO_SHOT,
  })
  @IsEnum(PromptTechnique)
  technique: PromptTechnique;

  @ApiProperty({ description: 'User input/prompt text' })
  @IsString()
  userInput: string;

  @ApiPropertyOptional({ description: 'Role for role-based prompting' })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({
    description: 'Examples for few-shot prompting',
    type: [ExampleDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExampleDto)
  examples?: ExampleDto[];

  @ApiPropertyOptional({ description: 'Custom system message' })
  @IsOptional()
  @IsString()
  systemMessage?: string;

  @ApiPropertyOptional({ description: 'Model to use (optional)' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ description: 'Temperature (0-2)', default: 0.7 })
  @IsOptional()
  temperature?: number;
}
