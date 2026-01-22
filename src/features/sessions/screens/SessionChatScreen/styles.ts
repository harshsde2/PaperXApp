/**
 * SessionChatScreen Styles
 */

import { StyleSheet } from 'react-native';
import { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },

    // Header
    header: {
      backgroundColor: theme.colors.background.primary,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[2],
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    headerCenter: {
      flex: 1,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.colors.text.primary,
    },
    headerSubtitle: {
      fontSize: 10,
      fontWeight: '600',
      color: theme.colors.text.tertiary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginTop: 2,
    },
    infoButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'flex-end',
    },

    // Chat Area
    chatContainer: {
      flex: 1,
    },
    chatContent: {
      padding: theme.spacing[4],
      paddingBottom: theme.spacing[8],
    },

    // Date Separator
    dateSeparator: {
      alignItems: 'center',
      marginVertical: theme.spacing[3],
    },
    dateSeparatorText: {
      fontSize: 11,
      fontWeight: '700',
      color: theme.colors.text.tertiary,
      backgroundColor: theme.colors.background.secondary,
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[1],
      borderRadius: theme.borderRadius.full,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },

    // Message Bubble
    messageRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginBottom: theme.spacing[3],
    },
    messageRowReceived: {
      justifyContent: 'flex-start',
    },
    messageRowSent: {
      justifyContent: 'flex-end',
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.background.secondary,
      marginRight: theme.spacing[3],
    },
    avatarPlaceholder: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.background.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing[3],
    },
    avatarHidden: {
      opacity: 0,
    },
    messageContent: {
      maxWidth: '85%',
    },
    messageMeta: {
      fontSize: 10,
      fontWeight: '600',
      color: theme.colors.text.tertiary,
      marginBottom: 4,
      marginLeft: 4,
    },
    messageMetaSent: {
      textAlign: 'right',
      marginRight: 4,
    },
    messageBubble: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
      borderRadius: theme.borderRadius.xl,
    },
    messageBubbleReceived: {
      backgroundColor: theme.colors.background.secondary,
      borderBottomLeftRadius: 4,
    },
    messageBubbleSent: {
      backgroundColor: theme.colors.primary.DEFAULT,
      borderBottomRightRadius: 4,
    },
    messageText: {
      fontSize: 14,
      lineHeight: 20,
    },
    messageTextReceived: {
      color: theme.colors.text.primary,
    },
    messageTextSent: {
      color: '#FFFFFF',
    },
    messageStatus: {
      fontSize: 10,
      color: theme.colors.text.tertiary,
      marginTop: 4,
      marginRight: 4,
      textAlign: 'right',
    },

    // File Message
    fileMessage: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.xl,
      borderBottomLeftRadius: 4,
      padding: theme.spacing[3],
      gap: theme.spacing[3],
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      maxWidth: '85%',
    },
    fileIcon: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.primary.light,
      justifyContent: 'center',
      alignItems: 'center',
    },
    fileInfo: {
      flex: 1,
    },
    fileName: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    fileSize: {
      fontSize: 11,
      color: theme.colors.text.tertiary,
      marginTop: 2,
    },

    // Image Message
    imageMessage: {
      borderRadius: theme.borderRadius.xl,
      borderBottomLeftRadius: 4,
      overflow: 'hidden',
      backgroundColor: theme.colors.background.secondary,
      maxWidth: '85%',
    },
    imagePreview: {
      width: '100%',
      aspectRatio: 16 / 9,
      backgroundColor: theme.colors.background.secondary,
    },
    imageFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing[2],
    },
    imageFileName: {
      fontSize: 11,
      fontWeight: '500',
      color: theme.colors.text.primary,
    },

    // Disclaimer
    disclaimer: {
      backgroundColor: theme.colors.background.secondary,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.primary,
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[2],
    },
    disclaimerText: {
      fontSize: 9,
      color: theme.colors.text.tertiary,
      textAlign: 'center',
    },

    // Input Area
    inputContainer: {
      backgroundColor: theme.colors.background.primary,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.primary,
      padding: theme.spacing[4],
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.full,
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[2],
    },
    attachButton: {
      marginRight: theme.spacing[2],
    },
    textInput: {
      flex: 1,
      fontSize: 14,
      color: theme.colors.text.primary,
      paddingVertical: theme.spacing[2],
      maxHeight: 100,
    },
    sendButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.primary.DEFAULT,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: theme.spacing[2],
    },
    sendButtonDisabled: {
      backgroundColor: theme.colors.text.tertiary,
    },
  });
