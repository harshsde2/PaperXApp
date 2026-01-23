import React, { useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  Linking,
  Alert,
  ActivityIndicator,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from '@navigation/constants';
import { Text } from '@shared/components/Text';
import { useSendOTP } from '@services/api';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { useForm, FormInput, validationRules } from '@shared/forms';
import { LoginScreenNavigationProp } from './@types';
import { createStyles } from './styles';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { baseColors } from '@theme/tokens/base';
import { Canvas, Group, Path, Skia } from '@shopify/react-native-skia';

type LoginFormData = {
  mobile: string;
};

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const { mutate: sendOTP, isPending: isSendingOTP } = useSendOTP();
  const { width, height } = useWindowDimensions();

  const { control, handleSubmit, formState: { isValid } } = useForm<LoginFormData>({
    defaultValues: {
      mobile: '',
    },
    mode: 'onChange', // Validate on change so errors show immediately
  });

  const onSubmit = (data: LoginFormData) => {
    sendOTP({ mobile: data.mobile.trim() }, {
      onSuccess: () => {
        navigation.navigate(SCREENS.AUTH.OTP_VERIFICATION, {
          mobile: data.mobile.trim(),
          purpose: 'login',
        });
      },
      onError: (error: Error) => {
        console.error('[LoginScreen] Send OTP Error:', error);
        Alert.alert('Error', error.message);
      },
    });
  };

  // Gradient Colors (Same as SplashScreen)
  const gradientColors = [
    baseColors.blue50,    // Lightest blue
    '#FFFFFF',            // White
    baseColors.blue100,
    baseColors.blue200,
    baseColors.blue300,   // Slightly darker middle
    baseColors.blue200,
    baseColors.blue100,
    '#FFFFFF',
  ];

  const GridBackground = useMemo(() => {
    const gridSize = 40;
    const path = Skia.Path.Make();
    
    // Vertical lines
    for (let i = 0; i <= width; i += gridSize) {
      path.moveTo(i, 0);
      path.lineTo(i, height);
    }

    // Horizontal lines
    for (let i = 0; i <= height; i += gridSize) {
      path.moveTo(0, i);
      path.lineTo(width, i);
    }

    return (
      <Canvas style={StyleSheet.absoluteFill}>
        <Group opacity={0.3}>
          <Path 
            path={path} 
            color="white" 
            style="stroke" 
            strokeWidth={1} 
          />
        </Group>
      </Canvas>
    );
  }, [width, height]);

  return (
    <ScreenWrapper
      safeArea={true} // Use false to let gradient cover status bar
      gradient="linear"
      safeAreaEdges={[]}
      gradientColors={gradientColors}
      gradientStart={{ x: 1, y: 0 }}
      gradientEnd={{ x: 0, y: 1 }}
      statusBarStyle="dark-content"
    >
      <View style={[styles.container, { paddingTop: 60 }]}>
        <View style={{alignItems: 'center', marginBottom: 40 }}>
          <AppIcon.ZupplyMainLogo width={100} height={100} color={baseColors.black} />
        </View>

        <Text variant="h1" style={styles.title}>
          Welcome Back
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Enter your verified mobile number to access your secure matchmaking
          session.
        </Text>

        <View style={styles.formContainer}>
          <FormInput
            name="mobile"
            control={control}
            label="Mobile Number"
            placeholder="Enter Your mobile number"
            keyboardType="phone-pad"
            maxLength={10}
            rules={{
              required: 'Mobile number is required',
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'Please enter a valid 10-digit mobile number',
              },
              minLength: {
                value: 10,
                message: 'Mobile number must be 10 digits',
              },
              maxLength: {
                value: 10,
                message: 'Mobile number must be 10 digits',
              },
            }}
            inputStyle={styles.input}
            labelStyle={styles.label}
            containerStyle={{ marginBottom: theme.spacing[6] }}
            showLabel={true}
            showError={true}
          />

          <TouchableOpacity
            style={[
              styles.button,
              (!isValid || isSendingOTP) && styles.buttonDisabled,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid || isSendingOTP}
          >
            {isSendingOTP ? (
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
    </ScreenWrapper>
  );
};

export default LoginScreen;
