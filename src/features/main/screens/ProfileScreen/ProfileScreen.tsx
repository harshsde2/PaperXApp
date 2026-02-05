import React, { useLayoutEffect, useEffect } from 'react';
import { View, TouchableOpacity, ActivityIndicator, RefreshControl, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '@store/hooks';
import { useLogout, useGetProfile } from '@services/api';
import { storageService } from '@services/storage/storageService';
import { setRoles, setActiveRole } from '@store/slices/roleSlice';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { Section } from '@shared/components/Section';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { CustomHeader } from '@shared/components/CustomHeader';
import { AnimatedCircularProgress } from '@shared/components/AnimatedCircularProgress';
import { useTheme } from '@theme/index';
import { ProfileScreenNavigationProp } from './@types';
import { createStyles } from './styles';
import type { UserProfile } from '@services/api/types';
import { AppIcon } from '@assets/svgs';
import { ROLES } from '@utils/constants';
import { UserRole } from '@shared/types';

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const route = useRoute();
  const theme = useTheme();
  const styles = createStyles(theme);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { activeRole, availableRoles, primaryRole: reduxPrimaryRole, secondaryRole: reduxSecondaryRole } = useAppSelector((state) => state.role);
  const logoutMutation = useLogout();
  
  // Fetch user profile from API
  const { data: profileData, isLoading, isError, refetch, isRefetching } = useGetProfile();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleEdit = () => {
    // TODO: Navigate to edit profile screen
    console.log('Edit profile');
  };

  // Set header options with Edit button
  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: any) => (
        <CustomHeader
          {...props}
          rightButton={{
            icon: <Text style={styles.editButtonText}>Edit</Text>,
            onPress: handleEdit,
          }}
        />
      ),
    });
  }, [navigation, handleEdit]);

  const handleAccountSettings = () => {
    // TODO: Navigate to account settings
    console.log('Account settings');
  };

  const handleManageRoles = () => {
    // TODO: Navigate to manage roles
    console.log('Manage roles');
  };

  const handleHelpSupport = () => {
    // TODO: Navigate to help & support
    console.log('Help & support');
  };

  // Extract user data from API response
  const userData = profileData;
  const companyName = userData?.company_name || 'Not Set';
  const email = userData?.email || 'Not Set';
  const mobile = userData?.mobile || user?.mobile || 'Not Set';
  const name = userData?.name || 'Not Set';
  const gstIn = userData?.gst_in || 'Not Set';
  const state = userData?.state || 'Not Set';
  const city = userData?.city || 'Not Set';
  const location = state !== 'Not Set' && city !== 'Not Set' 
    ? `${city}, ${state}`
    : 'Not Set';
  const primaryRole = userData?.primary_role || 'Not Set';
  const secondaryRole = userData?.secondary_role || null;
  const hasSecondaryRole = userData?.has_secondary_role === 1;
  const operationArea = userData?.operation_area || 'Not Set';
  const isUdyamVerified = !!userData?.udyam_verified_at;
  const emailVerified = !!userData?.email_verified_at;
  const udyamCertificate = userData?.udyam_certificate || null;
  const avatarUrl = userData?.avatar || null;

  // Helper function to normalize role from API format to UserRole type
  const normalizeRole = (role: string): UserRole => {
    const normalized = role.toLowerCase().replace(/\s+/g, '-');
    // Convert "machine-dealer" or "machinedealer" to "machineDealer" to match UserRole type
    if (normalized === 'machine-dealer' || normalized === 'machinedealer') {
      return 'machineDealer';
    }
    // Map other roles
    const roleMap: Record<string, UserRole> = {
      'dealer': 'dealer',
      'converter': 'converter',
      'brand': 'brand',
      'mill': 'mill',
      'scrap-dealer': 'scrapDealer',
    };
    return roleMap[normalized] || 'dealer';
  };

  // Initialize role slice when profile data loads (only once or when roles change)
  useEffect(() => {
    if (profileData && primaryRole && primaryRole !== 'Not Set') {
      const normalizedPrimaryRole = normalizeRole(primaryRole);
      const normalizedSecondaryRole = hasSecondaryRole && secondaryRole
        ? normalizeRole(secondaryRole)
        : undefined;

      // Only update roles if they've changed or haven't been set yet
      const rolesChanged = 
        reduxPrimaryRole !== normalizedPrimaryRole || 
        reduxSecondaryRole !== normalizedSecondaryRole;
      
      if (!reduxPrimaryRole || rolesChanged) {
        // Set roles from profile data (this will preserve activeRole if it's valid)
        dispatch(setRoles({
          primaryRole: normalizedPrimaryRole,
          secondaryRole: normalizedSecondaryRole,
        }));
      }
      
      // Only set active role to primary if it's not set yet
      // The setRoles action will handle preserving activeRole if it's already valid
      if (!activeRole) {
        dispatch(setActiveRole(normalizedPrimaryRole));
      }
    }
  }, [profileData, primaryRole, secondaryRole, hasSecondaryRole, dispatch, reduxPrimaryRole, reduxSecondaryRole, activeRole]);

  // Build roles array
  const roles: string[] = [];
  if (primaryRole && primaryRole !== 'Not Set') {
    roles.push(primaryRole);
  }
  if (hasSecondaryRole && secondaryRole) {
    roles.push(secondaryRole);
  }

  // Handle role switch
  const handleRoleSwitch = (role: string) => {
    const normalizedRole = normalizeRole(role);
    dispatch(setActiveRole(normalizedRole));
    // Navigate back to dashboard to refresh with new role
    // @ts-ignore - Navigation params type issue
    navigation.navigate('MainTabs', { screen: 'Dashboard' });
  };

  // Check profile completion status
  const hasEmail = !!userData?.email;
  const hasGstIn = !!userData?.gst_in;
  const hasState = !!userData?.state;
  const hasCity = !!userData?.city;
  const hasPrimaryRole = !!userData?.primary_role;
  const hasCompanyName = !!userData?.company_name;
  const hasName = !!userData?.name;
  
  // Calculate profile completion percentage
  const totalFields = 7; // name, company_name, email, gst_in, state, city, primary_role, udyam_verified
  const completedFields = [
    hasName,
    hasCompanyName,
    hasEmail,
    hasGstIn,
    hasState && hasCity, // Location counts as one field
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

  const handleCompleteProfile = () => {
    if(primaryRole === ROLES.DEALER) {

    }else if(primaryRole === ROLES.CONVERTER) {
      
    }
 
  };

  // Loading state
  if (isLoading) {
    return (
      <ScreenWrapper backgroundColor={theme.colors.background.secondary} safeAreaEdges={[]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.DEFAULT} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  // Error state
  if (isError) {
    return (
      <ScreenWrapper backgroundColor={theme.colors.background.secondary} safeAreaEdges={[]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>Failed to load profile</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      scrollable
      backgroundColor={theme.colors.background.secondary}
      safeAreaEdges={[]}
      contentContainerStyle={styles.scrollContent}
      scrollViewProps={{
        refreshControl: (
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        ),
      }}
    >
      {/* Profile Card */}
      <Card style={styles.profileCardContainer}>
        <View style={styles.profileImageContainer}>
          <AnimatedCircularProgress
            percentage={profileCompletionPercentage}
            size={120}
            strokeWidth={8}
            duration={1000}
            backgroundColor="#E0E0E0"
            showPercentage={true}
            percentagePosition="bottom"
            startPosition="6"
          >
            {/* Avatar or default icon in center */}
            {avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <AppIcon.Person width={50} height={50} />
              </View>
            )}
          </AnimatedCircularProgress>
        </View>
        
        <Text style={styles.companyName}>{companyName}</Text>
        {primaryRole && primaryRole !== 'Not Set' && (
          <Text style={styles.supplierType}>{primaryRole}</Text>
        )}
        
        <View style={styles.statusContainer}>
          <TouchableOpacity style={styles.activeButton}>
            <Text style={styles.activeButtonText}>ACTIVE</Text>
          </TouchableOpacity>
          {emailVerified && (
            <View style={styles.verifiedTag}>
              <Text style={styles.verifiedTagText}>Email Verified</Text>
            </View>
          )}
        </View>
      </Card>

      {/* Profile Completion Alert */}
      {profileIncomplete && (
        <Card style={styles.completionCard}>
          <View style={styles.completionHeader}>
            <View style={styles.completionIconContainer}>
              <AppIcon.Warning width={24} height={24} />
            </View>
            <View style={styles.completionTextContainer}>
              <Text style={styles.completionTitle}>Complete Your Profile</Text>
              <Text style={styles.completionSubtitle}>
                {incompleteFields.length} field{incompleteFields.length > 1 ? 's' : ''} remaining
              </Text>
            </View>
          </View>
          <View style={styles.incompleteFieldsList}>
            {incompleteFields.map((field, index) => (
              <View key={index} style={styles.incompleteFieldItem}>
                <Text style={styles.incompleteFieldDot}>•</Text>
                <Text style={styles.incompleteFieldText}>{field}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={styles.completeProfileButton}
            onPress={handleCompleteProfile}
            activeOpacity={0.8}
          >
            <Text style={styles.completeProfileButtonText}>Complete Profile</Text>
            <Text style={styles.completeProfileArrow}>→</Text>
          </TouchableOpacity>
        </Card>
      )}

      {/* Roles Section with Role Switcher */}
      {roles.length > 0 && (
        <Section
          title="Roles"
          style={styles.section}
        >
          <View style={styles.rolesContainer}>
            {roles.map((role, index) => {
              const normalizedRole = normalizeRole(role);
              // Compare with activeRole (which is in SharedUserRole format)
              const isActive = activeRole === normalizedRole;
              const isPrimary = index === 0;
              
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleRoleSwitch(role)}
                  disabled={isActive || roles.length === 1}
                  activeOpacity={0.7}
                >
                  <Card 
                    variant="compact" 
                    style={[
                      styles.roleBadge,
                      isActive && styles.roleBadgeActive,
                      roles.length === 1 && styles.roleBadgeDisabled
                    ]}
                  >
                    <View style={styles.roleBadgeContent}>
                      <View style={styles.roleBadgeLeft}>
                        <Text variant="captionSmall" fontWeight="semibold" color={theme.colors.primary.dark} style={styles.roleBadgeLabel}>
                          {isPrimary ? 'Primary' : 'Secondary'}
                        </Text>
                        <Text variant="bodyMedium" fontWeight="semibold" color={theme.colors.text.primary} style={styles.roleBadgeValue}>
                          {role}
                        </Text>
                      </View>
                      {isActive && (
                        <View style={styles.activeRoleIndicator}>
                          <Text style={styles.activeRoleText}>Active</Text>
                        </View>
                      )}
                      {!isActive && roles.length > 1 && (
                        <Text style={styles.switchRoleText}>Tap to switch →</Text>
                      )}
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>
          {roles.length > 1 && (
            <Text style={styles.roleSwitchHint}>
              Switch between roles to view role-specific dashboards and features
            </Text>
          )}
        </Section>
      )}

      {/* Contact Information */}
      <Section
        title="Contact Information"
        style={styles.section}
      >
        {name && name !== 'Not Set' && (
          <Card variant="compact" style={styles.contactItemContainer}>
            <AppIcon.PersonIcon width={24} height={24} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Name</Text>
              <Text style={styles.contactValue}>{name}</Text>
            </View>
          </Card>
        )}

        <Card variant="compact" style={styles.contactItemContainer}>
          <AppIcon.EmailIcon width={24} height={24} />
          <View style={styles.contactInfo}>
            <View style={styles.contactLabelRow}>
              <Text style={styles.contactLabel}>Email</Text>
              {emailVerified && (
                <View style={styles.verifiedIndicator}>
                  <Text style={styles.verifiedIndicatorText}>✓ Verified</Text>
                </View>
              )}
            </View>
            <Text style={styles.contactValue}>{email}</Text>
          </View>
        </Card>

        <Card variant="compact" style={styles.contactItemContainer}>
          <AppIcon.PhoneIcon width={24} height={24} />
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Mobile</Text>
            <Text style={styles.contactValue}>{mobile}</Text>
          </View>
        </Card>

        <Card variant="compact" style={styles.contactItemContainer}>
          <AppIcon.Location width={24} height={24} />
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Location</Text>
            <Text style={styles.contactValue}>{location}</Text>
          </View>
        </Card>
      </Section>

      {/* Company Information */}
      <Section
        title="Company Information"
        style={styles.section}
      >
        <Card variant="compact" style={styles.contactItemContainer}>
          <View style={styles.infoIconContainer}>
            <Text style={styles.infoIconText}>🏢</Text>
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Company Name</Text>
            <Text style={styles.contactValue}>{companyName}</Text>
          </View>
        </Card>

        <Card variant="compact" style={styles.contactItemContainer}>
          <View style={styles.infoIconContainer}>
            <Text style={styles.infoIconText}>📋</Text>
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>GSTIN</Text>
            <Text style={styles.contactValue}>{gstIn}</Text>
          </View>
        </Card>

        {operationArea && operationArea !== 'Not Set' && (
          <Card variant="compact" style={styles.contactItemContainer}>
            <View style={styles.infoIconContainer}>
              <Text style={styles.infoIconText}>🌍</Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Operation Area</Text>
              <Text style={styles.contactValue}>{operationArea}</Text>
            </View>
          </Card>
        )}
      </Section>

      {/* Verification Status */}
      <Section
        title="Verification Status"
        style={styles.section}
      >
        <Card variant="compact" style={styles.verificationCard}>
          <View style={styles.verificationRow}>
            <Text style={styles.verificationLabel}>UDYAM Certificate</Text>
            <View style={[
              styles.verificationStatus,
              isUdyamVerified ? styles.verificationStatusVerified : styles.verificationStatusPending
            ]}>
              <Text style={styles.verificationStatusText}>
                {isUdyamVerified ? '✓ Verified' : '⏳ Pending'}
              </Text>
            </View>
          </View>
          {userData?.udyam_verified_at && (
            <Text style={styles.verificationDate}>
              Verified on {new Date(userData.udyam_verified_at).toLocaleDateString()}
            </Text>
          )}
        </Card>

        <Card variant="compact" style={styles.verificationCard}>
          <View style={styles.verificationRow}>
            <Text style={styles.verificationLabel}>Email</Text>
            <View style={[
              styles.verificationStatus,
              emailVerified ? styles.verificationStatusVerified : styles.verificationStatusPending
            ]}>
              <Text style={styles.verificationStatusText}>
                {emailVerified ? '✓ Verified' : '⏳ Pending'}
              </Text>
            </View>
          </View>
          {userData?.email_verified_at && (
            <Text style={styles.verificationDate}>
              Verified on {new Date(userData.email_verified_at).toLocaleDateString()}
            </Text>
          )}
        </Card>
      </Section>

      {/* Settings */}
      <Section
        title="Settings"
        style={styles.section}
      >
        <TouchableOpacity style={styles.settingsItem} onPress={handleAccountSettings}>
          <View style={styles.settingsItemLeft}>
            <View style={styles.settingsIcon}>
              <Text style={styles.settingsIconText}>⚙️</Text>
            </View>
            <Text style={styles.settingsLabel}>Account Settings</Text>
          </View>
          <Text style={styles.settingsArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsItem} onPress={handleManageRoles}>
          <View style={styles.settingsItemLeft}>
            <View style={styles.settingsIcon}>
              <Text style={styles.settingsIconText}>👥</Text>
            </View>
            <Text style={styles.settingsLabel}>Manage Roles</Text>
          </View>
          <Text style={styles.settingsArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsItem} onPress={handleHelpSupport}>
          <View style={styles.settingsItemLeft}>
            <View style={styles.settingsIcon}>
              <Text style={styles.settingsIconText}>❓</Text>
            </View>
            <Text style={styles.settingsLabel}>Help & Support</Text>
          </View>
          <Text style={styles.settingsArrow}>›</Text>
        </TouchableOpacity>
      </Section>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        disabled={logoutMutation.isPending}
      >
        {logoutMutation.isPending ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Text style={styles.logoutIcon}>→</Text>
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Version */}
      <Text style={styles.versionText}>v1.0.4</Text>
    </ScreenWrapper>
  );
};

export default ProfileScreen;

