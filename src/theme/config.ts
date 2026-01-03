/**
 * Theme Configuration
 * 
 * Central theme configuration that combines all design tokens.
 * This is the single source of truth for all theme values.
 */

import { lightColors, darkColors, semanticTypography, semanticSpacing, semanticBorderRadius, semanticShadows } from './tokens/semantic';
import { baseSpacing, baseBorderRadius, baseShadows, baseOpacity, baseZIndex, baseAnimation } from './tokens/base';
import type { Theme, ThemeMode } from './types';

// ============================================================================
// LIGHT THEME CONFIGURATION
// ============================================================================

export const lightTheme: Theme = {
  mode: 'light',
  colors: lightColors,
  typography: semanticTypography,
  spacing: {
    ...semanticSpacing,
    ...baseSpacing,
  },
  borderRadius: {
    ...semanticBorderRadius,
    ...baseBorderRadius,
  },
  shadows: {
    ...semanticShadows,
    ...baseShadows,
  },
  opacity: baseOpacity,
  zIndex: baseZIndex,
  animation: baseAnimation,
};

// ============================================================================
// DARK THEME CONFIGURATION (Prepared for future use)
// ============================================================================

export const darkTheme: Theme = {
  mode: 'dark',
  colors: darkColors,
  typography: semanticTypography,
  spacing: {
    ...semanticSpacing,
    ...baseSpacing,
  },
  borderRadius: {
    ...semanticBorderRadius,
    ...baseBorderRadius,
  },
  shadows: {
    ...semanticShadows,
    ...baseShadows,
  },
  opacity: baseOpacity,
  zIndex: baseZIndex,
  animation: baseAnimation,
};

// ============================================================================
// THEME MAP
// ============================================================================

export const themes: Record<ThemeMode, Theme> = {
  light: lightTheme,
  dark: darkTheme,
};

// ============================================================================
// DEFAULT THEME (Currently Light)
// ============================================================================

export const defaultTheme: Theme = lightTheme;
export const defaultThemeMode: ThemeMode = 'light';

// ============================================================================
// THEME GETTER FUNCTION
// ============================================================================

/**
 * Get theme by mode
 */
export const getTheme = (mode: ThemeMode = defaultThemeMode): Theme => {
  return themes[mode];
};

