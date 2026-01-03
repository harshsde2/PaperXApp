import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import OTPInput from '@features/auth/components/OTPInput';
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

  const handleOTPComplete = (otp: string) => {
    // TODO: Verify OTP with backend
    console.log('OTP entered:', otp);
    
    if (purpose === 'login') {
      // Navigate to Dashboard after successful login
      // navigation.navigate('Dashboard' as never);
    } else {
      // Navigate to Registration flow
      // navigation.navigate('CompanyDetails' as never);
    }
  };

  const handleResend = () => {
    // TODO: Resend OTP
    setTimeLeft(120);
    setCanResend(false);
  };

  const maskedMobile = mobile ? `${mobile.slice(0, 2)}${mobile.slice(-2)}` : 'XX86';

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.logo}>Logo</Text>
      </View>
      
      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>
          Please enter the 6-digit code sent to your mobile device ending in {maskedMobile}.
        </Text>
        
        <OTPInput length={6} onComplete={handleOTPComplete} />
        
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>
            Code expires in {formatTime(timeLeft)}
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleOTPComplete('123456')} // Temporary for testing
        >
          <Text style={styles.buttonText}>Verify & Proceed</Text>
        </TouchableOpacity>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Didn't receive code?{' '}
            {canResend ? (
              <Text style={styles.resendLink} onPress={handleResend}>
                Resend Code
              </Text>
            ) : (
              <Text style={styles.resendDisabled}>
                Resend Code ({formatTime(timeLeft)})
              </Text>
            )}
          </Text>
          
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.helpLink}>Having trouble verifying?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default OTPVerificationScreen;

