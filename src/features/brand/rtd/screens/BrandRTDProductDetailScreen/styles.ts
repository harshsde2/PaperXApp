import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

/** Padding below scroll content so the last section clears the sticky footer + home indicator. */
export const getScrollFooterPadding = (theme: Theme) =>
  theme.spacing[3] * 2 + 56 + theme.spacing[4];

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    },
    loadingContainer: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },

    // Image
    imageContainer: {
      aspectRatio: 16 / 9,
      backgroundColor: theme.colors.surface.tertiary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    imagePlaceholderText: {
      fontSize: 13,
      color: theme.colors.text.tertiary,
      marginTop: theme.spacing[2],
    },

    // Product info
    infoSection: {
      paddingHorizontal: theme.spacing[4],
      paddingTop: theme.spacing[4],
      paddingBottom: theme.spacing[2],
      backgroundColor: theme.colors.surface.primary,
      gap: theme.spacing[2],
    },
    title: {
      fontSize: 22,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.primary,
      lineHeight: 28,
    },
    leadTimeBadge: {
      alignSelf: 'flex-start',
      backgroundColor: theme.colors.primary[100],
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[1],
      borderRadius: 100,
    },
    leadTimeBadgeText: {
      fontSize: 11,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.primary.DEFAULT,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    description: {
      fontSize: 14,
      color: theme.colors.text.secondary,
      lineHeight: 20,
    },

    // Sections
    sectionWrapper: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[4],
    },

    // Info banner
    infoBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[3],
      marginHorizontal: theme.spacing[4],
      marginTop: theme.spacing[4],
      padding: theme.spacing[4],
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: theme.colors.primary.DEFAULT,
      borderRadius: theme.borderRadius.card.lg,
      backgroundColor: theme.colors.primary[50],
    },
    infoBannerText: {
      flex: 1,
      fontSize: 13,
      fontWeight: fontWeightForPlatform('600'),
      color: theme.colors.primary.DEFAULT,
      lineHeight: 18,
    },

    // Escrow wrapper
    escrowWrapper: {
      paddingHorizontal: theme.spacing[4],
      paddingTop: theme.spacing[4],
    },

    // Footer
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
      backgroundColor: theme.colors.surface.primary,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.primary,
    },
    footerLeft: {
      gap: theme.spacing[1],
    },
    footerLabel: {
      fontSize: 11,
      color: theme.colors.text.tertiary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    footerValue: {
      fontSize: 15,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.primary,
    },
    footerRight: {
      alignItems: 'center',
      gap: theme.spacing[1],
    },
    footerCaption: {
      fontSize: 10,
      color: theme.colors.text.tertiary,
    },
  });
