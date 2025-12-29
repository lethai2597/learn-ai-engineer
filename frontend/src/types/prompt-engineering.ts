/**
 * Types cho Prompt Engineering
 */

export enum PromptTechnique {
  ZERO_SHOT = "zero-shot",
  FEW_SHOT = "few-shot",
  CHAIN_OF_THOUGHT = "chain-of-thought",
  ROLE = "role",
}

export const PromptTechniqueLabels: Record<PromptTechnique, string> = {
  [PromptTechnique.ZERO_SHOT]: "Zero-shot",
  [PromptTechnique.FEW_SHOT]: "Few-shot",
  [PromptTechnique.CHAIN_OF_THOUGHT]: "Chain-of-Thought",
  [PromptTechnique.ROLE]: "Role-based",
};

export const PromptTechniqueDescriptions: Record<PromptTechnique, string> = {
  [PromptTechnique.ZERO_SHOT]: "Hỏi AI trực tiếp không cần ví dụ mẫu",
  [PromptTechnique.FEW_SHOT]: "Đưa 2-5 ví dụ mẫu trước khi hỏi",
  [PromptTechnique.CHAIN_OF_THOUGHT]: 'Bảo AI "hãy suy nghĩ từng bước"',
  [PromptTechnique.ROLE]: 'Gán vai trò cụ thể: "Bạn là chuyên gia..."',
};

export const PromptTextareaRows = {
  [PromptTechnique.ZERO_SHOT]: 2,
  [PromptTechnique.FEW_SHOT]: 8,
  [PromptTechnique.CHAIN_OF_THOUGHT]: 8,
  [PromptTechnique.ROLE]: 4,
};
