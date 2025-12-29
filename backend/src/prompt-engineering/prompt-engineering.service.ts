import { Injectable } from '@nestjs/common';
import { OpenRouterService } from './services/openrouter.service';
import { PromptBuilder, PromptTechnique } from './prompts/prompt-builder';
import { EmailClassificationPrompts } from './prompts/email-classification.prompts';
import { CVExtractionPrompts } from './prompts/cv-extraction.prompts';
import { LogicProblemPrompts } from './prompts/logic-problem.prompts';
import { PromptRequestDto } from './dto/prompt-request.dto';
import { ObservabilityService } from '../observability/observability.service';

/**
 * Prompt Engineering Service
 * Business logic cho prompt engineering
 * Áp dụng Strategy Pattern - chọn prompt strategy dựa trên exercise type
 */
@Injectable()
export class PromptEngineeringService {
  constructor(
    private readonly openRouterService: OpenRouterService,
    private readonly observabilityService: ObservabilityService,
  ) {}

  // llm-fundamentals-prompt-engineering-01
  async testPrompt(dto: PromptRequestDto): Promise<{
    response: string;
    technique: string;
  }> {
    // [BUSINESS] Build prompt dựa trên technique được chọn
    // PromptBuilder sẽ tạo system message và user message phù hợp với technique
    const { systemMessage, userMessage } = PromptBuilder.build({
      technique: dto.technique,
      userInput: dto.userInput,
      role: dto.role,
      examples: dto.examples,
      systemMessage: dto.systemMessage,
    });

    // [FRONTEND] Đo thời gian bắt đầu để tính latency hiển thị cho user
    const startTime = Date.now();
    const fullPrompt = `${systemMessage}\n\n${userMessage}`;

    try {
      // [BUSINESS] Gọi LLM với prompt đã build
      // Sử dụng OpenRouter service để generate completion
      const result =
        await this.openRouterService.generateCompletionWithMetadata(
          [
            { role: 'system', content: systemMessage },
            { role: 'user', content: userMessage },
          ],
          {
            model: dto.model,
            temperature: dto.temperature,
          },
        );

      // [FRONTEND] Tính latency để hiển thị cho user biết thời gian xử lý
      const latency = Date.now() - startTime;

      // [BUSINESS] Log LLM call để observability (không ảnh hưởng đến response)
      await this.observabilityService.logLLMCallFromResponse(
        {
          model: result.model,
          provider: 'openrouter',
          response: result.content,
          prompt: fullPrompt,
          tokens: result.tokens,
        },
        latency,
        {
          endpoint: '/api/v1/prompt-engineering/test-prompt',
        },
      );

      return {
        response: result.content,
        technique: dto.technique,
      };
    } catch (error) {
      // [BUSINESS] Log error để observability
      const latency = Date.now() - startTime;
      await this.observabilityService.logError(
        error instanceof Error ? error : new Error('Unknown error'),
        latency,
        {
          endpoint: '/api/v1/prompt-engineering/test-prompt',
        },
      );
      throw error;
    }
  }

  /**
   * Bài 1: Email Classification
   */
  async classifyEmail(
    email: string,
    technique: PromptTechnique,
  ): Promise<{
    category: string;
    response: string;
    technique: string;
  }> {
    let prompt: { systemMessage: string; userMessage: string };

    switch (technique) {
      case PromptTechnique.ZERO_SHOT:
        prompt = EmailClassificationPrompts.getZeroShotPrompt(email);
        break;
      case PromptTechnique.FEW_SHOT:
        prompt = EmailClassificationPrompts.getFewShotPrompt(email);
        break;
      case PromptTechnique.CHAIN_OF_THOUGHT:
        prompt = EmailClassificationPrompts.getChainOfThoughtPrompt(email);
        break;
      case PromptTechnique.ROLE:
        prompt = EmailClassificationPrompts.getRoleBasedPrompt(email);
        break;
      default:
        prompt = EmailClassificationPrompts.getZeroShotPrompt(email);
    }

    const response = await this.openRouterService.generateCompletion([
      { role: 'system', content: prompt.systemMessage },
      { role: 'user', content: prompt.userMessage },
    ]);

    // Extract category from response (simple parsing)
    const category = this.extractCategory(response);

    return {
      category,
      response,
      technique,
    };
  }

  /**
   * Bài 2: CV Extraction
   */
  async extractCV(
    cvText: string,
    technique: PromptTechnique,
  ): Promise<{
    data: Record<string, any>;
    response: string;
    technique: string;
  }> {
    let prompt: { systemMessage: string; userMessage: string };

    switch (technique) {
      case PromptTechnique.ZERO_SHOT:
        prompt = CVExtractionPrompts.getZeroShotPrompt(cvText);
        break;
      case PromptTechnique.FEW_SHOT:
        prompt = CVExtractionPrompts.getFewShotPrompt(cvText);
        break;
      case PromptTechnique.CHAIN_OF_THOUGHT:
        prompt = CVExtractionPrompts.getChainOfThoughtPrompt(cvText);
        break;
      case PromptTechnique.ROLE:
        prompt = CVExtractionPrompts.getRoleBasedPrompt(cvText);
        break;
      default:
        prompt = CVExtractionPrompts.getZeroShotPrompt(cvText);
    }

    const response = await this.openRouterService.generateCompletion([
      { role: 'system', content: prompt.systemMessage },
      { role: 'user', content: prompt.userMessage },
    ]);

    // Try to parse JSON from response
    const data = this.parseJSONFromResponse(response);

    return {
      data,
      response,
      technique,
    };
  }

  /**
   * Bài 3: Logic Problem Solving
   */
  async solveLogicProblem(
    problem: string,
    technique: PromptTechnique,
  ): Promise<{
    solution: string;
    response: string;
    technique: string;
  }> {
    let prompt: { systemMessage: string; userMessage: string };

    switch (technique) {
      case PromptTechnique.ZERO_SHOT:
        prompt = LogicProblemPrompts.getZeroShotPrompt(problem);
        break;
      case PromptTechnique.FEW_SHOT:
        prompt = LogicProblemPrompts.getFewShotPrompt(problem);
        break;
      case PromptTechnique.CHAIN_OF_THOUGHT:
        prompt = LogicProblemPrompts.getChainOfThoughtPrompt(problem);
        break;
      case PromptTechnique.ROLE:
        prompt = LogicProblemPrompts.getRoleBasedPrompt(problem);
        break;
      default:
        prompt = LogicProblemPrompts.getChainOfThoughtPrompt(problem);
    }

    const response = await this.openRouterService.generateCompletion([
      { role: 'system', content: prompt.systemMessage },
      { role: 'user', content: prompt.userMessage },
    ]);

    return {
      solution: response,
      response,
      technique,
    };
  }

  /**
   * Helper: Extract category from response
   */
  private extractCategory(response: string): string {
    const categories = ['Technical Issue', 'Sales', 'General Inquiry'];
    const lowerResponse = response.toLowerCase();

    for (const category of categories) {
      if (lowerResponse.includes(category.toLowerCase())) {
        return category;
      }
    }

    // Return first line or first word if no match
    return response.split('\n')[0].trim() || 'Unknown';
  }

  /**
   * Helper: Parse JSON from response
   */
  private parseJSONFromResponse(response: string): Record<string, any> {
    try {
      // Try to find JSON in response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Try to parse entire response as JSON
      return JSON.parse(response);
    } catch {
      return {
        raw: response,
        error: 'Could not parse JSON from response',
      };
    }
  }
}
