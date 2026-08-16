import { StyleSheet } from 'react-native';
import { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing[5],
    },
    container: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius['2xl'],
      padding: theme.spacing[6],
      width: '100%',
      maxWidth: 360,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 10,
    },
    iconContainer: {
      width: 72,
      height: 72,
      borderRadius: 24,
      backgroundColor: theme.colors.primary[50],
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing[4],
    },
    iconContainerDestructive: {
      backgroundColor: '#FEE2E2',
    },
    title: {
      fontSize: 20,
      fontWeight: fontWeightForPlatform('800'),
      color: theme.colors.text.primary,
      textAlign: 'center',
      marginBottom: theme.spacing[2],
    },
    message: {
      fontSize: 14,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      lineHeight: 21,
      marginBottom: theme.spacing[5],
      paddingHorizontal: theme.spacing[2],
    },
    buttonsContainer: {
      width: '100%',
      gap: theme.spacing[3],
    },
    confirmButton: {
      backgroundColor: theme.colors.primary.DEFAULT,
      paddingVertical: theme.spacing[4],
      borderRadius: theme.borderRadius.xl,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: theme.spacing[2],
    },
    confirmButtonDestructive: {
      backgroundColor: theme.colors.error.DEFAULT,
    },
    confirmButtonText: {
      color: theme.colors.white,
      fontSize: 16,
      fontWeight: fontWeightForPlatform('700'),
    },
    cancelButton: {
      backgroundColor: 'transparent',
      paddingVertical: theme.spacing[3],
      alignItems: 'center',
    },
    cancelButtonText: {
      color: theme.colors.text.tertiary,
      fontSize: 15,
      fontWeight: fontWeightForPlatform('600'),
    },
  });
