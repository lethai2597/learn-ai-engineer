import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

export class AnalyzeCostRequestDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxTokens?: number;
}

export class AnalyzeCostResponseDto {
  inputTokens: number;
  estimatedOutputTokens: number;
  estimatedCost: number;
  recommendations: string[];
}

export class ModelPricingResponseDto {
  [model: string]: {
    input: number;
    output: number;
  };
}
