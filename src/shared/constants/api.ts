/**
 * API Endpoint Constants
 * All API endpoints should be defined here
 * Based on Paper X - B2B Matchmaking Platform API Postman Collection
 */

const API_VERSION = '/api/v1';

// Authentication Endpoints
export const AUTH_ENDPOINTS = {
  SEND_OTP: `${API_VERSION}/auth/otp/request`,
  VERIFY_OTP: `${API_VERSION}/auth/otp/verify`,
  REFRESH_TOKEN: `${API_VERSION}/auth/refresh-token`,
  LOGOUT: `${API_VERSION}/auth/logout`,
} as const;

// User Endpoints
export const USER_ENDPOINTS = {
  PROFILE: `${API_VERSION}/user/profile`,
  UPDATE_PROFILE: `${API_VERSION}/user/profile`,
  SWITCH_ROLE: `${API_VERSION}/user/switch-role`,
  UPLOAD_AVATAR: `${API_VERSION}/user/avatar`,
} as const;

// Reference Data Endpoints
export const REFERENCE_ENDPOINTS = {
  // Materials
  MATERIALS: `${API_VERSION}/materials`,
  MATERIAL_DETAILS: (id: number | string) => `${API_VERSION}/materials/${id}/details`,

  // Machines
  MACHINES: `${API_VERSION}/machines`,

  // Material Related
  MATERIAL_FINISHES: `${API_VERSION}/material-finishes`,
  MATERIAL_MILLS: `${API_VERSION}/material-mills`,
  MATERIAL_THICKNESS_TYPES: `${API_VERSION}/material-thickness-types`,

  // Brands (Mills)
  BRANDS: `${API_VERSION}/brands`,
} as const;

// Dealer Endpoints
export const DEALER_ENDPOINTS = {
  // Profile
  COMPLETE_PROFILE: `${API_VERSION}/dealer/profile/complete`,

  // Dashboard
  DASHBOARD: `${API_VERSION}/dealer/dashboard`,

  // Opportunities
  OPPORTUNITIES: `${API_VERSION}/dealer/opportunities`,
  OPPORTUNITY_DETAIL: (id: number | string) => `${API_VERSION}/dealer/opportunity/${id}`,
  ACCEPT_OPPORTUNITY: (id: number | string) => `${API_VERSION}/dealer/opportunity/${id}/accept`,
  DECLINE_OPPORTUNITY: (id: number | string) => `${API_VERSION}/dealer/opportunity/${id}/decline`,

  // Sessions
  SESSION_DETAIL: (id: number | string) => `${API_VERSION}/dealer/session/${id}`,
  SESSION_HISTORY: `${API_VERSION}/dealer/history`,

  // Chat
  CHAT_MESSAGES: (sessionId: number | string) => `${API_VERSION}/dealer/chat/${sessionId}`,
  SEND_MESSAGE: (sessionId: number | string) => `${API_VERSION}/dealer/chat/${sessionId}/message`,

  // Quotation
  SUBMIT_QUOTE: (sessionId: number | string) => `${API_VERSION}/dealer/quote/submit/${sessionId}`,

  // Notifications
  NOTIFICATIONS: `${API_VERSION}/dealer/notifications`,
  MARK_NOTIFICATION_READ: (id: number | string) => `${API_VERSION}/dealer/notification/${id}/read`,
  MARK_ALL_NOTIFICATIONS_READ: `${API_VERSION}/dealer/notifications/read-all`,
} as const;

// Machine Dealer Endpoints
export const MACHINE_DEALER_ENDPOINTS = {
  // Profile
  COMPLETE_PROFILE: `${API_VERSION}/machine-dealer/profile/complete`,

  // Dashboard
  DASHBOARD: `${API_VERSION}/machine-dealer/dashboard`,

  // Machine Listings
  POST_MACHINE: `${API_VERSION}/machine-dealer/machine/post`,
  LISTINGS: `${API_VERSION}/machine-dealer/listings`,
  REQUIREMENTS: `${API_VERSION}/machine-dealer/requirements`,
} as const;

