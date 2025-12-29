import { Tool } from './tool.registry';

export const calculatorTool: Tool = {
  name: 'calculate',
  schema: {
    type: 'function',
    function: {
      name: 'calculate',
      description:
        'Thực hiện phép tính toán học. Hỗ trợ cộng (+), trừ (-), nhân (*), chia (/). Ví dụ: "Tính 15 + 27" hoặc "Nhân 8 với 9".',
      parameters: {
        type: 'object',
        properties: {
          operation: {
            type: 'string',
            enum: ['add', 'subtract', 'multiply', 'divide'],
            description:
              'Loại phép tính: "add" cho cộng, "subtract" cho trừ, "multiply" cho nhân, "divide" cho chia',
          },
          a: {
            type: 'number',
            description: 'Số thứ nhất',
          },
          b: {
            type: 'number',
            description: 'Số thứ hai',
          },
        },
        required: ['operation', 'a', 'b'],
      },
    },
  },
  execute: async (args: { operation: string; a: number; b: number }) => {
    const { operation, a, b } = args;

    switch (operation) {
      case 'add':
        return { result: a + b, expression: `${a} + ${b} = ${a + b}` };
      case 'subtract':
        return { result: a - b, expression: `${a} - ${b} = ${a - b}` };
      case 'multiply':
        return { result: a * b, expression: `${a} × ${b} = ${a * b}` };
      case 'divide':
        if (b === 0) {
          throw new Error('Không thể chia cho 0');
        }
        return { result: a / b, expression: `${a} ÷ ${b} = ${a / b}` };
      default:
        throw new Error(`Operation không hợp lệ: ${operation}`);
    }
  },
};
