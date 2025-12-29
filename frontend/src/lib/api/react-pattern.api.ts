import axios from 'axios';
import {
  ReactCalculatorRequest,
  ReactCalculatorResponse,
  ReactResearchRequest,
  ReactResearchResponse,
} from '@/types/react-pattern';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const reactPatternApi = {
  calculator: async (
    data: ReactCalculatorRequest,
  ): Promise<ReactCalculatorResponse> => {
    const response = await axios.post<ApiResponse<ReactCalculatorResponse>>(
      `${baseURL}/api/v1/react-pattern/calculator`,
      data,
      {
        timeout: 60000,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data.data;
  },

  research: async (
    data: ReactResearchRequest,
  ): Promise<ReactResearchResponse> => {
    const response = await axios.post<ApiResponse<ReactResearchResponse>>(
      `${baseURL}/api/v1/react-pattern/research`,
      data,
      {
        timeout: 60000,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data.data;
  },
};

