import type { MachineDealerDashboardData } from '@services/api';

export interface MachineDealerDashboardViewProps {
  profileData: any;
  dashboardData?: MachineDealerDashboardData;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export interface MachineSnapshotData {
  activeListings: number;
  activeRequirements: number;
  responsesReceived: number;
}

export interface TransformedSession {
  id: string;
  status: 'NEGOTIATION' | 'PENDING_INFO' | 'WAITING' | 'ACTIVE';
  timeRemaining: string;
  companyAvatar: string;
  company: string;
  description: string;
  actionRequired: boolean;
  responsesReceived: number;
  totalExpectedResponses: number;
  progressPercent: number;
}
