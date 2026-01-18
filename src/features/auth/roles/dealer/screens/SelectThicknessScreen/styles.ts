import { StyleSheet, Platform } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    scrollContent: {
      paddingBottom: theme.spacing[6],
    },
    container: {
      flex: 1,
      padding: theme.spacing[4],
      gap: theme.spacing[4],
    },
    segmentedControl: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface.secondary || theme.colors.background.tertiary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[1],
      marginBottom: theme.spacing[2],
    },
    segmentedOption: {
      flex: 1,
      paddingVertical: theme.spacing[2],
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    segmentedOptionSelected: {
      backgroundColor: theme.colors.surface.primary || theme.colors.background.secondary,
    },
    segmentedOptionText: {
      color: theme.colors.text.tertiary,
    },
    segmentedOptionTextSelected: {
      color: theme.colors.primary.DEFAULT,
      fontWeight: '600',
    },
    selectedRangeCard: {
      padding: theme.spacing[4],
      marginBottom: theme.spacing[4],
      backgroundColor: theme.colors.surface.primary,
    },
    selectedRangeLabel: {
      color: theme.colors.text.tertiary,
      marginBottom: theme.spacing[2],
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    selectedRangeValue: {
      color: theme.colors.text.primary,
      fontSize: 32,
      lineHeight: 40,
    },
    selectedRangeUnit: {
      color: theme.colors.primary.DEFAULT,
      fontSize: 32,
    },
    sliderContainer: {
      marginBottom: theme.spacing[4],
    },
    sliderLabels: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing[3],
      paddingHorizontal: theme.spacing[1],
    },
    sliderLabel: {
      color: theme.colors.text.secondary,
      fontSize: 12,
    },
    sliderTrackContainer: {
      position: 'relative',
      height: 60,
      marginBottom: theme.spacing[2],
      paddingVertical: theme.spacing[3],
      width: '100%',
    },
    sliderTrack: {
      height: 4,
      backgroundColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.full,
      position: 'absolute',
      top: 28,
      left: 0,
      width: '100%',
    },
    sliderActiveTrack: {
      height: 4,
      backgroundColor: theme.colors.primary.DEFAULT,
      borderRadius: theme.borderRadius.full,
      position: 'absolute',
    },
    sliderHandleContainer: {
      position: 'absolute',
      top: 20,
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sliderHandle: {
      width: 24,
      height: 24,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.surface.primary || theme.colors.background.secondary,
      marginTop: -5,
      borderWidth: 2,
      borderColor: theme.colors.primary.DEFAULT,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    sliderHandleLabel: {
      position: 'absolute',
      bottom: 28,
      // Center the label above the handle - the handle container is 24px wide
      // Label minWidth is 44, so offset by (44-24)/2 = 10 to center
      left: -10,
      backgroundColor: theme.colors.surface.primary || theme.colors.background.secondary,
      paddingHorizontal: theme.spacing[2],
      paddingVertical: theme.spacing[1],
      borderRadius: theme.borderRadius.sm,
      minWidth: 44,
      alignItems: 'center',
      justifyContent: 'center',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.15,
          shadowRadius: 2,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    sliderHandleLabelText: {
      color: theme.colors.text.primary,
      fontWeight: '600',
      fontSize: 12,
    },
    sliderHint: {
      color: theme.colors.text.tertiary,
      textAlign: 'center',
      marginTop: theme.spacing[1],
    },
    inputsRow: {
      flexDirection: 'row',
      gap: theme.spacing[3],
      marginBottom: theme.spacing[4],
    },
    inputContainer: {
      flex: 1,
    },
    inputLabel: {
      color: theme.colors.text.tertiary,
      marginBottom: theme.spacing[1],
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    inputField: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface.primary,
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[3],
    },
    inputValue: {
      color: theme.colors.text.primary,
      fontWeight: '600',
      fontSize: 16,
      flex: 1,
    },
    inputUnit: {
      color: theme.colors.text.tertiary,
      marginLeft: theme.spacing[2],
    },
    infoBox: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: theme.colors.primary[50] || '#E0F2FE',
      padding: theme.spacing[3],
      borderRadius: theme.borderRadius.md,
      gap: theme.spacing[2],
      marginBottom: theme.spacing[2],
    },
    infoIcon: {
      width: 20,
      height: 20,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.primary.DEFAULT,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
    },
    infoIconText: {
      color: theme.colors.text.inverse,
      fontSize: 12,
      fontWeight: 'bold',
    },
    infoText: {
      flex: 1,
      color: theme.colors.primary[900] || theme.colors.text.primary,
      fontSize: 12,
      lineHeight: 16,
    },
    selectedRangesContainer: {
      marginBottom: theme.spacing[4],
    },
    selectedRangesTitle: {
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[3],
    },
    rangeChip: {
      marginBottom: theme.spacing[2],
      padding: theme.spacing[3],
      backgroundColor: theme.colors.surface.primary,
    },
    rangeChipContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    rangeChipInfo: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: theme.spacing[2],
    },
    rangeChipValue: {
      color: theme.colors.text.primary,
    },
    rangeChipUnit: {
      color: theme.colors.text.secondary,
    },
    removeButton: {
      padding: theme.spacing[1],
    },
    buttonRow: {
      flexDirection: 'row',
      gap: theme.spacing[3],
      width: '100%',
    },
    addButton: {
      flex: 1,
      backgroundColor: theme.colors.surface.secondary || theme.colors.background.tertiary,
      paddingVertical: theme.spacing[4],
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    addButtonDisabled: {
      opacity: 0.5,
    },
    addButtonText: {
      color: theme.colors.primary.DEFAULT,
      fontWeight: '600',
    },
    addButtonTextDisabled: {
      color: theme.colors.text.tertiary,
    },
    continueButton: {
      flex: 1,
      backgroundColor: theme.colors.primary.DEFAULT,
      paddingVertical: theme.spacing[4],
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: theme.spacing[2],
    },
    continueButtonDisabled: {
      opacity: 0.5,
      backgroundColor: theme.colors.surface.secondary || theme.colors.background.tertiary,
    },
    continueButtonText: {
      color: theme.colors.text.inverse,
    },
  });
