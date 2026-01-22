/**
 * Sessions Feature - Shared Types
 */

// Session Status Types
export type SessionStatus = 'finding_matches' | 'active' | 'locked' | 'completed' | 'expired';

// Match Type for filtering
export type MatchType = 'all' | 'exact_match' | 'slight_variation' | 'nearest';

// Tab Types for Session Dashboard
export type SessionTabType = 'all' | 'finding_matches' | 'active' | 'locked';

// Session Data
export interface Session {
  id: string;
  inquiryId: string;
  title: string;
  category: string;
  createdAt: string;
  status: SessionStatus;
  isUrgent: boolean;
  // Timer data
  biddingEndsAt?: string;
  // Progress data
  responsesReceived: number;
  totalExpectedResponses: number;
  // Material details
  materialName: string;
  quantity: string;
  quantityUnit: string;
  specifications?: string;
  imageUrl?: string;
}

// Match Response from Supplier
export interface MatchResponse {
  id: string;
  sessionId: string;
  supplierId: string;
  supplierName: string;
  supplierLogo?: string;
  isVerified: boolean;
  location: {
    city: string;
    country: string;
    distance: string; // e.g., "45 km away"
  };
  matchType: Exclude<MatchType, 'all'>;
  message: string;
  // Offer details
  availableQuantity?: string;
  pricePerUnit?: number;
  deliveryTime?: string;
  // Status
  isShortlisted: boolean;
  isRejected: boolean;
  respondedAt: string;
}

// Shortlisted Partner (for locked session)
export interface ShortlistedPartner {
  id: string;
  sessionId: string;
  supplierId: string;
  supplierName: string;
  supplierLogo?: string;
  isVerified: boolean;
  specialty: string;
  location: {
    city: string;
    country: string;
  };
  matchType: Exclude<MatchType, 'all'>;
  // Chat status
  hasUnreadMessages: boolean;
  lastMessageAt?: string;
}

// Chat Message
export interface ChatMessage {
  id: string;
  sessionId: string;
  partnerId: string;
  senderId: string;
  senderType: 'user' | 'partner';
  senderName: string;
  senderAvatar?: string;
  messageType: 'text' | 'file' | 'image';
  content: string;
  // File attachment details
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  fileUrl?: string;
  // Status
  isRead: boolean;
  sentAt: string;
}

// Timer Countdown
export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Navigation Params
export interface SessionDashboardParams {
  initialTab?: SessionTabType;
}

export interface SessionDetailsParams {
  sessionId: string;
  session?: Session;
}

export interface SessionLockedParams {
  sessionId: string;
  session?: Session;
}

export interface SessionChatParams {
  sessionId: string;
  partnerId: string;
  partnerName: string;
  inquiryRef?: string;
}
