/**
 * TransactionItem Component Styles - Premium Design
 */

import { StyleSheet } from 'react-native';
import { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background.primary,
      paddingVertical: theme.spacing[4],
      paddingHorizontal: theme.spacing[4],
    },
    
    // Icon
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing[3],
    },
    iconContainerAdded: {
      backgroundColor: '#DCFCE7',
    },
    iconContainerDeducted: {
      backgroundColor: '#FEE2E2',
    },
    
    // Content
    contentContainer: {
      flex: 1,
    },
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing[1],
    },
    description: {
      flex: 1,
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.text.primary,
      marginRight: theme.spacing[3],
      lineHeight: 20,
    },
    
    // Amount
    amountContainer: {
      alignItems: 'flex-end',
    },
    amount: {
      fontSize: 16,
      fontWeight: '700',
    },
    amountAdded: {
      color: '#16A34A',
    },
    amountDeducted: {
      color: '#DC2626',
    },
    balanceAfter: {
      fontSize: 11,
      color: theme.colors.text.quaternary,
      marginTop: 2,
    },
    
    // Bottom Row
    bottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    transactionTypeBadge: {
      backgroundColor: theme.colors.background.secondary,
      paddingHorizontal: theme.spacing[2],
      paddingVertical: theme.spacing[1] - 2,
      borderRadius: theme.borderRadius.sm,
      marginRight: theme.spacing[2],
    },
    transactionType: {
      fontSize: 10,
      fontWeight: '600',
      color: theme.colors.text.tertiary,
      textTransform: 'uppercase',
      letterSpacing: 0.3,
    },
    dateTime: {
      fontSize: 12,
      color: theme.colors.text.quaternary,
    },
    dot: {
      width: 3,
      height: 3,
      borderRadius: 1.5,
      backgroundColor: theme.colors.text.quaternary,
      marginHorizontal: theme.spacing[1],
    },
  });
