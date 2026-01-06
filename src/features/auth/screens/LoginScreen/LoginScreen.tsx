import React from 'react';
import {
  View,
  TouchableOpacity,
  Linking,
  Alert,
  ActivityIndicator,
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

type LoginFormData = {
  mobile: string;
};

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const { mutate: sendOTP, isPending: isSendingOTP } = useSendOTP();

  const { control, handleSubmit, formState: { isValid } } = useForm<LoginFormData>({
    defaultValues: {
      mobile: '',
    },
    mode: 'onBlur',
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

  return (
    <View style={styles.container}>
      <Text variant="h2" style={styles.logo}>
        Logo
      </Text>

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
          rules={validationRules.mobile() as any}
          inputStyle={styles.input}
          labelStyle={styles.label}
          containerStyle={{ marginBottom: theme.spacing[6] }}
          showLabel={true}
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
  );
};

export default LoginScreen;
