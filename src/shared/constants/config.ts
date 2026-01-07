/**
 * App Configuration Constants
 */

export const ENV = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  PRODUCTION: 'production',
} as const;

export type Environment = typeof ENV[keyof typeof ENV];

// Get environment from process.env or default to development
export const CURRENT_ENV: Environment =
  (process.env.NODE_ENV as Environment) || ENV.DEVELOPMENT;

// API Base URLs
export const API_BASE_URLS = {
  [ENV.DEVELOPMENT]: 'https://paperx.safewayrssi.com',
  [ENV.STAGING]: 'https://paperx.safewayrssi.com',
  [ENV.PRODUCTION]: 'https://paperx.safewayrssi.com',
} as const;

// WebSocket URLs
export const WS_BASE_URLS = {
  [ENV.DEVELOPMENT]: 'ws://localhost:8080/ws',
  [ENV.STAGING]: 'wss://staging-api.paperx.com/ws',
  [ENV.PRODUCTION]: 'wss://api.paperx.com/ws',
} as const;

export const API_BASE_URL = API_BASE_URLS[CURRENT_ENV];
export const WS_BASE_URL = WS_BASE_URLS[CURRENT_ENV];

// API Timeouts
export const API_TIMEOUT = 30000; // 30 seconds
export const API_UPLOAD_TIMEOUT = 120000; // 2 minutes for file uploads

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  FCM_TOKEN: 'fcm_token',
} as const;

// React Query Defaults
export const QUERY_CONFIG = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (garbage collection time, formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1, // Retry once for network errors (axios interceptor handles most retries)
    },
  },
} as const;

// App Info
export const APP_VERSION = '1.0.0';
export const APP_NAME = 'PaperX';

