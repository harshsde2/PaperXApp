import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      paddingVertical: theme.spacing[4],
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    stepWrapper: {
      alignItems: 'center',
      flex: 1,
    },
    circleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      justifyContent: 'center',
    },
    lineLeft: {
      flex: 1,
      height: 2,
    },
    lineRight: {
      flex: 1,
      height: 2,
    },
    lineCompleted: {
      backgroundColor: theme.colors.primary.DEFAULT,
    },
    lineFuture: {
      backgroundColor: theme.colors.border.primary,
    },
    lineTransparent: {
      backgroundColor: 'transparent',
    },
    lineCancelled: {
      backgroundColor: theme.colors.error.DEFAULT,
    },
    lineDisputed: {
      backgroundColor: theme.colors.warning.DEFAULT,
    },
    circle: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    circleCompleted: {
      backgroundColor: theme.colors.primary.DEFAULT,
    },
    circleCurrent: {
      backgroundColor: theme.colors.primary.DEFAULT,
    },
    circleFuture: {
      backgroundColor: theme.colors.surface.primary,
      borderWidth: 2,
      borderColor: theme.colors.border.primary,
    },
    circleCancelled: {
      backgroundColor: theme.colors.error.DEFAULT,
    },
    circleDisputed: {
      backgroundColor: theme.colors.warning.DEFAULT,
    },
    pulseOuter: {
      position: 'absolute',
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.primary[100],
    },
    iconText: {
      fontSize: 12,
      color: theme.colors.text.inverse,
    },
    label: {
      fontSize: 10,
      fontWeight: fontWeightForPlatform('500'),
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.text.tertiary,
      textAlign: 'center',
      marginTop: theme.spacing[1],
    },
    labelCompleted: {
      color: theme.colors.text.primary,
      fontWeight: fontWeightForPlatform('600'),
      fontFamily: theme.fontFamily.semibold,
    },
    labelCurrent: {
      color: theme.colors.primary.DEFAULT,
      fontWeight: fontWeightForPlatform('600'),
      fontFamily: theme.fontFamily.semibold,
    },
  });
