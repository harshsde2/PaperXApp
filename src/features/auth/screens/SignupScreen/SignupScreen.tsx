import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput, Linking, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from '@navigation/constants';
import { Text } from '@shared/components/Text';
import { KeyboardDoneBar } from '@shared/components/KeyboardDoneBar';
import { Toast } from 'toastify-react-native';
import { SignupScreenNavigationProp } from './@types';
import { styles } from './styles';

// Indian mobile: 10 digits, must start with 6, 7, 8, or 9
const INDIAN_MOBILE_REGEX = /^[6-9][0-9]{9}$/;

const SignupScreen = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const [mobileNumber, setMobileNumber] = useState('');

  const isValidMobile = INDIAN_MOBILE_REGEX.test(mobileNumber.trim());

  const handleSendOTP = () => {
    if (!isValidMobile) {
      Toast.show({
        type: 'error',
        text1: 'Invalid mobile number',
        text2: 'Enter a valid 10-digit Indian mobile number (starting 6-9)',
        position: 'top',
      });
      return;
    }
    navigation.navigate(SCREENS.AUTH.OTP_VERIFICATION, {
      mobile: mobileNumber.trim(),
      purpose: 'signup',
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.topSection}>
        <Text variant="h2" style={styles.logo}>Logo</Text>
      </View>

      <View style={styles.bottomSection}>
        <Text variant="h1" style={styles.title}>Create Account</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Enter your mobile number to get started with Zupply
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
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
          />
          
          <TouchableOpacity
            style={[styles.button, !isValidMobile && styles.buttonDisabled]}
            onPress={handleSendOTP}
            disabled={!isValidMobile}
          >
            <Text variant="buttonMedium" style={styles.buttonText}>Send OTP</Text>
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
        </View>
      </View>
      <KeyboardDoneBar />
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

