import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface.primary,
      borderRadius: theme.borderRadius['2xl'],
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      padding: theme.spacing[4],
      ...theme.shadows.card,
    },
    header: {
      fontSize: 18,
      fontWeight: fontWeightForPlatform('700'),
      fontFamily: theme.fontFamily.bold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[3],
    },
    productRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    thumbnail: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface.tertiary,
    },
    thumbnailImage: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.lg,
    },
    productDetails: {
      flex: 1,
      marginLeft: theme.spacing[3],
    },
    productName: {
      fontWeight: fontWeightForPlatform('600'),
      fontFamily: theme.fontFamily.semibold,
      color: theme.colors.text.primary,
    },
    quantity: {
      fontSize: 12,
      color: theme.colors.text.secondary,
      marginTop: 2,
    },
    price: {
      fontWeight: fontWeightForPlatform('700'),
      fontFamily: theme.fontFamily.bold,
      color: theme.colors.text.primary,
      marginLeft: theme.spacing[2],
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.divider.primary,
      marginVertical: theme.spacing[3],
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing[2],
    },
    detailLabel: {
      color: theme.colors.text.secondary,
    },
    detailValuePrimary: {
      fontWeight: fontWeightForPlatform('600'),
      fontFamily: theme.fontFamily.semibold,
      color: theme.colors.primary.DEFAULT,
    },
    detailValueMedium: {
      fontWeight: fontWeightForPlatform('500'),
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.text.primary,
    },
  });
