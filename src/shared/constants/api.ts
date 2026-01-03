/**
 * API Endpoint Constants
 * All API endpoints should be defined here
 */

const BASE_PATH = '';

// Authentication Endpoints
export const AUTH_ENDPOINTS = {
  SEND_OTP: `${BASE_PATH}/auth/send-otp`,
  VERIFY_OTP: `${BASE_PATH}/auth/verify-otp`,
  REFRESH_TOKEN: `${BASE_PATH}/auth/refresh-token`,
  LOGOUT: `${BASE_PATH}/auth/logout`,
} as const;

// User Endpoints
export const USER_ENDPOINTS = {
  PROFILE: `${BASE_PATH}/user/profile`,
  UPDATE_PROFILE: `${BASE_PATH}/user/profile`,
  UPLOAD_AVATAR: `${BASE_PATH}/user/avatar`,
} as const;

// Registration Endpoints
export const REGISTRATION_ENDPOINTS = {
  COMPANY_DETAILS: `${BASE_PATH}/registration/company-details`,
  ROLE_SELECTION: `${BASE_PATH}/registration/role-selection`,
  DEALER_REGISTRATION: `${BASE_PATH}/registration/dealer`,
  CONVERTER_REGISTRATION: `${BASE_PATH}/registration/converter`,
  BRAND_REGISTRATION: `${BASE_PATH}/registration/brand`,
  MACHINE_DEALER_REGISTRATION: `${BASE_PATH}/registration/machine-dealer`,
  MILL_REGISTRATION: `${BASE_PATH}/registration/mill`,
  SCRAP_DEALER_REGISTRATION: `${BASE_PATH}/registration/scrap-dealer`,
  UDYAM_UPLOAD: `${BASE_PATH}/registration/udyam`,
  VERIFICATION_STATUS: `${BASE_PATH}/registration/verification-status`,
} as const;

// Posting Endpoints
export const POST_ENDPOINTS = {
  CREATE: `${BASE_PATH}/posts`,
  LIST: `${BASE_PATH}/posts`,
  DETAIL: (id: string) => `${BASE_PATH}/posts/${id}`,
  UPDATE: (id: string) => `${BASE_PATH}/posts/${id}`,
  DELETE: (id: string) => `${BASE_PATH}/posts/${id}`,
  MY_POSTS: `${BASE_PATH}/posts/my-posts`,
} as const;

// Matchmaking Endpoints
export const MATCH_ENDPOINTS = {
  MATCHES: `${BASE_PATH}/matches`,
  MATCH_DETAIL: (id: string) => `${BASE_PATH}/matches/${id}`,
  RESPOND: (id: string) => `${BASE_PATH}/matches/${id}/respond`,
  SELECT_RESPONDERS: (id: string) => `${BASE_PATH}/matches/${id}/select-responders`,
  REPUBLISH: (id: string) => `${BASE_PATH}/matches/${id}/republish`,
  ACTIVE_SESSIONS: `${BASE_PATH}/matches/active-sessions`,
} as const;

// Chat Endpoints
export const CHAT_ENDPOINTS = {
  CONVERSATIONS: `${BASE_PATH}/chat/conversations`,
  MESSAGES: (conversationId: string) => `${BASE_PATH}/chat/conversations/${conversationId}/messages`,
  SEND_MESSAGE: (conversationId: string) => `${BASE_PATH}/chat/conversations/${conversationId}/messages`,
  MARK_READ: (conversationId: string) => `${BASE_PATH}/chat/conversations/${conversationId}/read`,
} as const;

// Notification Endpoints
export const NOTIFICATION_ENDPOINTS = {
  LIST: `${BASE_PATH}/notifications`,
  MARK_READ: (id: string) => `${BASE_PATH}/notifications/${id}/read`,
  MARK_ALL_READ: `${BASE_PATH}/notifications/read-all`,
  UNREAD_COUNT: `${BASE_PATH}/notifications/unread-count`,
} as const;

// Payment Endpoints
export const PAYMENT_ENDPOINTS = {
  CREATE_PAYMENT: `${BASE_PATH}/payments/create`,
  VERIFY_PAYMENT: `${BASE_PATH}/payments/verify`,
  PAYMENT_HISTORY: `${BASE_PATH}/payments/history`,
} as const;

// File Upload Endpoints
export const UPLOAD_ENDPOINTS = {
  SINGLE: `${BASE_PATH}/upload/single`,
  MULTIPLE: `${BASE_PATH}/upload/multiple`,
} as const;

