import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from '@navigation/constants';
import { SplashScreenNavigationProp } from './@types';
import { styles } from './styles';

const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.logo}>Logo</Text>
      </View>
      
      <View style={styles.bottomSection}>
        <Text style={styles.title}>Welcome to PaperX</Text>
        <Text style={styles.subtitle}>
          Lorem ipsum dolor sit amet consectetur. Lorem id sit
        </Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => navigation.navigate(SCREENS.AUTH.LOGIN)}
          >
            <Text style={styles.primaryButtonText}>Login</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate(SCREENS.AUTH.SIGNUP)}
          >
            <Text style={styles.secondaryButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SplashScreen;

