import React, { useCallback } from 'react';
import { View, TouchableOpacity, Keyboard } from 'react-native';
import { Text } from '@shared/components/Text';
import { useTheme } from '@theme/index';
import { useKeyboard } from '@shared/hooks';
import { KeyboardDoneBarProps } from './@types';
import { createStyles } from './styles';

/**
 * Cross-platform "Done" bar pinned just above the keyboard.
 *
 * Numeric keypads on iOS have no return/Done key and Android keyboards offer no
 * obvious dismiss for less tech-savvy users, so this gives every form a reliable
 * way to close the keyboard. Render it once at the root of a screen's JSX; it
 * shows itself only while the keyboard is visible.
 */
export const KeyboardDoneBar: React.FC<KeyboardDoneBarProps> = ({
  label = 'Done',
  onDone,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { isKeyboardVisible, keyboardHeight } = useKeyboard();

  const handlePress = useCallback(() => {
    Keyboard.dismiss();
    onDone?.();
  }, [onDone]);

  if (!isKeyboardVisible) return null;

  return (
    <View style={[styles.bar, { bottom: keyboardHeight }]}>
      <TouchableOpacity onPress={handlePress} style={styles.button} activeOpacity={0.7}>
        <Text variant="bodyMedium" fontWeight="semibold" style={styles.text}>
          {label}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default KeyboardDoneBar;
