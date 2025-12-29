export interface SimpleChainRequest {
  text: string;
}

export interface SimpleChainResponse {
  translation: string;
  summary: string;
  keywords: string[];
  totalTime: number;
}

export interface RouterRequest {
  input: string;
  temperature?: number;
}

export interface RouterResponse {
  intent: string;
  selectedModel: string;
  reason: string;
  response: string;
  latency: number;
}

export interface ConditionalChainRequest {
  document: string;
}

export interface ConditionalChainResponse {
  detectedLanguage: string;
  wasTranslated: boolean;
  processedDocument: string;
  summary: string;
  entities: string[];
  totalTime: number;
}






