import { Injectable } from '@nestjs/common';
import {
  RunEvaluationRequestDto,
  RunEvaluationResponseDto,
  EvaluationMetric,
  EvaluationResultDto,
  EvaluationSummaryDto,
} from './dto/run-evaluation.dto';
import { ExactMatchStrategy } from './strategies/exact-match.strategy';
import { ContainsStrategy } from './strategies/contains.strategy';
import { LlmJudgeStrategy } from './strategies/llm-judge.strategy';
import { IEvaluationStrategy } from './strategies/evaluation-strategy.interface';

@Injectable()
export class EvaluationService {
  constructor(
    private readonly exactMatchStrategy: ExactMatchStrategy,
    private readonly containsStrategy: ContainsStrategy,
    private readonly llmJudgeStrategy: LlmJudgeStrategy,
  ) {}

  // production-evaluation-01
  async runEvaluation(
    request: RunEvaluationRequestDto,
  ): Promise<RunEvaluationResponseDto> {
    // [BUSINESS] Chọn evaluation strategy dựa trên metric
    // Strategy Pattern: Mỗi metric (exact match, contains, LLM-as-judge) có cách đánh giá khác nhau
    const strategy = this.getStrategy(request.metric);

    // [BUSINESS] Evaluate từng test case trong dataset
    // Iterate qua dataset và evaluate từng case với strategy đã chọn
    const results: EvaluationResultDto[] = [];

    for (const testCase of request.dataset) {
      let result: EvaluationResultDto;

      // [BUSINESS] LLM-as-judge cần thêm judge config (model, temperature, rubric)
      // Các metric khác chỉ cần testCase
      if (request.metric === EvaluationMetric.LLM_AS_JUDGE) {
        result = await (strategy as LlmJudgeStrategy).evaluate(
          testCase,
          request.judge,
        );
      } else {
        result = await strategy.evaluate(testCase);
      }

      results.push(result);
    }

    // [BUSINESS] Tính summary từ kết quả: pass rate, avg score, total, passed, failed
    const summary = this.calculateSummary(results);

    return {
      summary,
      results,
    };
  }

  private getStrategy(metric: EvaluationMetric): IEvaluationStrategy {
    switch (metric) {
      case EvaluationMetric.EXACT_MATCH:
        return this.exactMatchStrategy;
      case EvaluationMetric.CONTAINS:
        return this.containsStrategy;
      case EvaluationMetric.LLM_AS_JUDGE:
        return this.llmJudgeStrategy;
      default:
        throw new Error(`Unknown metric: ${String(metric)}`);
    }
  }

  private calculateSummary(
    results: EvaluationResultDto[],
  ): EvaluationSummaryDto {
    const total = results.length;
    const passed = results.filter((r) => r.passed).length;
    const failed = total - passed;
    const passRate = total > 0 ? passed / total : 0;
    const avgScore =
      total > 0 ? results.reduce((sum, r) => sum + r.score, 0) / total : 0;

    return {
      total,
      passed,
      failed,
      passRate,
      avgScore: Math.round(avgScore * 100) / 100,
    };
  }
}
