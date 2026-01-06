import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) => StyleSheet.create({
  scrollContent: {
    paddingBottom: 120,
  },
  otpInputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing[4],
    paddingTop: theme.spacing[6],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[8],
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    flex: 1,
    textAlign: 'center',
    fontFamily: theme.fontFamily.bold,
  },
  shieldContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing[8],
  },
  shieldIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.text.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  codeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
    textAlign: 'center',
    fontFamily: theme.fontFamily.bold,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[8],
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: theme.fontFamily.regular,
    paddingHorizontal: theme.spacing[2],
  },
  boldText: {
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.bold,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[6],
    gap: theme.spacing[2],
  },
  clockIcon: {
    fontSize: 16,
  },
  timerText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontFamily: theme.fontFamily.regular,
  },
  button: {
    backgroundColor: theme.colors.primary.DEFAULT,
    paddingVertical: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing[8],
    gap: theme.spacing[2],
  },
  buttonDisabled: {
    backgroundColor: theme.colors.text.disabled,
    opacity: 0.6,
  },
  buttonText: {
    color: theme.colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: theme.fontFamily.medium,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing[6],
    fontFamily: theme.fontFamily.regular,
  },
  resendLink: {
    color: theme.colors.primary.DEFAULT,
    fontWeight: '600',
    fontFamily: theme.fontFamily.medium,
  },
  resendDisabled: {
    color: theme.colors.text.disabled,
    fontFamily: theme.fontFamily.regular,
  },
  helpLink: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontWeight: '400',
    fontFamily: theme.fontFamily.regular,
  },
});
