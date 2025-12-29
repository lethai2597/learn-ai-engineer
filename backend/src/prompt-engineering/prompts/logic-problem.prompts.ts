import { PromptBuilder, PromptTechnique } from './prompt-builder';

/**
 * Logic Problem Prompts
 * Bài tập 3: Giải bài toán logic bằng Chain-of-Thought
 */

export class LogicProblemPrompts {
  static getZeroShotPrompt(problem: string): {
    systemMessage: string;
    userMessage: string;
  } {
    return PromptBuilder.build({
      technique: PromptTechnique.ZERO_SHOT,
      userInput: `Solve this logic problem:\n\n${problem}`,
      systemMessage:
        'You are a logic problem solving assistant. Solve problems accurately and clearly.',
    });
  }

  static getFewShotPrompt(problem: string): {
    systemMessage: string;
    userMessage: string;
  } {
    return PromptBuilder.build({
      technique: PromptTechnique.FEW_SHOT,
      userInput: `Solve this logic problem:\n\n${problem}`,
      examples: [
        {
          input:
            'If all roses are flowers, and some flowers are red, can we conclude that some roses are red?',
          output:
            'No, we cannot conclude that. While all roses are flowers, and some flowers are red, the red flowers might not be roses. They could be other types of flowers like tulips or poppies.',
        },
      ],
      systemMessage:
        'You are a logic problem solving assistant. Follow the reasoning style shown in examples.',
    });
  }

  static getChainOfThoughtPrompt(problem: string): {
    systemMessage: string;
    userMessage: string;
  } {
    return PromptBuilder.build({
      technique: PromptTechnique.CHAIN_OF_THOUGHT,
      userInput: `Solve this logic problem step by step:\n\n${problem}\n\nThink through:\n1. Understand what is given\n2. Identify what needs to be determined\n3. Apply logical reasoning step by step\n4. Verify your conclusion`,
      systemMessage:
        'You are a logic problem solving assistant. Break down problems into steps and show your reasoning clearly.',
    });
  }

  static getRoleBasedPrompt(problem: string): {
    systemMessage: string;
    userMessage: string;
  } {
    return PromptBuilder.build({
      technique: PromptTechnique.ROLE,
      userInput: `Solve this logic problem:\n\n${problem}`,
      role: 'mathematics and logic professor',
      systemMessage:
        'You are an expert in mathematical logic and reasoning. Solve problems with rigorous logical analysis.',
    });
  }
}
