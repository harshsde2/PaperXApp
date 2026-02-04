import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAppSelector } from '@store/hooks';
import { useGetProfile, useGetDashboard } from '@services/api';
import type { DashboardRole } from '@services/api';
import { useActiveRole } from '@shared/hooks/useActiveRole';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { ProfileCompletionCard } from './components/ProfileCompletionCard';
import { DealerDashboardView } from './components/DealerDashboardView';
import { ConverterDashboardView } from './components/ConverterDashboardView';
import { BrandDashboardView } from './components/BrandDashboardView';
import { MachineDealerDashboardView } from './components/MachineDealerDashboardView';
import { DashboardHeader } from './components/DashboardHeader';
import { styles } from './styles';

const DashboardScreen = () => {
  const { user } = useAppSelector((state) => state.auth);
  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
    isRefetching: isProfileRefetching,
    refetch: refetchProfile,
  } = useGetProfile();

  // Get active role from Redux (supports role switching)
  const activeRole = useActiveRole() as DashboardRole;

  // Fetch dashboard data based on active role
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
    isRefetching: isDashboardRefetching,
    refetch: refetchDashboard,
  } = useGetDashboard({ role: activeRole });

  const isLoading = isProfileLoading || isDashboardLoading;
  const isError = isProfileError || isDashboardError;
  const isRefreshing = isProfileRefetching || isDashboardRefetching;

  const refetch = () => {
    refetchProfile();
    refetchDashboard();
  };

  // Check profile completion status
  const hasEmail = !!profileData?.email;
  const hasGstIn = !!profileData?.gst_in;
  const hasState = !!profileData?.state;
  const hasCity = !!profileData?.city;
  const hasPrimaryRole = !!profileData?.primary_role;
  const hasCompanyName = !!profileData?.company_name;
  const hasName = !!profileData?.name;
  const isUdyamVerified = !!profileData?.udyam_verified_at;

  const totalFields = 7;
  const completedFields = [
    hasName,
    hasCompanyName,
    hasEmail,
    hasGstIn,
    hasState && hasCity,
    hasPrimaryRole,
    isUdyamVerified,
  ].filter(Boolean).length;

  const profileCompletionPercentage = Math.round((completedFields / totalFields) * 100);
  const profileIncomplete = !isUdyamVerified || !hasEmail || !hasGstIn || !hasState || !hasCity || !hasPrimaryRole || !hasCompanyName;

  const incompleteFields: string[] = [];
  if (!hasCompanyName) incompleteFields.push('Company Name');
  if (!isUdyamVerified) incompleteFields.push('UDYAM Certificate');
  if (!hasEmail) incompleteFields.push('Email');
  if (!hasGstIn) incompleteFields.push('GSTIN');
  if (!hasState || !hasCity) incompleteFields.push('Location');
  if (!hasPrimaryRole) incompleteFields.push('Primary Role');

  // Loading state
  if (isLoading) {
    return (
      <ScreenWrapper backgroundColor="#F9FAFB" safeAreaEdges={[]}>
        <DashboardHeader />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  // Error state
  if (isError) {
    return (
      <ScreenWrapper backgroundColor="#F9FAFB" safeAreaEdges={[]}>
        <DashboardHeader />
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>Failed to load dashboard</Text>
        </View>
      </ScreenWrapper>
    );
  }

  // Show profile completion card if profile is incomplete
  // if (profileIncomplete) {
  //   return (
  //     <ScreenWrapper backgroundColor="#F9FAFB" safeAreaEdges={[]}>
  //       <DashboardHeader />
  //       <View style={styles.incompleteProfileContainer}>
  //         <ProfileCompletionCard
  //           incompleteFields={incompleteFields}
  //           completionPercentage={profileCompletionPercentage}
  //         />
  //       </View>
  //     </ScreenWrapper>
  //   );
  // }

  // Render role-specific dashboard views based on active role
  const renderRoleDashboard = () => {
    const refreshProps = { onRefresh: refetch, refreshing: isRefreshing };
    switch (activeRole) {
      case 'dealer':
        return (
          <DealerDashboardView
            profileData={profileData}
            dashboardData={dashboardData}
            {...refreshProps}
          />
        );
      case 'machine-dealer':
        return (
          <MachineDealerDashboardView
            profileData={profileData}
            dashboardData={dashboardData}
            {...refreshProps}
          />
        );
      case 'converter':
        return (
          <ConverterDashboardView
            profileData={profileData}
            dashboardData={dashboardData}
            {...refreshProps}
          />
        );
      case 'brand':
        return (
          <BrandDashboardView
            profileData={profileData}
            dashboardData={dashboardData}
            {...refreshProps}
          />
        );
      default:
        return (
          <DealerDashboardView
            profileData={profileData}
            dashboardData={dashboardData}
            {...refreshProps}
          />
        );
    }
  };

  return (
    // <ScreenWrapper
    //   backgroundColor="#F9FAFB"
    //   safeAreaEdges={[]}
    // >
    <View style={{ flex: 1 }}>
      <DashboardHeader />
      {renderRoleDashboard()}
    </View>
    // </ScreenWrapper>
  );
};

export default DashboardScreen;
