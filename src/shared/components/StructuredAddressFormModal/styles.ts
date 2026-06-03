import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    modalContainer: {
      flex: 1,
    },
    keyboardAvoiding: {
      flex: 1,
    },
    formModalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },
    formModalTitle: {
      color: theme.colors.text.primary,
      flex: 1,
      marginRight: theme.spacing[2],
    },
    formModalCloseButton: {
      padding: theme.spacing[1],
    },
  });
