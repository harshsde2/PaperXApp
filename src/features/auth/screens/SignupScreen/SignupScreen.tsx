import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from '@navigation/constants';
import { SignupScreenNavigationProp } from './@types';
import { styles } from './styles';

const SignupScreen = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const [mobileNumber, setMobileNumber] = useState('');

  const handleSendOTP = () => {
    if (mobileNumber.trim()) {
      navigation.navigate(SCREENS.AUTH.OTP_VERIFICATION, {
        mobile: mobileNumber,
        purpose: 'signup',
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.logo}>Logo</Text>
      </View>
      
      <View style={styles.bottomSection}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Enter your mobile number to get started with PaperX
        </Text>
        
        <View style={styles.formContainer}>
          <Text style={styles.label}>Mobile Number</Text>
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
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you acknowledge that you have read and understood, and agree to our{' '}
            <Text style={styles.link} onPress={() => Linking.openURL('#')}>
              Privacy Policy
            </Text>{' '}
            and{' '}
            <Text style={styles.link} onPress={() => Linking.openURL('#')}>
              Terms of Service
            </Text>
          </Text>
          
          <View style={styles.securityBadges}>
            <View style={styles.badge}>
              <Text style={styles.badgeIcon}>🔒</Text>
              <Text style={styles.badgeText}>256-bit SSL</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeIcon}>🛡️</Text>
              <Text style={styles.badgeText}>Secure Session</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SignupScreen;

