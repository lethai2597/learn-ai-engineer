import OpenAI from 'openai';

export interface ReActStep {
  thought?: string;
  action?: {
    functionName: string;
    arguments: Record<string, any>;
  };
  observation?: any;
}

export interface ReActState {
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
  steps: ReActStep[];
  iterations: number;
  maxIterations: number;
}
