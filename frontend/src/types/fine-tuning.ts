export interface FineTuneMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface FineTuneExample {
  messages: FineTuneMessage[];
}

export interface ValidateDatasetRequest {
  examples: FineTuneExample[];
}

export interface ValidateDatasetResponse {
  isValid: boolean;
  exampleCount: number;
  avgTokensPerExample: number;
  totalTokens: number;
  errors?: string[];
  warnings?: string[];
}

export interface PrepareDatasetRequest {
  examples: FineTuneExample[];
}

export interface PrepareDatasetResponse {
  jsonlContent: string;
  exampleCount: number;
  preview: string[];
}




