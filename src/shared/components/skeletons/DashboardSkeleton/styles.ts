import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: theme.spacing[4],
      paddingTop: theme.spacing[4],
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing[5],
    },
    greetingBlock: {
      flex: 1,
      gap: theme.spacing[2],
      marginRight: theme.spacing[3],
    },
    cardsColumn: {
      gap: theme.spacing[3],
    },
    metricsRow: {
      flexDirection: 'row',
      gap: theme.spacing[3],
      marginTop: theme.spacing[2],
    },
    metricCard: {
      flex: 1,
      gap: theme.spacing[2],
      padding: theme.spacing[3],
      borderRadius: theme.borderRadius.lg,
      backgroundColor:
        theme.mode === 'dark' ? theme.colors.secondary[900] : theme.colors.secondary[100],
    },
    spacer: {
      height: theme.spacing[2],
    },
  });
