import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: theme.spacing[4],
      paddingTop: theme.spacing[5],
    },
    header: {
      alignItems: 'center',
      marginBottom: theme.spacing[6],
      gap: theme.spacing[3],
    },
    infoCard: {
      borderRadius: theme.borderRadius.xl,
      paddingVertical: theme.spacing[3],
      paddingHorizontal: theme.spacing[4],
      gap: theme.spacing[4],
      backgroundColor:
        theme.mode === 'dark' ? theme.colors.secondary[900] : theme.colors.secondary[100],
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    rowText: {
      flex: 1,
      gap: theme.spacing[2],
      marginLeft: theme.spacing[3],
    },
  });
