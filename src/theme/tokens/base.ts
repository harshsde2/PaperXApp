/**
 * Base Design Tokens
 * 
 * Raw design values that form the foundation of the design system.
 * These are theme-agnostic base values that can be used to build semantic tokens.
 */

// ============================================================================
// COLOR PALETTE - Base Colors
// ============================================================================

export const baseColors = {
  // Primary Blue Palette (Main brand color from designs)
  blue50: '#EFF6FF',
  blue100: '#DBEAFE',
  blue200: '#BFDBFE',
  blue300: '#93C5FD',
  blue400: '#60A5FA',
  blue500: '#3B82F6', // Primary blue from designs
  blue600: '#2563EB', // Primary dark
  blue700: '#1D4ED8',
  blue800: '#1E40AF',
  blue900: '#1E3A8A', // Primary darkest (used in splash/login)
  blue950: '#172554',

  // Neutral/Gray Palette
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  gray950: '#030712',

  // White & Black
  white: '#FFFFFF',
  black: '#000000',

  // Semantic Colors - Success
  green50: '#F0FDF4',
  green100: '#DCFCE7',
  green200: '#BBF7D0',
  green300: '#86EFAC',
  green400: '#4ADE80',
  green500: '#22C55E',
  green600: '#16A34A', // Success/Approved from designs
  green700: '#15803D',
  green800: '#166534',
  green900: '#14532D',

  // Semantic Colors - Warning/Urgent
  orange50: '#FFF7ED',
  orange100: '#FFEDD5',
  orange200: '#FED7AA',
  orange300: '#FDBA74',
  orange400: '#FB923C',
  orange500: '#F97316', // Urgent/Warning from designs
  orange600: '#EA580C',
  orange700: '#C2410C',
  orange800: '#9A3412',
  orange900: '#7C2D12',

  // Semantic Colors - Error
  red50: '#FEF2F2',
  red100: '#FEE2E2',
  red200: '#FECACA',
  red300: '#FCA5A5',
  red400: '#F87171',
  red500: '#EF4444', // Error
  red600: '#DC2626',
  red700: '#B91C1C',
  red800: '#991B1B',
  red900: '#7F1D1D',

  // Semantic Colors - Info
  indigo50: '#EEF2FF',
  indigo100: '#E0E7FF',
  indigo200: '#C7D2FE',
  indigo300: '#A5B4FC',
  indigo400: '#818CF8',
  indigo500: '#6366F1',
  indigo600: '#4F46E5',
  indigo700: '#4338CA',
  indigo800: '#3730A3',
  indigo900: '#312E81',

  // Semantic Colors - Purple (Reviewing status from designs)
  purple50: '#FAF5FF',
  purple100: '#F3E8FF',
  purple200: '#E9D5FF',
  purple300: '#D8B4FE',
  purple400: '#C084FC',
  purple500: '#A855F7',
  purple600: '#9333EA', // Reviewing status
  purple700: '#7E22CE',
  purple800: '#6B21A8',
  purple900: '#581C87',
} as const;

// ============================================================================
// TYPOGRAPHY - Base Typography Scale
// ============================================================================

export const baseTypography = {
  // Font Families - Montserrat (all weights)
  fontFamily: {
    thin: 'Montserrat-Thin',
    extralight: 'Montserrat-ExtraLight',
    light: 'Montserrat-Light',
    regular: 'Montserrat-Regular',
    medium: 'Montserrat-Medium',
    semibold: 'Montserrat-SemiBold',
    bold: 'Montserrat-Bold',
    extrabold: 'Montserrat-ExtraBold',
    black: 'Montserrat-Black',
  },

  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 36,
    '6xl': 48,
  },

  // Font Weights (all weights)
  fontWeight: {
    thin: '100' as const,
    extralight: '200' as const,
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
    black: '900' as const,
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    medium: 1.3,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Letter Spacing
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
    widest: 1,
  },
} as const;

// ============================================================================
// SPACING - Base Spacing Scale (4px base unit)
// ============================================================================

export const baseSpacing = {
  0: 0,
  1: 4,   // 0.25rem
  2: 8,   // 0.5rem
  3: 12,  // 0.75rem
  4: 16,  // 1rem
  5: 20,  // 1.25rem
  6: 24,  // 1.5rem
  8: 32,  // 2rem
  10: 40, // 2.5rem
  12: 48, // 3rem
  16: 64, // 4rem
  20: 80, // 5rem
  24: 96, // 6rem
} as const;

// ============================================================================
// BORDER RADIUS - Base Border Radius Scale
// ============================================================================

export const baseBorderRadius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

// ============================================================================
// BORDER WIDTH - Base Border Width Scale
// ============================================================================

export const baseBorderWidth = {
  0: 0,
  1: 1,
  2: 2,
  4: 4,
  8: 8,
} as const;

// ============================================================================
// SHADOWS/ELEVATION - Base Shadow Values
// ============================================================================

export const baseShadows = {
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  '2xl': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
} as const;

// ============================================================================
// OPACITY - Base Opacity Values
// ============================================================================

export const baseOpacity = {
  0: 0,
  5: 0.05,
  10: 0.1,
  20: 0.2,
  25: 0.25,
  30: 0.3,
  40: 0.4,
  50: 0.5,
  60: 0.6,
  70: 0.7,
  75: 0.75,
  80: 0.8,
  90: 0.9,
  95: 0.95,
  100: 1,
} as const;

// ============================================================================
// Z-INDEX - Base Z-Index Scale
// ============================================================================

export const baseZIndex = {
  hide: -1,
  auto: 'auto' as const,
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  tooltip: 1700,
  toast: 1800,
} as const;

// ============================================================================
// BREAKPOINTS (for responsive design if needed)
// ============================================================================

export const baseBreakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// ============================================================================
// ANIMATION/TRANSITION - Base Timing Values
// ============================================================================

export const baseAnimation = {
  duration: {
    fast: 150,
    normal: 250,
    slow: 350,
    slower: 500,
  },
  easing: {
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

