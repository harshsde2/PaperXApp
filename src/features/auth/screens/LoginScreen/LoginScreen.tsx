import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput, Linking, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from '@navigation/constants';
import { Text } from '@shared/components/Text';
import { useSendOTP } from '@services/api';
import { LoginScreenNavigationProp } from './@types';
import { styles } from './styles';

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
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
      // Navigate to OTP verification screen on success
      navigation.navigate(SCREENS.AUTH.OTP_VERIFICATION, {
        mobile: mobileNumber.trim(),
        purpose: 'login',
      });
    } catch (error: any) {
      console.log("error ---->",JSON.stringify(error,null,2));
      Alert.alert(
        'Error',
        error?.message || 'Failed to send OTP. Please try again.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text variant="h2" style={styles.logo}>Logo</Text>
      </View>
      
      <View style={styles.bottomSection}>
        <Text variant="h1" style={styles.title}>Welcome Back</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Enter your verified mobile number to access your secure matchmaking session.
        </Text>
        
        <View style={styles.formContainer}>
          <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Your mobile number"
            placeholderTextColor="#999999"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="phone-pad"
            maxLength={10}
          />
          
          <TouchableOpacity
            style={[
              styles.button,
              (!mobileNumber.trim() || sendOTPMutation.isPending) && styles.buttonDisabled,
            ]}
            onPress={handleSendOTP}
            disabled={!mobileNumber.trim() || sendOTPMutation.isPending}
          >
            {sendOTPMutation.isPending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text variant="buttonMedium" style={styles.buttonText}>Send OTP</Text>
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text variant="captionMedium" style={styles.footerText}>
            By continuing, you acknowledge that you have read and understood, and agree to our{' '}
            <Text variant="captionMedium" style={styles.link} onPress={() => Linking.openURL('#')}>
              Privacy Policy
            </Text>{' '}
            and{' '}
            <Text variant="captionMedium" style={styles.link} onPress={() => Linking.openURL('#')}>
              Terms of Service
            </Text>
          </Text>
          
          <View style={styles.securityBadges}>
            <View style={styles.badge}>
              <Text variant="bodyMedium" style={styles.badgeIcon}>🔒</Text>
              <Text variant="captionMedium" style={styles.badgeText}>256-bit SSL</Text>
            </View>
            <View style={styles.badge}>
              <Text variant="bodyMedium" style={styles.badgeIcon}>🛡️</Text>
              <Text variant="captionMedium" style={styles.badgeText}>Secure Session</Text>
            </View>
          </View>
          
          <TouchableOpacity onPress={() => {}}>
            <Text variant="captionMedium" style={styles.helpLink}>Having trouble signing in?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

