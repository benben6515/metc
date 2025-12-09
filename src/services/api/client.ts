/**
 * Axios HTTP client with interceptors
 * Includes custom header: interviewerName: "Benben"
 */

import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { logger } from '@/utils/logger';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api-frontend-interview-server.metcfire.com.tw';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'interviewerName': 'Benben',
  },
});

// Request interceptor: Add auth token and log requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    logger.info('API Request', {
      method: config.method?.toUpperCase(),
      url: config.url,
      params: config.params,
    });

    return config;
  },
  (error) => {
    logger.error('API Request Error', error);
    return Promise.reject(error);
  }
);

// Response interceptor: Handle errors and 401 unauthorized
apiClient.interceptors.response.use(
  (response) => {
    logger.info('API Response', {
      status: response.status,
      url: response.config.url,
    });
    return response;
  },
  (error) => {
    if (error.response) {
      logger.error('API Response Error', {
        status: error.response.status,
        url: error.config?.url,
        message: error.response.data?.message || error.message,
      });

      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    } else {
      logger.error('API Network Error', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
