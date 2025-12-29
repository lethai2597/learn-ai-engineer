import { Tool } from './tool.registry';

const mockWeatherData: Record<
  string,
  { temperature: number; condition: string; humidity: number }
> = {
  'hà nội': { temperature: 28, condition: 'Nắng', humidity: 65 },
  hanoi: { temperature: 28, condition: 'Nắng', humidity: 65 },
  'tp.hcm': { temperature: 32, condition: 'Mưa rào', humidity: 80 },
  'ho chi minh': { temperature: 32, condition: 'Mưa rào', humidity: 80 },
  'sài gòn': { temperature: 32, condition: 'Mưa rào', humidity: 80 },
  'đà nẵng': { temperature: 30, condition: 'Nhiều mây', humidity: 70 },
  'da nang': { temperature: 30, condition: 'Nhiều mây', humidity: 70 },
};

export const weatherTool: Tool = {
  name: 'getWeather',
  schema: {
    type: 'function',
    function: {
      name: 'getWeather',
      description:
        'Lấy thông tin thời tiết của một thành phố. Sử dụng khi user hỏi về thời tiết, nhiệt độ, điều kiện thời tiết. Ví dụ: "Thời tiết ở Hà Nội như thế nào?" hoặc "Nhiệt độ ở TP.HCM".',
      parameters: {
        type: 'object',
        properties: {
          city: {
            type: 'string',
            description:
              'Tên thành phố. Hỗ trợ: Hà Nội, TP.HCM, Đà Nẵng và các tên tiếng Anh tương ứng',
          },
        },
        required: ['city'],
      },
    },
  },
  execute: async (args: { city: string }) => {
    const city = args.city.toLowerCase().trim();
    const weather = mockWeatherData[city];

    if (!weather) {
      return {
        city: args.city,
        error: 'Không tìm thấy dữ liệu thời tiết cho thành phố này',
        availableCities: Object.keys(mockWeatherData),
      };
    }

    return {
      city: args.city,
      temperature: weather.temperature,
      condition: weather.condition,
      humidity: weather.humidity,
      unit: '°C',
    };
  },
};
