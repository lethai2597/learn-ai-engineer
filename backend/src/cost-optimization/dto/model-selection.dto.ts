import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class SelectModelRequestDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsString()
  @IsIn(['simple', 'medium', 'complex'])
  taskType: 'simple' | 'medium' | 'complex';
}

export class SelectModelResponseDto {
  recommendedModel: string;
  reason: string;
  estimatedCost: number;
}
