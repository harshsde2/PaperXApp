import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: theme.spacing[6],
    gap: theme.spacing[3],
    paddingHorizontal: theme.spacing[2], // Add padding to prevent 6th input from being cut off
  },
  input: {
    width: 50,
    height: 56, // Increased height to prevent clipping
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.md,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.surface.primary,
    fontFamily: theme.fontFamily.semibold,
    paddingVertical: 0, // Remove vertical padding to allow proper centering
    paddingHorizontal: 0,
    lineHeight: 24, // Match fontSize to prevent extra space
    includeFontPadding: false, // Android: remove extra padding
    textAlignVertical: 'center', // Android: center text vertically
  },
  inputFocused: {
    borderColor: theme.colors.primary.DEFAULT,
    borderWidth: 2,
  },
});
