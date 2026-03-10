/**
 * Semantic Design Tokens
 *
 * Semantic tokens that map base tokens to meaningful, purpose-driven names.
 * These tokens are theme-aware and will change based on light/dark mode.
 */

import type { BaseColorPalette } from './palettes/types';
import { basePalette } from './palettes/base';
import { baseTypography, baseSpacing, baseBorderRadius, baseShadows } from './base';

// ============================================================================
// BUILD SEMANTIC COLORS - Palette-aware
// ============================================================================

export function buildLightColors(palette: BaseColorPalette) {
  return {
    primary: {
      50: palette.blue50,
      100: palette.blue100,
      200: palette.blue200,
      300: palette.blue300,
      400: palette.blue400,
      500: palette.blue500,
      600: palette.blue600,
      700: palette.blue700,
      800: palette.blue800,
      900: palette.blue900,
      DEFAULT: palette.blue800,
      light: palette.blue300,
      dark: palette.blue900,
    },
    secondary: {
      50: palette.gray50,
      100: palette.gray100,
      200: palette.gray200,
      300: palette.gray300,
      400: palette.gray400,
      500: palette.gray500,
      600: palette.gray600,
      700: palette.gray700,
      800: palette.gray800,
      900: palette.gray900,
      DEFAULT: palette.gray600,
    },
    success: {
      50: palette.green50,
      100: palette.green100,
      200: palette.green200,
      300: palette.green300,
      400: palette.green400,
      500: palette.green500,
      600: palette.green600,
      700: palette.green700,
      DEFAULT: palette.green600,
      light: palette.green100,
      dark: palette.green700,
    },
    warning: {
      50: palette.orange50,
      100: palette.orange100,
      500: palette.orange500,
      600: palette.orange600,
      700: palette.orange700,
      DEFAULT: palette.orange500,
      light: palette.orange100,
      dark: palette.orange700,
    },
    error: {
      50: palette.red50,
      100: palette.red100,
      500: palette.red500,
      600: palette.red600,
      700: palette.red700,
      DEFAULT: palette.red500,
      light: palette.red100,
      dark: palette.red700,
    },
    info: {
      50: palette.indigo50,
      100: palette.indigo100,
      500: palette.indigo500,
      600: palette.indigo600,
      700: palette.indigo700,
      DEFAULT: palette.indigo500,
      light: palette.indigo100,
      dark: palette.indigo700,
    },
    status: {
      matching: palette.green600,
      reviewing: palette.purple600,
      pending: palette.orange500,
      urgent: palette.orange600,
      approved: palette.green600,
      expired: palette.gray500,
      closed: palette.gray600,
      active: palette.blue600,
      negotiating: palette.blue500,
    },
    background: {
      primary: palette.white,
      secondary: palette.gray50,
      tertiary: palette.gray100,
      inverse: palette.gray900,
      overlay: palette.gray900 + 'CC',
    },
    surface: {
      primary: palette.white,
      secondary: palette.gray50,
      tertiary: palette.gray100,
      elevated: palette.white,
      disabled: palette.gray100,
    },
    text: {
      primary: palette.gray900,
      secondary: palette.gray600,
      tertiary: palette.gray500,
      disabled: palette.gray400,
      inverse: palette.white,
      link: palette.blue800,
      linkHover: palette.blue900,
      placeholder: palette.gray400,
    },
    border: {
      primary: palette.gray200,
      secondary: palette.gray300,
      focus: palette.blue800,
      error: palette.red500,
      success: palette.green500,
      disabled: palette.gray300,
    },
    divider: {
      primary: palette.gray200,
      secondary: palette.gray100,
    },
    white: palette.white,
    black: palette.black,
  } as const;
}

