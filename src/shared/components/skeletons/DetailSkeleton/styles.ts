import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: theme.spacing[4],
      paddingTop: theme.spacing[4],
    },
    content: {
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing[4],
      gap: theme.spacing[3],
      backgroundColor:
        theme.mode === 'dark' ? theme.colors.secondary[900] : theme.colors.secondary[100],
    },
    imageBlock: {
      marginBottom: theme.spacing[1],
    },
    lineGap: {
      gap: theme.spacing[2],
    },
    paragraph: {
      marginTop: theme.spacing[2],
      gap: theme.spacing[2],
    },
  });
