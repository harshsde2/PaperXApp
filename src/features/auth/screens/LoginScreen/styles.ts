import { StyleSheet } from 'react-native';
import { baseColors, baseBorderRadius, baseSpacing } from '@theme/tokens/base';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: baseColors.gray800,
  },
  topSection: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: baseColors.gray800,
  },
  bottomSection: {
    flex: 0.7,
    backgroundColor: baseColors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: baseSpacing[6],
    paddingTop: baseSpacing[8],
  },
  logo: {
    fontSize: 48,
    fontWeight: '900',
    color: baseColors.black,
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: baseColors.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: baseColors.gray500,
    marginBottom: baseSpacing[8],
    textAlign: 'center',
    lineHeight: 20,
  },
  formContainer: {
    marginBottom: baseSpacing[8],
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: baseColors.black,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: baseColors.gray200,
    borderRadius: baseBorderRadius.lg,
    padding: baseSpacing[4],
    fontSize: 16,
    backgroundColor: baseColors.white,
    marginBottom: baseSpacing[6],
  },
  button: {
    backgroundColor: baseColors.blue800,
    paddingVertical: baseSpacing[4],
    borderRadius: baseBorderRadius.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  buttonDisabled: {
    backgroundColor: baseColors.gray400,
    opacity: 0.6,
  },
  buttonText: {
    color: baseColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 12,
    color: baseColors.gray500,
    textAlign: 'center',
    marginBottom: baseSpacing[6],
    lineHeight: 18,
  },
  link: {
    color: baseColors.blue800,
    fontWeight: '600',
  },
  securityBadges: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: baseSpacing[6],
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeDivider: {
    width: 1,
    height: 16,
    backgroundColor: baseColors.gray200,
    marginHorizontal: 12,
  },
  badgeIcon: {
    fontSize: 16,
  },
  badgeText: {
    fontSize: 12,
    color: baseColors.gray500,
  },
  helpLink: {
    fontSize: 14,
    color: baseColors.gray500,
    fontWeight: '400',
  },
});

