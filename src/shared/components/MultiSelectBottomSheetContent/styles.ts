import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: theme.spacing[4],
  },
  title: {
    color: theme.colors.text.primary,
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[4],
    marginBottom: theme.spacing[2],
  },
  selectedCount: {
    paddingHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[2],
  },
  selectedCountText: {
    color: theme.colors.primary.DEFAULT,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface.primary,
    paddingHorizontal: theme.spacing[3],
    marginHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[3],
  },
  searchIcon: {
    marginRight: theme.spacing[2],
  },
  searchInput: {
    flex: 1,
    padding: theme.spacing[2],
    fontSize: 16,
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.regular,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: theme.spacing[4],
    flexGrow: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  itemSelected: {
    backgroundColor: theme.colors.primary[50],
  },
  itemText: {
    color: theme.colors.text.primary,
    flex: 1,
  },
  itemTextSelected: {
    color: theme.colors.primary.DEFAULT,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: theme.spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: theme.colors.text.tertiary,
  },
});
