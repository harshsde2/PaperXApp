import { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@theme/index';
import { useKeyboard } from './useKeyboard';

/**
 * Hook to calculate bottom padding for scrollable content when using FloatingBottomContainer
 * 
 * This ensures content doesn't get hidden behind the floating container at the bottom.
 * Automatically adjusts based on keyboard visibility.
 * 
 * @param options - Configuration options
 * @param options.buttonHeight - Height of the button/primary action (default: 60)
 * @param options.additionalContentHeight - Height of additional content like text, badges, etc. (default: 0)
 * @param options.extraSpacing - Extra spacing for safety margin (default: theme.spacing[2])
 * @param options.customPaddingVertical - Custom vertical padding if different from theme default
 * 
 * @returns {number} paddingBottom - The calculated bottom padding value
 * 
 * @example
 * ```tsx
 * const paddingBottom = useFloatingBottomPadding({
 *   buttonHeight: 60,
 *   additionalContentHeight: 20, // For footer note text
 * });
 * 
 * <ScreenWrapper
 *   scrollable
 *   contentContainerStyle={{ paddingBottom }}
 * >
 *   <View>
 *     <Text>Your content here</Text>
 *   </View>
 * </ScreenWrapper>
 * ```
 */
export const useFloatingBottomPadding = (options?: {
  buttonHeight?: number;
  additionalContentHeight?: number;
  extraSpacing?: number;
  customPaddingVertical?: number;
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { isKeyboardVisible } = useKeyboard();

  const {
    buttonHeight = 60,
    additionalContentHeight = 0,
    extraSpacing,
    customPaddingVertical,
  } = options || {};

  const paddingBottom = useMemo(() => {
    // No padding needed when keyboard is open (FloatingBottomContainer is typically hidden)
    if (isKeyboardVisible) {
      return 0;
    }

    // Calculate the total height of FloatingBottomContainer:
    // - Button/primary action height
    // - Additional content height (text, badges, etc.)
    // - Padding vertical (top + bottom) = theme.spacing[4] * 2 (default) or custom
    // - Gap between elements (if using style.gap) = theme.spacing[2] (default)
    // - Safe area bottom inset
    // - Extra spacing for safety margin
    
    const verticalPadding = customPaddingVertical ?? theme.spacing[4] * 2;
    const gap = theme.spacing[2];
    const safeAreaBottom = insets.bottom;
    const safetyMargin = extraSpacing ?? theme.spacing[2];

    return (
      buttonHeight +
      additionalContentHeight +
      verticalPadding +
      gap +
      safeAreaBottom +
      safetyMargin
    );
  }, [
    isKeyboardVisible,
    buttonHeight,
    additionalContentHeight,
    customPaddingVertical,
    theme.spacing,
    insets.bottom,
    extraSpacing,
  ]);

  return paddingBottom;
};
