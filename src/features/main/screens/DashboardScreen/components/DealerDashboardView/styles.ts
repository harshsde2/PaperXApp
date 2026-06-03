import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';
import {
  getHeadingStyle,
  getBodyStyle,
  getCaptionStyle,
} from '../sharedDashboardStyles';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      paddingBottom: theme.spacing[6],
      // Keep transparent so DashboardScreen wrapper gradient is visible.
    },
    titleSection: {
      paddingHorizontal: theme.spacing[5],
      paddingTop: theme.spacing[5],
      paddingBottom: theme.spacing[4],
    },
    title: {
      ...getHeadingStyle(theme, 'h4'),
      fontSize: theme.typography.heading.h2.fontSize,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[1],
    },
    subtitle: {
      ...getBodyStyle(theme, 'medium'),
      color: theme.colors.text.secondary,
    },
    statsContainer: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing[5],
      paddingVertical: theme.spacing[4],
      gap: theme.spacing[3],
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.colors.surface.primary,
      borderRadius: theme.borderRadius.card.lg,
      padding: theme.spacing[4],
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      shadowColor: theme.colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },
    statCardWithGradient: {
      backgroundColor: 'transparent',
      overflow: 'hidden',
    },
    statGradientCanvas: {
      ...StyleSheet.absoluteFillObject,
    },
    statContent: {
      zIndex: 1,
    },
    statCardBlue: {
      backgroundColor: theme.colors.primary[50],
      borderColor: theme.colors.primary[200],
    },
    statCardGrey: {
      backgroundColor: theme.colors.secondary[600],
      borderColor: theme.colors.secondary[600],
    },
    statIconContainer: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.card.md ?? 10,
      backgroundColor: 'rgba(255,255,255,0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing[3],
    },
    statIconDark: {
      backgroundColor: 'rgba(255,255,255,0.15)',
    },
    statValue: {
      fontSize: 28,
      fontFamily: theme.fontFamily.bold,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.primary.DEFAULT,
      marginBottom: theme.spacing[1],
    },
    statValueDark: {
      color: theme.colors.text.inverse,
    },
    statLabel: {
      ...getCaptionStyle(theme, 'medium'),
      color: theme.colors.text.secondary,
      lineHeight: 18,
    },
    statSublabel: {
      ...getCaptionStyle(theme, 'small'),
      color: theme.colors.text.tertiary,
      marginTop: theme.spacing[1],
    },
    statLabelDark: {
      color: 'rgba(255,255,255,0.85)',
    },
    section: {
      paddingHorizontal: theme.spacing[5],
      paddingVertical: theme.spacing[4],
      marginTop: theme.spacing[2],
    },
    sectionTitle: {
      ...getHeadingStyle(theme, 'h5'),
      color: theme.colors.text.primary,
    },
    actionsContainer: {
      flexDirection: 'row',
      gap: theme.spacing[3],
      marginTop: theme.spacing[3],
    },
    actionCardPrimary: {
      flex: 1,
      backgroundColor: theme.colors.primary.DEFAULT,
      borderRadius: theme.borderRadius.card.lg,
      padding: theme.spacing[5],
      alignItems: 'center',
    },
    actionCardSecondary: {
      flex: 1,
      backgroundColor: theme.colors.primary[50],
      borderRadius: theme.borderRadius.card.lg,
      padding: theme.spacing[5],
      alignItems: 'center',
    },
    actionCardWithGradient: {
      backgroundColor: 'transparent',
      overflow: 'hidden',
    },
    actionGradientCanvas: {
      ...StyleSheet.absoluteFillObject,
    },
    actionContent: {
      alignItems: 'center',
      zIndex: 1,
    },
    actionIcon: {
      width: 52,
      height: 52,
      borderRadius: theme.borderRadius.card.lg ?? 14,
      backgroundColor: 'rgba(255,255,255,0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing[4],
    },
    actionIconSecondary: {
      width: 52,
      height: 52,
      borderRadius: theme.borderRadius.card.lg ?? 14,
      backgroundColor: 'rgba(255,255,255,0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing[4],
    },
    actionTitlePrimary: {
      ...getBodyStyle(theme, 'medium'),
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.inverse,
      marginBottom: theme.spacing[1],
    },
    actionSubtitlePrimary: {
      ...getBodyStyle(theme, 'small'),
      color: 'rgba(255,255,255,0.9)',
    },
    actionTitleSecondary: {
      ...getBodyStyle(theme, 'medium'),
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.inverse,
      marginBottom: theme.spacing[1],
    },
    actionSubtitleSecondary: {
      ...getBodyStyle(theme, 'small'),
      color: 'rgba(255,255,255,0.9)',
    },
    additionalCardsRow: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing[5],
      paddingVertical: theme.spacing[4],
      gap: theme.spacing[3],
      marginTop: theme.spacing[2],
    },
    additionalCard: {
      flex: 1,
      backgroundColor: theme.colors.surface.primary,
      borderRadius: theme.borderRadius.card.lg,
      padding: theme.spacing[4],
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    additionalIconContainer: {
      width: 44,
      height: 44,
      borderRadius: theme.borderRadius.card.md ?? 12,
      backgroundColor: theme.colors.primary[50],
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing[4],
    },
    additionalCardTitle: {
      ...getHeadingStyle(theme, 'h6'),
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[1],
    },
    additionalCardSubtitle: {
      ...getBodyStyle(theme, 'small'),
      color: theme.colors.text.secondary,
    },
    insightCard: {
      marginHorizontal: theme.spacing[5],
      marginTop: theme.spacing[4],
      marginBottom: theme.spacing[2],
      backgroundColor: theme.colors.primary[800],
      borderRadius: theme.borderRadius.card.lg,
      padding: theme.spacing[6],
    },
    insightCategory: {
      ...getCaptionStyle(theme, 'small'),
      fontWeight: fontWeightForPlatform('700'),
      color: 'rgba(255,255,255,0.8)',
      letterSpacing: 1,
      marginBottom: theme.spacing[3],
      textTransform: 'uppercase',
    },
    insightTitle: {
      ...getHeadingStyle(theme, 'h5'),
      color: theme.colors.text.inverse,
      lineHeight: 26,
      marginBottom: theme.spacing[4],
    },
    insightLink: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    insightLinkText: {
      ...getBodyStyle(theme, 'small'),
      fontWeight: fontWeightForPlatform('600'),
      color: theme.colors.text.inverse,
      marginRight: theme.spacing[2],
    },
  });
