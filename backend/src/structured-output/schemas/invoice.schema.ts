import { z } from 'zod';

/**
 * Invoice Item Schema
 */
export const InvoiceItemSchema = z.object({
  description: z.string().describe('Mô tả sản phẩm/dịch vụ'),
  quantity: z.number().positive().describe('Số lượng'),
  price: z.number().positive().describe('Giá đơn vị'),
});

/**
 * Invoice Schema
 * Schema để trích xuất thông tin hóa đơn từ text
 */
export const InvoiceSchema = z.object({
  invoiceNumber: z.string().describe('Số hóa đơn'),
  date: z.string().describe('Ngày hóa đơn (format: YYYY-MM-DD hoặc text)'),
  customerName: z.string().describe('Tên khách hàng'),
  items: z.array(InvoiceItemSchema).describe('Danh sách sản phẩm/dịch vụ'),
  total: z.number().positive().describe('Tổng tiền'),
  tax: z.number().optional().describe('Thuế (nếu có)'),
  subtotal: z.number().optional().describe('Tổng trước thuế (nếu có)'),
});

export type Invoice = z.infer<typeof InvoiceSchema>;
export type InvoiceItem = z.infer<typeof InvoiceItemSchema>;
