import { z } from "zod";

/**
 * Common validation schemas
 * Có thể được sử dụng cho nhiều form khác nhau
 */

// Email validation
export const emailSchema = z.string().email("Email không hợp lệ");

// Password validation
export const passwordSchema = z
  .string()
  .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
  .regex(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ hoa")
  .regex(/[a-z]/, "Mật khẩu phải có ít nhất 1 chữ thường")
  .regex(/[0-9]/, "Mật khẩu phải có ít nhất 1 số");

// Phone number validation (Vietnam format)
export const phoneSchema = z
  .string()
  .regex(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ");

// URL validation
export const urlSchema = z.string().url("URL không hợp lệ");









