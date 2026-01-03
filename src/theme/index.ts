/**
 * Theme - Main Export
 * 
 * Central export point for the theme system.
 * This is the single entry point for all theme-related functionality.
 * 
 * @example
 * ```tsx
 * import { useTheme, lightTheme, colors } from '@theme';
 * 
 * // In component
 * const theme = useTheme();
 * const primaryColor = theme.colors.primary.DEFAULT;
 * ```
 */

// ============================================================================
// Main Theme Configuration
// ============================================================================
export { defaultTheme, lightTheme, darkTheme, themes, getTheme } from './config';
import { lightTheme } from './config';
export type { Theme, ThemeMode } from './types';

// ============================================================================
// Hooks
// ============================================================================
export { useTheme } from './hooks/useTheme';

// ============================================================================
// Design Tokens (Direct Access)
// ============================================================================
export * from './tokens';

// ============================================================================
// Type Exports
// ============================================================================
export type {
  BaseColors,
  LightColors,
  DarkColors,
  PrimaryColor,
  StatusColor,
  BaseTypography,
  SemanticTypography,
  HeadingStyle,
  BodyStyle,
  CaptionStyle,
  ButtonTypography,
  BaseSpacing,
  SemanticSpacing,
  BaseBorderRadius,
  SemanticBorderRadius,
  BaseShadows,
  SemanticShadows,
  ThemeContextValue,
} from './types';

// ============================================================================
// Legacy Exports (Backward Compatibility)
// ============================================================================
/**
 * @deprecated Use theme.colors instead
 * Legacy color exports for backward compatibility.
 * These will be removed in a future version.
 */
export const colors = {
  primary: lightTheme.colors.primary.DEFAULT,
  primaryDark: lightTheme.colors.primary.dark,
  primaryLight: lightTheme.colors.primary.light,
  secondary: lightTheme.colors.secondary.DEFAULT,
  error: lightTheme.colors.error.DEFAULT,
  warning: lightTheme.colors.warning.DEFAULT,
  success: lightTheme.colors.success.DEFAULT,
  background: lightTheme.colors.background.primary,
  surface: lightTheme.colors.surface.primary,
  text: lightTheme.colors.text.primary,
  textSecondary: lightTheme.colors.text.secondary,
  border: lightTheme.colors.border.primary,
  disabled: lightTheme.colors.text.disabled,
};

/**
 * @deprecated Use theme.spacing instead
 * Legacy spacing exports for backward compatibility.
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

/**
 * @deprecated Use theme.typography instead
 * Legacy typography exports for backward compatibility.
 */
export const typography = {
  h1: lightTheme.typography.heading.h1,
  h2: lightTheme.typography.heading.h2,
  h3: lightTheme.typography.heading.h3,
  body: lightTheme.typography.body.medium,
  caption: lightTheme.typography.caption.medium,
  small: lightTheme.typography.caption.small,
};

/**
 * @deprecated Use theme.borderRadius instead
 * Legacy borderRadius exports for backward compatibility.
 */
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};
