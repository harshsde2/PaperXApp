import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    heroSection: {
      width: '100%',
      height: 290,
      backgroundColor: theme.colors.surface.secondary,
      position: 'relative',
    },
    heroImage: {
      width: '100%',
      height: '100%',
    },
    heroFallback: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroOverlay: {
      ...StyleSheet.absoluteFillObject,
    },
    floatingActions: {
      position: 'absolute',
      left: 0,
      right: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing[4],
    },
    actionButtonsRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[2],
    },
    actionButton: {
      width: 36,
      height: 36,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.background.overlay,
      alignItems: 'center',
      justifyContent: 'center',
    },
    categoryPill: {
      position: 'absolute',
      left: theme.spacing[4],
      bottom: theme.spacing[5],
      borderRadius: theme.borderRadius.badge,
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[1],
    },
    categoryText: {
      color: theme.colors.text.inverse,
      fontWeight: fontWeightForPlatform('700'),
    },
    contentCard: {
      marginTop: -40,
      borderTopLeftRadius: theme.borderRadius.card.lg,
      borderTopRightRadius: theme.borderRadius.card.lg,
      backgroundColor: theme.colors.surface.primary,
      paddingHorizontal: theme.spacing[5],
      paddingTop: theme.spacing[5],
      paddingBottom: theme.spacing[8],
      minHeight: 360,
      gap: theme.spacing[3],
    },
    title: {
      color: theme.colors.text.primary,
      fontWeight: fontWeightForPlatform('700'),
      lineHeight: 34,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[2],
    },
    metaText: {
      color: theme.colors.text.secondary,
    },
    sourceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[2],
    },
    sourceAvatar: {
      width: 34,
      height: 34,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.primary[100],
      alignItems: 'center',
      justifyContent: 'center',
    },
    sourceAvatarText: {
      color: theme.colors.primary.DEFAULT,
      fontWeight: fontWeightForPlatform('700'),
    },
    sourceName: {
      color: theme.colors.text.primary,
      fontWeight: fontWeightForPlatform('600'),
      flexShrink: 1,
    },
    verifiedIcon: {
      width: 18,
      height: 18,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.success.DEFAULT,
      alignItems: 'center',
      justifyContent: 'center',
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.divider.primary,
    },
    summary: {
      color: theme.colors.text.secondary,
      lineHeight: 24,
    },
    ctaWrapper: {
      marginTop: theme.spacing[2],
    },
  });
