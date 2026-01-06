import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) => StyleSheet.create({
  scrollContent: {
    paddingBottom: 120,
  },
  container: {
    flex: 1,
    padding: theme.spacing[4],
    gap: theme.spacing[4],
  },
  headerContainer: {
    marginBottom: theme.spacing[2],
  },
  title: {
    marginBottom: theme.spacing[1],
  },
  subtitle: {
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[1],
  },
  formContainer: {
    gap: theme.spacing[4],
  },
  inputContainer: {
    gap: theme.spacing[1],
  },
  label: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[3],
    minHeight: 48,
  },
  inputWrapperFocused: {
    borderColor: theme.colors.primary.DEFAULT,
  },
  inputIconLeft: {
    marginRight: theme.spacing[2],
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.regular,
    padding: 0,
  },
  inputIconRight: {
    marginLeft: theme.spacing[2],
  },
  brandTypeSelector: {
    backgroundColor: theme.colors.surface.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[3],
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandTypeSelectorText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.regular,
  },
  brandTypeSelectorPlaceholder: {
    color: theme.colors.text.tertiary,
  },
  brandTypeSelectorSelected: {
    color: theme.colors.text.primary,
  },
  optionalLabel: {
    color: theme.colors.text.tertiary,
    fontSize: 12,
  },
  validationIcon: {
    marginLeft: theme.spacing[2],
  },
  brandTypeModal: {
    backgroundColor: theme.colors.surface.primary,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing[4],
    maxHeight: '80%',
  },
  brandTypeModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  brandTypeModalTitle: {
    color: theme.colors.text.primary,
  },
  brandTypeModalClose: {
    padding: theme.spacing[1],
  },
  brandTypeSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    marginBottom: theme.spacing[3],
  },
  brandTypeSearchIcon: {
    marginRight: theme.spacing[2],
  },
  brandTypeSearchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.regular,
  },
  brandTypeCategory: {
    marginBottom: theme.spacing[3],
  },
  brandTypeCategoryTitle: {
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[2],
    fontSize: 14,
    fontFamily: theme.fontFamily.semibold,
  },
  brandTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing[2],
    gap: theme.spacing[2],
  },
  brandTypeOptionLabel: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.regular,
  },
  brandTypeOptionSelected: {
    color: theme.colors.primary.DEFAULT,
    fontFamily: theme.fontFamily.medium,
  },
  selectedCountBadge: {
    backgroundColor: theme.colors.primary.DEFAULT,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.full,
    marginLeft: theme.spacing[2],
  },
  selectedCountText: {
    color: theme.colors.text.inverse,
    fontSize: 12,
    fontFamily: theme.fontFamily.medium,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface.primary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
    padding: theme.spacing[4],
    gap: theme.spacing[3],
    paddingBottom: theme.spacing[10],
  },
  footerNote: {
    textAlign: 'center',
    color: theme.colors.text.secondary,
    fontSize: 14,
    fontFamily: theme.fontFamily.regular,
  },
  continueButton: {
    backgroundColor: theme.colors.primary.DEFAULT,
    paddingVertical: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: theme.spacing[2],
  },
  continueButtonText: {
    color: theme.colors.text.inverse,
  },
  continueButtonDisabled: {
    backgroundColor: theme.colors.border.primary,
    opacity: 0.5,
  },
});

