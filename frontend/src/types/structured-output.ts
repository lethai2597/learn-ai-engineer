/**
 * Types cho Structured Output
 */

export type ExtractionMethod = "json-mode" | "function-calling";

export interface ParsePersonRequest {
  text: string;
  method: ExtractionMethod;
}

export interface ParsePersonResponse {
  data: {
    name: string;
    age: number;
    skills: string[];
    email?: string;
    bio?: string;
  };
  rawResponse: string;
  method: string;
}

export interface ExtractInvoiceRequest {
  invoiceText: string;
  method: ExtractionMethod;
}

export interface ExtractInvoiceResponse {
  data: {
    invoiceNumber: string;
    date: string;
    customerName: string;
    items: Array<{
      description: string;
      quantity: number;
      price: number;
    }>;
    total: number;
    tax?: number;
    subtotal?: number;
  };
  rawResponse: string;
  method: string;
}

export interface GenericExtractRequest {
  text: string;
  schema: string;
  method: ExtractionMethod;
}

export interface GenericExtractResponse {
  data: Record<string, unknown>;
  rawResponse: string;
  method: string;
  errors?: string[];
}









