import React, { useState, useEffect, useMemo } from 'react';
import { View, TouchableOpacity, Alert, ActivityIndicator, useWindowDimensions, StyleSheet } from 'react-native';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { Controller } from 'react-hook-form';
import { Text } from '@shared/components/Text';
import OTPInput from '@features/auth/components/OTPInput';
import { useSendOTP, useVerifyOTP, type VerifyOTPResult } from '@services/api';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { useForm } from '@shared/forms';
import {
  OTPVerificationScreenNavigationProp,
  OTPVerificationScreenRouteProp,
} from './@types';
import { createStyles } from './styles';
import { SCREENS } from '@navigation/constants';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { baseColors } from '@theme/tokens/base';
import { Canvas, Group, Path, Skia } from '@shopify/react-native-skia';
import { getFirstRegistrationScreen } from '@navigation/helpers';
import type { UserRole } from '@shared/types';

type OTPFormData = {
  otp: string;
};

const OTPVerificationScreen = () => {
  const navigation = useNavigation<OTPVerificationScreenNavigationProp>();
  const route = useRoute<OTPVerificationScreenRouteProp>();
  const { mobile, purpose } = route.params;
  const theme = useTheme();
  const styles = createStyles(theme);
  const { width, height } = useWindowDimensions();

  const [timeLeft, setTimeLeft] = useState(120);
  const [canResend, setCanResend] = useState(false);

  // Gradient Colors (Same as SplashScreen and LoginScreen)
  const gradientColors = [
    baseColors.blue50,    // Lightest blue
    '#FFFFFF',            // White
    baseColors.blue100,
    baseColors.blue200,
    baseColors.blue300,   // Slightly darker middle
    baseColors.blue200,
    baseColors.blue100,
    '#FFFFFF',
  ];

  const GridBackground = useMemo(() => {
    const gridSize = 40;
    const path = Skia.Path.Make();
    
    // Vertical lines
    for (let i = 0; i <= width; i += gridSize) {
      path.moveTo(i, 0);
      path.lineTo(i, height);
    }

    // Horizontal lines
    for (let i = 0; i <= height; i += gridSize) {
      path.moveTo(0, i);
      path.lineTo(width, i);
    }

    return (
      <Canvas style={StyleSheet.absoluteFill}>
        <Group opacity={0.3}>
          <Path 
            path={path} 
            color="white" 
            style="stroke" 
            strokeWidth={1} 
          />
        </Group>
      </Canvas>
    );
  }, [width, height]);

  const { control, handleSubmit, formState: { isValid }, setValue, watch } = useForm<OTPFormData>({
    defaultValues: {
      otp: '',
    },
    mode: 'onChange',
  });

  const otp = watch('otp');

  const {mutate: verifyOTP, isPending: isVerifyingOTP} = useVerifyOTP();
  const {mutate: sendOTP, isPending: isSendingOTP} = useSendOTP();

  /**
   * Normalize backend primary_role string to shared UserRole type.
   * Handles formats like "machine-dealer", "machine_dealer", "machineDealer", etc.
   */
  const normalizeRole = (role: string | null | undefined): UserRole | null => {
    if (!role) return null;
    const normalized = role.toLowerCase().replace(/[\s_]+/g, '-');

    if (normalized === 'machine-dealer' || normalized === 'machinedealer') {
      return 'machineDealer';
    }

    const roleMap: Record<string, UserRole> = {
      dealer: 'dealer',
      converter: 'converter',
      brand: 'brand',
      mill: 'mill',
      'scrap-dealer': 'scrapDealer',
    };

    return roleMap[normalized] ?? null;
  };

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
    setValue('otp', enteredOtp, { shouldValidate: true });
    if (enteredOtp.length === 6) {
      handleSubmit(onSubmit)();
    }
  };

  const onSubmit = (data: OTPFormData) => {
    if (isVerifyingOTP) {
      return;
    }
    verifyOTP(
      { mobile: mobile, otp: data.otp },
      {
        onSuccess: (result: VerifyOTPResult) => {
          const profile = result.profile as any;
          const hasCompletedRegistration = result.hasCompletedRegistration;
          const hasCompanyDetails = !!profile?.company_name;

          // Case 3: User has fully completed registration for their role -> go to dashboard
          // AppNavigator will pick this up via auth state (no manual navigation needed here).
          if (hasCompletedRegistration) {
            return;
          }

          // Case 1: First-time user, no company details yet -> go to Company Details screen
          if (!hasCompanyDetails) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: SCREENS.AUTH.COMPANY_DETAILS }],
              })
            );
            return;
          }

          // Case 2: Company details exist but role-specific registration not completed.
          // Redirect to the first registration screen for the user's primary role.
          const rawPrimaryRole: string | undefined =
            profile?.primary_role ?? profile?.primaryRole ?? undefined;
          const normalizedRole = normalizeRole(rawPrimaryRole);

          if (normalizedRole) {
            const firstScreen = getFirstRegistrationScreen(normalizedRole);

            if (firstScreen && firstScreen !== SCREENS.AUTH.VERIFICATION_STATUS) {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    {
                      // firstScreen is an auth-stack screen name
                      name: firstScreen as never,
                      // Pass profile data so registration flow screens can use it
                      params: { profileData: profile } as never,
                    },
                  ],
                })
              );
              return;
            }
          }

          // Fallback: if we can't determine a specific flow, go to verification status.
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: SCREENS.AUTH.VERIFICATION_STATUS as never,
                  params: { profileData: profile } as never,
                },
              ],
            })
          );
        },
      onError: (error: Error) => {
        console.error('[OTPVerificationScreen] Verify OTP Error:', error);
        Alert.alert('Error', error.message);
      },
    });
  };

  const handleResendOTP = async () => {
    sendOTP({ mobile: mobile }, {
      onSuccess: () => {
        setTimeLeft(120);
        setCanResend(false);
        setValue('otp', '');
        Alert.alert('Success', 'OTP has been resent to your mobile number');
      },
      onError: (error: Error) => {
        console.error('[OTPVerificationScreen] Send OTP Error:', error);
        Alert.alert('Error', error.message);
      },
    });
  };

  const lastTwoDigits = mobile ? mobile.slice(-2) : '88';

  return (
    <ScreenWrapper
      scrollable
      safeArea={true}
      safeAreaEdges={['top']}
      gradient="linear"
      gradientColors={gradientColors}
      gradientStart={{ x: 1, y: 0 }}
      gradientEnd={{ x: 0, y: 1 }}
      // backgroundElement={GridBackground}
      statusBarStyle="dark-content"
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
        <Controller
          control={control}
          name="otp"
          rules={{
            required: 'Please enter the OTP',
            minLength: {
              value: 6,
              message: 'OTP must be 6 digits',
            },
            maxLength: {
              value: 6,
              message: 'OTP must be 6 digits',
            },
            pattern: {
              value: /^[0-9]{6}$/,
              message: 'Please enter a valid 6-digit OTP',
            },
          }}
          render={({ field: { value } }) => (
            <OTPInput length={6} onComplete={handleOTPComplete} />
          )}
        />
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
          (!isValid || isVerifyingOTP || isSendingOTP) && styles.buttonDisabled,
        ]}
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid || isVerifyingOTP || isSendingOTP}
      >
        {isVerifyingOTP ? (
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
              onPress={isSendingOTP ? undefined : handleResendOTP}
            >
              {isSendingOTP ? 'Sending...' : 'Resend Code'}
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
