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
  },
  input: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.md,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.surface.primary,
    fontFamily: theme.fontFamily.semibold,
  },
  inputFocused: {
    borderColor: theme.colors.primary.DEFAULT,
    borderWidth: 2,
  },
});
