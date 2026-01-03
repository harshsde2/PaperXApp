/**
 * useTheme Hook
 * 
 * React hook to access theme values throughout the app.
 * For now, returns the light theme. Can be extended with context provider later.
 */

import { useMemo } from 'react';
import { defaultTheme } from '../config';
import type { Theme } from '../types';

/**
 * Hook to access theme values
 * 
 * @returns Theme object with all design tokens
 * 
 * @example
 * ```tsx
 * const theme = useTheme();
 * 
 * // Use colors
 * const primaryColor = theme.colors.primary.DEFAULT;
 * 
 * // Use typography
 * const headingStyle = theme.typography.heading.h1;
 * 
 * // Use spacing
 * const padding = theme.spacing[4]; // 16
 * ```
 */
export const useTheme = (): Theme => {
  // For now, always return light theme
  // Can be extended with React Context when dark mode is needed
  return useMemo(() => defaultTheme, []);
};

