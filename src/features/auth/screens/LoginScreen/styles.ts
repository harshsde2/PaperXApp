import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[4],
  },
  logo: {
    fontSize: 48,
    fontWeight: fontWeightForPlatform('900'),
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing[6],
    fontFamily: theme.fontFamily.bold,
  },
  title: {
    fontSize: 32,
    fontWeight: fontWeightForPlatform('bold'),
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
  formContainer: {
    width: '100%',
    maxWidth: 400,
    marginBottom: theme.spacing[8],
  },
  label: {
    fontSize: 14,
    fontWeight: fontWeightForPlatform('600'),
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
    fontFamily: theme.fontFamily.medium,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    fontSize: 16,
    backgroundColor: theme.colors.surface.primary,
    marginBottom: theme.spacing[1],
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.regular,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: theme.spacing[4],
    gap: theme.spacing[2],
    paddingHorizontal: theme.spacing[2],
  },
  termsTextWrapper: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  termsText: {
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  termsLink: {
    color: theme.colors.primary.DEFAULT,
    fontWeight: fontWeightForPlatform('600'),
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: theme.spacing[5],
  },
  footer: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  footerText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing[6],
    lineHeight: 18,
    fontFamily: theme.fontFamily.regular,
    paddingHorizontal: theme.spacing[2],
  },
  link: {
    color: theme.colors.primary.DEFAULT,
    fontWeight: fontWeightForPlatform('600'),
    fontFamily: theme.fontFamily.medium,
  },
  securityBadges: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[1],
  },
  badgeDivider: {
    width: 1,
    height: 16,
    backgroundColor: theme.colors.border.primary,
    marginHorizontal: theme.spacing[3],
  },
  badgeIcon: {
    fontSize: 16,
  },
  badgeText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontFamily: theme.fontFamily.regular,
  },
  helpLink: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontWeight: fontWeightForPlatform('400'),
    fontFamily: theme.fontFamily.regular,
  },
});
