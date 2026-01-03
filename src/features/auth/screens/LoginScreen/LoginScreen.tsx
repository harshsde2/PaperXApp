import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from '@navigation/constants';
import { Text } from '@shared/components/Text';
import { LoginScreenNavigationProp } from './@types';
import { styles } from './styles';

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [mobileNumber, setMobileNumber] = useState('');

  const handleSendOTP = () => {
    if (mobileNumber.trim()) {
      navigation.navigate(SCREENS.AUTH.OTP_VERIFICATION, {
        mobile: mobileNumber,
        purpose: 'login',
      });
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
            style={[styles.button, !mobileNumber.trim() && styles.buttonDisabled]}
            onPress={handleSendOTP}
            disabled={!mobileNumber.trim()}
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
          
          <TouchableOpacity onPress={() => {}}>
            <Text variant="captionMedium" style={styles.helpLink}>Having trouble signing in?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

