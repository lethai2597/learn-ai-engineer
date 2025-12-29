import { QueryClient } from "@tanstack/react-query";

/**
 * React Query Client configuration
 * Áp dụng Singleton Pattern để đảm bảo chỉ có một instance
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: Data được coi là fresh trong 5 phút
      staleTime: 5 * 60 * 1000,
      // Cache time: Data được giữ trong cache 10 phút sau khi không còn component nào sử dụng
      gcTime: 10 * 60 * 1000,
      // Retry: Retry 3 lần với exponential backoff
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus: Tự động refetch khi user quay lại tab
      refetchOnWindowFocus: true,
      // Refetch on reconnect: Tự động refetch khi mạng reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry mutations 1 lần
      retry: 1,
    },
  },
});









