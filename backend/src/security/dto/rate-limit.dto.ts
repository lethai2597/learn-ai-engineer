import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CheckRateLimitRequestDto {
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @IsOptional()
  @IsString()
  endpoint?: string;
}

export class CheckRateLimitResponseDto {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  limit: number;
}
