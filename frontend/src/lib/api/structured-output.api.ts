import { apiClient } from "./client";
import {
  ParsePersonRequest,
  ParsePersonResponse,
  ExtractInvoiceRequest,
  ExtractInvoiceResponse,
  GenericExtractRequest,
  GenericExtractResponse,
} from "@/types/structured-output";

/**
 * API functions cho Structured Output
 */

/**
 * Response wrapper từ TransformInterceptor
 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export const structuredOutputApi = {
  /**
   * Bài 1: Parse Person
   */
  parsePerson: async (
    data: ParsePersonRequest
  ): Promise<ParsePersonResponse> => {
    const response = await apiClient.post<ApiResponse<ParsePersonResponse>>(
      "/api/v1/structured-output/parse-person",
      data
    );
    return response.data.data;
  },

  /**
   * Bài 2: Extract Invoice
   */
  extractInvoice: async (
    data: ExtractInvoiceRequest
  ): Promise<ExtractInvoiceResponse> => {
    const response = await apiClient.post<ApiResponse<ExtractInvoiceResponse>>(
      "/api/v1/structured-output/extract-invoice",
      data
    );
    return response.data.data;
  },

  /**
   * Bài 3: Generic Extraction
   */
  genericExtract: async (
    data: GenericExtractRequest
  ): Promise<GenericExtractResponse> => {
    const response = await apiClient.post<ApiResponse<GenericExtractResponse>>(
      "/api/v1/structured-output/extract",
      data
    );
    return response.data.data;
  },
};









