import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    badge: {
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[1],
      borderRadius: theme.borderRadius.badge,
      alignSelf: 'flex-start',
    },
    text: {
      fontSize: theme.typography.caption.medium.fontSize,
      fontWeight: theme.typography.caption.medium.fontWeight,
    },
    requested: {
      backgroundColor: theme.colors.primary[100],
      borderWidth: 1,
      borderColor: theme.colors.primary.DEFAULT,
    },
    accepted: {
      backgroundColor: theme.colors.warning.light,
      borderWidth: 1,
      borderColor: theme.colors.warning.DEFAULT,
    },
    paid: {
      backgroundColor: theme.colors.success.light,
      borderWidth: 1,
      borderColor: theme.colors.success.DEFAULT,
    },
    inProduction: {
      backgroundColor: theme.colors.primary[100],
      borderWidth: 1,
      borderColor: theme.colors.primary.DEFAULT,
    },
    dispatched: {
      backgroundColor: theme.colors.info.light,
      borderWidth: 1,
      borderColor: theme.colors.status.reviewing,
    },
    completed: {
      backgroundColor: theme.colors.success.light,
      borderWidth: 1,
      borderColor: theme.colors.success.DEFAULT,
    },
    cancelled: {
      backgroundColor: theme.colors.error.light,
      borderWidth: 1,
      borderColor: theme.colors.error.DEFAULT,
    },
    disputed: {
      backgroundColor: theme.colors.error.light,
      borderWidth: 1,
      borderColor: theme.colors.error.DEFAULT,
    },
    textRequested: {
      color: theme.colors.primary.DEFAULT,
    },
    textAccepted: {
      color: theme.colors.warning.DEFAULT,
    },
    textPaid: {
      color: theme.colors.success.DEFAULT,
    },
    textInProduction: {
      color: theme.colors.primary.DEFAULT,
    },
    textDispatched: {
      color: theme.colors.status.reviewing,
    },
    textCompleted: {
      color: theme.colors.success.DEFAULT,
    },
    textCancelled: {
      color: theme.colors.error.DEFAULT,
    },
    textDisputed: {
      color: theme.colors.error.DEFAULT,
    },
  });
