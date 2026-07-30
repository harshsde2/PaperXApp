import React, { useLayoutEffect, useEffect, useCallback, useState } from 'react';
import { View, TouchableOpacity, RefreshControl, Image, LayoutChangeEvent } from 'react-native';
import { Canvas, RoundedRect, LinearGradient, vec } from '@shopify/react-native-skia';
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
import { CustomButton } from '@shared/components/CustomButton';
import { AnimatedCircularProgress } from '@shared/components/AnimatedCircularProgress';
import { useTheme } from '@theme/index';
import { ProfileScreenNavigationProp } from './@types';
import { createStyles } from './styles';
import { AppIcon } from '@assets/svgs';
import { ROLES } from '@utils/constants';
import { UserRole } from '@shared/types';
import { SCREENS } from '@navigation/constants';
import { useSkeleton } from '@shared/hooks/useSkeleton';
import { ProfileSkeleton } from '@shared/components/skeletons';

const getInitials = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed || trimmed === 'Not Set') return '?';
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return trimmed.slice(0, 2).toUpperCase();
};

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
  const showSkeleton = useSkeleton(isLoading);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleAccountSettings = useCallback(() => {
    // navigation.navigate(SCREENS.MAIN.SETTINGS);
    return null;
  }, [navigation]);

  const handleManageRoles = useCallback(() => {
    navigation.navigate(SCREENS.MAIN.REGISTRATION_DETAILS);
  }, [navigation]);

  const handleHelpSupport = useCallback(() => {
    // navigation.navigate(SCREENS.MAIN.SETTINGS);
    return null;
  }, [navigation]);

  // Set header options
  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: any) => <CustomHeader {...props} />,
    });
  }, [navigation]);

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
  const initials = getInitials(companyName);

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
  
  const [roleBadgeLayout, setRoleBadgeLayout] = useState({ width: 0, height: 0 });
  const handleRoleBadgeLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setRoleBadgeLayout({ width, height });
    }
  }, []);

  const incompleteFields: string[] = [];
  if (!hasCompanyName) incompleteFields.push('Company Name');
  if (!isUdyamVerified) incompleteFields.push('UDYAM Certificate');
  if (!hasEmail) incompleteFields.push('Email');
  if (!hasGstIn) incompleteFields.push('GSTIN');
  if (!hasState || !hasCity) incompleteFields.push('Location');
  if (!hasPrimaryRole) incompleteFields.push('Primary Role');

  const handleCompleteProfile = useCallback(() => {
    navigation.navigate(SCREENS.MAIN.REGISTRATION_DETAILS);
  }, [navigation]);

  // Loading state
  if (showSkeleton) {
    return (
      <ScreenWrapper backgroundColor={theme.colors.background.secondary} safeAreaEdges={[]}>
        <ProfileSkeleton />
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
          <CustomButton title="Retry" onPress={() => refetch()} variant="primary" size="md" style={styles.retryButton} />
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
            percentage={100}
            size={120}
            strokeWidth={8}
            duration={1000}
            backgroundColor={theme.colors.border.primary}
            showPercentage={true}
            percentagePosition="bottom"
            startPosition="6"
          >
            {/* Avatar or initials when no avatar URL */}
            {avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primary[100] }]}>
                <Text
                  variant="h4"
                  fontWeight="bold"
                  style={{
                    color: theme.colors.primary.DEFAULT,
                    fontSize: 28,
                    lineHeight: 28,
                  }}
                >
                  {initials}
                </Text>
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
      {/* {profileIncomplete && (
        <Card style={styles.completionCard}>
          <View style={styles.completionHeader}>
            <View style={styles.completionIconContainer}>
              <AppIcon.Warning width={24} height={24} color={theme.colors.warning.DEFAULT} />
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
          <CustomButton
            title="Complete Profile"
            onPress={handleCompleteProfile}
            variant="gradient"
            size="md"
            gradientColors={[
              theme.colors.primary[400],
              theme.colors.primary[600],
              theme.colors.primary.DEFAULT,
            ]}
            gradientStart={{ x: 0, y: 0 }}
            gradientEnd={{ x: 1, y: 1 }}
            rightIcon={
              <AppIcon.ArrowRight width={20} height={20} color={theme.colors.text.inverse} />
            }
            style={{ marginTop: theme.spacing[2] }}
          />
        </Card>
      )} */}

      {/* Roles Section with Role Switcher */}
      {roles.length > 0 && (
        <Section
          title="Role"
          style={styles.section}
        >
          <View style={styles.rolesContainer}>
            {roles.map((role, index) => {
              const normalizedRole = normalizeRole(role);
              // Compare with activeRole (which is in SharedUserRole format)
              const isActive = activeRole === normalizedRole;
              const isPrimary = index === 0;
              
              const gradientColors = isActive
                ? [theme.colors.primary[500], theme.colors.primary[600], theme.colors.primary.DEFAULT]
                : [theme.colors.primary[200], theme.colors.primary[100], theme.colors.primary[50]];
              const w = Math.max(roleBadgeLayout.width, 140);
              const h = Math.max(roleBadgeLayout.height, 56);

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleRoleSwitch(role)}
                  disabled={isActive || roles.length === 1}
                  activeOpacity={0.7}
                  onLayout={handleRoleBadgeLayout}
                >
                  <View
                    style={[
                      styles.roleBadge,
                      styles.roleBadgeWithGradient,
                      isActive && styles.roleBadgeActive,
                      roles.length === 1 && styles.roleBadgeDisabled,
                    ]}
                  >
                    {w > 0 && h > 0 && (
                      <Canvas style={[styles.roleBadgeGradientCanvas, { width: w, height: h }]}>
                        <RoundedRect x={0} y={0} width={w} height={h} r={theme.borderRadius.lg}>
                          <LinearGradient
                            start={vec(0, 0)}
                            end={vec(w, h)}
                            colors={gradientColors}
                          />
                        </RoundedRect>
                      </Canvas>
                    )}
                    <View style={styles.roleBadgeContent}>
                      <View style={styles.roleBadgeLeft}>
                        <Text
                          variant="captionSmall"
                          fontWeight="semibold"
                          color={isActive ? theme.colors.text.inverse : theme.colors.primary[600]}
                          style={styles.roleBadgeLabel}
                        >
                          {isPrimary ? 'Primary' : 'Secondary'}
                        </Text>
                        <Text
                          variant="bodyMedium"
                          fontWeight="semibold"
                          color={isActive ? theme.colors.text.inverse : theme.colors.text.primary}
                          style={styles.roleBadgeValue}
                        >
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
                  </View>
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
          <AppIcon.Organization width={24} height={24} color={theme.colors.text.tertiary} />
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Company Name</Text>
            <Text style={styles.contactValue}>{companyName}</Text>
          </View>
        </Card>

        <Card variant="compact" style={styles.contactItemContainer}>
          <AppIcon.Security width={24} height={24} color={theme.colors.text.tertiary} />
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>GSTIN</Text>
            <Text style={styles.contactValue}>{gstIn}</Text>
          </View>
        </Card>

        {operationArea && operationArea !== 'Not Set' && (
          <Card variant="compact" style={styles.contactItemContainer}>
            <AppIcon.Globe width={24} height={24} color={theme.colors.text.tertiary} />
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
        <TouchableOpacity style={styles.settingsItem} onPress={handleAccountSettings} activeOpacity={0.7}>
          <View style={styles.settingsItemLeft}>
            <View style={styles.settingsIcon}>
              <AppIcon.Settings width={22} height={22} color={theme.colors.text.tertiary} />
            </View>
            <Text style={styles.settingsLabel}>Account Settings</Text>
          </View>
          <AppIcon.ChevronRight width={20} height={20} color={theme.colors.text.tertiary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsItem} onPress={handleManageRoles} activeOpacity={0.7}>
          <View style={styles.settingsItemLeft}>
            <View style={styles.settingsIcon}>
              <AppIcon.Person width={22} height={22} color={theme.colors.text.tertiary} />
            </View>
            <Text style={styles.settingsLabel}>Manage Roles</Text>
          </View>
          <AppIcon.ChevronRight width={20} height={20} color={theme.colors.text.tertiary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsItem} onPress={handleHelpSupport} activeOpacity={0.7}>
          <View style={styles.settingsItemLeft}>
            <View style={styles.settingsIcon}>
              <AppIcon.Warning width={22} height={22} color={theme.colors.text.tertiary} />
            </View>
            <Text style={styles.settingsLabel}>Help & Support</Text>
          </View>
          <AppIcon.ChevronRight width={20} height={20} color={theme.colors.text.tertiary} />
        </TouchableOpacity>
      </Section>

      {/* Logout Button */}
      <CustomButton
        title="Log Out"
        onPress={handleLogout}
        variant="danger"
        size="md"
        loading={logoutMutation.isPending}
        disabled={logoutMutation.isPending}
        rightIcon={
          <AppIcon.ArrowRight width={20} height={20} color={theme.colors.text.inverse} />
        }
        style={styles.logoutButton}
      />

      {/* Version */}
      <Text style={styles.versionText}>v1.0.4</Text>
    </ScreenWrapper>
  );
};

export default ProfileScreen;

