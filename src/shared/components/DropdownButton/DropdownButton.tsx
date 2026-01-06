import React from 'react';
import { TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';

export interface DropdownButtonProps {
  /**
   * The selected value to display. If empty, placeholder will be shown.
   */
  value?: string;
  /**
   * Placeholder text to show when no value is selected
   */
  placeholder?: string;
  /**
   * Callback function when the dropdown is pressed
   */
  onPress?: () => void;
  /**
   * Custom style for the container
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Custom style for the text
   */
  textStyle?: StyleProp<TextStyle>;
  /**
   * Custom style for the placeholder text
   */
  placeholderStyle?: StyleProp<TextStyle>;
  /**
   * Whether the dropdown is disabled
   */
  disabled?: boolean;
  /**
   * Active opacity for touch feedback (default: 0.7)
   */
  activeOpacity?: number;
}

export const DropdownButton: React.FC<DropdownButtonProps> = ({
  value,
  placeholder = 'Select an option',
  onPress,
  style,
  textStyle,
  placeholderStyle,
  disabled = false,
  activeOpacity = 0.7,
}) => {
  const theme = useTheme();

  const defaultStyle: StyleProp<ViewStyle> = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[3],
    backgroundColor: theme.colors.surface.primary,
  };

  const defaultTextStyle: StyleProp<TextStyle> = {
    fontSize: 16,
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.regular,
    flex: 1,
  };

  const defaultPlaceholderStyle: StyleProp<TextStyle> = {
    color: theme.colors.text.tertiary,
  };

  const hasValue = !!value;
  const displayText = value || placeholder;
  const isPlaceholder = !hasValue;

  return (
    <TouchableOpacity
      style={[defaultStyle, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={activeOpacity}
    >
      <Text
        variant="bodyMedium"
        style={[
          defaultTextStyle,
          isPlaceholder && defaultPlaceholderStyle,
          isPlaceholder && placeholderStyle,
          !isPlaceholder && textStyle,
        ]}
        numberOfLines={1}
      >
        {displayText}
      </Text>
      <AppIcon.ChevronDown
        width={20}
        height={20}
        color={theme.colors.text.tertiary}
      />
    </TouchableOpacity>
  );
};

