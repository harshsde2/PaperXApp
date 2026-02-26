import { StyleSheet } from 'react-native';
import { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
      paddingHorizontal: theme.spacing[4],
      paddingTop: theme.spacing[2],
      paddingBottom: theme.spacing[4],
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[1],
    },
    headerSubtitle: {
      fontSize: 13,
      color: theme.colors.text.tertiary,
      marginBottom: theme.spacing[4],
    },
    listContent: {
      paddingBottom: theme.spacing[8],
    },
    card: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      padding: theme.spacing[4],
      marginBottom: theme.spacing[3],
    },
    cardTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing[2],
    },
    cardRightPills: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[2],
    },
    partnerName: {
      fontSize: 16,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.primary,
      flex: 1,
      marginRight: theme.spacing[2],
    },
    roleBadge: {
      paddingHorizontal: theme.spacing[2],
      paddingVertical: theme.spacing[1],
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.primary.light,
    },
    roleBadgeText: {
      fontSize: 11,
      color: theme.colors.primary.DEFAULT,
      fontWeight: fontWeightForPlatform('600'),
      textTransform: 'capitalize',
    },
    newBadge: {
      paddingHorizontal: theme.spacing[2],
      paddingVertical: theme.spacing[1],
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.success?.light ?? theme.colors.primary.light,
    },
    newBadgeText: {
      fontSize: 11,
      color: theme.colors.success?.DEFAULT ?? theme.colors.primary.DEFAULT,
      fontWeight: fontWeightForPlatform('700'),
    },
    unreadBadge: {
      minWidth: 22,
      height: 22,
      paddingHorizontal: theme.spacing[1],
      borderRadius: 11,
      backgroundColor: theme.colors.primary.DEFAULT,
      alignItems: 'center',
      justifyContent: 'center',
    },
    unreadBadgeText: {
      fontSize: 11,
      color: '#FFFFFF',
      fontWeight: fontWeightForPlatform('700'),
    },
    preview: {
      fontSize: 13,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing[2],
    },
    dateText: {
      fontSize: 12,
      color: theme.colors.text.tertiary,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing[6],
    },
    emptyText: {
      fontSize: 14,
      color: theme.colors.text.tertiary,
      textAlign: 'center',
    },
  });
