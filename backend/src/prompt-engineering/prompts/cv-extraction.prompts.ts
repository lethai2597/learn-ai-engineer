import { PromptBuilder, PromptTechnique } from './prompt-builder';

/**
 * Document/Note Extraction Prompts
 * Bài tập 2: Trích xuất thông tin từ tài liệu/ghi chú trong kho tri thức thành JSON
 */

export class CVExtractionPrompts {
  static getZeroShotPrompt(cvText: string): {
    systemMessage: string;
    userMessage: string;
  } {
    return PromptBuilder.build({
      technique: PromptTechnique.ZERO_SHOT,
      userInput: `Extract the following information from the document/note text below and return it as a JSON object with these fields: title, category, key_points (array), tags (array), source.\n\nDocument Text:\n${cvText}`,
      systemMessage:
        'You are a document parsing assistant for personal knowledge base. Extract structured information from documents and notes and return it as valid JSON.',
    });
  }

  static getFewShotPrompt(cvText: string): {
    systemMessage: string;
    userMessage: string;
  } {
    return PromptBuilder.build({
      technique: PromptTechnique.FEW_SHOT,
      userInput: `Extract information from this document/note:\n\n${cvText}`,
      examples: [
        {
          input:
            'Vector Database\n\nVector databases là công nghệ lưu trữ và tìm kiếm dữ liệu dựa trên embeddings. Chúng cho phép semantic search hiệu quả hơn so với traditional keyword search. Một số vector DB phổ biến: ChromaDB, Pinecone, Weaviate.\n\nNguồn: Learning notes về RAG systems',
          output: JSON.stringify(
            {
              title: 'Vector Database',
              category: 'Learning Material',
              key_points: [
                'Lưu trữ và tìm kiếm dữ liệu dựa trên embeddings',
                'Semantic search hiệu quả hơn keyword search',
                'Các vector DB phổ biến: ChromaDB, Pinecone, Weaviate',
              ],
              tags: ['database', 'AI', 'search', 'RAG'],
              source: 'Learning notes về RAG systems',
            },
            null,
            2,
          ),
        },
      ],
      systemMessage:
        'You are a document parsing assistant for personal knowledge base. Follow the example format to extract information as JSON.',
    });
  }

  static getChainOfThoughtPrompt(cvText: string): {
    systemMessage: string;
    userMessage: string;
  } {
    return PromptBuilder.build({
      technique: PromptTechnique.CHAIN_OF_THOUGHT,
      userInput: `Extract information from this document/note and return as JSON:\n\n${cvText}\n\nThink step by step:\n1. Identify the title/main topic\n2. Determine the category (Technical Note, Meeting Summary, Learning Material, Reference)\n3. Extract key points or main content\n4. Identify relevant tags\n5. Note the source if mentioned\n6. Format as JSON`,
      systemMessage:
        'You are a document parsing assistant for personal knowledge base. Extract information systematically and return as valid JSON.',
    });
  }

  static getRoleBasedPrompt(cvText: string): {
    systemMessage: string;
    userMessage: string;
  } {
    return PromptBuilder.build({
      technique: PromptTechnique.ROLE,
      userInput: `Extract structured information from this document/note from knowledge base:\n\n${cvText}\n\nReturn as JSON with fields: title, category, key_points, tags, source`,
      role: 'knowledge base organization specialist',
      systemMessage:
        'You specialize in extracting structured data from documents and notes in personal knowledge bases. Return accurate JSON format.',
    });
  }
}
