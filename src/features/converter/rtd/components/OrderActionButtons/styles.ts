import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      gap: theme.spacing[3],
      flexWrap: 'wrap',
    },
    buttonWrap: {
      flex: 1,
      minWidth: 120,
    },
  });
