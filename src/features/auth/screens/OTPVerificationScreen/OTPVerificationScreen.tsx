import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Linking, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Text } from '@shared/components/Text';
import OTPInput from '@features/auth/components/OTPInput';
import { useSendOTP, useVerifyOTP } from '@services/api';
import { AppIcon } from '@assets/svgs';
import { baseColors } from '@theme/tokens/base';
import {
  OTPVerificationScreenNavigationProp,
  OTPVerificationScreenRouteProp,
} from './@types';
import { styles } from './styles';

const OTPVerificationScreen = () => {
  const navigation = useNavigation<OTPVerificationScreenNavigationProp>();
  const route = useRoute<OTPVerificationScreenRouteProp>();
  const { mobile, purpose } = route.params;
  
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [otp, setOtp] = useState('');
  
  const verifyOTPMutation = useVerifyOTP();
  const sendOTPMutation = useSendOTP();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
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
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
      await verifyOTPMutation.mutateAsync({
        mobile: mobile,
        otp: otpToVerify,
      });
      
      // Success - AppNavigator will automatically switch to MainNavigator
      // when auth state is updated in Redux (isAuthenticated becomes true)
      // No need to navigate manually or show alert
    } catch (error: any) {
      Alert.alert(
        'Verification Failed',
        error?.message || 'Invalid OTP. Please try again.'
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
        error?.message || 'Failed to resend OTP. Please try again.'
      );
    }
  };

  const lastTwoDigits = mobile ? mobile.slice(-2) : '88';

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text variant="h2" style={styles.logo}>Logo</Text>
      </View>
      
      <View style={styles.bottomSection}>
        <View style={styles.headerRow}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <AppIcon.ArrowLeft width={24} height={24} color={baseColors.black} />
          </TouchableOpacity>
          <Text variant="h1" style={styles.title}>Verify Identity</Text>
          <View style={styles.backButton} />
        </View>
        
        <View style={styles.shieldContainer}>
          <View style={styles.shieldIcon}>
            <Text style={styles.shieldCheckmark}>✓</Text>
          </View>
        </View>
        
        <Text variant="h1" style={styles.codeTitle}>Enter Authentication Code</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Please enter the 6-digit code sent to your mobile device ending in{' '}
          <Text style={styles.boldText}>{lastTwoDigits}</Text>.
        </Text>
        
        <OTPInput length={6} onComplete={handleOTPComplete} />
        
        <View style={styles.timerContainer}>
          <Text style={styles.clockIcon}>🕐</Text>
          <Text variant="captionMedium" style={styles.timerText}>
            Code expires in <Text style={styles.boldText}>{formatTime(timeLeft)}</Text>
          </Text>
        </View>
        
        <TouchableOpacity
          style={[
            styles.button,
            (verifyOTPMutation.isPending || sendOTPMutation.isPending || otp.length !== 6) && styles.buttonDisabled,
          ]}
          onPress={() => verifyOTP(otp)}
          disabled={verifyOTPMutation.isPending || sendOTPMutation.isPending || otp.length !== 6}
        >
          {verifyOTPMutation.isPending ? (
            <ActivityIndicator color={baseColors.white} />
          ) : (
            <>
              <Text variant="buttonMedium" style={styles.buttonText}>Verify & Proceed</Text>
              <AppIcon.ArrowRight width={20} height={20} color={baseColors.white} />
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
            <Text variant="captionMedium" style={styles.helpLink}>Having trouble verifying?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default OTPVerificationScreen;

