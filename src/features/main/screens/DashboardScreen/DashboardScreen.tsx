import React, { useCallback, useMemo, useState } from 'react';
import { View, BackHandler } from 'react-native';
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
import { DashboardHeaderHeightContext } from './DashboardHeaderHeightContext';
import { styles } from './styles';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '@theme/index';
import { useSkeleton } from '@shared/hooks/useSkeleton';
import { DashboardSkeleton } from '@shared/components/skeletons';

const DashboardScreen = () => {
  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
    isRefetching: isProfileRefetching,
    refetch: refetchProfile,
  } = useGetProfile();
  const theme = useTheme();

  // Get active role from Redux (supports role switching)
  const activeRole = useActiveRole() as DashboardRole;

  const [dashboardHeaderHeight, setDashboardHeaderHeight] = useState(100);

  // Fetch dashboard data based on active role
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
    isRefetching: isDashboardRefetching,
    refetch: refetchDashboard,
  } = useGetDashboard({ role: activeRole });

  const isLoading = isProfileLoading || isDashboardLoading;
  const showSkeleton = useSkeleton(isLoading);
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

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => subscription.remove();
    }, [])
  );

  const gradientColors = useMemo(
    () => [
      theme.colors.primary[50],
      theme.colors.primary[100],
      theme.colors.primary[100],
      theme.colors.primary[200],
      theme.colors.primary[200],
      theme.colors.primary[100],
      theme.colors.primary[100],
      theme.colors.primary[50],
      theme.colors.primary[50],
      theme.colors.primary[200],
      theme.colors.primary[200],
      theme.colors.primary[300],
      theme.colors.primary[300],
      theme.colors.primary[300],
      theme.colors.primary[400],
      theme.colors.primary[400],
      theme.colors.primary[300],
      theme.colors.primary[300],
      theme.colors.primary[200],
      theme.colors.primary[100],
      theme.colors.white,
      theme.colors.white,
      theme.colors.white,
      theme.colors.white,
    ],
    [theme.colors]
  );


  // Loading state
  if (showSkeleton) {
    return (
      <ScreenWrapper backgroundColor="#F9FAFB" safeAreaEdges={[]}>
        <DashboardHeader onLayoutHeight={setDashboardHeaderHeight} />
        <DashboardSkeleton />
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
    <DashboardHeaderHeightContext.Provider value={dashboardHeaderHeight}>
      <ScreenWrapper
        safeArea={true} // Use false to let gradient cover status bar
        gradient="linear"
        safeAreaEdges={[]}
        gradientColors={gradientColors}
        gradientStart={{ x: 1, y: 0 }}
        gradientEnd={{ x: 0, y: 1 }}
        statusBarStyle="dark-content"
      >
        <View style={styles.dashboardWrapper}>
          <DashboardHeader onLayoutHeight={setDashboardHeaderHeight} />
          {renderRoleDashboard()}
        </View>
      </ScreenWrapper>
    </DashboardHeaderHeightContext.Provider>
  );
};

export default DashboardScreen;
