/**
 * App Configuration Constants
 */

import { NativeModules, Platform } from 'react-native';

export const ENV = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  PRODUCTION: 'production',
} as const;

export type Environment = typeof ENV[keyof typeof ENV];

/**
 * Release builds (__DEV__ false) use staging/production URLs from API_BASE_URLS,
 * not Metro-derived localhost/LAN. In dev, NODE_ENV is usually "development".
 */
export const CURRENT_ENV: Environment = __DEV__
  ? ((process.env.NODE_ENV as Environment) || ENV.DEVELOPMENT)
  : ((process.env.NODE_ENV as Environment) || ENV.PRODUCTION);

/**
 * DEVELOPMENT API URL CONFIGURATION
 *
 * Auto-detect host IP from Metro's scriptURL in dev mode.
 * This avoids hardcoding a Wi-Fi IP that can change frequently.
 *
 * Optional manual override:
 * - Set DEV_API_HOST to your machine's LAN IP (e.g. 10.0.0.5) when needed
 * - Keep it empty to use automatic detection
 */
const DEV_API_HOST = '';

const getMetroHost = (): string | null => {
  const scriptURL = (NativeModules as { SourceCode?: { scriptURL?: string } })?.SourceCode?.scriptURL;
  if (!scriptURL) return null;

  const match = scriptURL.match(/^https?:\/\/([^/:]+):\d+/);
  return match?.[1] || null;
};

const getDevelopmentApiUrl = (): string => {
  // Manual override for special networking setups
  if (DEV_API_HOST.trim()) {
    return `http://${DEV_API_HOST.trim()}:8000`;
  }

  // Auto-detect host from Metro bundler URL in development
  const metroHost = getMetroHost();
  if (metroHost) {
    // Android emulator uses 10.0.2.2 instead of localhost
    if (Platform.OS === 'android' && (metroHost === 'localhost' || metroHost === '127.0.0.1')) {
      return 'http://10.0.2.2:8000';
    }
    return `http://${metroHost}:8000`;
  }

  // Fallback when Metro host is unavailable
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000';
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:8000';
  }

  return 'http://localhost:8000';
};

/**
 * Hosted API (HTTPS). Used for staging and release builds.
 * Change this when the production API domain changes.
 */
const SERVER_API_BASE_URL = 'https://paperx.safewayrssi.com';

// API Base URLs
export const API_BASE_URLS = {
  [ENV.DEVELOPMENT]: getDevelopmentApiUrl(),
  // [ENV.DEVELOPMENT]: SERVER_API_BASE_URL, // Uncomment to point dev at the server
  [ENV.STAGING]: SERVER_API_BASE_URL,
  [ENV.PRODUCTION]: SERVER_API_BASE_URL,
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
  THEME_PALETTE: 'theme_palette',
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

// ============================================
// DEMO MODE - For Client Presentations
// ============================================
// Set to true to use dummy data instead of real API
// This allows demonstrating the full user flow without backend
export const USE_DUMMY_DATA = false;