export function buildDarkColors(palette: BaseColorPalette) {
  const light = buildLightColors(palette);
  return {
    primary: {
      50: palette.blue950,
      100: palette.blue900,
      200: palette.blue800,
      300: palette.blue700,
      400: palette.blue600,
      500: palette.blue500,
      600: palette.blue400,
      700: palette.blue300,
      800: palette.blue200,
      900: palette.blue100,
      DEFAULT: palette.blue400,
      light: palette.blue300,
      dark: palette.blue600,
    },
    secondary: {
      50: palette.gray950,
      100: palette.gray900,
      200: palette.gray800,
      300: palette.gray700,
      400: palette.gray600,
      500: palette.gray500,
      600: palette.gray400,
      700: palette.gray300,
      800: palette.gray200,
      900: palette.gray100,
      DEFAULT: palette.gray400,
    },
    success: light.success,
    warning: light.warning,
    error: light.error,
    info: light.info,
    status: light.status,
    background: {
      primary: palette.gray900,
      secondary: palette.gray800,
      tertiary: palette.gray700,
      inverse: palette.white,
      overlay: palette.black + 'CC',
    },
    surface: {
      primary: palette.gray800,
      secondary: palette.gray700,
      tertiary: palette.gray600,
      elevated: palette.gray700,
      disabled: palette.gray700,
    },
    text: {
      primary: palette.gray50,
      secondary: palette.gray300,
      tertiary: palette.gray400,
      disabled: palette.gray500,
      inverse: palette.gray900,
      link: palette.blue400,
      linkHover: palette.blue300,
      placeholder: palette.gray500,
    },
    border: {
      primary: palette.gray700,
      secondary: palette.gray600,
      focus: palette.blue400,
      error: palette.red400,
      success: palette.green400,
      disabled: palette.gray600,
    },
    divider: {
      primary: palette.gray700,
      secondary: palette.gray800,
    },
    white: palette.white,
    black: palette.black,
  } as const;
}

// ============================================================================
// DEFAULT LIGHT/DARK COLORS (backward compatibility - uses base palette)
// ============================================================================

export const lightColors = buildLightColors(basePalette);
export const darkColors = buildDarkColors(basePalette);

// ============================================================================
// SEMANTIC TYPOGRAPHY TOKENS
// ============================================================================

export const semanticTypography = {
  // Headings
  heading: {
    h1: {
      fontSize: baseTypography.fontSize['4xl'], // 32
      fontWeight: baseTypography.fontWeight.bold,
      lineHeight: baseTypography.lineHeight.normal,
      letterSpacing: baseTypography.letterSpacing.tight,
    },
    h2: {
      fontSize: baseTypography.fontSize['3xl'], // 28
      fontWeight: baseTypography.fontWeight.bold,
      lineHeight: baseTypography.lineHeight.loose,
      letterSpacing: baseTypography.letterSpacing.tight,
    },
    h3: {
      fontSize: baseTypography.fontSize['2xl'], // 24
      fontWeight: baseTypography.fontWeight.semibold,
      lineHeight: baseTypography.lineHeight.normal,
      letterSpacing: baseTypography.letterSpacing.normal,
    },
    h4: {
      fontSize: baseTypography.fontSize.xl, // 20
      fontWeight: baseTypography.fontWeight.semibold,
      lineHeight: baseTypography.lineHeight.normal,
      letterSpacing: baseTypography.letterSpacing.normal,
    },
    h5: {
      fontSize: baseTypography.fontSize.lg, // 18
      fontWeight: baseTypography.fontWeight.semibold,
      lineHeight: baseTypography.lineHeight.normal,
      letterSpacing: baseTypography.letterSpacing.normal,
    },
    h6: {
      fontSize: baseTypography.fontSize.base, // 16
      fontWeight: baseTypography.fontWeight.semibold,
      lineHeight: baseTypography.lineHeight.normal,
      letterSpacing: baseTypography.letterSpacing.normal,
    },
  },

  // Body Text
  body: {
    large: {
      fontSize: baseTypography.fontSize.lg, // 18
      fontWeight: baseTypography.fontWeight.regular,
      lineHeight: baseTypography.lineHeight.relaxed,
      letterSpacing: baseTypography.letterSpacing.normal,
    },
    medium: {
      fontSize: baseTypography.fontSize.base, // 16
      fontWeight: baseTypography.fontWeight.regular,
      lineHeight: baseTypography.lineHeight.normal,
      letterSpacing: baseTypography.letterSpacing.normal,
    },
    small: {
      fontSize: baseTypography.fontSize.sm, // 14
      fontWeight: baseTypography.fontWeight.regular,
      lineHeight: baseTypography.lineHeight.normal,
      letterSpacing: baseTypography.letterSpacing.normal,
    },
  },

  // Caption & Labels
  caption: {
    large: {
      fontSize: baseTypography.fontSize.sm, // 14
      fontWeight: baseTypography.fontWeight.medium,
      lineHeight: baseTypography.lineHeight.normal,
      letterSpacing: baseTypography.letterSpacing.wide,
    },
    medium: {
      fontSize: baseTypography.fontSize.xs, // 12
      fontWeight: baseTypography.fontWeight.medium,
      lineHeight: baseTypography.lineHeight.normal,
      letterSpacing: baseTypography.letterSpacing.wide,
    },
    small: {
      fontSize: baseTypography.fontSize.xs, // 12
      fontWeight: baseTypography.fontWeight.regular,
      lineHeight: baseTypography.lineHeight.normal,
      letterSpacing: baseTypography.letterSpacing.normal,
    },
  },

  // Special Text Styles
  overline: {
    fontSize: baseTypography.fontSize.xs,
    fontWeight: baseTypography.fontWeight.semibold,
    lineHeight: baseTypography.lineHeight.normal,
    letterSpacing: baseTypography.letterSpacing.widest,
    textTransform: 'uppercase' as const,
  },

  button: {
    large: {
      fontSize: baseTypography.fontSize.base, // 16
      fontWeight: baseTypography.fontWeight.semibold,
      lineHeight: baseTypography.lineHeight.tight,
      letterSpacing: baseTypography.letterSpacing.wide,
    },
    medium: {
      fontSize: baseTypography.fontSize.sm, // 14
      fontWeight: baseTypography.fontWeight.semibold,
      lineHeight: baseTypography.lineHeight.tight,
      letterSpacing: baseTypography.letterSpacing.wide,
    },
    small: {
      fontSize: baseTypography.fontSize.xs, // 12
      fontWeight: baseTypography.fontWeight.semibold,
      lineHeight: baseTypography.lineHeight.tight,
      letterSpacing: baseTypography.letterSpacing.wide,
    },
  },
} as const;

