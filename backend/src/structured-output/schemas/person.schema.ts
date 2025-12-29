import { z } from 'zod';

/**
 * Person Schema
 * Schema để parse thông tin người từ text
 */
export const PersonSchema = z.object({
  name: z.string().describe('Tên đầy đủ của người'),
  age: z.number().int().positive().describe('Tuổi của người'),
  skills: z.array(z.string()).describe('Danh sách kỹ năng'),
  email: z.string().email().optional().describe('Email (nếu có)'),
  bio: z.string().optional().describe('Tiểu sử ngắn (nếu có)'),
});

export type Person = z.infer<typeof PersonSchema>;
