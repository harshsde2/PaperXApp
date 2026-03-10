/**
 * useTheme Hook
 *
 * React hook to access theme values throughout the app.
 * Uses ThemeContext for palette-aware theming.
 */

import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { defaultTheme } from '../config';
import type { Theme } from '../types';

/**
 * Hook to access theme values
 *
 * @returns Theme object with all design tokens (and optional palette controls)
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
 *
 * // Switch palette (if ThemeProvider is used)
 * const { setPalette, paletteId } = useTheme();
 * setPalette('indigo');
 * ```
 */
export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  return context?.theme ?? defaultTheme;
};

/**
 * Hook to access full theme context (palette, mode, setters).
 * Use when you need to switch palette or mode.
 */
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  return context;
};

