/**
 * Theme Type Definitions
 * 
 * TypeScript types for the theme system to ensure type safety.
 */

import type { lightColors, semanticTypography, semanticSpacing, semanticBorderRadius, semanticShadows, darkColors } from './tokens/semantic';
import type { baseColors, baseTypography, baseSpacing, baseBorderRadius, baseShadows, baseOpacity, baseZIndex, baseAnimation } from './tokens/base';

// ============================================================================
// Theme Mode
// ============================================================================

export type ThemeMode = 'light' | 'dark';

// ============================================================================
// Color Types
// ============================================================================

export type BaseColors = typeof baseColors;
export type LightColors = typeof lightColors;
export type DarkColors = typeof darkColors;

// Extract individual color token types
export type PrimaryColor = LightColors['primary'];
export type StatusColor = LightColors['status'];

// ============================================================================
// Typography Types
// ============================================================================

export type BaseTypography = typeof baseTypography;
export type SemanticTypography = typeof semanticTypography;

// Individual typography style types
export type HeadingStyle = SemanticTypography['heading']['h1'];
export type BodyStyle = SemanticTypography['body']['medium'];
export type CaptionStyle = SemanticTypography['caption']['medium'];
export type ButtonTypography = SemanticTypography['button']['medium'];

// ============================================================================
// Spacing Types
// ============================================================================

export type BaseSpacing = typeof baseSpacing;
export type SemanticSpacing = typeof semanticSpacing;

// ============================================================================
// Border Radius Types
// ============================================================================

export type BaseBorderRadius = typeof baseBorderRadius;
export type SemanticBorderRadius = typeof semanticBorderRadius;

// ============================================================================
// Shadow Types
// ============================================================================

export type BaseShadows = typeof baseShadows;
export type SemanticShadows = typeof semanticShadows;

// ============================================================================
// Complete Theme Type
// ============================================================================

export interface Theme {
  mode: ThemeMode;
  colors: LightColors | DarkColors;
  typography: typeof semanticTypography;
  fontFamily: typeof baseTypography.fontFamily;
  spacing: typeof semanticSpacing & typeof baseSpacing;
  borderRadius: typeof semanticBorderRadius & typeof baseBorderRadius;
  shadows: typeof semanticShadows & typeof baseShadows;
  opacity: typeof baseOpacity;
  zIndex: typeof baseZIndex;
  animation: typeof baseAnimation;
}

// ============================================================================
// Theme Context Type
// ============================================================================

export interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

