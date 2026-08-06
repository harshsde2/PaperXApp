import { StyleSheet } from 'react-native';
import { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.55)',
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: theme.colors.background.primary,
      borderTopLeftRadius: theme.borderRadius['2xl'],
      borderTopRightRadius: theme.borderRadius['2xl'],
      maxHeight: '90%',
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing[5],
      paddingTop: theme.spacing[5],
      paddingBottom: theme.spacing[3],
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border.primary,
    },
    headerTextWrapper: {
      flex: 1,
      paddingRight: theme.spacing[3],
    },
    title: {
      fontSize: 18,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.primary,
    },
    effectiveDate: {
      fontSize: 12,
      color: theme.colors.text.tertiary,
      marginTop: 2,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.background.secondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scrollContent: {
      paddingHorizontal: theme.spacing[5],
      paddingTop: theme.spacing[4],
      paddingBottom: theme.spacing[6],
    },
    section: {
      marginBottom: theme.spacing[5],
    },
    sectionHeading: {
      fontSize: 15,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[2],
    },
    paragraph: {
      fontSize: 13.5,
      lineHeight: 21,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing[2],
    },
    bulletRow: {
      flexDirection: 'row',
      marginBottom: theme.spacing[1],
      paddingRight: theme.spacing[2],
    },
    bulletDot: {
      fontSize: 13.5,
      lineHeight: 21,
      color: theme.colors.text.secondary,
      marginRight: theme.spacing[2],
    },
    bulletText: {
      flex: 1,
      fontSize: 13.5,
      lineHeight: 21,
      color: theme.colors.text.secondary,
    },
    footer: {
      paddingHorizontal: theme.spacing[5],
      paddingTop: theme.spacing[3],
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border.primary,
    },
    footerButton: {
      backgroundColor: theme.colors.primary.DEFAULT,
      paddingVertical: theme.spacing[4],
      borderRadius: theme.borderRadius.xl,
      alignItems: 'center',
      justifyContent: 'center',
    },
    footerButtonText: {
      color: theme.colors.white,
      fontSize: 15,
      fontWeight: fontWeightForPlatform('700'),
    },
  });
