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
  noWarehouseCard: {
    padding: theme.spacing[4],
    marginBottom: theme.spacing[2],
  },
  noWarehouseContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing[3],
  },
  checkboxContainer: {
    marginTop: 2,
  },
  noWarehouseTextContainer: {
    flex: 1,
    gap: theme.spacing[1],
  },
  noWarehouseTitle: {
    color: theme.colors.text.primary,
  },
  noWarehouseDescription: {
    color: theme.colors.text.secondary,
  },
  locationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  locationsHeaderLeft: {
    flex: 1,
    marginRight: theme.spacing[3],
  },
  locationsTitle: {
    color: theme.colors.text.primary,
  },
  locationsSubtitle: {
    marginTop: theme.spacing[1],
    color: theme.colors.text.secondary,
  },
  locationsBadge: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  locationsBadgeText: {
    color: theme.colors.text.secondary,
  },
  locationCard: {
    padding: theme.spacing[4],
    marginBottom: theme.spacing[3],
  },
  locationCardPrimary: {
    borderWidth: 1,
    borderColor: theme.colors.primary.DEFAULT,
    backgroundColor: theme.colors.primary.light,
  },
  locationHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[2],
  },
  locationHeaderText: {
    flex: 1,
    marginRight: theme.spacing[2],
  },
  locationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  primaryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary.DEFAULT,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.full,
  },
  primaryBadgeText: {
    color: theme.colors.text.inverse,
    letterSpacing: 0.5,
  },
  locationName: {
    color: theme.colors.text.primary,
  },
  locationSummary: {
    marginTop: theme.spacing[1],
    color: theme.colors.text.secondary,
  },
  locationAddress: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
  },
  locationCity: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[3],
  },
  locationActions: {
    flexDirection: 'row',
    gap: theme.spacing[4],
    marginBottom: theme.spacing[3],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[1],
  },
  actionIcon: {
    fontSize: 16,
  },
  actionButtonText: {
    color: theme.colors.text.secondary,
  },
  chevronIcon: {
    transform: [{ rotate: '0deg' }],
  },
  chevronIconExpanded: {
    transform: [{ rotate: '180deg' }],
  },
  searchIcon: {
    fontSize: 20,
  },
  mapContainer: {
    height: 220,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface.secondary,
    marginTop: theme.spacing[2],
  },
  miniMap: {
    ...StyleSheet.absoluteFillObject,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.secondary,
  },
  mapPlaceholderText: {
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing[1],
  },
  emptyStateCard: {
    paddingVertical: theme.spacing[6],
    paddingHorizontal: theme.spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateTitle: {
    marginTop: theme.spacing[3],
    color: theme.colors.text.primary,
  },
  emptyStateDescription: {
    marginTop: theme.spacing[2],
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  addLocationCard: {
    borderWidth: 2,
    borderColor: theme.colors.border.primary,
    borderStyle: 'dashed',
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface.primary,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
  },
  addLocationContent: {
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  addLocationIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing[1],
  },
  addLocationIconText: {
    fontSize: 32,
    color: theme.colors.text.inverse,
    fontWeight: '300',
  },
  addLocationTitle: {
    color: theme.colors.text.primary,
  },
  addLocationDescription: {
    color: theme.colors.text.secondary,
  },
  footer: {
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
    backgroundColor: theme.colors.surface.primary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
    padding: theme.spacing[4],
    // paddingBottom: theme.spacing[10],
  },
  primaryButton: {
    backgroundColor: theme.colors.primary.DEFAULT,
    paddingVertical: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing[2],
  },
  primaryButtonText: {
    color: theme.colors.text.inverse,
    letterSpacing: 0.5,
  },
  secondaryButton: {
    paddingVertical: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing[2],
    borderWidth: 1,
    borderColor: theme.colors.primary.DEFAULT,
    backgroundColor: theme.colors.surface.primary,
  },
  secondaryButtonText: {
    color: theme.colors.primary.DEFAULT,
    letterSpacing: 0.5,
  },
  errorContainer: {
    marginTop: theme.spacing[3],
    padding: theme.spacing[3],
    backgroundColor: theme.colors.error.light || '#FEE2E2',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.error.DEFAULT || '#EF4444',
  },
  errorText: {
    color: theme.colors.error.DEFAULT || '#EF4444',
    textAlign: 'center',
  },
});

