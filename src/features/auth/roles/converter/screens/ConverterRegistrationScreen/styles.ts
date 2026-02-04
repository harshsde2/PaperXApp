import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) => StyleSheet.create({
  scrollContent: {
    paddingBottom: theme.spacing[6],
  },
  container: {
    flex: 1,
    padding: theme.spacing[3],
    gap: theme.spacing[3],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  loadingText: {
    color: theme.colors.text.secondary,
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
    flex: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface.primary,
    minHeight: 48,
  },
  inputIconLeft: {
    paddingLeft: theme.spacing[3],
    paddingRight: theme.spacing[2],
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputIconRight: {
    paddingRight: theme.spacing[3],
    paddingLeft: theme.spacing[2],
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperText: {
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing[1],
    fontSize: 12,
  },
  errorText: {
    color: (theme.colors.error as any)?.DEFAULT || '#FF3B30',
    marginTop: theme.spacing[1],
    fontSize: 12,
  },
  capacityRow: {
    flexDirection: 'row',
    gap: theme.spacing[3],
    marginBottom: theme.spacing[4],
  },
  capacityInput: {
    flex: 1,
  },
  unitContainer: {
    padding: theme.spacing[4],
  },
  unitTitle: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
  },
  unitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  unitItemSelected: {
    backgroundColor: theme.colors.primary[50],
  },
  unitText: {
    color: theme.colors.text.primary,
  },
  unitTextSelected: {
    color: theme.colors.primary.DEFAULT,
    fontWeight: '600',
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
});
