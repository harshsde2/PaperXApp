/**
 * Theme Helper Utilities
 * 
 * Utility functions for common theme operations.
 */

import type { HeadingStyle, Theme } from '../types';

/**
 * Get color with opacity
 * 
 * @param color - Hex color string
 * @param opacity - Opacity value (0-100)
 * @returns Color string with alpha channel
 * 
 * @example
 * ```tsx
 * const colorWithOpacity = getColorWithOpacity('#3B82F6', 50); // Returns '#3B82F650'
 * ```
 */
export const getColorWithOpacity = (color: string, opacity: number): string => {
  // Convert opacity (0-100) to hex (00-FF)
  const alpha = Math.round((opacity / 100) * 255)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase();

  // Remove # if present
  const hexColor = color.replace('#', '');

  // If color is already 8 characters (has alpha), replace it
  if (hexColor.length === 8) {
    return `#${hexColor.slice(0, 6)}${alpha}`;
  }

  // Add alpha channel
  return `#${hexColor}${alpha}`;
};

/**
 * Get status color from theme
 * 
 * @param theme - Theme object
 * @param status - Status type
 * @returns Color string for the status
 * 
 * @example
 * ```tsx
 * const color = getStatusColor(theme, 'matching'); // Returns green color
 * ```
 */
export const getStatusColor = (
  theme: Theme,
  status: 'matching' | 'reviewing' | 'pending' | 'urgent' | 'approved' | 'expired' | 'closed' | 'active' | 'negotiating'
): string => {
  return theme.colors.status[status];
};

/**
 * Get text style for heading level
 * 
 * @param theme - Theme object
 * @param level - Heading level (1-6)
 * @returns Typography style object
 * 
 * @example
 * ```tsx
 * const h1Style = getHeadingStyle(theme, 1);
 * ```
 */
export const getHeadingStyle = (
  theme: Theme,
  level: 1 | 2 | 3 | 4 | 5 | 6
): typeof theme.typography.heading.h1 => {
  const headingMap = {
    1: theme.typography.heading.h1,
    2: theme.typography.heading.h2,
    3: theme.typography.heading.h3,
    4: theme.typography.heading.h4,
    5: theme.typography.heading.h5,
    6: theme.typography.heading.h6,
  } as const;

  return headingMap[level] as HeadingStyle;
};

/**
 * Combine multiple style objects (useful for combining theme styles with custom styles)
 * 
 * @param styles - Array of style objects
 * @returns Combined style object
 * 
 * @example
 * ```tsx
 * const combinedStyle = combineStyles(
 *   theme.typography.heading.h1,
 *   { color: theme.colors.text.primary },
 *   customStyle
 * );
 * ```
 */
export const combineStyles = <T extends Record<string, any>>(...styles: (T | undefined | null | false)[]): T => {
  return Object.assign({}, ...styles.filter(Boolean)) as T;
};

/**
 * Get spacing value (helper to access spacing with type safety)
 * 
 * @param theme - Theme object
 * @param size - Spacing size key
 * @returns Spacing value in pixels
 * 
 * @example
 * ```tsx
 * const padding = getSpacing(theme, 4); // Returns 16
 * ```
 */
export const getSpacing = (
  theme: Theme,
  size: keyof typeof theme.spacing
): number => {
  const value = theme.spacing[size];
  return typeof value === 'number' ? value : 0;
};

