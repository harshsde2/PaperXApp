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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: baseSpacing[6],
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
    color: baseColors.black,
    flex: 1,
    textAlign: 'center',
  },
  shieldContainer: {
    alignItems: 'center',
    marginBottom: baseSpacing[6],
  },
  shieldIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: baseColors.blue300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shieldCheckmark: {
    fontSize: 32,
    color: baseColors.white,
    fontWeight: 'bold',
  },
  codeTitle: {
    fontSize: 28,
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
  boldText: {
    fontWeight: 'bold',
    color: baseColors.black,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: baseSpacing[6],
    gap: 8,
  },
  clockIcon: {
    fontSize: 16,
  },
  timerText: {
    fontSize: 14,
    color: baseColors.gray500,
  },
  button: {
    backgroundColor: baseColors.blue800,
    paddingVertical: baseSpacing[4],
    borderRadius: baseBorderRadius.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: baseSpacing[8],
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
  },
  footerText: {
    fontSize: 14,
    color: baseColors.gray500,
    textAlign: 'center',
    marginBottom: baseSpacing[6],
  },
  resendLink: {
    color: baseColors.blue800,
    fontWeight: '600',
  },
  resendDisabled: {
    color: baseColors.gray400,
  },
  helpLink: {
    fontSize: 14,
    color: baseColors.gray500,
    fontWeight: '400',
  },
});

