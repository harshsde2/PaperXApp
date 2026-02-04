/**
 * App Configuration Constants
 */

import { Platform } from 'react-native';

export const ENV = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  PRODUCTION: 'production',
} as const;

export type Environment = typeof ENV[keyof typeof ENV];

// Get environment from process.env or default to development
export const CURRENT_ENV: Environment =
  (process.env.NODE_ENV as Environment) || ENV.DEVELOPMENT;

/**
 * DEVELOPMENT API URL CONFIGURATION
 * 
 * For Simulators/Emulators (automatic):
 * - iOS Simulator: uses localhost (same machine) ✅
 * - Android Emulator: uses 10.0.2.2 (special IP that maps to host's localhost) ✅
 * 
 * For Physical Devices:
 * - Set USE_PHYSICAL_DEVICE_IP to true and update PHYSICAL_DEVICE_IP below
 * - Make sure your phone and computer are on the same WiFi network
 * - Find your IP: run `ifconfig | grep "inet " | grep -v 127.0.0.1` on Mac/Linux
 */
const USE_PHYSICAL_DEVICE_IP = true; // Set to true when testing on physical device (same WiFi as Mac)
const PHYSICAL_DEVICE_IP = '192.168.29.149'; // Your Mac's local network IP (run: ipconfig getifaddr en0)

const getDevelopmentApiUrl = (): string => {
  // Override: Use network IP for physical devices
  if (USE_PHYSICAL_DEVICE_IP) {
    return `http://${PHYSICAL_DEVICE_IP}:8000`;
  }

  // Default: Use simulator/emulator URLs
  if (Platform.OS === 'android') {
    // Android Emulator uses 10.0.2.2 to access host machine's localhost
    return 'http://10.0.2.2:8000';
  } else if (Platform.OS === 'ios') {
    // iOS Simulator can use localhost directly
    return 'http://localhost:8000';
  }
  
  // Fallback
  return `http://${PHYSICAL_DEVICE_IP}:8000`;
};

// API Base URLs
export const API_BASE_URLS = {
  [ENV.DEVELOPMENT]: getDevelopmentApiUrl(),
  // [ENV.DEVELOPMENT]: 'https://paperx.safewayrssi.com', // Uncomment to use staging server
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

// ============================================
// DEMO MODE - For Client Presentations
// ============================================
// Set to true to use dummy data instead of real API
// This allows demonstrating the full user flow without backend
export const USE_DUMMY_DATA = true; // Toggle this for demo mode