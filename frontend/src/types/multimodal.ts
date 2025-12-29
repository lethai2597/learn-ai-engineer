export interface AnalyzeImageRequest {
  imageUrl: string;
  prompt?: string;
}

export interface AnalyzeImageResponse {
  analysis: string;
  model: string;
  tokens: {
    input: number;
    output: number;
    total: number;
  };
}




