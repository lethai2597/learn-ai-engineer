import { useMutation } from '@tanstack/react-query';
import { memoryManagementApi } from '@/lib/api/memory-management.api';
import { ChatRequest, ChatResponse } from '@/types/memory-management';

export const useMemoryChat = () => {
  return useMutation<ChatResponse, Error, ChatRequest>({
    mutationFn: memoryManagementApi.chat,
  });
};






