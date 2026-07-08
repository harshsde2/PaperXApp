import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    scrollContent: {
      padding: theme.spacing[4],
      gap: theme.spacing[3],
      paddingBottom: theme.spacing[8],
    },
    card: {
      backgroundColor: theme.colors.surface.primary,
      borderRadius: theme.borderRadius.card.lg,
      padding: theme.spacing[4],
      ...theme.shadows.card,
    },
    heroTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    invoiceNo: {
      fontSize: 16,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.primary,
    },
    paidChip: {
      backgroundColor: '#DCFCE7',
      borderRadius: theme.borderRadius.badge,
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[1],
    },
    paidChipText: {
      fontSize: 11,
      fontWeight: fontWeightForPlatform('700'),
      color: '#15803D',
      letterSpacing: 0.8,
    },
    heroTitle: {
      fontSize: 14,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing[2],
    },
    heroDate: {
      fontSize: 12,
      color: theme.colors.text.tertiary,
      marginTop: theme.spacing[1],
    },
    sectionTitle: {
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      color: theme.colors.text.tertiary,
      fontWeight: fontWeightForPlatform('700'),
      marginBottom: theme.spacing[3],
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing[1],
    },
    rowLabel: {
      fontSize: 13,
      color: theme.colors.text.secondary,
      flexShrink: 1,
      marginRight: theme.spacing[3],
    },
    rowValue: {
      fontSize: 13,
      color: theme.colors.text.primary,
      fontWeight: fontWeightForPlatform('600'),
      flexShrink: 1,
      textAlign: 'right',
    },
    separator: {
      height: 1,
      backgroundColor: theme.colors.border.primary,
      marginVertical: theme.spacing[3],
    },
    totalRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    totalLabel: {
      fontSize: 15,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.primary,
    },
    totalValue: {
      fontSize: 20,
      fontWeight: fontWeightForPlatform('800'),
      color: theme.colors.primary.DEFAULT,
    },
    downloadButton: {
      marginTop: theme.spacing[2],
    },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing[3],
      paddingHorizontal: theme.spacing[8],
    },
    errorTitle: {
      fontSize: 16,
      fontWeight: fontWeightForPlatform('600'),
      color: theme.colors.text.secondary,
    },
    errorSubtitle: {
      fontSize: 13,
      color: theme.colors.text.tertiary,
      textAlign: 'center',
    },
    retryButton: {
      minWidth: 160,
      marginTop: theme.spacing[2],
    },
    skeletonContainer: {
      padding: theme.spacing[4],
    },
  });
