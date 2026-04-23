import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: theme.spacing[4],
      paddingTop: theme.spacing[4],
      gap: theme.spacing[4],
    },
    balanceCard: {
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing[4],
      gap: theme.spacing[3],
      backgroundColor:
        theme.mode === 'dark' ? theme.colors.secondary[900] : theme.colors.secondary[100],
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: theme.spacing[3],
    },
    transactionList: {
      gap: theme.spacing[3],
    },
    transactionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing[2],
      gap: theme.spacing[3],
    },
    transactionText: {
      flex: 1,
      gap: theme.spacing[2],
    },
  });
