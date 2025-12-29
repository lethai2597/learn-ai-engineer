import { useMutation } from '@tanstack/react-query';
import { chainsRoutingApi } from '@/lib/api/chains-routing.api';
import {
  SimpleChainRequest,
  SimpleChainResponse,
  RouterRequest,
  RouterResponse,
  ConditionalChainRequest,
  ConditionalChainResponse,
} from '@/types/chains-routing';

export const useSimpleChain = () => {
  return useMutation<SimpleChainResponse, Error, SimpleChainRequest>({
    mutationFn: chainsRoutingApi.simpleChain,
  });
};

export const useRouter = () => {
  return useMutation<RouterResponse, Error, RouterRequest>({
    mutationFn: chainsRoutingApi.routeRequest,
  });
};

export const useConditionalChain = () => {
  return useMutation<ConditionalChainResponse, Error, ConditionalChainRequest>(
    {
      mutationFn: chainsRoutingApi.processDocument,
    },
  );
};






