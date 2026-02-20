import { Platform } from 'react-native';
import type { TextStyle } from 'react-native';

/**
 * Returns the fontWeight for use in styles. On iOS, returns undefined so custom
 * fontFamily is used correctly; on Android, returns the given weight.
 */
export function fontWeightForPlatform(
  weight: TextStyle['fontWeight']
): TextStyle['fontWeight'] {
  return Platform.OS === 'ios' ? undefined : weight;
}
