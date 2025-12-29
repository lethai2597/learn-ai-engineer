import { Tool } from './tool.registry';
import { calculatorTool } from './calculator.tool';
import { weatherTool } from './weather.tool';

export const getCurrentTimeTool: Tool = {
  name: 'getCurrentTime',
  schema: {
    type: 'function',
    function: {
      name: 'getCurrentTime',
      description:
        'Lấy thời gian hiện tại. Sử dụng khi user hỏi về giờ, thời gian hiện tại. Ví dụ: "Bây giờ là mấy giờ?" hoặc "Thời gian hiện tại".',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
  execute: () => {
    const now = new Date();
    return Promise.resolve({
      time: now.toLocaleTimeString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      date: now.toLocaleDateString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      timestamp: now.toISOString(),
    });
  },
};

export const searchWebTool: Tool = {
  name: 'searchWeb',
  schema: {
    type: 'function',
    function: {
      name: 'searchWeb',
      description:
        'Tìm kiếm thông tin trên web. Sử dụng khi user yêu cầu tìm kiếm, tra cứu thông tin. Ví dụ: "Tìm kiếm về AI" hoặc "Tra cứu thông tin về NestJS".',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Từ khóa tìm kiếm',
          },
        },
        required: ['query'],
      },
    },
  },
  execute: (args: { query: string }) => {
    return Promise.resolve({
      query: args.query,
      results: [
        {
          title: `Kết quả tìm kiếm cho "${args.query}"`,
          snippet: `Đây là kết quả mock cho tìm kiếm "${args.query}". Trong production, bạn sẽ tích hợp với Google Search API hoặc Bing Search API.`,
          url: `https://example.com/search?q=${encodeURIComponent(args.query)}`,
        },
      ],
      note: 'Đây là mock data. Trong production, tích hợp với search API thực tế.',
    });
  },
};

export const assistantTools: Tool[] = [
  calculatorTool,
  weatherTool,
  getCurrentTimeTool,
  searchWebTool,
];
