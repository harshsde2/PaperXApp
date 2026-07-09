import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    scrollContent: {
      padding: theme.spacing[4],
      paddingBottom: theme.spacing[12],
    },
    sectionContainer: {
      marginBottom: theme.spacing[6],
    },
    card: {
      marginBottom: theme.spacing[4],
    },
    slotsBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing[3],
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing[4],
    },
    slotsBannerHasSlots: {
      backgroundColor: theme.colors.primary.light,
    },
    slotsBannerNoSlots: {
      backgroundColor: theme.colors.warning.light,
    },
    slotsBannerText: {
      flex: 1,
      marginRight: theme.spacing[2],
    },
    slotsBannerTitle: {
      color: theme.colors.text.primary,
    },
    slotsBannerSubtitle: {
      color: theme.colors.text.secondary,
      marginTop: theme.spacing[1],
    },
    slotsBannerCta: {
      color: theme.colors.warning.DEFAULT,
      fontFamily: theme.fontFamily.semibold,
    },
    sectionTitle: {
      marginBottom: theme.spacing[4],
    },
    fieldContainer: {
      marginBottom: theme.spacing[4],
    },
    label: {
      marginBottom: theme.spacing[1],
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.input.md,
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[3],
      fontSize: theme.typography.body.medium.fontSize,
      color: theme.colors.text.primary,
      backgroundColor: theme.colors.background.primary,
      fontFamily: theme.fontFamily.regular,
    },
    inputError: {
      borderColor: theme.colors.border.error,
    },
    inputReadOnly: {
      backgroundColor: theme.colors.surface.secondary,
      color: theme.colors.text.tertiary,
    },
    errorText: {
      marginTop: theme.spacing[1],
      color: theme.colors.error.DEFAULT,
    },
    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing[4],
    },
    switchLabel: {
      flex: 1,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    halfField: {
      flex: 1,
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[2],
      marginBottom: theme.spacing[1],
    },
    optionalLabel: {
      color: theme.colors.text.tertiary,
    },
    customMaterialRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[2],
    },
    customMaterialInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[3],
      fontSize: 16,
      backgroundColor: theme.colors.surface.primary,
      color: theme.colors.text.primary,
      fontFamily: theme.fontFamily.regular,
    },
    addMaterialButton: {
      paddingVertical: theme.spacing[3],
      paddingHorizontal: theme.spacing[4],
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.primary.DEFAULT,
      justifyContent: 'center',
    },
    buttonText: {
      color: theme.colors.text.inverse,
    },
    helperText: {
      color: theme.colors.text.tertiary,
    },
    leadTimeChipsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing[2],
      marginBottom: theme.spacing[4],
    },
    leadTimeChip: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[2],
      borderRadius: theme.borderRadius.button.full,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    leadTimeChipActive: {
      borderColor: theme.colors.primary.DEFAULT,
      backgroundColor: theme.colors.primary[50],
    },
    leadTimeChipText: {
      color: theme.colors.text.secondary,
    },
    leadTimeChipTextActive: {
      color: theme.colors.primary.DEFAULT,
    },
    submitButtonContainer: {
      marginTop: theme.spacing[6],
    },
    loadingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing[3],
      paddingVertical: theme.spacing[4],
    },
    loadingText: {
      color: theme.colors.text.secondary,
    },
    locationButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[3],
      backgroundColor: theme.colors.surface.primary,
    },
    sheetContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing[4],
      paddingTop: theme.spacing[4],
    },
    sheetTitle: {
      marginBottom: theme.spacing[3],
    },
    searchInput: {
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[3],
      color: theme.colors.text.primary,
      fontFamily: theme.fontFamily.regular,
      marginBottom: theme.spacing[3],
    },
    sheetOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.secondary,
    },
    sheetListContent: {
      paddingBottom: theme.spacing[5],
    },
    loadingMore: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing[4],
    },
    modalOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
      zIndex: 1004,
    },
    modalContent: {
      backgroundColor: theme.colors.background.primary,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      padding: theme.spacing[4],
      maxHeight: '70%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing[4],
    },
    closeIcon: {
      fontSize: 24,
      color: theme.colors.text.primary,
    },
    modalOption: {
      paddingVertical: theme.spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.secondary,
    },
  });
