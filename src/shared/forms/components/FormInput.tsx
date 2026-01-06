import React from 'react';
import { TextInput, TextInputProps, StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { Control, Controller, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';
import { Text } from '@shared/components/Text';
import { useTheme } from '@theme/index';

export interface FormInputProps<T extends FieldValues> extends Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur'> {
  name: FieldPath<T>;
  control: Control<T>;
  rules?: RegisterOptions<T>;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  showError?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  helperStyle?: StyleProp<TextStyle>;
  showLabel?: boolean;
}

export function FormInput<T extends FieldValues>({
  name,
  control,
  rules,
  label,
  helperText,
  errorMessage,
  showError = true,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  helperStyle,
  showLabel = true,
  ...textInputProps
}: FormInputProps<T>) {
  const theme = useTheme();

  const defaultInputStyle: StyleProp<TextStyle> = {
    borderWidth: 1,
    borderColor: theme.colors.border?.primary || theme.colors.text.tertiary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.primary,
    fontFamily: theme.fontFamily.regular,
  };

  const defaultErrorStyle: StyleProp<TextStyle> = {
    color: (theme.colors.error as any)?.DEFAULT || theme.colors.error?.[500] || '#FF3B30',
    marginTop: 4,
  };

  const defaultHelperStyle: StyleProp<TextStyle> = {
    color: theme.colors.text.tertiary,
    marginTop: 4,
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
        const hasError = !!error || !!errorMessage;
        const displayError = showError && hasError;
        const errorText = errorMessage || error?.message;

        return (
          <View style={containerStyle}>
            {showLabel && label && (
              <Text
                variant="bodyMedium"
                fontWeight="medium"
                style={[{ marginBottom: 8 }, labelStyle]}
              >
                {label}
              </Text>
            )}
            <TextInput
              {...textInputProps}
              style={[
                defaultInputStyle,
                hasError && {
                  borderColor: (theme.colors.error as any)?.DEFAULT || theme.colors.error?.[500] || '#FF3B30',
                },
                inputStyle,
              ]}
              value={value || ''}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholderTextColor={theme.colors.text.tertiary}
            />
            {displayError && errorText && (
              <Text variant="captionSmall" style={[defaultErrorStyle, errorStyle]}>
                {errorText}
              </Text>
            )}
            {!displayError && helperText && (
              <Text variant="captionSmall" style={[defaultHelperStyle, helperStyle]}>
                {helperText}
              </Text>
            )}
          </View>
        );
      }}
    />
  );
}

