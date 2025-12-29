export interface DetectInjectionRequest {
  text: string;
}

export interface DetectInjectionResponse {
  isInjection: boolean;
  confidence: number;
  matchedPatterns: string[];
  details: string;
}

export interface ModerateContentRequest {
  text: string;
}

export interface ModerateContentResponse {
  flagged: boolean;
  categories: Record<string, boolean>;
  categoryScores: Record<string, number>;
  details: string;
}

export interface DetectPiiRequest {
  text: string;
}

export interface DetectPiiResponse {
  hasPii: boolean;
  detectedEntities: Array<{
    type: string;
    value: string;
    startIndex: number;
    endIndex: number;
  }>;
  details: string;
}

export interface RedactPiiRequest {
  text: string;
}

export interface RedactPiiResponse {
  redactedText: string;
  redactedCount: number;
  details: string;
}

export interface CheckRateLimitRequest {
  identifier: string;
  endpoint?: string;
}

export interface CheckRateLimitResponse {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  limit: number;
}




