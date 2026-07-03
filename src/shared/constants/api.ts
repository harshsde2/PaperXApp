/**
 * API Endpoint Constants
 * All API endpoints should be defined here
 * Based on Paper X - B2B Matchmaking Platform API Postman Collection
 */

const API_VERSION = '/api/v1';

// Market Insights Endpoints (Public)
export const INSIGHTS_ENDPOINTS = {
  TODAY: `${API_VERSION}/insights/today`,
  HISTORY: (days: number = 7) => `${API_VERSION}/insights/history?days=${days}`,
  BY_DATE: (date: string) => `${API_VERSION}/insights/${date}`,
} as const;

// Dashboard Endpoints (Unified for all roles)
export const DASHBOARD_ENDPOINTS = {
  DASHBOARD: (role?: string) => `${API_VERSION}/dashboard${role ? `?role=${role}` : ''}`,
} as const;

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

  // Converter Reference Data
  CONVERTER_TYPES: `${API_VERSION}/converter-types`,
  FINISHED_PRODUCTS: `${API_VERSION}/finished-products`,
  SCRAP_TYPES: `${API_VERSION}/scrap-types`,
  CONVERTER_REFERENCE_DATA: `${API_VERSION}/converter-reference-data`,
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

  // Requirements/Posts
  POST_REQUIREMENT: `${API_VERSION}/dealer/requirement/post`,
  REQUIREMENTS: `${API_VERSION}/dealer/requirements`,
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

  // Requirements
  POST_REQUIREMENT: `${API_VERSION}/converter/requirement/post`,
  // Machine buy/sell (converter)
  POST_MACHINE: `${API_VERSION}/converter/machine/post`,
  // Jobwork (converter → converter)
  POST_JOBWORK_FIND: `${API_VERSION}/converter/jobwork/find`,
  POST_JOBWORK_GIVE: `${API_VERSION}/converter/jobwork/give`,
} as const;

