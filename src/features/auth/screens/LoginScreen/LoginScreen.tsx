import React, { useEffect, useState } from 'react';
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
import { api, useSendOTP } from '@services/api';
import { AppIcon } from '@assets/svgs';
import { baseColors } from '@theme/tokens/base';
import { LoginScreenNavigationProp } from './@types';
import { styles } from './styles';
import axios from 'axios';

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [mobileNumber, setMobileNumber] = useState('');
  const sendOTPMutation = useSendOTP();

  const testAPI = async () => {
    try {
      console.log('[Test API] Starting GET request...');
      
      const response = await fetch(
        'https://testingapp.payairo.com/api/materials',
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          // Note: GET requests should NOT have a body
        },
      );

      console.log('[Test API] Response status:', response.status);
      console.log('[Test API] Response ok:', response.ok);

      // Check if response is successful (status 200-299)
      if (!response.ok) {
        // Try to parse error response
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: `Request failed with status ${response.status}` };
        }
        
        console.error('[Test API] Server Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });
        
        Alert.alert(
          'API Error',
          errorData?.message || `Request failed with status ${response.status}`
        );
        return;
      }

      // Parse successful response
      const result = await response.json();
      console.log('[Test API] Success:', JSON.stringify(result, null, 2));
      
      Alert.alert(
        'Success',
        `API call successful! Received ${Array.isArray(result) ? result.length : 'data'} items.`
      );

    } catch (error: any) {
      // Handle network errors, timeouts, or parsing errors
      console.error('[Test API] Network or Parsing Error:', {
        message: error?.message,
        name: error?.name,
        code: error?.code,
      });
      
      Alert.alert(
        'Network Error',
        error?.message || 'Failed to connect to the server. Please check your internet connection.'
      );
    }
  };
  

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
      // await sendOTPMutation.mutateAsync({ mobile: mobileNumber.trim() });
      // Navigate to OTP verification screen on success
      navigation.navigate(SCREENS.AUTH.OTP_VERIFICATION, {
        mobile: mobileNumber.trim(),
        purpose: 'login',
      });
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
      <View style={styles.topSection}>
        <Text variant="h2" style={styles.logo}>
          Logo
        </Text>
      </View>

      <View style={styles.bottomSection}>
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
            placeholderTextColor={baseColors.gray500}
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
              <ActivityIndicator color={baseColors.white} />
            ) : (
              <>
                <Text variant="buttonMedium" style={styles.buttonText}>
                  Send OTP
                </Text>
                <AppIcon.ArrowRight
                  width={20}
                  height={20}
                  color={baseColors.white}
                />
              </>
            )}
          </TouchableOpacity>
          {/* <TouchableOpacity style={[styles.button]} onPress={testAPI}>
            <Text variant="buttonMedium" style={styles.buttonText}>
              Test API
            </Text>
          </TouchableOpacity> */}
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
    </View>
  );
};

export default LoginScreen;
