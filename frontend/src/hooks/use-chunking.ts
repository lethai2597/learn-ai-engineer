import { useMutation } from '@tanstack/react-query';
import { chunkingApi } from '@/lib/api/chunking.api';
import {
  ChunkTextRequest,
  ChunkTextResponse,
} from '@/types/chunking';

export const useChunkText = () => {
  return useMutation<ChunkTextResponse, Error, ChunkTextRequest>({
    mutationFn: chunkingApi.chunkText,
  });
};







