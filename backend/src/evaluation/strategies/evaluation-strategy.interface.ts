import { TestCaseDto, EvaluationResultDto } from '../dto/run-evaluation.dto';

export interface IEvaluationStrategy {
  evaluate(testCase: TestCaseDto): Promise<EvaluationResultDto>;
}
