import { PromptBuilder, PromptTechnique } from './prompt-builder';

/**
 * Document Classification Prompts
 * Bài tập 1: Phân loại tài liệu/ghi chú trong kho tri thức thành Technical Note / Meeting Summary / Learning Material / Reference
 */

export class EmailClassificationPrompts {
  static getZeroShotPrompt(email: string): {
    systemMessage: string;
    userMessage: string;
  } {
    return PromptBuilder.build({
      technique: PromptTechnique.ZERO_SHOT,
      userInput: `Classify the following document/note from knowledge base into one of these categories: Technical Note, Meeting Summary, Learning Material, or Reference.\n\nDocument:\n${email}\n\nRespond with only the category name.`,
      systemMessage:
        'You are a document classification assistant for personal knowledge base. Classify documents and notes accurately into the specified categories.',
    });
  }

  static getFewShotPrompt(email: string): {
    systemMessage: string;
    userMessage: string;
  } {
    return PromptBuilder.build({
      technique: PromptTechnique.FEW_SHOT,
      userInput: `Classify the following document/note:\n\n${email}`,
      examples: [
        {
          input:
            'Ghi chú về meeting với team về architecture design của hệ thống RAG. Đã thảo luận về vector database, chunking strategy, và embedding models.',
          output: 'Meeting Summary',
        },
        {
          input:
            'Vector databases là công nghệ lưu trữ và tìm kiếm dữ liệu dựa trên embeddings. Chúng cho phép semantic search hiệu quả hơn so với traditional keyword search.',
          output: 'Learning Material',
        },
        {
          input:
            'Best practices cho prompt engineering: 1) Be specific, 2) Use examples, 3) Break down complex tasks, 4) Iterate and test.',
          output: 'Technical Note',
        },
        {
          input:
            'LangChain documentation: https://python.langchain.com/docs/get_started/introduction',
          output: 'Reference',
        },
      ],
      systemMessage:
        'You are a document classification assistant for personal knowledge base. Follow the examples to classify documents and notes accurately.',
    });
  }

  static getChainOfThoughtPrompt(email: string): {
    systemMessage: string;
    userMessage: string;
  } {
    return PromptBuilder.build({
      technique: PromptTechnique.CHAIN_OF_THOUGHT,
      userInput: `Classify the following document/note from knowledge base into one of these categories: Technical Note, Meeting Summary, Learning Material, or Reference.\n\nDocument:\n${email}\n\nThink step by step:\n1. Analyze the document content\n2. Identify key indicators (meeting notes, technical details, learning content, reference links)\n3. Determine the category\n4. Provide your final classification`,
      systemMessage:
        'You are a document classification assistant for personal knowledge base. Explain your reasoning step by step before providing the classification.',
    });
  }

  static getRoleBasedPrompt(email: string): {
    systemMessage: string;
    userMessage: string;
  } {
    return PromptBuilder.build({
      technique: PromptTechnique.ROLE,
      userInput: `Classify the following document/note from knowledge base:\n\n${email}\n\nCategories: Technical Note, Meeting Summary, Learning Material, Reference`,
      role: 'knowledge base organization expert',
      systemMessage:
        'You have years of experience organizing and classifying documents in personal knowledge bases. Provide accurate classifications.',
    });
  }
}
