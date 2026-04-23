import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginHorizontal: -theme.spacing[4],
      paddingHorizontal: theme.spacing[4],
    },
    contentContainer: {
      gap: theme.spacing[2],
      paddingVertical: theme.spacing[1],
    },
    chip: {
      minHeight: 34,
      borderRadius: theme.borderRadius.badge,
      borderWidth: 1,
      paddingHorizontal: theme.spacing[3],
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing[1],
    },
    chipLabel: {
      fontWeight: fontWeightForPlatform('600'),
      color: theme.colors.text.secondary,
    },
    chipCount: {
      color: theme.colors.text.tertiary,
      fontWeight: fontWeightForPlatform('600'),
    },
  });
