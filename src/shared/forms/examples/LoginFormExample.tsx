/**
 * Example: Login Form with React Hook Form
 * 
 * This is a reference example showing how to use the forms module
 * to convert an existing form to use React Hook Form.
 */

import React from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useForm, FormInput, validationRules } from '@shared/forms';
import { Text } from '@shared/components/Text';
import { useTheme } from '@theme/index';
import { AppIcon } from '@assets/svgs';
import { RegisterOptions } from 'react-hook-form';

// Define form data type
type LoginFormData = {
  mobile: string;
};

/**
 * Example Login Form Component
 * 
 * This demonstrates:
 * - Basic form setup with useForm
 * - Using FormInput component
 * - Validation with pre-built rules
 * - Form submission handling
 * - Loading states
 */
export const LoginFormExample = () => {
  const theme = useTheme();
  
  // Initialize form with default values and validation mode
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFormData>({
    defaultValues: {
      mobile: '',
    },
    mode: 'onBlur', // Validate on blur for better UX
  });

  // Form submission handler
  const onSubmit = async (data: LoginFormData) => {
    console.log('Form submitted:', data);
    // Here you would call your API
    // await sendOTP({ mobile: data.mobile });
  };

  return (
    <View style={{ padding: 16 }}>
      <Text variant="h1" style={{ marginBottom: 8 }}>
        Welcome Back
      </Text>
      <Text variant="bodyMedium" style={{ marginBottom: 24 }}>
        Enter your verified mobile number
      </Text>

      {/* Form Input with validation */}
      <FormInput
        name="mobile"
        control={control}
        label="Mobile Number"
        placeholder="Enter your mobile number"
        keyboardType="phone-pad"
        maxLength={10}
        rules={validationRules.combine(
          validationRules.required('Mobile number is required'),
          validationRules.mobile('Please enter a valid 10-digit mobile number')
        ) as RegisterOptions<LoginFormData>}
        containerStyle={{ marginBottom: 16 }}
      />

      {/* Submit Button */}
      <TouchableOpacity
        style={{
          backgroundColor: theme.colors.primary.DEFAULT,
          padding: 16,
          borderRadius: 8,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isValid && !isSubmitting ? 1 : 0.6,
        }}
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color={theme.colors.text.inverse} />
        ) : (
          <>
            <Text
              variant="buttonMedium"
              style={{ color: theme.colors.text.inverse, marginRight: 8 }}
            >
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
  );
};

