import React from 'react';
import { View, ActivityIndicator, Button, RefreshControl } from 'react-native';
import { useAppSelector } from '@store/hooks';
import { useGetProfile } from '@services/api';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { ProfileCompletionCard } from './components/ProfileCompletionCard';
import { DealerDashboardView } from './components/DealerDashboardView';
import { styles } from './styles';
import { SCREENS } from '@navigation/constants';
import { useNavigation } from '@react-navigation/native';

const DashboardScreen = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { data: profileData, isLoading, isError, refetch } = useGetProfile();
  const navigation = useNavigation<any>();
  // Check profile completion status (same logic as ProfileScreen)
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
      <ScreenWrapper backgroundColor="#F5F5F5" safeAreaEdges={[]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  // Error state
  if (isError) {
    return (
      <ScreenWrapper backgroundColor="#F5F5F5" safeAreaEdges={[]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>Failed to load dashboard</Text>
        </View>
      </ScreenWrapper>
    );
  }

  // Get user's primary role
  const primaryRole = profileData?.primary_role || user?.primaryRole || 'dealer';

  // // Show profile completion card if profile is incomplete
  if (profileIncomplete) {
    return (
        <View style={styles.incompleteProfileContainer}>
          <ProfileCompletionCard
            incompleteFields={incompleteFields}
            completionPercentage={profileCompletionPercentage}
          />
        </View>
    );
  }

  // Render role-specific dashboard views
  const renderRoleDashboard = () => {
    switch (primaryRole.toLowerCase()) {
      case 'dealer':
        return <DealerDashboardView profileData={profileData} />;
      // Add more role cases here in the future
      // case 'converter':
      //   return <ConverterDashboardView profileData={profileData} />;
      // case 'brand':
      //   return <BrandDashboardView profileData={profileData} />;
      default:
        return <DealerDashboardView profileData={profileData} />;
    }
  };

  return (
    <ScreenWrapper
    scrollable
    backgroundColor="#F5F5F5"
    safeAreaEdges={[]}
    contentContainerStyle={styles.scrollContent}
    scrollViewProps={{
      refreshControl: (
        <></>
            ),
    }}
  >
    {renderRoleDashboard()}
   </ScreenWrapper>
  );
};

export default DashboardScreen;

