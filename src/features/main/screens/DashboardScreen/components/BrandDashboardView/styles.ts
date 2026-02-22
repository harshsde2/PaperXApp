import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      paddingBottom: theme.spacing[6],
      backgroundColor: theme.colors.background.secondary,
    },

    /* ── Notification Banner ── */
    notificationBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: theme.spacing[5],
      marginTop: theme.spacing[4],
      paddingVertical: theme.spacing[4],
      paddingHorizontal: theme.spacing[4],
      backgroundColor: theme.colors.primary[50],
      borderRadius: theme.borderRadius.card.lg,
      borderWidth: 1,
      borderColor: theme.colors.primary[100],
    },
    notificationContent: {
      flex: 1,
    },
    notificationTitle: {
      fontSize: 14,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.primary.DEFAULT,
      marginBottom: 2,
    },
    notificationSubtitle: {
      fontSize: 12,
      fontWeight: fontWeightForPlatform('500'),
      color: theme.colors.primary[400],
    },

    /* ── Action Cards (full-width gradient cards) ── */
    actionCard: {
      marginHorizontal: theme.spacing[5],
      marginTop: theme.spacing[4],
      borderRadius: theme.borderRadius.card.lg,
      overflow: 'hidden',
      minHeight: 180,
    },
    actionCardGradientCanvas: {
      ...StyleSheet.absoluteFillObject,
    },
    actionCardContent: {
      flex: 1,
      padding: theme.spacing[5],
      zIndex: 1,
    },
    actionCardBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[1],
      borderRadius: theme.borderRadius.button.lg,
      backgroundColor: 'rgba(255,255,255,0.2)',
      marginBottom: theme.spacing[3],
    },
    actionCardBadgeText: {
      fontSize: 11,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.inverse,
      letterSpacing: 0.8,
    },
    actionCardTitle: {
      fontSize: 22,
      fontWeight: fontWeightForPlatform('800'),
      color: theme.colors.text.inverse,
      marginBottom: theme.spacing[2],
    },
    actionCardSubtitle: {
      fontSize: 13,
      fontWeight: fontWeightForPlatform('400'),
      color: theme.colors.text.inverse,
      opacity: 0.85,
      marginBottom: theme.spacing[5],
      lineHeight: 18,
      maxWidth: '80%',
    },
    actionCardIconWrap: {
      position: 'absolute',
      top: theme.spacing[5],
      right: theme.spacing[5],
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.card.md ?? 10,
      backgroundColor: 'rgba(255,255,255,0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionCardButton: {
      backgroundColor: theme.colors.surface.primary,
      paddingVertical: theme.spacing[3],
      borderRadius: theme.borderRadius.button.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionCardButtonText: {
      fontSize: 15,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.primary.DEFAULT,
    },
    actionCardButtonTextSuccess: {
      color: theme.colors.success.DEFAULT,
    },

    /* ── Stats Row ── */
    statsSection: {
      marginTop: theme.spacing[6],
      paddingHorizontal: theme.spacing[5],
    },
    statsRow: {
      flexDirection: 'row',
      gap: theme.spacing[3],
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.colors.surface.primary,
      borderRadius: theme.borderRadius.card.lg,
      paddingVertical: theme.spacing[4],
      paddingHorizontal: theme.spacing[3],
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      alignItems: 'center',
      position: 'relative',
    },
    statLabel: {
      fontSize: 10,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.tertiary,
      letterSpacing: 0.8,
      marginBottom: theme.spacing[2],
    },
    statValue: {
      fontSize: 28,
      fontWeight: fontWeightForPlatform('800'),
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[1],
    },
    statValueHighlight: {
      color: theme.colors.primary.DEFAULT,
    },
    statCategory: {
      fontSize: 12,
      fontWeight: fontWeightForPlatform('500'),
      color: theme.colors.text.secondary,
    },
    statDot: {
      position: 'absolute',
      top: theme.spacing[2],
      right: theme.spacing[2],
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.primary.DEFAULT,
    },

    /* ── Recent Activity ── */
    recentSection: {
      marginTop: theme.spacing[6],
      paddingHorizontal: theme.spacing[5],
    },
    recentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing[4],
    },
    recentTitle: {
      fontSize: 20,
      fontWeight: fontWeightForPlatform('800'),
      color: theme.colors.text.primary,
    },
    viewAllLink: {
      fontSize: 14,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.primary.DEFAULT,
    },
    tabsContainer: {
      flexDirection: 'row',
      gap: theme.spacing[2],
      marginBottom: theme.spacing[4],
    },
    tab: {
      paddingVertical: theme.spacing[2],
      paddingHorizontal: theme.spacing[5],
      borderRadius: theme.borderRadius.button.lg,
      backgroundColor: theme.colors.surface.tertiary,
    },
    tabActive: {
      backgroundColor: theme.colors.text.primary,
    },
    tabText: {
      fontSize: 14,
      fontWeight: fontWeightForPlatform('600'),
      color: theme.colors.text.secondary,
    },
    tabTextActive: {
      color: theme.colors.text.inverse,
    },

    /* ── Activity List Items ── */
    activityItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface.primary,
      borderRadius: theme.borderRadius.card.lg,
      padding: theme.spacing[4],
      marginBottom: theme.spacing[3],
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    activityIconWrap: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.card.md ?? 10,
      backgroundColor: theme.colors.surface.tertiary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing[3],
    },
    activityInfo: {
      flex: 1,
    },
    activityTitle: {
      fontSize: 15,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.primary,
      marginBottom: 2,
    },
    activityTime: {
      fontSize: 12,
      fontWeight: fontWeightForPlatform('500'),
      color: theme.colors.text.tertiary,
    },
    activityBadge: {
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[1],
      borderRadius: theme.borderRadius.button.lg,
      borderWidth: 1,
    },
    activityBadgeText: {
      fontSize: 11,
      fontWeight: fontWeightForPlatform('700'),
      letterSpacing: 0.3,
    },

    /* ── Empty state (Recent Activity) ── */
    emptyActivityCard: {
      backgroundColor: theme.colors.surface.primary,
      borderRadius: theme.borderRadius.card.lg,
      padding: theme.spacing[6],
      alignItems: 'center',
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: theme.colors.border.primary,
      marginTop: theme.spacing[2],
    },
    emptyActivityIconWrap: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.colors.primary[50],
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing[3],
    },
    emptyActivityTitle: {
      fontSize: 16,
      fontWeight: fontWeightForPlatform('800'),
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[1],
    },
    emptyActivityDesc: {
      fontSize: 14,
      fontWeight: fontWeightForPlatform('500'),
      color: theme.colors.text.secondary,
      textAlign: 'center',
      marginBottom: theme.spacing[4],
    },
    emptyActivityButtonContainer: {
      marginTop: theme.spacing[2],
      alignSelf: 'flex-start',
    },
  });
