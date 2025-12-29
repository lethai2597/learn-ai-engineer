import { useMutation } from '@tanstack/react-query';
import { securityApi } from '@/lib/api/security.api';
import {
  DetectInjectionRequest,
  ModerateContentRequest,
  DetectPiiRequest,
  RedactPiiRequest,
  CheckRateLimitRequest,
} from '@/types/security';

export const useDetectInjection = () => {
  return useMutation({
    mutationFn: (data: DetectInjectionRequest) =>
      securityApi.detectInjection(data),
  });
};

export const useModerateContent = () => {
  return useMutation({
    mutationFn: (data: ModerateContentRequest) =>
      securityApi.moderateContent(data),
  });
};

export const useDetectPii = () => {
  return useMutation({
    mutationFn: (data: DetectPiiRequest) => securityApi.detectPii(data),
  });
};

export const useRedactPii = () => {
  return useMutation({
    mutationFn: (data: RedactPiiRequest) => securityApi.redactPii(data),
  });
};

export const useCheckRateLimit = () => {
  return useMutation({
    mutationFn: (data: CheckRateLimitRequest) =>
      securityApi.checkRateLimit(data),
  });
};




