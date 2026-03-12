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
  header: {
    marginBottom: theme.spacing[4],
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing[2],
    marginBottom: theme.spacing[2],
  },
  progressText: {
    color: theme.colors.text.secondary,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.full,
    marginTop: theme.spacing[2],
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary.DEFAULT,
    borderRadius: theme.borderRadius.full,
  },
  title: {
    marginBottom: theme.spacing[2],
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
    marginBottom: theme.spacing[4],
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
  customMaterialInput: {
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[3],
    fontSize: 16,
    backgroundColor: theme.colors.surface.primary,
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.regular,
  },
  addMaterialButton: {
    minWidth: 80,
  },
  selectedCountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary.DEFAULT,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing[4],
    alignSelf: 'flex-start',
  },
  selectedCountPillText: {
    color: theme.colors.text.inverse,
  },
  categorySection: {
    marginBottom: theme.spacing[2],
  },
  categoryHeader: {
    color: theme.colors.text.tertiary,
    letterSpacing: 0.5,
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
  materialItemSubtitle: {
    color: theme.colors.text.tertiary,
  },
  halfButton: {
    flex: 1,
  },
  addCustomButton: {
    flex: 1,
    backgroundColor: theme.colors.primary[50],
    borderWidth: 1,
    borderColor: theme.colors.primary[200],
    borderRadius: theme.borderRadius.md,
  },
  bottomActionsRow: {
    flexDirection: 'row',
    gap: theme.spacing[2],
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.background.overlay,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing[4],
  },
  modalCard: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing[4],
    gap: theme.spacing[3],
  },
  modalTitle: {
    color: theme.colors.text.primary,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing[2],
  },
  modalCancelButton: {
    minWidth: 80,
  },
});

