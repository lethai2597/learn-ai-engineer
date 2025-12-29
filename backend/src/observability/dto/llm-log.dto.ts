import { IsString, IsNumber, IsOptional, IsObject } from 'class-validator';

export class CreateLLMLogDto {
  @IsString()
  model: string;

  @IsString()
  provider: string;

  @IsString()
  prompt: string;

  @IsString()
  response: string;

  @IsObject()
  tokens: {
    input: number;
    output: number;
    total: number;
  };

  @IsNumber()
  cost: number;

  @IsNumber()
  latency: number;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsOptional()
  @IsString()
  endpoint?: string;

  @IsOptional()
  @IsString()
  error?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class QueryLogsDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}
