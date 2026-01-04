import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) => StyleSheet.create({
  scrollContent: {
    paddingBottom: theme.spacing[6],
  },
  container: {
    flex: 1,
    padding: theme.spacing[4],
  },
  verificationCard: {
    marginBottom: theme.spacing[4],
    padding: 0,
    overflow: 'hidden',
  },
  verificationHeader: {
    height: 180,
    backgroundColor: theme.colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  verificationIconContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
  },
  verificationIconBackground: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.success[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificationContent: {
    padding: theme.spacing[4],
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  approvedBadge: {
    backgroundColor: theme.colors.success[100],
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.md,
  },
  approvedBadgeText: {
    color: theme.colors.success[700],
  },
  timestamp: {
    color: theme.colors.text.tertiary,
  },
  verificationTitle: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
  },
  verificationDescription: {
    color: theme.colors.text.secondary,
    lineHeight: 22,
  },
  businessCard: {
    marginBottom: theme.spacing[4],
    padding: theme.spacing[4],
  },
  businessTitle: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  detailLabel: {
    color: theme.colors.text.tertiary,
  },
  detailValue: {
    color: theme.colors.text.primary,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary.DEFAULT,
    paddingVertical: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing[2],
    marginBottom: theme.spacing[3],
  },
  primaryButtonText: {
    color: theme.colors.text.inverse,
  },
  secondaryButton: {
    backgroundColor: theme.colors.surface.primary,
    paddingVertical: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing[2],
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    marginBottom: theme.spacing[4],
  },
  secondaryButtonText: {
    color: theme.colors.text.primary,
  },
  supportIcon: {
    fontSize: 20,
  },
  securityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[2],
    marginBottom: theme.spacing[4],
  },
  lockIcon: {
    fontSize: 14,
  },
  securityText: {
    color: theme.colors.text.tertiary,
    letterSpacing: 0.5,
  },
});
