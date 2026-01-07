/**
 * Semantic Design Tokens
 * 
 * Semantic tokens that map base tokens to meaningful, purpose-driven names.
 * These tokens are theme-aware and will change based on light/dark mode.
 */

import { baseColors, baseTypography, baseSpacing, baseBorderRadius, baseShadows, baseOpacity } from './base';

// ============================================================================
// LIGHT THEME - Semantic Color Tokens
// ============================================================================

export const lightColors = {
  // Primary Colors
  primary: {
    50: baseColors.blue50,
    100: baseColors.blue100,
    200: baseColors.blue200,
    300: baseColors.blue300,
    400: baseColors.blue400,
    500: baseColors.blue500,
    600: baseColors.blue600,
    700: baseColors.blue700,
    800: baseColors.blue800,
    900: baseColors.blue900, // Primary darkest
    DEFAULT: baseColors.blue800, // Default primary color
    light: baseColors.blue300,
    dark: baseColors.blue900,
  },

  // Secondary Colors (can be customized)
  secondary: {
    50: baseColors.gray50,
    100: baseColors.gray100,
    200: baseColors.gray200,
    300: baseColors.gray300,
    400: baseColors.gray400,
    500: baseColors.gray500,
    600: baseColors.gray600,
    700: baseColors.gray700,
    800: baseColors.gray800,
    900: baseColors.gray900,
    DEFAULT: baseColors.gray600,
  },

  // Status Colors
  success: {
    50: baseColors.green50,
    100: baseColors.green100,
    200: baseColors.green200,
    300: baseColors.green300,
    400: baseColors.green400,
    500: baseColors.green500,
    600: baseColors.green600, // Approved/Matching status
    700: baseColors.green700,
    DEFAULT: baseColors.green600,
    light: baseColors.green100,
    dark: baseColors.green700,
  },

  warning: {
    50: baseColors.orange50,
    100: baseColors.orange100,
    500: baseColors.orange500, // Urgent status
    600: baseColors.orange600,
    700: baseColors.orange700,
    DEFAULT: baseColors.orange500,
    light: baseColors.orange100,
    dark: baseColors.orange700,
  },

  error: {
    50: baseColors.red50,
    100: baseColors.red100,
    500: baseColors.red500,
    600: baseColors.red600,
    700: baseColors.red700,
    DEFAULT: baseColors.red500,
    light: baseColors.red100,
    dark: baseColors.red700,
  },

  info: {
    50: baseColors.indigo50,
    100: baseColors.indigo100,
    500: baseColors.indigo500,
    600: baseColors.indigo600,
    700: baseColors.indigo700,
    DEFAULT: baseColors.indigo500,
    light: baseColors.indigo100,
    dark: baseColors.indigo700,
  },

  // Status-specific colors from designs
  status: {
    matching: baseColors.green600,      // Green - Matching status
    reviewing: baseColors.purple600,    // Purple - Reviewing status
    pending: baseColors.orange500,      // Orange - Pending status
    urgent: baseColors.orange600,       // Orange - Urgent
    approved: baseColors.green600,      // Green - Approved
    expired: baseColors.gray500,        // Gray - Expired
    closed: baseColors.gray600,         // Gray - Closed
    active: baseColors.blue600,         // Blue - Active
    negotiating: baseColors.blue500,    // Blue - Negotiating
  },

  // Background Colors
  background: {
    primary: baseColors.white,
    secondary: baseColors.gray50,
    tertiary: baseColors.gray100,
    inverse: baseColors.gray900,
    overlay: baseColors.gray900 + 'CC', // 80% opacity
  },

  // Surface Colors (Cards, Modals, etc.)
  surface: {
    primary: baseColors.white,
    secondary: baseColors.gray50,
    tertiary: baseColors.gray100,
    elevated: baseColors.white,
    disabled: baseColors.gray100,
  },

  // Text Colors
  text: {
    primary: baseColors.gray900,
    secondary: baseColors.gray600,
    tertiary: baseColors.gray500,
    disabled: baseColors.gray400,
    inverse: baseColors.white,
    link: baseColors.blue800,
    linkHover: baseColors.blue900,
    placeholder: baseColors.gray400,
  },

  // Border Colors
  border: {
    primary: baseColors.gray200,
    secondary: baseColors.gray300,
    focus: baseColors.blue800,
    error: baseColors.red500,
    success: baseColors.green500,
    disabled: baseColors.gray300,
  },

  // Divider Colors
  divider: {
    primary: baseColors.gray200,
    secondary: baseColors.gray100,
  },

  // Common Colors (direct access)
  white: baseColors.white,
  black: baseColors.black,
} as const;

// ============================================================================
// DARK THEME - Semantic Color Tokens (Prepared for future use)
// ============================================================================

export const darkColors = {
  // Primary Colors (same as light, but can be adjusted)
  primary: {
    50: baseColors.blue950,
    100: baseColors.blue900,
    200: baseColors.blue800,
    300: baseColors.blue700,
    400: baseColors.blue600,
    500: baseColors.blue500,
    600: baseColors.blue400,
    700: baseColors.blue300,
    800: baseColors.blue200,
    900: baseColors.blue100,
    DEFAULT: baseColors.blue400,
    light: baseColors.blue300,
    dark: baseColors.blue600,
  },

  // Secondary Colors
  secondary: {
    50: baseColors.gray950,
    100: baseColors.gray900,
    200: baseColors.gray800,
    300: baseColors.gray700,
    400: baseColors.gray600,
    500: baseColors.gray500,
    600: baseColors.gray400,
    700: baseColors.gray300,
    800: baseColors.gray200,
    900: baseColors.gray100,
    DEFAULT: baseColors.gray400,
  },

  // Status Colors (same values, but can be adjusted for dark mode)
  success: lightColors.success,
  warning: lightColors.warning,
  error: lightColors.error,
  info: lightColors.info,
  status: lightColors.status,

  // Background Colors
  background: {
    primary: baseColors.gray900,
    secondary: baseColors.gray800,
    tertiary: baseColors.gray700,
    inverse: baseColors.white,
    overlay: baseColors.black + 'CC', // 80% opacity
  },

  // Surface Colors
  surface: {
    primary: baseColors.gray800,
    secondary: baseColors.gray700,
    tertiary: baseColors.gray600,
    elevated: baseColors.gray700,
    disabled: baseColors.gray700,
  },

  // Text Colors
  text: {
    primary: baseColors.gray50,
    secondary: baseColors.gray300,
    tertiary: baseColors.gray400,
    disabled: baseColors.gray500,
    inverse: baseColors.gray900,
    link: baseColors.blue400,
    linkHover: baseColors.blue300,
    placeholder: baseColors.gray500,
  },

  // Border Colors
  border: {
    primary: baseColors.gray700,
    secondary: baseColors.gray600,
    focus: baseColors.blue400,
    error: baseColors.red400,
    success: baseColors.green400,
    disabled: baseColors.gray600,
  },

  // Divider Colors
  divider: {
    primary: baseColors.gray700,
    secondary: baseColors.gray800,
  },

  // Common Colors (direct access)
  white: baseColors.white,
  black: baseColors.black,
} as const;

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

