import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      gap: theme.spacing[3],
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
      borderRadius: theme.borderRadius.lg,
      backgroundColor:
        theme.mode === 'dark' ? theme.colors.secondary[900] : theme.colors.secondary[100],
    },
    textBlock: {
      flex: 1,
      marginHorizontal: theme.spacing[3],
      gap: theme.spacing[2],
    },
  });
