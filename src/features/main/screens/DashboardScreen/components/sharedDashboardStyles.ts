import type { TextStyle } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

/**
 * Shared typography helpers for consistent heading/subtext across all role dashboards.
 */
export const getHeadingStyle = (theme: Theme, size: 'h4' | 'h5' | 'h6') => ({
  fontSize: theme.typography.heading[size].fontSize,
  fontWeight: fontWeightForPlatform(
    theme.typography.heading[size].fontWeight as TextStyle['fontWeight']
  ),
  fontFamily: theme.fontFamily.semibold,
});

export const getBodyStyle = (theme: Theme, size: 'small' | 'medium') => ({
  fontSize: theme.typography.body[size].fontSize,
  fontWeight: fontWeightForPlatform(
    theme.typography.body[size].fontWeight as TextStyle['fontWeight']
  ),
  fontFamily: theme.fontFamily.regular,
});

export const getCaptionStyle = (theme: Theme, size: 'small' | 'medium') => ({
  fontSize: theme.typography.caption[size].fontSize,
  fontWeight: fontWeightForPlatform(
    theme.typography.caption[size].fontWeight as TextStyle['fontWeight']
  ),
  fontFamily: theme.fontFamily.medium,
});
