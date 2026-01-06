import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Text } from '@shared/components/Text';
import OTPInput from '@features/auth/components/OTPInput';
import { useSendOTP, useVerifyOTP } from '@services/api';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import {
  OTPVerificationScreenNavigationProp,
  OTPVerificationScreenRouteProp,
} from './@types';
import { createStyles } from './styles';
import { SCREENS } from '@navigation/constants';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';

const OTPVerificationScreen = () => {
  const navigation = useNavigation<OTPVerificationScreenNavigationProp>();
  const route = useRoute<OTPVerificationScreenRouteProp>();
  const { mobile, purpose } = route.params;
  const theme = useTheme();
  const styles = createStyles(theme);

  const [timeLeft, setTimeLeft] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [otp, setOtp] = useState('');

  const verifyOTPMutation = useVerifyOTP();
  const sendOTPMutation = useSendOTP();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const handleOTPComplete = (enteredOtp: string) => {
    // Store OTP when all digits are entered
    setOtp(enteredOtp);
    // Automatically verify when 6 digits are entered
    if (enteredOtp.length === 6) {
      verifyOTP(enteredOtp);
    }
  };

  const verifyOTP = async (otpToVerify: string) => {
    if (!otpToVerify || otpToVerify.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    // Prevent multiple simultaneous verification attempts
    if (verifyOTPMutation.isPending) {
      return;
    }

    try {
      const response = await verifyOTPMutation.mutateAsync({
        mobile: mobile,
        otp: otpToVerify,
      });

      // Check if user has completed registration (company_name exists)
      // Response structure: { type, token, user: { company_name, ... } }
      const responseData = response as any;
      const user = responseData?.user;
      const companyName = user?.company_name;

      // If company_name is null or undefined, user needs to complete registration
      if (!companyName) {
        navigation.navigate(SCREENS.AUTH.COMPANY_DETAILS);
      }
      // Otherwise, AppNavigator will automatically switch to MainNavigator
      // when auth state is updated in Redux (isAuthenticated becomes true)
    } catch (error: any) {
      Alert.alert(
        'Verification Failed',
        error?.message || 'Invalid OTP. Please try again.',
      );
      // Clear OTP input on error
      setOtp('');
    }
  };

  const handleResend = async () => {
    try {
      await sendOTPMutation.mutateAsync({ mobile: mobile });
      setTimeLeft(120);
      setCanResend(false);
      setOtp('');
      Alert.alert('Success', 'OTP has been resent to your mobile number');
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.message || 'Failed to resend OTP. Please try again.',
      );
    }
  };

  const lastTwoDigits = mobile ? mobile.slice(-2) : '88';

  return (
    <ScreenWrapper
      scrollable
      backgroundColor={theme.colors.background.secondary}
      safeAreaEdges={['top']}
      paddingHorizontal={theme.spacing[4]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.shieldContainer}>
        <View style={styles.shieldIconWrapper}>
          <AppIcon.Security
            width={50}
            height={50}
            color={theme.colors.primary.DEFAULT}
          />
        </View>
      </View>

      <Text variant="h1" style={styles.codeTitle}>
        Enter Authentication Code
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Please enter the 6-digit code sent to your mobile device ending in{' '}
        <Text style={styles.boldText}>{lastTwoDigits}</Text>.
      </Text>
      <View style={styles.otpInputContainer}>
        <OTPInput length={6} onComplete={handleOTPComplete} />
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.clockIcon}>🕐</Text>
        <Text variant="captionMedium" style={styles.timerText}>
          Code expires in{' '}
          <Text style={styles.boldText}>{formatTime(timeLeft)}</Text>
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          (verifyOTPMutation.isPending ||
            sendOTPMutation.isPending ||
            otp.length !== 6) &&
            styles.buttonDisabled,
        ]}
        onPress={() => verifyOTP(otp)}
        disabled={
          verifyOTPMutation.isPending ||
          sendOTPMutation.isPending ||
          otp.length !== 6
        }
      >
        {verifyOTPMutation.isPending ? (
          <ActivityIndicator color={theme.colors.text.inverse} />
        ) : (
          <>
            <Text variant="buttonMedium" style={styles.buttonText}>
              Verify & Proceed
            </Text>
            <AppIcon.ArrowRight
              width={20}
              height={20}
              color={theme.colors.text.inverse}
            />
          </>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text variant="captionMedium" style={styles.footerText}>
          Didn't receive code?{' '}
          {canResend ? (
            <Text
              variant="captionMedium"
              style={styles.resendLink}
              onPress={sendOTPMutation.isPending ? undefined : handleResend}
            >
              {sendOTPMutation.isPending ? 'Sending...' : 'Resend Code'}
            </Text>
          ) : (
            <Text variant="captionMedium" style={styles.resendDisabled}>
              Resend Code
            </Text>
          )}
        </Text>

        <TouchableOpacity onPress={() => {}}>
          <Text variant="captionMedium" style={styles.helpLink}>
            Having trouble verifying?
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default OTPVerificationScreen;
