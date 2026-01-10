import { useState, useEffect } from 'react';
import { Keyboard, KeyboardEvent, Platform } from 'react-native';

/**
 * Hook to detect keyboard visibility
 * 
 * @returns {boolean} isKeyboardVisible - true when keyboard is open, false when closed
 * @returns {number} keyboardHeight - height of the keyboard (0 when closed)
 * 
 * @example
 * ```tsx
 * const { isKeyboardVisible, keyboardHeight } = useKeyboard();
 * 
 * if (isKeyboardVisible) {
 *   // Keyboard is open
 * }
 * ```
 */
export const useKeyboard = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event: KeyboardEvent) => {
        setIsKeyboardVisible(true);
        setKeyboardHeight(event.endCoordinates.height);
      }
    );

    const hideSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
        setKeyboardHeight(0);
      }
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return { isKeyboardVisible, keyboardHeight };
};
