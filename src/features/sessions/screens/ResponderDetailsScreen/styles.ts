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

    // Responder detail – fuller layout (different from card)
    responderContent: {
      paddingHorizontal: theme.spacing[4],
      paddingTop: theme.spacing[4],
      paddingBottom: theme.spacing[10],
    },
    responderHero: {
      paddingVertical: theme.spacing[4],
      paddingHorizontal: theme.spacing[4],
      borderRadius: theme.borderRadius.xl,
      marginBottom: theme.spacing[4],
      borderLeftWidth: 4,
    },
    responderHeroBuy: {
      backgroundColor: 'rgba(5, 150, 105, 0.08)',
      borderLeftColor: '#059669',
    },
    responderHeroSell: {
      backgroundColor: 'rgba(29, 78, 216, 0.08)',
      borderLeftColor: '#1D4ED8',
    },
    responderHeroHeadline: {
      fontSize: 18,
      fontWeight: '800',
      marginBottom: theme.spacing[1],
      letterSpacing: 0.2,
    },
    responderHeroHeadlineBuy: {
      color: '#047857',
    },
    responderHeroHeadlineSell: {
      color: '#1D4ED8',
    },
    responderHeroByline: {
      fontSize: 14,
      color: theme.colors.text.secondary,
    },
    responderSectionLabel: {
      fontSize: 11,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: theme.spacing[2],
      color: theme.colors.text.tertiary,
    },
    responderRequirementBlock: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing[5],
      marginBottom: theme.spacing[4],
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      overflow: 'hidden',
    },
    responderRequirementTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[3],
      lineHeight: 26,
    },
    responderRequirementList: {
      gap: theme.spacing[2],
    },
    responderRequirementRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing[2],
      paddingHorizontal: theme.spacing[3],
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.lg,
    },
    responderRequirementRowText: {
      fontSize: 14,
      color: theme.colors.text.primary,
      flex: 1,
    },
    responderRequirementRowBullet: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginRight: theme.spacing[2],
      backgroundColor: theme.colors.primary.DEFAULT,
    },
    responderMeta: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: theme.spacing[3],
      marginTop: theme.spacing[4],
      paddingTop: theme.spacing[3],
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.secondary,
    },
    responderMetaText: {
      fontSize: 13,
      color: theme.colors.text.tertiary,
    },
    responderTimerWrap: {
      marginBottom: theme.spacing[4],
    },
    responderTimeStrip: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.background.primary,
      paddingVertical: theme.spacing[4],
      paddingHorizontal: theme.spacing[4],
      borderRadius: theme.borderRadius.xl,
      marginBottom: theme.spacing[4],
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    responderTimeStripLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.text.secondary,
    },
    responderTimeStripRow: {
      flexDirection: 'row',
      gap: theme.spacing[3],
    },
    responderTimeBlock: {
      alignItems: 'center',
      minWidth: 52,
    },
    responderTimeValue: {
      width: 48,
      height: 44,
      backgroundColor: theme.colors.primary.light,
      borderRadius: theme.borderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 4,
    },
    responderTimeValueText: {
      fontSize: 18,
      fontWeight: '800',
      color: theme.colors.primary.DEFAULT,
    },
    responderTimeUnit: {
      fontSize: 10,
      fontWeight: '600',
      color: theme.colors.text.tertiary,
      textTransform: 'uppercase',
    },
    responderActionsSection: {
      marginTop: theme.spacing[2],
    },
    responderActionsTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[3],
      paddingHorizontal: theme.spacing[1],
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
    // Interested modal
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalBackdrop: {
      ...StyleSheet.absoluteFillObject,
    },
    modalCenter: {
      width: '100%',
      paddingHorizontal: theme.spacing[4],
    },
    modalBox: {
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing[5],
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: theme.spacing[4],
    },
    modalLabel: {
      fontSize: 13,
      fontWeight: '600',
      marginBottom: theme.spacing[1],
    },
    modalInput: {
      borderWidth: 1,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[3],
      fontSize: 16,
    },
    modalTextArea: {
      minHeight: 80,
      textAlignVertical: 'top',
    },
    modalActions: {
      flexDirection: 'row',
      gap: theme.spacing[3],
      marginTop: theme.spacing[5],
    },
    modalButtonPrimary: {
      flex: 1,
      paddingVertical: theme.spacing[3],
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalButtonPrimaryText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    modalButtonSecondary: {
      flex: 1,
      paddingVertical: theme.spacing[3],
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalButtonSecondaryText: {
      fontSize: 16,
      fontWeight: '600',
    },
  });
