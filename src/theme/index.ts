// Theme configuration
export const colors = {
  primary: '#1E3A8A',
  primaryDark: '#1E40AF',
  primaryLight: '#3B82F6',
  secondary: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
  background: '#FFFFFF',
  surface: '#F9FAFB',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  disabled: '#9CA3AF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
  },
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