// Converter Endpoints
export const CONVERTER_ENDPOINTS = {
  // Profile
  COMPLETE_PROFILE: `${API_VERSION}/converter/profile/complete`,

  // Dashboard
  DASHBOARD: `${API_VERSION}/converter/dashboard`,
} as const;

// Brand Endpoints
export const BRAND_ENDPOINTS = {
  // Profile
  COMPLETE_PROFILE: `${API_VERSION}/brand/profile/complete`,

  // Dashboard
  DASHBOARD: `${API_VERSION}/brand/dashboard`,
} as const;

// Registration Endpoints (Legacy - keeping for backward compatibility)
export const REGISTRATION_ENDPOINTS = {
  COMPANY_DETAILS: `${API_VERSION}/registration/company-details`,
  ROLE_SELECTION: `${API_VERSION}/registration/role-selection`,
  DEALER_REGISTRATION: `${API_VERSION}/registration/dealer`,
  CONVERTER_REGISTRATION: `${API_VERSION}/registration/converter`,
  BRAND_REGISTRATION: `${API_VERSION}/registration/brand`,
  MACHINE_DEALER_REGISTRATION: `${API_VERSION}/registration/machine-dealer`,
  MILL_REGISTRATION: `${API_VERSION}/registration/mill`,
  SCRAP_DEALER_REGISTRATION: `${API_VERSION}/registration/scrap-dealer`,
  UDYAM_UPLOAD: `${API_VERSION}/registration/udyam`,
  VERIFICATION_STATUS: `${API_VERSION}/registration/verification-status`,
} as const;

// Posting Endpoints
export const POST_ENDPOINTS = {
  CREATE: `${API_VERSION}/posts`,
  LIST: `${API_VERSION}/posts`,
  DETAIL: (id: string) => `${API_VERSION}/posts/${id}`,
  UPDATE: (id: string) => `${API_VERSION}/posts/${id}`,
  DELETE: (id: string) => `${API_VERSION}/posts/${id}`,
  MY_POSTS: `${API_VERSION}/posts/my-posts`,
} as const;

// Matchmaking Endpoints
export const MATCH_ENDPOINTS = {
  MATCHES: `${API_VERSION}/matches`,
  MATCH_DETAIL: (id: string) => `${API_VERSION}/matches/${id}`,
  RESPOND: (id: string) => `${API_VERSION}/matches/${id}/respond`,
  SELECT_RESPONDERS: (id: string) => `${API_VERSION}/matches/${id}/select-responders`,
  REPUBLISH: (id: string) => `${API_VERSION}/matches/${id}/republish`,
  ACTIVE_SESSIONS: `${API_VERSION}/matches/active-sessions`,
} as const;

// Chat Endpoints
export const CHAT_ENDPOINTS = {
  CONVERSATIONS: `${API_VERSION}/chat/conversations`,
  MESSAGES: (conversationId: string) =>
    `${API_VERSION}/chat/conversations/${conversationId}/messages`,
  SEND_MESSAGE: (conversationId: string) =>
    `${API_VERSION}/chat/conversations/${conversationId}/messages`,
  MARK_READ: (conversationId: string) =>
    `${API_VERSION}/chat/conversations/${conversationId}/read`,
} as const;

// Notification Endpoints
export const NOTIFICATION_ENDPOINTS = {
  LIST: `${API_VERSION}/notifications`,
  MARK_READ: (id: string) => `${API_VERSION}/notifications/${id}/read`,
  MARK_ALL_READ: `${API_VERSION}/notifications/read-all`,
  UNREAD_COUNT: `${API_VERSION}/notifications/unread-count`,
} as const;

// Payment Endpoints
export const PAYMENT_ENDPOINTS = {
  CREATE_PAYMENT: `${API_VERSION}/payments/create`,
  VERIFY_PAYMENT: `${API_VERSION}/payments/verify`,
  PAYMENT_HISTORY: `${API_VERSION}/payments/history`,
} as const;

// File Upload Endpoints
export const UPLOAD_ENDPOINTS = {
  SINGLE: `${API_VERSION}/upload/single`,
  MULTIPLE: `${API_VERSION}/upload/multiple`,
} as const;
