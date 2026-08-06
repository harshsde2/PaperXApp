import { AppIcon } from '@assets/svgs';
import { SCREENS } from '@navigation/constants';
import { useNavigation } from '@react-navigation/native';
import { useSendOTP } from '@services/api';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { FormInput, useForm } from '@shared/forms';
import { useTheme } from '@theme/index';
import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { CustomButton } from '@shared/components/CustomButton';
import { LegalModal } from '@shared/components/LegalModal';
import type { LegalDocType } from '@shared/components/LegalModal/@types';
import { Toast } from 'toastify-react-native';
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
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [legalDoc, setLegalDoc] = useState<LegalDocType | null>(null);

  const { control, handleSubmit } = useForm<LoginFormData>({
    defaultValues: {
      mobile: '',
    },
    mode: 'onChange',
  });

  const onSubmit = useCallback(
    (data: LoginFormData) => {
      if (!agreedToTerms) {
        Toast.show({
          type: 'error',
          text1: 'Terms Required',
          text2: 'Please agree to the Terms and Conditions and Privacy Policy',
          position: 'top',
        });
        return;
      }
      sendOTP(
        { mobile: data.mobile.trim() },
        {
          onSuccess: () => {
            Toast.show({
              type: 'success',
              text1: 'Success!',
              text2: 'OTP sent successfully!',
              position: 'top',
            });
            navigation.navigate(SCREENS.AUTH.OTP_VERIFICATION, {
              mobile: data.mobile.trim(),
              purpose: 'login',
            });
          },
          onError: (error: Error) => {
            console.error('[LoginScreen] Send OTP Error:', error);
            const errorMessage = error?.message || 'Failed to send OTP. Please try again.';
            Toast.show({
              type: 'error',
              text1: 'Something went wrong!',
              text2: errorMessage,
              position: 'top',
            });
          },
        }
      );
    },
    [agreedToTerms, sendOTP, navigation]
  );

  const onInvalid = useCallback(
    (errors: { mobile?: { message?: string } }) => {
      const message = errors.mobile?.message || 'Please enter a valid 10-digit mobile number';
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: message,
        position: 'top',
      });
    },
    []
  );

  const handleSendOTPPress = useCallback(() => {
    handleSubmit(onSubmit, onInvalid)();
  }, [handleSubmit, onSubmit, onInvalid]);

  const gradientColors = useMemo(
    () => [
      theme.colors.primary[50],
      theme.colors.white,
      theme.colors.primary[100],
      theme.colors.primary[200],
      theme.colors.primary[300],
      theme.colors.primary[200],
      theme.colors.primary[100],
      theme.colors.white,
    ],
    [theme.colors]
  );


  return (
    <ScreenWrapper
      keyboardDoneBar
      safeArea={true} // Use false to let gradient cover status bar
      gradient="linear"
      safeAreaEdges={['bottom']}
      gradientColors={gradientColors}
      gradientStart={{ x: 1, y: 0 }}
      gradientEnd={{ x: 0, y: 1 }}
      statusBarStyle="dark-content"
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
      >
        <View style={[styles.container, { paddingTop: 60 }]}>
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <AppIcon.ZupplyLogo width={120} height={120} />
          </View>
          <Text variant="h1" style={styles.title}>
            Welcome Back
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Enter your verified mobile number to access your account securely.
          </Text>

          <View style={styles.formContainer}>
            <FormInput
              name="mobile"
              control={control}
              label="Mobile Number"
              placeholder="Enter Your mobile number"
              keyboardType="phone-pad"
              // returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit
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
              containerStyle={{}}
              showLabel={true}
              showError={false}
            />

            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setAgreedToTerms((prev) => !prev)}
              activeOpacity={0.7}
            >
              {agreedToTerms ? (
                <AppIcon.TickCheckedBox width={15} height={15} style={{ marginTop: 2 }} color={theme.colors.primary.DEFAULT} />
              ) : (
                <AppIcon.UntickCheckedBox width={15} height={15} style={{ marginTop: 2 }} color={theme.colors.text.tertiary} />
              )}
              <View style={styles.termsTextWrapper}>
                <Text variant="captionMedium" style={styles.termsText}>
                  I agree to the{' '}
                </Text>
                <TouchableOpacity onPress={() => setLegalDoc('terms')} hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}>
                  <Text variant="captionMedium" style={styles.termsLink}>Terms and Conditions</Text>
                </TouchableOpacity>
                <Text variant="captionMedium" style={styles.termsText}>{' '}and{' '}</Text>
                <TouchableOpacity onPress={() => setLegalDoc('privacy')} hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}>
                  <Text variant="captionMedium" style={styles.termsLink}>Privacy Policy</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Send OTP"
            onPress={handleSendOTPPress}
            variant="gradient"
            fullWidth
            size="md"
            loading={isSendingOTP}
            disabled={isSendingOTP}
            gradientColors={[
              theme.colors.primary[400],
              theme.colors.primary[600],
              theme.colors.primary.DEFAULT,
            ]}
            gradientStart={{ x: 0, y: 0 }}
            gradientEnd={{ x: 1, y: 1 }}
            rightIcon={<AppIcon.ArrowRight width={20} height={20} color={theme.colors.text.inverse} />}
          />
        </View>
      </KeyboardAvoidingView>

      <LegalModal
        visible={legalDoc !== null}
        docType={legalDoc ?? 'terms'}
        onClose={() => setLegalDoc(null)}
      />
    </ScreenWrapper>
  );
};

export default LoginScreen;
