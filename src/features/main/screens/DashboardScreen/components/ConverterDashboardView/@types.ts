import type { ConverterDashboardData } from '@services/api';
import type { ActiveSessionListItem } from '@services/api/sessionApi/@types';

export interface ConverterDashboardViewProps {
  profileData: any;
  dashboardData?: ConverterDashboardData;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export interface RTDSnapshotData {
  activeListings: number;
  activeListingsChange: string;
  pendingOrders: number;
  pendingOrdersLabel: string;
  totalOrders: number;
  ordersLabel: string;
  revenue: string;
  revenueChange: string;
}

export interface TransformedSession {
  id: string;
  status: 'NEGOTIATION' | 'PENDING_INFO' | 'WAITING' | 'ACTIVE';
  timeRemaining: string;
  companyAvatar: string;
  company: string;
  description: string;
  actionRequired: boolean;
  stepProgress: number;
  totalSteps: number;
  step: string;
  waitingOn: string;
}
