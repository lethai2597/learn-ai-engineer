import { apiClient } from "./client";
import { StreamRequest, StreamResponse } from "@/types/streaming";

/**
 * API functions cho Streaming
 */

/**
 * Response wrapper từ TransformInterceptor
 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export const streamingApi = {
  /**
   * Streaming text response (SSE)
   * Trả về ReadableStream để consume SSE
   */
  streamText: async (
    data: StreamRequest,
    onChunk: (chunk: string) => void,
    onError?: (error: Error) => void,
    abortSignal?: AbortSignal
  ): Promise<void> => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
        }/api/v1/streaming/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          signal: abortSignal,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No reader available");
      }

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);

            if (data === "[DONE]") {
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                onChunk(parsed.content);
              }
              if (parsed.error) {
                onError?.(new Error(parsed.error));
                return;
              }
            } catch (e) {
              // Ignore parse errors for non-JSON data
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        // User cancelled, don't call onError
        return;
      }
      onError?.(error instanceof Error ? error : new Error("Unknown error"));
    }
  },

  /**
   * Non-streaming text response
   */
  nonStreamText: async (data: StreamRequest): Promise<StreamResponse> => {
    const response = await apiClient.post<ApiResponse<StreamResponse>>(
      "/api/v1/streaming/non-stream",
      data
    );
    return response.data.data;
  },
};









