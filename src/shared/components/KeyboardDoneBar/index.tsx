import React, { useCallback, useEffect, useId } from 'react';
import { View, TouchableOpacity, Keyboard } from 'react-native';
import { Text } from '@shared/components/Text';
import { useTheme } from '@theme/index';
import { useKeyboard } from '@shared/hooks';
import { KeyboardDoneBarProps } from './@types';
import { createStyles } from './styles';
import { useKeyboardDoneBarClaim } from './KeyboardDoneBarContext';

/**
 * Cross-platform "Done" bar pinned just above the keyboard.
 *
 * Numeric keypads on iOS have no return/Done key and Android keyboards offer no
 * obvious dismiss for less tech-savvy users, so this gives every form a reliable
 * way to close the keyboard. Render it once at the root of a screen's JSX; it
 * shows itself only while the keyboard is visible.
 *
 * A screen and a modal stacked on top of it (e.g. an address-entry modal) can
 * both have this mounted at once — only the most recently mounted instance
 * renders, so a background screen's bar never doubles up with a modal's.
 */
export const KeyboardDoneBar: React.FC<KeyboardDoneBarProps> = ({
  label = 'Done',
  onDone,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { isKeyboardVisible, keyboardHeight } = useKeyboard();
  const id = useId();
  const { claim, release, activeId, isManaged } = useKeyboardDoneBarClaim();

  useEffect(() => {
    claim(id);
    return () => release(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handlePress = useCallback(() => {
    Keyboard.dismiss();
    onDone?.();
  }, [onDone]);

  if (!isKeyboardVisible) return null;
  if (isManaged && activeId !== id) return null;

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
export { KeyboardDoneBarProvider } from './KeyboardDoneBarContext';
