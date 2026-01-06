import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Controller } from 'react-hook-form';
import { Text } from '@shared/components/Text';
import OTPInput from '@features/auth/components/OTPInput';
import { useSendOTP, useVerifyOTP } from '@services/api';
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

type OTPFormData = {
  otp: string;
};

const OTPVerificationScreen = () => {
  const navigation = useNavigation<OTPVerificationScreenNavigationProp>();
  const route = useRoute<OTPVerificationScreenRouteProp>();
  const { mobile, purpose } = route.params;
  const theme = useTheme();
  const styles = createStyles(theme);

  const [timeLeft, setTimeLeft] = useState(120);
  const [canResend, setCanResend] = useState(false);

  const { control, handleSubmit, formState: { isValid }, setValue, watch } = useForm<OTPFormData>({
    defaultValues: {
      otp: '',
    },
    mode: 'onChange',
  });

  const otp = watch('otp');

  const {mutate: verifyOTP, isPending: isVerifyingOTP} = useVerifyOTP();
  const {mutate: sendOTP, isPending: isSendingOTP} = useSendOTP();

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
    verifyOTP({ mobile: mobile, otp: data.otp }, {
      onSuccess: () => {
        navigation.navigate(SCREENS.AUTH.COMPANY_DETAILS);
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
