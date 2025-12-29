export enum EvaluationMetric {
  EXACT_MATCH = 'EXACT_MATCH',
  CONTAINS = 'CONTAINS',
  LLM_AS_JUDGE = 'LLM_AS_JUDGE',
}

export interface TestCase {
  id?: string;
  input: string;
  expected: string;
  actual: string;
  metadata?: Record<string, unknown>;
}

export interface LlmJudgeConfig {
  model?: string;
  temperature?: number;
  rubric?: string;
}

export interface RunEvaluationRequest {
  dataset: TestCase[];
  metric: EvaluationMetric;
  judge?: LlmJudgeConfig;
}

export interface EvaluationResult {
  id?: string;
  input: string;
  expected: string;
  actual: string;
  score: number;
  passed: boolean;
  details?: Record<string, unknown>;
}

export interface EvaluationSummary {
  total: number;
  passed: number;
  failed: number;
  passRate: number;
  avgScore: number;
}

export interface RunEvaluationResponse {
  summary: EvaluationSummary;
  results: EvaluationResult[];
}






