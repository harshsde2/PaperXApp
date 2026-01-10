/**
 * Dashboard API Barrel Export
 */

// Export API hooks
export {
  useGetDashboard,
  useGetDealerDashboard,
  useGetMachineDealerDashboard,
  useGetConverterDashboard,
  useGetBrandDashboard,
} from './dashboardApi';

// Export types
export type {
  DashboardRole,
  DashboardData,
  GetDashboardParams,
  GetDashboardResponse,
  DealerDashboardData,
  MachineDealerDashboardData,
  ConverterDashboardData,
  BrandDashboardData,
  RecentSession,
  RecentInquiry,
  ActiveSession,
  NewInquiry,
  MachineOpportunity,
} from './@types';
