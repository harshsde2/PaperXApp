/**
 * Theme Configuration
 *
 * Central theme configuration that combines all design tokens.
 * This is the single source of truth for all theme values.
 */

import type { ThemePaletteId } from './tokens/palettes/types';
import { themePalettes } from './tokens/palettes';
import { buildLightColors, buildDarkColors, semanticTypography, semanticSpacing, semanticBorderRadius, semanticShadows } from './tokens/semantic';
import { baseSpacing, baseBorderRadius, baseShadows, baseOpacity, baseZIndex, baseAnimation, baseTypography } from './tokens/base';
import type { Theme, ThemeMode } from './types';

// ============================================================================
// BUILD THEME (Palette-aware)
// ============================================================================

export function buildTheme(mode: ThemeMode, paletteId: ThemePaletteId): Theme {
  const palette = themePalettes[paletteId];
  const colors = mode === 'light' ? buildLightColors(palette) : buildDarkColors(palette);
  return {
    mode,
    colors,
    typography: semanticTypography,
    fontFamily: baseTypography.fontFamily,
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
}

// ============================================================================
// PALETTE REGISTRY
// ============================================================================

export { themePalettes } from './tokens/palettes';

// ============================================================================
// LIGHT THEME CONFIGURATION (base palette - backward compat)
// ============================================================================

export const lightTheme: Theme = buildTheme('light', 'base');

// ============================================================================
// DARK THEME CONFIGURATION (base palette - backward compat)
// ============================================================================

export const darkTheme: Theme = buildTheme('dark', 'base');

// ============================================================================
// THEME MAP (base palette)
// ============================================================================

export const themes: Record<ThemeMode, Theme> = {
  light: lightTheme,
  dark: darkTheme,
};

// ============================================================================
// DEFAULT THEME
// ============================================================================

export const defaultTheme: Theme = lightTheme;
export const defaultThemeMode: ThemeMode = 'light';

// ============================================================================
// THEME GETTER FUNCTIONS
// ============================================================================

/**
 * Get theme by mode (uses base palette)
 */
export const getTheme = (mode: ThemeMode = defaultThemeMode): Theme => {
  return themes[mode];
};

