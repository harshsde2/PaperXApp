import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) => StyleSheet.create({
  scrollContent: {
    paddingBottom: 100,
  },
  container: {
    flex: 1,
    padding: theme.spacing[4],
    gap: theme.spacing[4],
  },
  title: {
    marginBottom: theme.spacing[1],
  },
  description: {
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[4],
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    marginBottom: theme.spacing[2],
  },
  searchIconContainer: {
    marginRight: theme.spacing[2],
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.regular,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
    marginBottom: theme.spacing[3],
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary.DEFAULT,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.full,
    gap: theme.spacing[2],
  },
  chipText: {
    color: theme.colors.text.inverse,
  },
  chipClose: {
    fontSize: 18,
    color: theme.colors.text.inverse,
    fontWeight: 'bold',
  },
  sectionHeader: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[3],
    letterSpacing: 0.5,
  },
  card: {
    marginBottom: theme.spacing[3],
    padding: theme.spacing[4],
  },
  sectionHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[2],
  },
  sectionTitle: {
    color: theme.colors.text.primary,
  },
  chevronRotated: {
    transform: [{ rotate: '180deg' }],
  },
  optionsContainer: {
    marginTop: theme.spacing[2],
    gap: theme.spacing[2],
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing[2],
  },
  optionLabel: {
    flex: 1,
    color: theme.colors.text.primary,
  },
  optionLabelSelected: {
    color: theme.colors.text.primary,
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
  continueButton: {
    backgroundColor: theme.colors.primary.DEFAULT,
    paddingVertical: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    color: theme.colors.text.inverse,
  },
});

