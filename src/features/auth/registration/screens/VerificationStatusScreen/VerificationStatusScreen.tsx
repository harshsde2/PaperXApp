import React, { useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { useAppDispatch } from '@store/hooks';
import { updateUser } from '@store/slices/authSlice';
import { storageService } from '@services/storage/storageService';
import { SCREENS } from '@navigation/constants';
import { VerificationStatusScreenNavigationProp, VerificationStatusScreenRouteProp } from './@types';
import { createStyles } from './styles';
import type { UpdateProfileResponse } from '@services/api';

const VerificationStatusScreen = () => {
  const navigation = useNavigation<VerificationStatusScreenNavigationProp>();
  const route = useRoute<VerificationStatusScreenRouteProp>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const dispatch = useAppDispatch();

  // Get profile data from route params
  const { profileData } = route.params || {};

  console.log('profileData', JSON.stringify(profileData, null, 2));

  // console.log('[VerificationStatus] Profile data:', JSON.stringify(profileData, null, 2));
  // NOTE: Do NOT update Redux state or storage on screen load
  // State will be updated only when user clicks "Proceed to Dashboard" button
  // This prevents automatic navigation to dashboard

  // Check if UDYAM is verified and redirect to dashboard
  useEffect(() => {
    if (profileData?.udyam_verified_at) {
      // UDYAM is verified, AppNavigator will handle navigation to MainNavigator
      // We can navigate away after a short delay to show the success message
      const timer = setTimeout(() => {
        // Navigation will be handled by AppNavigator based on udyam_verified_at
        // The AppNavigator will check this and show MainNavigator
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [profileData?.udyam_verified_at]);

  const handleProceedToDashboard = () => {
    // Update Redux state and storage ONLY when user clicks "Proceed to Dashboard"
    // This ensures user sees verification status before navigating to dashboard
    if (profileData) {
      // Update storage to persist the data
      storageService.setUserData(profileData);
      console.log('[VerificationStatus] User data saved to storage');

      // Update Redux state to trigger AppNavigator to show MainNavigator
      dispatch(
        updateUser({
          companyName: profileData.company_name || null,
          udyamVerifiedAt: profileData.udyam_verified_at || null,
          ...profileData,
        })
      );
      console.log('[VerificationStatus] Redux state updated, navigating to dashboard');
    }
    
    // AppNavigator will automatically switch to MainNavigator
    // since user has company_name (hasCompletedRegistration = true)
    // The navigation happens automatically when Redux state updates
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
      contentContainerStyle={styles.scrollContent}
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

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleProceedToDashboard}
          activeOpacity={0.8}
        >
          <Text variant="buttonMedium" style={styles.primaryButtonText}>
            Proceed to Dashboard
          </Text>
          <AppIcon.ArrowRight
            width={20}
            height={20}
            color={theme.colors.text.inverse}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleContactSupport}
          activeOpacity={0.8}
        >
          <Text variant="buttonMedium" style={styles.secondaryButtonText}>
            Contact Support
          </Text>
          <Text style={styles.supportIcon}>🎧</Text>
        </TouchableOpacity>

        {/* Security Footer */}
        <View style={styles.securityFooter}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text variant="captionSmall" style={styles.securityText}>
            Secured by 256-bit SSL Encryption
          </Text>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default VerificationStatusScreen;
