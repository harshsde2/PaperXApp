import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme, pageWidth: number) =>
  StyleSheet.create({
    page: {
      width: pageWidth,
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing[3],
      paddingTop: theme.spacing[2],
    },
    image: {
      flex: 1,
      width: '100%',
    },
  });
