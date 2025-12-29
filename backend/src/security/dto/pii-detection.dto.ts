import { IsString, IsNotEmpty } from 'class-validator';

export class DetectPiiRequestDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class DetectPiiResponseDto {
  hasPii: boolean;
  detectedEntities: Array<{
    type: string;
    value: string;
    startIndex: number;
    endIndex: number;
  }>;
  details: string;
}

export class RedactPiiRequestDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class RedactPiiResponseDto {
  redactedText: string;
  redactedCount: number;
  details: string;
}
