import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface.primary,
      borderRadius: theme.borderRadius.card.lg,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      ...theme.shadows.card,
      overflow: 'hidden',
    },
    imageContainer: {
      aspectRatio: 16 / 9,
      backgroundColor: theme.colors.surface.tertiary,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    badgeContainer: {
      // position: 'absolute',
      // top: theme.spacing[2],
      // left: theme.spacing[2],
      // marginTop: theme.spacing[2],
      flexDirection: 'row',
      gap: theme.spacing[1],
    },
    badge: {
      backgroundColor: theme.colors.primary.DEFAULT,
      paddingHorizontal: theme.spacing[2],
      paddingVertical: theme.spacing[1],
      borderRadius: theme.borderRadius.badge,
    },
    badgeText: {
      color: theme.colors.text.inverse,
      fontWeight: fontWeightForPlatform('700'),
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    content: {
      padding: theme.spacing[4],
      gap: theme.spacing[2],
    },
    title: {
      color: theme.colors.text.primary,
      fontWeight: fontWeightForPlatform('700'),
    },
    subtitle: {
      color: theme.colors.text.secondary,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    moqLabel: {
      color: theme.colors.text.secondary,
    },
    moqValue: {
      color: theme.colors.text.primary,
      fontWeight: fontWeightForPlatform('700'),
    },
    divider: {
      width: 1,
      height: 16,
      backgroundColor: theme.colors.divider.primary,
      marginHorizontal: theme.spacing[3],
    },
    priceText: {
      color: theme.colors.primary.DEFAULT,
      fontWeight: fontWeightForPlatform('700'),
    },
  });
