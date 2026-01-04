import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { useAppDispatch } from '@store/hooks';
import { setCredentials } from '@store/slices/authSlice';
import { SCREENS } from '@navigation/constants';
import { VerificationStatusScreenNavigationProp } from './@types';
import { createStyles } from './styles';

const VerificationStatusScreen = () => {
  const navigation = useNavigation<VerificationStatusScreenNavigationProp>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const dispatch = useAppDispatch();

  const handleProceedToDashboard = () => {
    // TODO: Set user as verified and authenticated
    // For now, this will be handled by the actual verification flow
    // dispatch(setCredentials({ ... }));
    // Navigation will be handled by AppNavigator based on auth state
    navigation.navigate(SCREENS.AUTH.MATERIALS);
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
              Verification Approved
            </Text>

            <Text variant="bodyMedium" style={styles.verificationDescription}>
              Your UDYAM registration has been successfully validated. You now
              have full access to global matchmaking services.
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
              Acme Packaging Ltd.
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text variant="bodyMedium" style={styles.detailLabel}>
              UDYAM No.
            </Text>
            <Text variant="bodyMedium" fontWeight="semibold" style={styles.detailValue}>
              UDYAM-MH-33-0004521
            </Text>
          </View>
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
