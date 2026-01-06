import React from 'react';
import { TouchableOpacity, StyleProp, ViewStyle, TextStyle, View } from 'react-native';
import { Control, Controller, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';
import { Text } from '@shared/components/Text';
import { useTheme } from '@theme/index';
import { AppIcon } from '@assets/svgs';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface FormSelectProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  rules?: RegisterOptions<T>;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  errorMessage?: string;
  showError?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  selectStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  placeholderStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  showLabel?: boolean;
  onPress?: (value: string | number | undefined) => void;
}

export function FormSelect<T extends FieldValues>({
  name,
  control,
  rules,
  label,
  placeholder = 'Select an option',
  options,
  errorMessage,
  showError = true,
  containerStyle,
  selectStyle,
  textStyle,
  placeholderStyle,
  labelStyle,
  errorStyle,
  showLabel = true,
  onPress,
}: FormSelectProps<T>) {
  const theme = useTheme();

  const defaultSelectStyle: StyleProp<ViewStyle> = {
    borderWidth: 1,
    borderColor: theme.colors.border.primary || theme.colors.text.tertiary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background.primary,
  };

  const defaultErrorStyle: StyleProp<TextStyle> = {
    color: (theme.colors.error as any)?.DEFAULT || theme.colors.error?.[500] || '#FF3B30',
    marginTop: 4,
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const hasError = !!error || !!errorMessage;
        const displayError = showError && hasError;
        const errorText = errorMessage || error?.message;
        const selectedOption = options.find((opt) => opt.value === value);

        const handlePress = () => {
          if (onPress) {
            onPress(value);
          }
        };

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
            <TouchableOpacity
              style={[
                defaultSelectStyle,
                hasError && {
                  borderColor: (theme.colors.error as any)?.DEFAULT || theme.colors.error?.[500] || '#FF3B30',
                },
                selectStyle,
              ]}
              onPress={handlePress}
              activeOpacity={0.7}
            >
              <Text
                variant="bodyMedium"
                style={[
                  selectedOption ? textStyle : placeholderStyle,
                  !selectedOption && { color: theme.colors.text.tertiary },
                ]}
              >
                {selectedOption ? selectedOption.label : placeholder}
              </Text>
              <AppIcon.ChevronDown
                width={20}
                height={20}
                color={theme.colors.text.tertiary}
              />
            </TouchableOpacity>
            {displayError && errorText && (
              <Text variant="captionSmall" style={[defaultErrorStyle, errorStyle]}>
                {errorText}
              </Text>
            )}
          </View>
        );
      }}
    />
  );
}

