import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) => StyleSheet.create({
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
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[1],
    marginBottom: theme.spacing[4],
  },
  segmentedOption: {
    flex: 1,
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentedOptionSelected: {
    backgroundColor: theme.colors.surface.primary,
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
  },
  selectedRangeLabel: {
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing[2],
    letterSpacing: 0.5,
  },
  selectedRangeValue: {
    color: theme.colors.text.primary,
  },
  selectedRangeUnit: {
    color: theme.colors.primary.DEFAULT,
  },
  sliderContainer: {
    marginBottom: theme.spacing[4],
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[2],
  },
  sliderLabel: {
    color: theme.colors.text.secondary,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.full,
    position: 'relative',
    marginBottom: theme.spacing[2],
  },
  sliderActiveTrack: {
    height: '100%',
    backgroundColor: theme.colors.primary.DEFAULT,
    borderRadius: theme.borderRadius.full,
    position: 'absolute',
  },
  sliderHandlesContainer: {
    position: 'relative',
    height: 40,
    marginTop: -20,
  },
  sliderHandle: {
    width: 24,
    height: 24,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface.primary,
    borderWidth: 2,
    borderColor: theme.colors.primary.DEFAULT,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sliderHandleLabel: {
    position: 'absolute',
    top: -28,
    backgroundColor: theme.colors.surface.primary,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.sm,
    minWidth: 40,
    alignItems: 'center',
  },
  sliderHandleLabelText: {
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  sliderHint: {
    color: theme.colors.text.tertiary,
    textAlign: 'center',
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
  },
  inputUnit: {
    color: theme.colors.text.tertiary,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.primary[50],
    padding: theme.spacing[3],
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing[2],
    marginBottom: theme.spacing[4],
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
    color: theme.colors.primary[900],
  },
  button: {
    backgroundColor: theme.colors.primary.DEFAULT,
    paddingVertical: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing[2],
    marginTop: theme.spacing[2],
  },
  buttonText: {
    color: theme.colors.text.inverse,
  },
});

