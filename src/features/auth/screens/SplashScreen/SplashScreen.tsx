import React, { useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from '@navigation/constants';
import { Text } from '@shared/components/Text';
import { useTheme } from '@theme/index';
import { useAppSelector } from '@store/hooks';
import { SplashScreenNavigationProp } from './@types';
import { styles } from './styles';

const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const theme = useTheme();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Auto-navigate if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // User is already logged in, AppNavigator will handle showing MainNavigator
      // No need to navigate here as the navigation is handled at AppNavigator level
    }
  }, [isAuthenticated]);

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text variant="h1" color={theme.colors.text.inverse} >Logo</Text>
      </View>
      
      <View style={styles.bottomSection}>
        <Text variant="h1" style={styles.title}>Welcome to PaperX</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Lorem ipsum dolor sit amet consectetur. Lorem id sit
        </Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => navigation.navigate(SCREENS.AUTH.LOGIN)}
          >
            <Text variant="buttonMedium" style={styles.primaryButtonText}>Login</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate(SCREENS.AUTH.SIGNUP)}
          >
            <Text variant="buttonMedium" style={styles.secondaryButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SplashScreen;

