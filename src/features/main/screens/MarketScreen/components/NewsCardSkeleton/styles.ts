import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      gap: theme.spacing[2],
      paddingBottom: theme.spacing[3],
    },
    titleRow: {
      gap: theme.spacing[1],
    },
    metaRow: {
      marginTop: theme.spacing[1],
    },
  });
