import type { BrandDashboardData } from '@services/api';

export interface BrandDashboardViewProps {
  profileData: any;
  dashboardData?: BrandDashboardData;
  onRefresh?: () => void;
  refreshing?: boolean;
}
