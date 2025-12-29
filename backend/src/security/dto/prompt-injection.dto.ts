import { IsString, IsNotEmpty } from 'class-validator';

export class DetectInjectionRequestDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class DetectInjectionResponseDto {
  isInjection: boolean;
  confidence: number;
  matchedPatterns: string[];
  details: string;
}
