import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) => StyleSheet.create({
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[4],
    paddingBottom: theme.spacing[2],
  },
  backButton: {
    padding: theme.spacing[1],
  },
  headerTitle: {
    color: theme.colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  skipButton: {
    padding: theme.spacing[1],
  },
  skipButtonText: {
    color: theme.colors.primary.DEFAULT,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[4],
    paddingBottom: theme.spacing[3],
    gap: theme.spacing[2],
  },
  progressText: {
    color: theme.colors.text.secondary,
    minWidth: 80,
  },
  progressBarContainer: {
    flex: 1,
    height: 4,
    backgroundColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary.DEFAULT,
    borderRadius: theme.borderRadius.full,
  },
  progressPercentage: {
    color: theme.colors.text.secondary,
    minWidth: 100,
    textAlign: 'right',
  },
  container: {
    flex: 1,
    padding: theme.spacing[4],
    gap: theme.spacing[3],
  },
  title: {
    marginBottom: theme.spacing[1],
  },
  description: {
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[4],
  },
  card: {
    marginBottom: theme.spacing[2],
    padding: theme.spacing[4],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[2],
  },
  sectionHeaderLeft: {
    flex: 1,
    gap: theme.spacing[1],
  },
  sectionTitle: {
    color: theme.colors.text.primary,
  },
  sectionSubtitle: {
    color: theme.colors.text.secondary,
  },
  badge: {
    backgroundColor: theme.colors.primary.DEFAULT,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing[2],
  },
  badgeText: {
    color: theme.colors.text.inverse,
  },
  chevronRotated: {
    transform: [{ rotate: '180deg' }],
  },
  optionsContainer: {
    marginTop: theme.spacing[3],
    gap: theme.spacing[3],
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
  },
  chip: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    backgroundColor: theme.colors.surface.primary,
  },
  chipSelected: {
    backgroundColor: theme.colors.primary.DEFAULT,
    borderColor: theme.colors.primary.DEFAULT,
  },
  chipText: {
    color: theme.colors.text.primary,
  },
  chipTextSelected: {
    color: theme.colors.text.inverse,
  },
  customInput: {
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface.primary,
    padding: theme.spacing[3],
    fontSize: 16,
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.regular,
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
    paddingBottom: theme.spacing[10],
  },
  saveContinueButton: {
    backgroundColor: theme.colors.primary.DEFAULT,
    paddingVertical: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing[2],
  },
  saveContinueButtonText: {
    color: theme.colors.text.inverse,
  },
});

