import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@theme/index';
import { FloatingBottomContainerProps } from './@types';

/**
 * FloatingBottomContainer
 * 
 * A reusable component that creates a floating container at the bottom of the screen.
 * It handles safe area insets automatically and allows content to scroll above it.
 * 
 * @example
 * ```tsx
 * <FloatingBottomContainer>
 *   <TouchableOpacity style={styles.button}>
 *     <Text>Save & Continue</Text>
 *   </TouchableOpacity>
 * </FloatingBottomContainer>
 * ```
 */
export const FloatingBottomContainer: React.FC<FloatingBottomContainerProps> = ({
  children,
  style,
  backgroundColor,
  paddingHorizontal,
  paddingVertical,
  paddingTop,
  paddingBottom,
  safeArea = true,
  shadow = true,
  borderRadius = 0,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const defaultPaddingHorizontal = paddingHorizontal ?? theme.spacing[4];
  const defaultPaddingVertical = paddingVertical ?? theme.spacing[4];
  const defaultPaddingTop = paddingTop ?? defaultPaddingVertical;
  const defaultPaddingBottom = paddingBottom ?? defaultPaddingVertical;

  // Calculate bottom padding with safe area inset
  const bottomPadding = safeArea
    ? defaultPaddingBottom + insets.bottom
    : defaultPaddingBottom;

  const containerStyle = [
    styles.container,
    {
      backgroundColor: backgroundColor || theme.colors.background.primary,
      paddingHorizontal: defaultPaddingHorizontal,
      paddingTop: defaultPaddingTop,
      paddingBottom: bottomPadding,
      borderTopLeftRadius: borderRadius,
      borderTopRightRadius: borderRadius,
    },
    shadow && styles.shadow,
    style,
  ];

  return <View style={containerStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 1000,
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});

export default FloatingBottomContainer;

