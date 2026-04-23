import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { getColorWithOpacity } from '@theme/utils/themeHelpers';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: getColorWithOpacity(theme.colors.white, 60),
      paddingHorizontal: theme.spacing.component.padding.md,
      paddingBottom: theme.spacing.component.padding.md,
      paddingTop: 0,
      borderRadius: theme.borderRadius.card.lg,
      width: '100%',
    },
  });
