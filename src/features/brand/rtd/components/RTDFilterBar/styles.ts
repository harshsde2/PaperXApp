import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      paddingVertical: theme.spacing[2],
    },
    scrollContent: {
      paddingHorizontal: theme.spacing[4],
      gap: theme.spacing[2],
      flexDirection: 'row',
      alignItems: 'center',
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[2],
      borderRadius: theme.borderRadius.badge,
      borderWidth: 1,
      gap: theme.spacing[1],
    },
    chipInactive: {
      backgroundColor: theme.colors.surface.tertiary,
      borderColor: theme.colors.border.primary,
    },
    chipActive: {
      backgroundColor: theme.colors.primary[50],
      borderColor: theme.colors.primary.DEFAULT,
    },
    chipTextInactive: {
      color: theme.colors.text.primary,
      fontWeight: fontWeightForPlatform('500'),
    },
    chipTextActive: {
      color: theme.colors.primary.DEFAULT,
      fontWeight: fontWeightForPlatform('600'),
    },
    chevronInactive: {
      color: theme.colors.text.tertiary,
    },
    chevronActive: {
      color: theme.colors.primary.DEFAULT,
    },
    badge: {
      backgroundColor: theme.colors.primary.DEFAULT,
      borderRadius: 10,
      minWidth: 18,
      height: 18,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingHorizontal: 4,
    },
    badgeText: {
      color: theme.colors.surface.primary,
      fontWeight: fontWeightForPlatform('700'),
      fontSize: 10,
      lineHeight: 14,
    },
  });
