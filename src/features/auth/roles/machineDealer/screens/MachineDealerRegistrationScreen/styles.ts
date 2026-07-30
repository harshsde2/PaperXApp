import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    scrollContent: {
      paddingBottom: theme.spacing[6],
    },
    container: {
      flex: 1,
      padding: theme.spacing[3],
      gap: theme.spacing[3],
    },
    card: {
      marginBottom: theme.spacing[3],
      padding: theme.spacing[4],
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing[4],
      gap: theme.spacing[2],
    },
    sectionIconContainer: {
      width: 32,
      height: 32,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.primary[50],
      justifyContent: 'center',
      alignItems: 'center',
    },
    sectionTitle: {
      flex: 1,
      color: theme.colors.text.primary,
    },
    formGroup: {
      marginBottom: theme.spacing[4],
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing[2],
      marginBottom: theme.spacing[1],
    },
    label: {
      color: theme.colors.text.primary,
    },
    optionalLabel: {
      color: theme.colors.text.tertiary,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[3],
      fontSize: 16,
      backgroundColor: theme.colors.surface.primary,
      color: theme.colors.text.primary,
      fontFamily: theme.fontFamily.regular,
    },
    locationInput: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: theme.spacing[2],
    },
    inputIconLeft: {
      marginRight: theme.spacing[2],
    },
    textArea: {
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[3],
      fontSize: 16,
      backgroundColor: theme.colors.surface.primary,
      color: theme.colors.text.primary,
      fontFamily: theme.fontFamily.regular,
      minHeight: 100,
      textAlignVertical: 'top',
    },
    addressContainer: {
      marginTop: theme.spacing[2],
    },
    addressPreview: {
      marginTop: theme.spacing[2],
      padding: theme.spacing[3],
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    addressPreviewText: {
      color: theme.colors.text.secondary,
    },
    infoContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: theme.colors.primary[50],
      padding: theme.spacing[3],
      borderRadius: theme.borderRadius.md,
      gap: theme.spacing[2],
    },
    infoIcon: {
      fontSize: 16,
      marginTop: 2,
    },
    infoText: {
      flex: 1,
      color: theme.colors.primary[900],
      lineHeight: 18,
    },
    button: {
      backgroundColor: theme.colors.primary.DEFAULT,
      paddingVertical: theme.spacing[4],
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: theme.spacing[2],
      marginTop: theme.spacing[4],
      marginBottom: theme.spacing[6],
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      color: theme.colors.text.inverse,
    },
    securityFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing[2],
      marginBottom: theme.spacing[4],
    },
    lockIcon: {
      fontSize: 14,
    },
    securityText: {
      color: theme.colors.text.tertiary,
      letterSpacing: 0.5,
    },
    addCustomLinkRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[1],
      marginTop: theme.spacing[2],
      alignSelf: 'flex-start',
    },
    addCustomLinkText: {
      color: theme.colors.primary.DEFAULT,
      textDecorationLine: 'underline',
    },
    // Machine preferences list + add-form
    addPrefIconButton: {
      width: 32,
      height: 32,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.primary[50],
      justifyContent: 'center',
      alignItems: 'center',
    },
    prefEmptyText: {
      color: theme.colors.text.tertiary,
      marginBottom: theme.spacing[3],
    },
    prefList: {
      gap: theme.spacing[2],
      marginBottom: theme.spacing[3],
    },
    prefRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.lg,
      paddingVertical: theme.spacing[2],
      paddingHorizontal: theme.spacing[3],
      backgroundColor: theme.colors.surface.primary,
      gap: theme.spacing[2],
    },
    prefRowTextWrap: {
      flex: 1,
    },
    prefRowName: {
      color: theme.colors.text.primary,
    },
    prefRowCategory: {
      color: theme.colors.text.tertiary,
      marginTop: 2,
    },
    prefRowBrands: {
      color: theme.colors.text.secondary,
      marginTop: 2,
    },
    prefRemoveButton: {
      width: 28,
      height: 28,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.surface.tertiary,
    },
    addPrefForm: {
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[3],
      backgroundColor: theme.colors.background.secondary,
      gap: theme.spacing[3],
      marginBottom: theme.spacing[2],
    },
    addPrefButton: {
      marginTop: theme.spacing[1],
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.colors.background.overlay,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing[4],
    },
    modalCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      paddingTop: theme.spacing[5],
      paddingBottom: theme.spacing[6],
      paddingHorizontal: theme.spacing[5],
      gap: theme.spacing[3],
    },
    modalTitle: {
      color: theme.colors.text.primary,
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: theme.spacing[3],
    },
    modalCancelButton: {
      minWidth: 96,
    },
    addMachineButton: {
      minWidth: 96,
    },
    customMachineInput: {
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[3],
      fontSize: 16,
      backgroundColor: theme.colors.surface.primary,
      color: theme.colors.text.primary,
      fontFamily: theme.fontFamily.regular,
    },
    customEntryScroll: {
      maxHeight: 360,
    },
    customEntryFieldLabel: {
      color: theme.colors.text.secondary,
      marginTop: theme.spacing[2],
      marginBottom: theme.spacing[1],
    },
    customEntryOptionalHint: {
      color: theme.colors.text.tertiary,
    },
    customEntryChipsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing[2],
      marginBottom: theme.spacing[2],
    },
    customEntryChip: {
      paddingVertical: theme.spacing[2],
      paddingHorizontal: theme.spacing[3],
      borderRadius: theme.borderRadius.full,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      backgroundColor: theme.colors.surface.primary,
    },
    customEntryChipSelected: {
      borderColor: theme.colors.primary.DEFAULT,
      backgroundColor: theme.colors.primary[50],
    },
    customEntryChipText: {
      color: theme.colors.text.primary,
    },
    customEntryChipTextSelected: {
      color: theme.colors.primary.DEFAULT,
      fontWeight: fontWeightForPlatform('600'),
    },
    customEntryDescriptionInput: {
      minHeight: 80,
      textAlignVertical: 'top',
    },
  });
