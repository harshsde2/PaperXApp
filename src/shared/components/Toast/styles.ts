import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.component.padding.sm,
      paddingHorizontal: theme.spacing.component.padding.md,
      borderRadius: theme.borderRadius.card.lg,
      marginHorizontal: theme.spacing[4],
      marginTop: theme.spacing[3],
      gap: theme.spacing.component.gap.md,
      borderWidth: 1,
      // Shadow/elevation for subtle lift
      ...theme.shadows.card,
    },
    successBackground: {
      backgroundColor: theme.colors.success.light,
      borderColor: theme.colors.success.DEFAULT,
    },
    infoBackground: {
      backgroundColor: theme.colors.info.light,
      borderColor: theme.colors.info.DEFAULT,
    },
    warningBackground: {
      backgroundColor: theme.colors.warning.light,
      borderColor: theme.colors.warning.DEFAULT,
    },
    errorBackground: {
      backgroundColor: theme.colors.error.light,
      borderColor: theme.colors.error.DEFAULT,
    },
    iconContainer: {
      width: 32,
      height: 32,
      borderRadius: theme.borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconContainerSuccess: {
      backgroundColor: theme.colors.success.DEFAULT,
    },
    iconContainerInfo: {
      backgroundColor: theme.colors.info.DEFAULT,
    },
    iconContainerWarning: {
      backgroundColor: theme.colors.warning.DEFAULT,
    },
    iconContainerError: {
      backgroundColor: theme.colors.error.DEFAULT,
    },
    content: {
      flex: 1,
    },
    title: {
      marginBottom: 2,
    },
    message: {
      marginTop: 2,
      opacity: 0.9,
    },
    closeButton: {
      width: 28,
      height: 28,
      borderRadius: theme.borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

