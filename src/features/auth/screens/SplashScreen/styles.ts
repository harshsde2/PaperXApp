import { StyleSheet } from 'react-native';
import { baseColors, baseTypography, baseSpacing } from '@theme/tokens/base';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: baseColors.blue50,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: baseSpacing[6],
  },
  header: {
    alignItems: 'center',
    paddingTop: baseSpacing[4],
  },
  visualContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -baseSpacing[8], // Pull up slightly to balance layout
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    gap: baseSpacing[6],
    marginBottom: baseSpacing[4],
  },
  headline: {
    fontFamily: baseTypography.fontFamily.bold,
    fontSize: 28, // Slightly smaller than before to fit graphics
    lineHeight: 36,
    color: baseColors.black,
    textAlign: 'center',
  },
  subheadline: {
    fontFamily: baseTypography.fontFamily.medium,
    fontSize: baseTypography.fontSize.sm, // Smaller for subtitle
    color: baseColors.blue600, // Primary color for subtitle as per example (theme.colors.primary)
    textAlign: 'center',
    paddingHorizontal: baseSpacing[2],
    lineHeight: 22,
  },
  actionButton: {
    width: '100%',
    flexDirection: 'row',
    gap: baseSpacing[2],
    backgroundColor: baseColors.blue800, // Main brand color (800)
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: baseColors.blue800,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButtonText: {
    fontFamily: baseTypography.fontFamily.semibold,
    fontSize: baseTypography.fontSize.lg,
    color: baseColors.white,
  },
});
