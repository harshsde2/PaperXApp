import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) => StyleSheet.create({
  scrollContent: {
    paddingBottom: theme.spacing[6],
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[4],
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing[3],
    marginBottom: theme.spacing[2],
  },
  searchIcon: {
    marginRight: theme.spacing[2],
  },
  searchInput: {
    flex: 1,
    paddingVertical: theme.spacing[3],
    fontSize: 16,
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.regular,
  },
  materialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.secondary,
  },
  materialItemContent: {
    flex: 1,
  },
  materialItemName: {
    color: theme.colors.text.primary,
    marginBottom: 2,
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
    paddingVertical: theme.spacing[1],
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
    width: '100%',
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface.primary,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[3],
    fontSize: 16,
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.regular,
  },
  footerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
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
  bottomActionsRow: {
    flexDirection: 'row',
    gap: theme.spacing[2],
    width: '100%',
  },
  addCustomButton: {
    flex: 1,
    // minWidth: 0,
    backgroundColor: theme.colors.primary[50],
    borderWidth: 1,
    borderColor: theme.colors.primary[200],
    borderRadius: theme.borderRadius.md,
  },
  confirmButton: {
    flex: 1,
    minWidth: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.background.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[4],
  },
  modalContent: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing[4],
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[4],
  },
  modalTitle: {
    color: theme.colors.text.primary,
  },
  modalCloseButton: {
    padding: theme.spacing[1],
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing[2],
    marginTop: theme.spacing[4],
  },
  modalCancelButton: {
    minWidth: 80,
  },
  modalAddButton: {
    minWidth: 80,
  },
});

