import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    },
    content: {
      paddingHorizontal: theme.spacing[4],
      paddingBottom: theme.spacing[24],
    },
    title: {
      fontSize: 20,
      fontWeight: fontWeightForPlatform('800'),
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[1],
    },
    subtitle: {
      fontSize: 14,
      fontWeight: fontWeightForPlatform('500'),
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing[6],
    },
    packCard: {
      borderRadius: theme.borderRadius.card.lg,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      backgroundColor: theme.colors.surface.primary,
      padding: theme.spacing[4],
      marginBottom: theme.spacing[4],
    },
    packCardPopular: {
      borderColor: theme.colors.primary.DEFAULT,
      borderWidth: 2,
    },
    popularBadge: {
      alignSelf: 'flex-start',
      backgroundColor: theme.colors.primary.light,
      paddingHorizontal: theme.spacing[2],
      paddingVertical: theme.spacing[0],
      borderRadius: theme.borderRadius.badge,
      marginBottom: theme.spacing[2],
    },
    popularBadgeText: {
      fontSize: 10,
      fontWeight: fontWeightForPlatform('800'),
      color: theme.colors.primary.dark,
      textTransform: 'uppercase',
    },
    packName: {
      fontSize: 16,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[1],
    },
    packMeta: {
      fontSize: 13,
      fontWeight: fontWeightForPlatform('500'),
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing[3],
    },
    packPriceRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginTop: theme.spacing[2],
    },
    packPrice: {
      fontSize: 22,
      fontWeight: fontWeightForPlatform('800'),
      color: theme.colors.text.primary,
    },
    buyButton: {
      minWidth: 100,
    },
  });
