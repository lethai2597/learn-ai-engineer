import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CheckCacheRequestDto {
  @IsString()
  @IsNotEmpty()
  query: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  threshold?: number;
}

export class CheckCacheResponseDto {
  cached: boolean;
  response?: string;
  similarity?: number;
}

export class StoreCacheRequestDto {
  @IsString()
  @IsNotEmpty()
  query: string;

  @IsString()
  @IsNotEmpty()
  response: string;
}

export class StoreCacheResponseDto {
  success: boolean;
}

export class CacheStatsResponseDto {
  totalEntries: number;
  hitRate: number;
  savings: number;
}
