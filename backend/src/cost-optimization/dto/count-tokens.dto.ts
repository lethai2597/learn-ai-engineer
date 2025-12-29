import { IsString, IsNotEmpty } from 'class-validator';

export class CountTokensRequestDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsNotEmpty()
  model: string;
}

export class CountTokensResponseDto {
  tokenCount: number;
  estimatedCost: number;
}
