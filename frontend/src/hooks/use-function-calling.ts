import { useMutation } from '@tanstack/react-query';
import { functionCallingApi } from '@/lib/api/function-calling.api';
import {
  CalculatorRequest,
  CalculatorResponse,
  WeatherRequest,
  WeatherResponse,
  AssistantRequest,
  AssistantResponse,
} from '@/types/function-calling';

export const useCalculator = () => {
  return useMutation<CalculatorResponse, Error, CalculatorRequest>({
    mutationFn: functionCallingApi.calculate,
  });
};

export const useWeather = () => {
  return useMutation<WeatherResponse, Error, WeatherRequest>({
    mutationFn: functionCallingApi.getWeather,
  });
};

export const useAssistant = () => {
  return useMutation<AssistantResponse, Error, AssistantRequest>({
    mutationFn: functionCallingApi.assistant,
  });
};






