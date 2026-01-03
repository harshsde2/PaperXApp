/**
 * Axios API Client Configuration
 * Centralized HTTP client with interceptors and error handling
 */

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '@shared/constants/config';
import { storageService } from '@services/storage/storageService';
import type { ApiResponse, ApiError } from './types';

/**
 * Create Axios instance
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Request Interceptor
 * - Add auth token to requests
 * - Add request ID for tracking
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    const token = storageService.getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for tracking
    if (config.headers) {
      config.headers['X-Request-ID'] = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Log request in development
    if (__DEV__) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * - Handle common errors
 * - Handle token refresh
 * - Transform response data
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Log response in development
    if (__DEV__) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }

    // Check if response has success field
    if ('success' in response.data) {
      // Standard API response with success flag
      if (response.data.success) {
        return response;
      }
      // Handle API-level errors (success: false in response)
      const apiError: ApiError = response.data as unknown as ApiError;
      return Promise.reject(new Error(apiError.error?.message || 'API request failed'));
    }

    // If no success field but status is 2xx, treat as successful (for APIs without standard wrapper)
    if (response.status >= 200 && response.status < 300) {
      return response;
    }

    // Fallback: reject if we can't determine success
    return Promise.reject(new Error('API request failed'));
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle network errors
    if (!error.response) {
      console.error('[API Network Error]', error.message);
      return Promise.reject(new Error('Network error. Please check your internet connection.'));
    }

    const { status, data } = error.response;

    // Handle 401 Unauthorized - Token expired or invalid
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = storageService.getRefreshToken();
        if (refreshToken) {
          // TODO: Implement token refresh logic
          // const response = await apiClient.post('/auth/refresh-token', { refresh_token: refreshToken });
          // const { token } = response.data.data;
          // storageService.setAuthToken(token);
          // originalRequest.headers.Authorization = `Bearer ${token}`;
          // return apiClient(originalRequest);
        }

        // If refresh fails, clear auth and redirect to login
        storageService.clearAuth();
        // TODO: Dispatch logout action to Redux
        return Promise.reject(new Error('Session expired. Please login again.'));
      } catch (refreshError) {
        storageService.clearAuth();
        // TODO: Dispatch logout action to Redux
        return Promise.reject(new Error('Session expired. Please login again.'));
      }
    }

    // Handle other error status codes
    const errorMessage =
      data?.error?.message || error.message || `Request failed with status ${status}`;

    // Log error details
    if (__DEV__) {
      console.error(`[API Error] ${originalRequest.method?.toUpperCase()} ${originalRequest.url}`, {
        status,
        error: data?.error,
        message: errorMessage,
      });
    }

    return Promise.reject(new Error(errorMessage));
  }
);

/**
 * API Client Methods
 */
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> =>
    apiClient.get<ApiResponse<T>>(url, config),

  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> => apiClient.post<ApiResponse<T>>(url, data, config),

  put: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> => apiClient.put<ApiResponse<T>>(url, data, config),

  patch: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> => apiClient.patch<ApiResponse<T>>(url, data, config),

  delete: <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> => apiClient.delete<ApiResponse<T>>(url, config),
};

export default apiClient;

