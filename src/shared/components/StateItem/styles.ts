import { StyleSheet } from 'react-native';
import { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing[3],
      paddingHorizontal: theme.spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },
    containerSelected: {
      backgroundColor: theme.colors.primary[50],
    },
    text: {
      color: theme.colors.text.primary,
      flex: 1,
    },
    textSelected: {
      color: theme.colors.primary.DEFAULT,
      fontWeight: '600',
    },
  });
