import { Injectable } from '@nestjs/common';
import {
  TestCaseDto,
  EvaluationResultDto,
  LlmJudgeConfigDto,
} from '../dto/run-evaluation.dto';
import { IEvaluationStrategy } from './evaluation-strategy.interface';
import { OpenRouterService } from '../../prompt-engineering/services/openrouter.service';

@Injectable()
export class LlmJudgeStrategy implements IEvaluationStrategy {
  constructor(private readonly openRouterService: OpenRouterService) {}

  async evaluate(
    testCase: TestCaseDto,
    config?: LlmJudgeConfigDto,
  ): Promise<EvaluationResultDto> {
    const rubric =
      config?.rubric ||
      'Rate based on: Accuracy (40%), Completeness (30%), Clarity (30%). Score from 1-10.';

    const prompt = `Rate the quality of this answer on a scale of 1-10:

Question: ${testCase.input}
Expected: ${testCase.expected}
Actual: ${testCase.actual}

Rubric: ${rubric}

Respond with ONLY a number from 1-10, no other text.`;

    try {
      const response = await this.openRouterService.generateCompletion(
        [
          {
            role: 'system',
            content:
              'You are an expert evaluator. Rate answers strictly based on the rubric.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        {
          model: config?.model || 'openai/gpt-4o',
          temperature: config?.temperature ?? 0.3,
          maxTokens: 10,
        },
      );

      const scoreText = response.trim().replace(/[^0-9]/g, '');
      const score = Math.min(10, Math.max(1, parseInt(scoreText, 10) || 5));
      const passed = score >= 7;

      return {
        id: testCase.id,
        input: testCase.input,
        expected: testCase.expected,
        actual: testCase.actual,
        score,
        passed,
        details: {
          judgeResponse: response.trim(),
          rubric,
          threshold: 7,
        },
      };
    } catch (error) {
      return {
        id: testCase.id,
        input: testCase.input,
        expected: testCase.expected,
        actual: testCase.actual,
        score: 0,
        passed: false,
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }
}
