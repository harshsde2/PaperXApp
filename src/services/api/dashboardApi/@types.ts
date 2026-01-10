/**
 * Dashboard API Types
 * Unified dashboard types for all roles
 */

// Role types
export type DashboardRole = 'dealer' | 'machine-dealer' | 'converter' | 'brand';

// ============================================
// COMMON DASHBOARD TYPES
// ============================================

export interface RecentSession {
  id: number;
  material: string;
  quantity: string;
  status: 'NEGOTIATING' | 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  statusColor?: string;
  time: string;
  description: string;
  counterpartyName?: string;
  counterpartyAvatar?: string;
}

export interface RecentInquiry {
  id: number;
  title: string;
  brand?: string;
  brandLogo?: string;
  quantity: string;
  specifications: string;
  urgency: 'URGENT' | 'NORMAL';
  status: 'MATCHING' | 'OPEN' | 'CLOSED' | 'NEW';
  time: string;
  matchCount?: number;
}

export interface ActiveSession {
  id: number;
  title: string;
  description: string;
  companyName: string;
  companyAvatar?: string;
  status: 'NEGOTIATION' | 'PENDING_INFO' | 'WAITING' | 'ACTIVE';
  step: string;
  stepProgress: number;
  totalSteps: number;
  timeRemaining?: string;
  yourTurn?: boolean;
  actionRequired?: boolean;
}

export interface NewInquiry {
  id: number;
  brand: string;
  brandLogo?: string;
  title: string;
  quantity: string;
  specifications: string;
  urgency: 'URGENT' | 'NORMAL';
  time: string;
}

// ============================================
// DEALER DASHBOARD
// ============================================

export interface DealerDashboardData {
  profile_completion_percentage: number;
  active_opportunities_count: number;
  locked_sessions_count: number;
  expired_sessions_count: number;
  unread_notifications_count: number;
}

// ============================================
// MACHINE DEALER DASHBOARD
// ============================================

export interface MachineOpportunity {
  id: number;
  title: string;
  type: 'BUY_REQUEST' | 'RESPONSE' | 'NEGOTIATION' | 'INVENTORY';
  count?: number;
  image?: string;
  status?: string;
}

export interface MachineDealerDashboardData {
  opportunities: number;
  activeSessions: number;
  responses: number;
  inventoryCount: number;
  machineOpportunities: MachineOpportunity[];
}

// ============================================
// CONVERTER DASHBOARD
// ============================================

export interface ConverterDashboardData {
  inquiriesCount: number;
  newInquiries: number;
  avgResponseSpeed: string;
  avgResponseChange: string;
  winRate: number;
  newInquiriesList: NewInquiry[];
  activeSessions: ActiveSession[];
  productionCapacity: {
    current: number;
    max: number;
    unit: string;
  };
}

// ============================================
// BRAND DASHBOARD
// ============================================

export interface BrandDashboardData {
  activeInquiries: number;
  newProposals: number;
  unreadMessages: number;
  recentInquiries: RecentInquiry[];
}

// ============================================
// UNIFIED DASHBOARD RESPONSE
// ============================================

export type DashboardData = {
  dealer: DealerDashboardData;
  'machine-dealer': MachineDealerDashboardData;
  converter: ConverterDashboardData;
  brand: BrandDashboardData;
};

export interface GetDashboardParams {
  role?: DashboardRole;
}

export interface GetDashboardResponse<T = any> {
  success: boolean;
  data: T;
}
