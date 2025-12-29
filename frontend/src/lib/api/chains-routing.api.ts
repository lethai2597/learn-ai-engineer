import { apiClient } from './client';
import {
  SimpleChainRequest,
  SimpleChainResponse,
  RouterRequest,
  RouterResponse,
  ConditionalChainRequest,
  ConditionalChainResponse,
} from '@/types/chains-routing';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export const chainsRoutingApi = {
  simpleChain: async (
    data: SimpleChainRequest,
  ): Promise<SimpleChainResponse> => {
    const response = await apiClient.post<ApiResponse<SimpleChainResponse>>(
      '/api/v1/chains-routing/simple-chain',
      data,
    );
    return response.data.data;
  },

  routeRequest: async (data: RouterRequest): Promise<RouterResponse> => {
    const response = await apiClient.post<ApiResponse<RouterResponse>>(
      '/api/v1/chains-routing/router',
      data,
    );
    return response.data.data;
  },

  processDocument: async (
    data: ConditionalChainRequest,
  ): Promise<ConditionalChainResponse> => {
    const response = await apiClient.post<
      ApiResponse<ConditionalChainResponse>
    >('/api/v1/chains-routing/conditional-chain', data);
    return response.data.data;
  },
};






