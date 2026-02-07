/**
 * ResponderDetailsScreen Styles
 */

import { StyleSheet } from 'react-native';
import { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    },
    header: {
      backgroundColor: theme.colors.background.primary,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[1],
    },
    headerTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: theme.colors.text.primary,
      flex: 1,
      textAlign: 'center',
    },
    posterLine: {
      paddingHorizontal: theme.spacing[4],
      paddingTop: theme.spacing[2],
      paddingBottom: theme.spacing[1],
    },
    posterLineText: {
      fontSize: 13,
      color: theme.colors.text.tertiary,
    },
    intentBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[2],
      borderRadius: theme.borderRadius.lg,
      marginHorizontal: theme.spacing[4],
      marginTop: theme.spacing[2],
    },
    intentBadgeBuy: {
      backgroundColor: '#D1FAE5',
    },
    intentBadgeSell: {
      backgroundColor: '#DBEAFE',
    },
    intentBadgeText: {
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
    },
    intentBadgeTextBuy: {
      color: '#059669',
    },
    intentBadgeTextSell: {
      color: '#1D4ED8',
    },
    actionSection: {
      padding: theme.spacing[4],
      gap: theme.spacing[3],
    },
    primaryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing[2],
      backgroundColor: theme.colors.primary.DEFAULT,
      paddingVertical: theme.spacing[4],
      borderRadius: theme.borderRadius.lg,
    },
    primaryButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    secondaryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing[2],
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      paddingVertical: theme.spacing[4],
      borderRadius: theme.borderRadius.lg,
    },
    secondaryButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text.secondary,
    },
    statusBox: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
      backgroundColor: theme.colors.primary.light,
      borderRadius: theme.borderRadius.lg,
      marginHorizontal: theme.spacing[4],
      marginTop: theme.spacing[2],
    },
    statusText: {
      fontSize: 14,
      color: theme.colors.text.secondary,
      textAlign: 'center',
    },
    lockedText: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[4],
      textAlign: 'center',
      fontSize: 14,
      color: theme.colors.text.tertiary,
    },
  });
