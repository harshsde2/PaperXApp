import React, { useRef } from 'react';
import { View } from 'react-native';
import { CustomButton } from '@shared/components/CustomButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch } from '@store/hooks';
import { updateUser } from '@store/slices/authSlice';
import { storageService } from '@services/storage/storageService';
import { VerificationStatusScreenNavigationProp, VerificationStatusScreenRouteProp } from './@types';
import { createStyles } from './styles';
import { setRoles } from '@store/slices/roleSlice';
import { UserRole } from '@shared/types';

const VerificationStatusScreen = () => {
  const navigation = useNavigation<VerificationStatusScreenNavigationProp>();
  const route = useRoute<VerificationStatusScreenRouteProp>();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);
  const dispatch = useAppDispatch();
  const hasProceededRef = useRef(false);

  // Get profile data from route params
  const { profileData } = route.params || {};

  // console.log('profileData', JSON.stringify(profileData, null, 2));
  // NOTE: Do NOT update Redux state or storage on screen load.
  // State is updated only when user clicks "Proceed to Dashboard".

  const handleProceedToDashboard = () => {
    if (!profileData || hasProceededRef.current) return;
    hasProceededRef.current = true;

    // User has just completed the full registration flow (this is the last screen).
    // Force completion flags so AppNavigator switches to MainNavigator.
    // (profileData may still have has_completed_registration: false from an earlier API response.)
    const completedProfile = {
      ...profileData,
      has_completed_registration: true,
      profile_complete: true,
    };


    console.log('completedProfile', completedProfile);

    storageService.setUserData(completedProfile);

    // Initialize roles in role slice so dashboard uses correct activeRole immediately
    if (profileData.primary_role) {
      dispatch(
        setRoles({
          primaryRole: profileData.primary_role as UserRole,
          secondaryRole: (profileData as any).secondary_role as UserRole | undefined,
        })
      );
    }

    dispatch(
      updateUser({
        companyName: profileData.company_name || null,
        udyamVerifiedAt: profileData.udyam_verified_at || null,
        has_completed_registration: true,
        profile_complete: true,
        ...completedProfile,
      })
    );



    // AppNavigator will re-render and show MainNavigator (dashboard)
    // because has_completed_registration is now true.
  };

  const handleContactSupport = () => {
    // TODO: Navigate to support/contact screen or open support modal
    console.log('Contact support');
  };

  return (
    <ScreenWrapper
      scrollable
      backgroundColor={theme.colors.background.secondary}
      safeAreaEdges={[]}
      contentContainerStyle={{
        ...styles.scrollContent,
        paddingBottom: theme.spacing[6] + insets.bottom,
      }}
    >
      <View style={styles.container}>
        {/* Verification Status Card */}
        <Card style={styles.verificationCard}>
          <View style={styles.verificationHeader}>
            <View style={styles.verificationIconContainer}>
              <View style={styles.verificationIconBackground}>
                <AppIcon.TickCheckedBox
                  width={48}
                  height={48}
                  color={theme.colors.success.DEFAULT}
                />
              </View>
            </View>
          </View>

          <View style={styles.verificationContent}>
            <View style={styles.statusRow}>
              <View style={styles.approvedBadge}>
                <Text
                  variant="captionSmall"
                  fontWeight="semibold"
                  style={styles.approvedBadgeText}
                >
                  APPROVED
                </Text>
              </View>
              <Text variant="captionSmall" style={styles.timestamp}>
                Just now
              </Text>
            </View>

            <Text variant="h3" fontWeight="bold" style={styles.verificationTitle}>
              {profileData?.udyam_verified_at
                ? 'Verification Approved'
                : 'Registration Submitted'}
            </Text>

            <Text variant="bodyMedium" style={styles.verificationDescription}>
              {profileData?.udyam_verified_at
                ? 'Your UDYAM registration has been successfully validated. You now have full access to global matchmaking services.'
                : 'Your registration has been submitted successfully. Your UDYAM certificate is being verified. You will be notified once verification is complete.'}
            </Text>
          </View>
        </Card>

        {/* Business Details Card */}
        <Card style={styles.businessCard}>
          <Text variant="h4" fontWeight="semibold" style={styles.businessTitle}>
            Business Details
          </Text>

          <View style={styles.detailRow}>
            <Text variant="bodyMedium" style={styles.detailLabel}>
              Business Name
            </Text>
            <Text variant="bodyMedium" fontWeight="semibold" style={styles.detailValue}>
              {profileData?.company_name || 'N/A'}
            </Text>
          </View>

          {profileData?.gst_in && (
            <View style={styles.detailRow}>
              <Text variant="bodyMedium" style={styles.detailLabel}>
                GSTIN
              </Text>
              <Text variant="bodyMedium" fontWeight="semibold" style={styles.detailValue}>
                {profileData.gst_in}
              </Text>
            </View>
          )}

          {profileData?.udyam_certificate && (
            <View style={styles.detailRow}>
              <Text variant="bodyMedium" style={styles.detailLabel}>
                UDYAM Certificate
              </Text>
              <Text variant="bodyMedium" fontWeight="semibold" style={styles.detailValue}>
                {profileData.udyam_verified_at ? 'Verified' : 'Pending Verification'}
              </Text>
            </View>
          )}

          {profileData?.primary_role && (
            <View style={styles.detailRow}>
              <Text variant="bodyMedium" style={styles.detailLabel}>
                Primary Role
              </Text>
              <Text variant="bodyMedium" fontWeight="semibold" style={styles.detailValue}>
                {profileData.primary_role}
              </Text>
            </View>
          )}
        </Card>

        {/* Action Button */}
        <CustomButton
          title="Proceed to Dashboard"
          onPress={handleProceedToDashboard}
          variant="gradient"
          size="lg"
          gradientColors={[
            theme.colors.primary[400],
            theme.colors.primary[600],
            theme.colors.primary.DEFAULT,
          ]}
          gradientStart={{ x: 0, y: 0 }}
          gradientEnd={{ x: 1, y: 1 }}
          rightIcon={
            <AppIcon.ArrowRight
              width={20}
              height={20}
              color={theme.colors.text.inverse}
            />
          }
          style={styles.primaryButton}
        />

      </View>
    </ScreenWrapper>
  );
};

export default VerificationStatusScreen;
