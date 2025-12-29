/**
 * Prompt Builder
 * Factory Pattern để tạo prompts theo các kỹ thuật khác nhau
 * Template Method Pattern - các template methods cho từng technique
 */

export enum PromptTechnique {
  ZERO_SHOT = 'zero-shot',
  FEW_SHOT = 'few-shot',
  CHAIN_OF_THOUGHT = 'chain-of-thought',
  ROLE = 'role',
}

export interface PromptOptions {
  technique: PromptTechnique;
  userInput: string;
  role?: string;
  examples?: Array<{ input: string; output: string }>;
  systemMessage?: string;
}

/**
 * Prompt Builder Class
 * Áp dụng Factory Pattern và Template Method Pattern
 */
export class PromptBuilder {
  /**
   * Build prompt dựa trên technique được chọn
   * Strategy Pattern - chọn strategy dựa trên technique
   */
  static build(options: PromptOptions): {
    systemMessage: string;
    userMessage: string;
  } {
    switch (options.technique) {
      case PromptTechnique.ZERO_SHOT:
        return this.buildZeroShot(options);
      case PromptTechnique.FEW_SHOT:
        return this.buildFewShot(options);
      case PromptTechnique.CHAIN_OF_THOUGHT:
        return this.buildChainOfThought(options);
      case PromptTechnique.ROLE:
        return this.buildRoleBased(options);
      default:
        return this.buildZeroShot(options);
    }
  }

  /**
   * Zero-shot: Direct prompt không có examples
   */
  private static buildZeroShot(options: PromptOptions): {
    systemMessage: string;
    userMessage: string;
  } {
    return {
      systemMessage: options.systemMessage || 'You are a helpful AI assistant.',
      userMessage: options.userInput,
    };
  }

  /**
   * Few-shot: Prompt với 2-5 examples
   */
  private static buildFewShot(options: PromptOptions): {
    systemMessage: string;
    userMessage: string;
  } {
    if (!options.examples || options.examples.length === 0) {
      return this.buildZeroShot(options);
    }

    let examplesText = 'Here are some examples:\n\n';
    options.examples.forEach((example, index) => {
      examplesText += `Example ${index + 1}:\n`;
      examplesText += `Input: ${example.input}\n`;
      examplesText += `Output: ${example.output}\n\n`;
    });

    const userMessage = `${examplesText}Now, please process the following input:\n\n${options.userInput}`;

    return {
      systemMessage:
        options.systemMessage ||
        'You are a helpful AI assistant that follows examples provided.',
      userMessage,
    };
  }

  /**
   * Chain-of-Thought: Prompt với "hãy suy nghĩ từng bước"
   */
  private static buildChainOfThought(options: PromptOptions): {
    systemMessage: string;
    userMessage: string;
  } {
    const userMessage = `Please solve this step by step, showing your reasoning process:\n\n${options.userInput}\n\nThink through this problem carefully, step by step.`;

    return {
      systemMessage:
        options.systemMessage ||
        'You are a helpful AI assistant that explains your reasoning step by step.',
      userMessage,
    };
  }

  /**
   * Role: Prompt với role assignment
   */
  private static buildRoleBased(options: PromptOptions): {
    systemMessage: string;
    userMessage: string;
  } {
    const role = options.role || 'expert';
    const systemMessage = `You are a ${role}. ${options.systemMessage || 'Provide expert-level responses based on your expertise.'}`;

    return {
      systemMessage,
      userMessage: options.userInput,
    };
  }
}
