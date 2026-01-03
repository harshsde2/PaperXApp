import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SCREENS } from './constants';
import SplashScreen from '@features/auth/screens/SplashScreen/SplashScreen';
import LoginScreen from '@features/auth/screens/LoginScreen/LoginScreen';
import SignupScreen from '@features/auth/screens/SignupScreen/SignupScreen';
import OTPVerificationScreen from '@features/auth/screens/OTPVerificationScreen/OTPVerificationScreen';

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  OTPVerification: { mobile: string; purpose: 'login' | 'signup' };
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={SCREENS.AUTH.SPLASH}
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen name={SCREENS.AUTH.SPLASH} component={SplashScreen} />
      <Stack.Screen name={SCREENS.AUTH.LOGIN} component={LoginScreen} />
      <Stack.Screen name={SCREENS.AUTH.SIGNUP} component={SignupScreen} />
      <Stack.Screen
        name={SCREENS.AUTH.OTP_VERIFICATION}
        component={OTPVerificationScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;

