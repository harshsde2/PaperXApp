import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      gap: theme.spacing[3],
    },
    imageWrapper: {
      aspectRatio: 16 / 9,
      borderRadius: theme.borderRadius.card.lg,
      overflow: 'hidden',
      backgroundColor: theme.colors.surface.secondary,
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    fallbackImage: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    overlayActions: {
      position: 'absolute',
      top: theme.spacing[3],
      left: theme.spacing[3],
      right: theme.spacing[3],
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    iconButton: {
      width: 32,
      height: 32,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.background.overlay,
      alignItems: 'center',
      justifyContent: 'center',
    },
    categoryPill: {
      position: 'absolute',
      left: theme.spacing[3],
      bottom: theme.spacing[3],
      borderRadius: theme.borderRadius.badge,
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[1],
    },
    categoryText: {
      color: theme.colors.text.inverse,
      fontWeight: fontWeightForPlatform('700'),
    },
    title: {
      color: theme.colors.text.primary,
      fontWeight: fontWeightForPlatform('700'),
      lineHeight: 24,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[1],
    },
    metaText: {
      color: theme.colors.text.secondary,
    },
  });
