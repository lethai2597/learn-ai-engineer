import { Injectable } from '@nestjs/common';
import { TestCaseDto, EvaluationResultDto } from '../dto/run-evaluation.dto';
import { IEvaluationStrategy } from './evaluation-strategy.interface';

@Injectable()
export class ExactMatchStrategy implements IEvaluationStrategy {
  evaluate(testCase: TestCaseDto): Promise<EvaluationResultDto> {
    const normalizedExpected = testCase.expected.trim().toLowerCase();
    const normalizedActual = testCase.actual.trim().toLowerCase();
    const passed = normalizedExpected === normalizedActual;
    const score = passed ? 1 : 0;

    return Promise.resolve({
      id: testCase.id,
      input: testCase.input,
      expected: testCase.expected,
      actual: testCase.actual,
      score,
      passed,
      details: {
        normalizedExpected,
        normalizedActual,
        match: passed,
      },
    });
  }
}
