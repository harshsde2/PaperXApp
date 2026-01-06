import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from '@navigation/constants';
import { Text } from '@shared/components/Text';
import { useSendOTP } from '@services/api';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { LoginScreenNavigationProp } from './@types';
import { createStyles } from './styles';

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const [mobileNumber, setMobileNumber] = useState('');
  const sendOTPMutation = useSendOTP();

  const handleSendOTP = async () => {
    if (!mobileNumber.trim()) {
      Alert.alert('Error', 'Please enter a valid mobile number');
      return;
    }

    // Validate mobile number (10 digits for Indian numbers)
    if (mobileNumber.trim().length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      await sendOTPMutation.mutateAsync({ mobile: mobileNumber.trim() });
      navigation.navigate(SCREENS.AUTH.OTP_VERIFICATION, {
        mobile: mobileNumber.trim(),
        purpose: 'login',
      });
      // navigation.navigate(SCREENS.AUTH.CONVERTER_TYPE);
    } catch (error: any) {
      // Enhanced error logging
      console.error('[LoginScreen] Send OTP Error:', {
        message: error?.message,
        name: error?.name,
        code: error?.code,
        stack: error?.stack,
        fullError: error,
      });

      // Extract user-friendly error message
      let errorMessage = 'Failed to send OTP. Please try again.';

      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="h2" style={styles.logo}>
        Logo
      </Text>

      <Text variant="h1" style={styles.title}>
        Welcome Back
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Enter your verified mobile number to access your secure matchmaking
        session.
      </Text>

      <View style={styles.formContainer}>
        <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
          Mobile Number
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Your mobile number"
          placeholderTextColor={theme.colors.text.tertiary}
          value={mobileNumber}
          onChangeText={setMobileNumber}
          keyboardType="phone-pad"
          maxLength={10}
        />

        <TouchableOpacity
          style={[
            styles.button,
            (!mobileNumber.trim() || sendOTPMutation.isPending) &&
              styles.buttonDisabled,
          ]}
          onPress={handleSendOTP}
          disabled={!mobileNumber.trim() || sendOTPMutation.isPending}
        >
          {sendOTPMutation.isPending ? (
            <ActivityIndicator color={theme.colors.text.inverse} />
          ) : (
            <>
              <Text variant="buttonMedium" style={styles.buttonText}>
                Send OTP
              </Text>
              <AppIcon.ArrowRight
                width={20}
                height={20}
                color={theme.colors.text.inverse}
              />
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text variant="captionMedium" style={styles.footerText}>
          By continuing, you acknowledge that you have read and understood,
          and agree to our{' '}
          <Text
            variant="captionMedium"
            style={styles.link}
            onPress={() => Linking.openURL('#')}
          >
            Privacy Policy
          </Text>{' '}
          and{' '}
          <Text
            variant="captionMedium"
            style={styles.link}
            onPress={() => Linking.openURL('#')}
          >
            Terms of Service
          </Text>
        </Text>

        <View style={styles.securityBadges}>
          <View style={styles.badge}>
            <Text variant="bodyMedium" style={styles.badgeIcon}>
              🔒
            </Text>
            <Text variant="captionMedium" style={styles.badgeText}>
              256-bit SSL
            </Text>
          </View>
          <View style={styles.badgeDivider} />
          <View style={styles.badge}>
            <Text variant="bodyMedium" style={styles.badgeIcon}>
              🛡️
            </Text>
          </View>
          <View style={styles.badgeDivider} />
          <View style={styles.badge}>
            <Text variant="bodyMedium" style={styles.badgeIcon}>
              👤
            </Text>
            <Text variant="captionMedium" style={styles.badgeText}>
              Secure Session
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => {}}>
          <Text variant="captionMedium" style={styles.helpLink}>
            Having trouble signing in?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
