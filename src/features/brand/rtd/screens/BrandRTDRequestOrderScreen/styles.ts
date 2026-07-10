import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scrollContent: {
      paddingBottom: theme.spacing[6],
    },

    // Progress bar
    progressContainer: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[4],
      backgroundColor: theme.colors.surface.primary,
    },
    progressLabel: {
      fontSize: 12,
      fontWeight: fontWeightForPlatform('600'),
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing[2],
    },
    progressBarTrack: {
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.colors.surface.tertiary,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      borderRadius: 3,
      backgroundColor: theme.colors.primary.DEFAULT,
    },

    // Sections
    section: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[4],
      backgroundColor: theme.colors.surface.primary,
      marginTop: theme.spacing[2],
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[4],
    },

    // Form fields
    fieldLabel: {
      fontSize: 13,
      fontWeight: fontWeightForPlatform('600'),
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing[2],
    },
    optionalTag: {
      fontSize: 12,
      color: theme.colors.text.tertiary,
    },
    inputContainer: {
      height: 56,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.card.lg,
      paddingHorizontal: theme.spacing[4],
      backgroundColor: theme.colors.surface.primary,
    },
    inputContainerFocused: {
      borderColor: theme.colors.primary.DEFAULT,
      borderWidth: 1.5,
    },
    inputContainerError: {
      borderColor: theme.colors.error.DEFAULT,
    },
    textInput: {
      flex: 1,
      fontSize: 15,
      color: theme.colors.text.primary,
      padding: 0,
    },
    inputSuffix: {
      fontSize: 14,
      color: theme.colors.text.tertiary,
      marginLeft: theme.spacing[2],
    },
    errorText: {
      fontSize: 12,
      color: theme.colors.error.DEFAULT,
      marginTop: theme.spacing[1],
    },

    // Logo upload
    uploadArea: {
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.card.lg,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing[6],
      paddingHorizontal: theme.spacing[4],
      backgroundColor: theme.colors.surface.secondary,
      gap: theme.spacing[2],
      marginTop: theme.spacing[2],
    },
    uploadAreaActive: {
      borderColor: theme.colors.primary.DEFAULT,
      backgroundColor: theme.colors.primary[50],
    },
    uploadIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.primary[100],
      alignItems: 'center',
      justifyContent: 'center',
    },
    uploadTitle: {
      fontSize: 14,
      fontWeight: fontWeightForPlatform('600'),
      color: theme.colors.text.primary,
    },
    uploadHint: {
      fontSize: 12,
      color: theme.colors.text.tertiary,
      textAlign: 'center',
    },
    chooseFileButton: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[2],
      borderRadius: theme.borderRadius.button.sm,
      backgroundColor: theme.colors.primary.DEFAULT,
      marginTop: theme.spacing[1],
    },
    chooseFileText: {
      fontSize: 13,
      fontWeight: fontWeightForPlatform('600'),
      color: theme.colors.text.inverse,
    },
    selectedFileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing[3],
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[2],
      borderRadius: theme.borderRadius.card.md,
      backgroundColor: theme.colors.primary[50],
      gap: theme.spacing[2],
    },
    selectedFileName: {
      flex: 1,
      fontSize: 13,
      color: theme.colors.primary.DEFAULT,
    },
    removeFileButton: {
      padding: theme.spacing[1],
    },

    // Textarea
    textareaContainer: {
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.card.lg,
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
      backgroundColor: theme.colors.surface.primary,
      minHeight: 80,
    },
    textareaContainerFocused: {
      borderColor: theme.colors.primary.DEFAULT,
      borderWidth: 1.5,
    },
    textarea: {
      fontSize: 15,
      color: theme.colors.text.primary,
      padding: 0,
      textAlignVertical: 'top',
      minHeight: 60,
    },

    // Lead time card
    leadTimeCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[3],
      marginTop: theme.spacing[3],
      padding: theme.spacing[4],
      backgroundColor: theme.colors.primary[50],
      borderWidth: 1,
      borderColor: theme.colors.primary[200],
      borderRadius: theme.borderRadius.card.lg,
    },
    leadTimeIconWrapper: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary[100],
      alignItems: 'center',
      justifyContent: 'center',
    },
    leadTimeContent: {
      flex: 1,
    },
    leadTimeLabel: {
      fontSize: 12,
      fontWeight: fontWeightForPlatform('600'),
      color: theme.colors.primary.DEFAULT,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    leadTimeValue: {
      fontSize: 14,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.primary,
      marginTop: 2,
    },

    fieldSpacer: {
      height: theme.spacing[4],
    },

    // Footer
    footer: {
      paddingHorizontal: theme.spacing[4],
      paddingTop: theme.spacing[3],
      paddingBottom: theme.spacing[4],
      backgroundColor: theme.colors.surface.primary,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.primary,
    },
    footerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 4,
    },
    footerLabel: {
      fontSize: 13,
      color: theme.colors.text.secondary,
    },
    footerValue: {
      fontSize: 13,
      color: theme.colors.text.primary,
    },
    footerDivider: {
      height: 1,
      backgroundColor: theme.colors.border.primary,
      marginVertical: theme.spacing[2],
    },
    footerTotalRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing[3],
    },
    footerTotalLabel: {
      fontSize: 14,
      color: theme.colors.text.secondary,
    },
    footerTotalValue: {
      fontSize: 18,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.primary,
    },
    termsText: {
      fontSize: 10,
      color: theme.colors.text.tertiary,
      textAlign: 'center',
      marginTop: theme.spacing[3],
    },
  });
