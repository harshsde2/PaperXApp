/**
 * MatchResponseCard Styles
 */

import { StyleSheet } from 'react-native';
import { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing[4],
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 6,
      elevation: 2,
    },
    cardShortlisted: {
      borderColor: theme.colors.primary.DEFAULT,
      borderWidth: 2,
    },

    // Header
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing[3],
    },
    supplierInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: theme.spacing[3],
    },
    supplierLogo: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.primary.light,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing[3],
    },
    supplierLogoSlightVariation: {
      backgroundColor: theme.colors.background.secondary,
    },
    supplierDetails: {
      flex: 1,
    },
    supplierNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginBottom: 2,
    },
    supplierName: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.colors.text.primary,
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    locationText: {
      fontSize: 11,
      color: theme.colors.text.tertiary,
    },

    // Match Type Badge
    matchBadge: {
      paddingHorizontal: theme.spacing[2],
      paddingVertical: theme.spacing[1],
      borderRadius: theme.borderRadius.lg,
      alignSelf: 'flex-start',
    },
    matchBadgeExact: {
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
    },
    matchBadgeVariation: {
      backgroundColor: theme.colors.background.secondary,
    },
    matchBadgeNearest: {
      backgroundColor: '#FEF3C7',
    },
    matchBadgeText: {
      fontSize: 9,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.3,
    },
    matchBadgeTextExact: {
      color: theme.colors.primary.DEFAULT,
    },
    matchBadgeTextVariation: {
      color: theme.colors.text.primary,
    },
    matchBadgeTextNearest: {
      color: '#D97706',
    },

    // Message
    message: {
      fontSize: 13,
      color: theme.colors.text.secondary,
      lineHeight: 19,
      marginBottom: theme.spacing[4],
    },

    // Actions
    actionsRow: {
      flexDirection: 'row',
      gap: theme.spacing[2],
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 44,
      borderRadius: theme.borderRadius.lg,
      gap: theme.spacing[2],
    },
    chatButton: {
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      backgroundColor: theme.colors.background.primary,
    },
    shortlistButton: {
      backgroundColor: theme.colors.primary.DEFAULT,
    },
    shortlistedButton: {
      backgroundColor: '#DCFCE7',
      borderWidth: 1,
      borderColor: '#16A34A',
    },
    rejectButton: {
      width: 44,
      flex: 0,
      backgroundColor: '#FEE2E2',
      borderWidth: 1,
      borderColor: '#FECACA',
    },
    actionButtonText: {
      fontSize: 13,
      fontWeight: '700',
    },
    chatButtonText: {
      color: theme.colors.text.primary,
    },
    shortlistButtonText: {
      color: '#FFFFFF',
    },
    shortlistedButtonText: {
      color: '#16A34A',
    },
  });