// Brand Endpoints
export const BRAND_ENDPOINTS = {
  // Profile
  COMPLETE_PROFILE: `${API_VERSION}/brand/profile/complete`,

  // Dashboard
  DASHBOARD: `${API_VERSION}/brand/dashboard`,

  // Requirements
  POST_REQUIREMENT: `${API_VERSION}/brand/requirement/post`,
  REQUIREMENTS: `${API_VERSION}/brand/requirements`,
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

// Registration Details Endpoint (Unified view for all roles)
export const REGISTRATION_DETAILS_ENDPOINTS = {
  DETAIL: `${API_VERSION}/registration-details`,
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

// Wallet Endpoints
export const WALLET_ENDPOINTS = {
  BALANCE: `${API_VERSION}/wallet`,
  CREDIT_PACKS: `${API_VERSION}/wallet/credit-packs`,
  CALCULATE: `${API_VERSION}/wallet/calculate`,
  PURCHASE: `${API_VERSION}/wallet/purchase`,
  RAZORPAY_ORDER: `${API_VERSION}/wallet/payments/razorpay/order`,
  RAZORPAY_EXACT_CREDITS_ORDER: `${API_VERSION}/wallet/payments/razorpay/exact-credits-order`,
  RAZORPAY_VERIFY: `${API_VERSION}/wallet/payments/razorpay/verify`,
  ADD: `${API_VERSION}/wallet/add`,
  TRANSACTIONS: `${API_VERSION}/wallet/transactions`,
  DEDUCT: `${API_VERSION}/wallet/deduct`,
} as const;

// File Upload Endpoints
export const UPLOAD_ENDPOINTS = {
  SINGLE: `${API_VERSION}/upload/single`,
  MULTIPLE: `${API_VERSION}/upload/multiple`,
} as const;

// Session Endpoints (Unified for all roles)
export const SESSION_ENDPOINTS = {
  // Get active sessions (Sourcing Hub)
  ACTIVE: `${API_VERSION}/sessions/active`,
  // Get session history
  HISTORY: `${API_VERSION}/sessions/history`,
  // Get session by inquiry id (e.g. from requirements list; use session id for detail)
  BY_INQUIRY: (inquiryId: number | string) => `${API_VERSION}/sessions/by-inquiry/${inquiryId}`,
  // Get session details (use session id, not inquiry id)
  DETAIL: (id: number | string) => `${API_VERSION}/sessions/${id}`,
  // Get poster detail (owner only: counts + requirement summary, no response list)
  POSTER_DETAIL: (id: number | string) => `${API_VERSION}/sessions/${id}/poster-detail`,
  // Get responder detail (non-owner only: someone wants to buy/sell + requirement summary)
  RESPONDER_DETAIL: (id: number | string) => `${API_VERSION}/sessions/${id}/responder-detail`,
  // Lock session (select dealers)
  LOCK: (id: number | string) => `${API_VERSION}/sessions/${id}/lock`,
  // Republish session
  REPUBLISH: (id: number | string) => `${API_VERSION}/sessions/${id}/republish`,
  // Mark deal as failed
  DEAL_FAILED: (id: number | string) => `${API_VERSION}/sessions/${id}/deal-failed`,
  // Chat list (conversations for Messages tab)
  CHAT_LIST: `${API_VERSION}/sessions/chat-list`,
} as const;

// RTD (Ready-to-Dispatch) Endpoints
export const RTD_ENDPOINTS = {
  // Listing packs (Converter – pay to list products)
  LISTING_PACKS: `${API_VERSION}/rtd/listing-packs`,
  LISTING_PACKS_PURCHASE: `${API_VERSION}/rtd/listing-packs/purchase`,
  RTD_ENTITLEMENT: `${API_VERSION}/rtd/entitlement`,
  DISPATCH_OPTIONS: `${API_VERSION}/rtd/dispatch-options`,
  // Products (Converter)
  PRODUCTS_MY: `${API_VERSION}/rtd/products/my`,
  PRODUCTS_CATALOG: `${API_VERSION}/rtd/products/catalog`,
  PRODUCT_DETAIL: (id: number | string) => `${API_VERSION}/rtd/products/${id}`,
  PRODUCT_STORE: `${API_VERSION}/rtd/products`,
  PRODUCT_UPDATE: (id: number | string) => `${API_VERSION}/rtd/products/${id}`,
  PRODUCT_PAUSE: (id: number | string) => `${API_VERSION}/rtd/products/${id}/pause`,
  PRODUCT_RESUME: (id: number | string) => `${API_VERSION}/rtd/products/${id}/resume`,
  // Orders (role auto-detected from token)
  ORDERS_MY: `${API_VERSION}/rtd/orders/my`,
  ORDER_STORE: `${API_VERSION}/rtd/orders`,
  ORDER_DETAIL: (id: number | string) => `${API_VERSION}/rtd/orders/${id}`,
  ORDER_ACCEPT: (id: number | string) => `${API_VERSION}/rtd/orders/${id}/accept`,
  ORDER_DECLINE: (id: number | string) => `${API_VERSION}/rtd/orders/${id}/decline`,
  ORDER_CONFIRM_PAYMENT: (id: number | string) => `${API_VERSION}/rtd/orders/${id}/confirm-payment`,
  ORDER_RAZORPAY_CREATE: (id: number | string) =>
    `${API_VERSION}/rtd/orders/${id}/payments/razorpay/order`,
  ORDER_RAZORPAY_VERIFY: (id: number | string) =>
    `${API_VERSION}/rtd/orders/${id}/payments/razorpay/verify`,
  ORDER_IN_PRODUCTION: (id: number | string) => `${API_VERSION}/rtd/orders/${id}/in-production`,
  ORDER_DISPATCH: (id: number | string) => `${API_VERSION}/rtd/orders/${id}/dispatch`,
  ORDER_DISPUTE: (id: number | string) => `${API_VERSION}/rtd/orders/${id}/dispute`,
  ORDER_CANCEL: (id: number | string) => `${API_VERSION}/rtd/orders/${id}/cancel`,
} as const;

// Inquiry Endpoints
export const INQUIRY_ENDPOINTS = {
  // Get inquiry details
  DETAIL: (id: number | string) => `${API_VERSION}/inquiries/${id}`,
  // Get responses for inquiry (brand/converter only)
  RESPONSES: (id: number | string) => `${API_VERSION}/inquiries/${id}/responses`,
  // Get matchmaking responses with filters
  MATCHMAKING_RESPONSES: (id: number | string) => `${API_VERSION}/inquiries/${id}/matchmaking-responses`,
  // Shortlist/Reject response
  SHORTLIST_RESPONSE: (id: number | string) => `${API_VERSION}/inquiries/responses/${id}/shortlist`,
  // Responder: express interest or decline
  EXPRESS_INTEREST: (inquiryId: number | string) => `${API_VERSION}/inquiries/${inquiryId}/express-interest`,
  DECLINE: (inquiryId: number | string) => `${API_VERSION}/inquiries/${inquiryId}/decline`,
  // Structured chat threads for poster
  CHAT_THREADS: (inquiryId: number | string) => `${API_VERSION}/inquiries/${inquiryId}/chat-threads`,
  // Structured chat open/create for responder
  OPEN_CHAT_THREAD: (inquiryId: number | string) =>
    `${API_VERSION}/inquiries/${inquiryId}/chat-threads/open`,
} as const;

export const CHAT_THREAD_ENDPOINTS = {
  ALL: `${API_VERSION}/chat-threads`,
  MESSAGES: (threadId: number | string) => `${API_VERSION}/chat-threads/${threadId}/messages`,
  MARK_READ: (threadId: number | string) => `${API_VERSION}/chat-threads/${threadId}/read`,
} as const;

export const PRICING_ENDPOINTS = {
  QUOTE: `${API_VERSION}/pricing/quote`,
} as const;
