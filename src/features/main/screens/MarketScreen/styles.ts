import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    listContentContainer: {
      paddingHorizontal: theme.spacing[4],
      paddingBottom: theme.spacing[8],
      gap: theme.spacing[4],
    },
    headerContainer: {
      gap: theme.spacing[4],
      paddingBottom: theme.spacing[2],
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    avatarButton: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary[100],
      overflow: 'hidden',
    },
    avatarImage: {
      width: '100%',
      height: '100%',
    },
    avatarInitials: {
      color: theme.colors.primary.DEFAULT,
      fontWeight: fontWeightForPlatform('700'),
    },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surface.secondary,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    heroBlock: {
      gap: theme.spacing[1],
    },
    heroTitle: {
      color: theme.colors.text.primary,
      fontWeight: fontWeightForPlatform('800'),
    },
    heroSubtitle: {
      color: theme.colors.text.secondary,
    },
    listHeaderSpacer: {
      height: theme.spacing[2],
    },
    stateContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing[8],
      gap: theme.spacing[2],
    },
    stateTitle: {
      color: theme.colors.text.primary,
      textAlign: 'center',
      fontWeight: fontWeightForPlatform('700'),
    },
    stateDescription: {
      color: theme.colors.text.secondary,
      textAlign: 'center',
    },
    retryButton: {
      marginTop: theme.spacing[2],
      minWidth: 160,
    },
    listSeparator: {
      height: theme.spacing[4],
    },
    emptyFilterContainer: {
      marginTop: theme.spacing[2],
      paddingVertical: theme.spacing[6],
      paddingHorizontal: theme.spacing[4],
      borderRadius: theme.borderRadius.card.md,
      backgroundColor: theme.colors.surface.secondary,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      gap: theme.spacing[1],
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyFilterTitle: {
      color: theme.colors.text.primary,
      fontWeight: fontWeightForPlatform('700'),
      textAlign: 'center',
    },
    emptyFilterSubtitle: {
      color: theme.colors.text.secondary,
      textAlign: 'center',
    },
    loadingContentContainer: {
      paddingHorizontal: theme.spacing[4],
      paddingBottom: theme.spacing[8],
      gap: theme.spacing[4],
    },
    loadingHeader: {
      gap: theme.spacing[4],
    },
    loadingHeaderTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    loadingCardsWrapper: {
      gap: theme.spacing[4],
    },
  });
