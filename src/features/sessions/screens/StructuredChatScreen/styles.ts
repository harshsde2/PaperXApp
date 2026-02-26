import { StyleSheet } from 'react-native';
import { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    },
    listContent: {
      flexGrow: 1,
      justifyContent: 'flex-end',
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
    },
    loadMoreButton: {
      alignSelf: 'center',
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[2],
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.primary.light,
      marginBottom: theme.spacing[3],
    },
    loadMoreLoadingRow: {
      alignSelf: 'center',
      marginBottom: theme.spacing[3],
      minHeight: 28,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadMoreText: {
      fontSize: 12,
      color: theme.colors.primary.DEFAULT,
      fontWeight: fontWeightForPlatform('600'),
    },
    messageBubble: {
      maxWidth: '80%',
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[2],
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing[2],
    },
    myMessage: {
      alignSelf: 'flex-end',
      backgroundColor: theme.colors.primary.DEFAULT,
    },
    partnerMessage: {
      alignSelf: 'flex-start',
      backgroundColor: theme.colors.background.primary,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    myMessageText: {
      color: '#FFFFFF',
      fontSize: 14,
    },
    partnerMessageText: {
      color: theme.colors.text.primary,
      fontSize: 14,
    },
    messageTime: {
      marginTop: theme.spacing[1],
      fontSize: 11,
      color: theme.colors.text.tertiary,
    },
    composerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[2],
      padding: theme.spacing[3],
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.primary,
      backgroundColor: theme.colors.background.primary,
    },
    composerErrorText: {
      fontSize: 12,
      color: theme.colors.error?.DEFAULT ?? '#D32F2F',
      paddingHorizontal: theme.spacing[3],
      paddingTop: theme.spacing[2],
      backgroundColor: theme.colors.background.primary,
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[2],
      color: theme.colors.text.primary,
      backgroundColor: theme.colors.background.secondary,
      maxHeight: 110,
    },
    sendButton: {
      minWidth: 72,
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[2],
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.primary.DEFAULT,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendButtonDisabled: {
      opacity: 0.6,
    },
    sendButtonText: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: fontWeightForPlatform('700'),
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
    invalidThreadText: {
      fontSize: 14,
      color: theme.colors.text.tertiary,
      textAlign: 'center',
      lineHeight: 20,
    },
  });