// ============================================================================
// SEMANTIC SPACING TOKENS
// ============================================================================

export const semanticSpacing = {
  // Component Spacing
  component: {
    padding: {
      xs: baseSpacing[2],  // 8
      sm: baseSpacing[3],  // 12
      md: baseSpacing[4],  // 16
      lg: baseSpacing[6],  // 24
      xl: baseSpacing[8],  // 32
    },
    gap: {
      xs: baseSpacing[1],  // 4
      sm: baseSpacing[2],  // 8
      md: baseSpacing[3],  // 12
      lg: baseSpacing[4],  // 16
      xl: baseSpacing[6],  // 24
    },
  },

  // Layout Spacing
  layout: {
    container: {
      padding: baseSpacing[4], // 16
      paddingLarge: baseSpacing[6], // 24
    },
    section: {
      margin: baseSpacing[6], // 24
      gap: baseSpacing[4], // 16
    },
    screen: {
      padding: baseSpacing[4], // 16
      paddingVertical: baseSpacing[6], // 24
    },
  },
} as const;

// ============================================================================
// SEMANTIC BORDER RADIUS TOKENS
// ============================================================================

export const semanticBorderRadius = {
  // Buttons
  button: {
    sm: baseBorderRadius.md,  // 8
    md: baseBorderRadius.md,  // 8
    lg: baseBorderRadius.lg,  // 12
    full: baseBorderRadius.full,
  },

  // Cards
  card: {
    sm: baseBorderRadius.md,  // 8
    md: baseBorderRadius.lg,  // 12
    lg: baseBorderRadius.xl,  // 16
  },

  // Inputs
  input: {
    sm: baseBorderRadius.sm,  // 6
    md: baseBorderRadius.md,  // 8
    lg: baseBorderRadius.lg,  // 12
  },

  // Modals
  modal: baseBorderRadius.xl, // 16

  // Badges
  badge: baseBorderRadius.full,

  // Images
  image: {
    sm: baseBorderRadius.md,  // 8
    md: baseBorderRadius.lg,  // 12
    lg: baseBorderRadius.xl,  // 16
  },
} as const;

// ============================================================================
// SEMANTIC SHADOW TOKENS
// ============================================================================

export const semanticShadows = {
  card: baseShadows.sm,
  cardHover: baseShadows.md,
  modal: baseShadows.xl,
  dropdown: baseShadows.lg,
  button: baseShadows.sm,
  buttonPressed: baseShadows.none,
  input: baseShadows.none,
  inputFocus: baseShadows.sm,
} as const;

