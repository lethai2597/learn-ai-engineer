import { useMutation } from "@tanstack/react-query";
import { structuredOutputApi } from "@/lib/api/structured-output.api";
import {
  ParsePersonRequest,
  ExtractInvoiceRequest,
  GenericExtractRequest,
} from "@/types/structured-output";

/**
 * React Query hooks cho Structured Output
 */

export const useParsePerson = () => {
  return useMutation({
    mutationFn: (data: ParsePersonRequest) =>
      structuredOutputApi.parsePerson(data),
  });
};

export const useExtractInvoice = () => {
  return useMutation({
    mutationFn: (data: ExtractInvoiceRequest) =>
      structuredOutputApi.extractInvoice(data),
  });
};

export const useGenericExtract = () => {
  return useMutation({
    mutationFn: (data: GenericExtractRequest) =>
      structuredOutputApi.genericExtract(data),
  });
};










