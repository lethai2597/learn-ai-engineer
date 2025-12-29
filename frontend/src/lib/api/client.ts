import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

/**
 * Axios instance factory với interceptors
 * Áp dụng Factory Pattern để tạo reusable axios instance
 */
export const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor: Thêm auth token, logging
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Thêm auth token nếu có
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Log request trong development
      if (process.env.NODE_ENV === "development") {
        console.log(
          `[API Request] ${config.method?.toUpperCase()} ${config.url}`
        );
      }

      return config;
    },
    (error: AxiosError) => {
      console.error("[API Request Error]", error);
      return Promise.reject(error);
    }
  );

  // Response interceptor: Error handling, logging
  client.interceptors.response.use(
    (response) => {
      // Log response trong development
      if (process.env.NODE_ENV === "development") {
        console.log(
          `[API Response] ${response.config.method?.toUpperCase()} ${
            response.config.url
          }`,
          response.data
        );
      }
      return response;
    },
    (error: AxiosError) => {
      // Centralized error handling
      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;

        switch (status) {
          case 401:
            // Unauthorized - clear token và redirect to login
            if (typeof window !== "undefined") {
              localStorage.removeItem("token");
              // Có thể redirect đến login page ở đây
            }
            break;
          case 403:
            console.error("[API Error] Forbidden:", data);
            break;
          case 404:
            console.error("[API Error] Not Found:", data);
            break;
          case 500:
            console.error("[API Error] Server Error:", data);
            break;
          default:
            console.error(`[API Error] ${status}:`, data);
        }
      } else if (error.request) {
        // Request was made but no response received
        console.error("[API Error] No response received:", error.request);
      } else {
        // Something happened in setting up the request
        console.error("[API Error] Request setup error:", error.message);
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// Singleton instance
export const apiClient = createApiClient();









