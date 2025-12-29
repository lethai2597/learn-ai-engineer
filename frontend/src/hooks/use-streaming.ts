import { useState, useCallback, useRef } from "react";
import { streamingApi } from "@/lib/api/streaming.api";
import { StreamRequest } from "@/types/streaming";

/**
 * React hooks cho Streaming
 */

export const useStreaming = () => {
  const [text, setText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const startStreaming = useCallback(async (data: StreamRequest) => {
    setText("");
    setError(null);
    setIsStreaming(true);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      await streamingApi.streamText(
        data,
        (chunk) => {
          // Update state immediately for each chunk
          setText((prev) => {
            const newText = prev + chunk;
            // Force immediate update
            return newText;
          });
        },
        (err) => {
          setError(err);
          setIsStreaming(false);
        },
        abortController.signal
      );
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err);
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, []);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    setText("");
    setError(null);
    setIsStreaming(false);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    text,
    isStreaming,
    error,
    startStreaming,
    cancel,
    reset,
  };
};

export const useNonStreaming = () => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchText = useCallback(async (data: StreamRequest) => {
    setText("");
    setError(null);
    setIsLoading(true);

    try {
      const response = await streamingApi.nonStreamText(data);
      setText(response.text);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setText("");
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    text,
    isLoading,
    error,
    fetchText,
    reset,
  };
};










