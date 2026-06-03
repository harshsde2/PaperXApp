import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignSelf: 'stretch',
      width: '100%',
      paddingHorizontal: theme.spacing[4],
      paddingTop: theme.spacing[4],
    },
    content: {
      width: '100%',
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing[4],
      gap: theme.spacing[3],
      backgroundColor:
        theme.mode === 'dark' ? theme.colors.secondary[900] : theme.colors.secondary[100],
    },
    imageBlock: {
      width: '100%',
      marginBottom: theme.spacing[1],
    },
    lineGap: {
      width: '100%',
      gap: theme.spacing[2],
    },
    paragraph: {
      width: '100%',
      marginTop: theme.spacing[2],
      gap: theme.spacing[2],
    },
  });
