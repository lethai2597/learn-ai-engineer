import { IsString, IsNotEmpty } from 'class-validator';

export class ModerateContentRequestDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class ModerateContentResponseDto {
  flagged: boolean;
  categories: Record<string, boolean>;
  categoryScores: Record<string, number>;
  details: string;
}
