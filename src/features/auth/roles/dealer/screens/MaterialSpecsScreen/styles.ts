import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) => StyleSheet.create({
  scrollContent: {
    paddingBottom: 100,
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
    marginBottom: theme.spacing[3],
    padding: theme.spacing[4],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[3],
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    flex: 1,
  },
  sectionTitle: {
    color: theme.colors.text.primary,
  },
  badge: {
    backgroundColor: theme.colors.primary.DEFAULT,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[0.5],
    borderRadius: theme.borderRadius.full,
  },
  badgeText: {
    color: theme.colors.text.inverse,
  },
  sectionSubtitle: {
    color: theme.colors.text.tertiary,
  },
  sectionInstruction: {
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[3],
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
  },
  optionChip: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    backgroundColor: theme.colors.surface.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[1],
  },
  optionChipSelected: {
    backgroundColor: theme.colors.primary.DEFAULT,
    borderColor: theme.colors.primary.DEFAULT,
  },
  optionChipText: {
    color: theme.colors.text.primary,
  },
  optionChipTextSelected: {
    color: theme.colors.text.inverse,
  },
  customInputSection: {
    marginTop: theme.spacing[3],
  },
  customInputLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[1],
    marginBottom: theme.spacing[2],
  },
  customInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface.primary,
    paddingHorizontal: theme.spacing[3],
  },
  customInput: {
    flex: 1,
    paddingVertical: theme.spacing[3],
    fontSize: 16,
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.regular,
  },
  addButton: {
    padding: theme.spacing[2],
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
  },
  footerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerItemCount: {
    color: theme.colors.text.primary,
  },
  clearAllButton: {
    padding: theme.spacing[1],
  },
  clearAllButtonText: {
    color: theme.colors.primary.DEFAULT,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary.DEFAULT,
    paddingVertical: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing[2],
  },
  confirmButtonText: {
    color: theme.colors.text.inverse,
  },
});

