/**
 * InsufficientCreditsModal Component Styles - Premium Design
 */

import { StyleSheet } from 'react-native';
import { Theme } from '@theme/types';

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
    
    // Icon
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 24,
      backgroundColor: '#FEF3C7',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing[5],
    },
    
    // Content
    title: {
      fontSize: 22,
      fontWeight: '800',
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
    
    // Balance Details
    balanceContainer: {
      width: '100%',
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.xl,
      overflow: 'hidden',
      marginBottom: theme.spacing[5],
    },
    balanceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing[3],
      paddingHorizontal: theme.spacing[4],
    },
    balanceRowDivider: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },
    balanceLabel: {
      fontSize: 14,
      color: theme.colors.text.secondary,
    },
    balanceValue: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    neededRow: {
      backgroundColor: '#FEE2E2',
      paddingVertical: theme.spacing[3] + 2,
      paddingHorizontal: theme.spacing[4],
    },
    neededLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: '#DC2626',
    },
    neededValue: {
      fontSize: 18,
      fontWeight: '800',
      color: '#DC2626',
    },
    
    // Buttons
    buttonsContainer: {
      width: '100%',
      gap: theme.spacing[3],
    },
    buyButton: {
      backgroundColor: theme.colors.primary.DEFAULT,
      paddingVertical: theme.spacing[4],
      borderRadius: theme.borderRadius.xl,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: theme.spacing[2],
      shadowColor: theme.colors.primary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    buyButtonText: {
      color: theme.colors.white,
      fontSize: 16,
      fontWeight: '700',
    },
    cancelButton: {
      backgroundColor: 'transparent',
      paddingVertical: theme.spacing[3],
      alignItems: 'center',
    },
    cancelButtonText: {
      color: theme.colors.text.tertiary,
      fontSize: 15,
      fontWeight: '600',
    },
  });
