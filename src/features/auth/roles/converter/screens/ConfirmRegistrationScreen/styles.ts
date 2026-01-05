import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) => StyleSheet.create({
  scrollContent: {
    paddingBottom: 120,
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
  card: {
    padding: theme.spacing[4],
    marginBottom: theme.spacing[3],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    flex: 1,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  gearIcon: {
    fontSize: 20,
  },
  packageIcon: {
    fontSize: 20,
  },
  cardTitle: {
    color: theme.colors.text.primary,
  },
  editButton: {
    padding: theme.spacing[1],
  },
  editButtonText: {
    color: theme.colors.primary.DEFAULT,
  },
  cardContent: {
    gap: theme.spacing[3],
  },
  detailRow: {
    gap: theme.spacing[1],
  },
  detailLabel: {
    color: theme.colors.text.secondary,
  },
  detailValue: {
    color: theme.colors.text.primary,
  },
  linkValue: {
    color: theme.colors.primary.DEFAULT,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
    marginTop: theme.spacing[1],
  },
  tag: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1.5],
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface.secondary,
  },
  tagSuccess: {
    backgroundColor: theme.colors.success[100],
  },
  tagText: {
    color: theme.colors.text.secondary,
  },
  tagTextSuccess: {
    color: theme.colors.success[700] || theme.colors.success.DEFAULT,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing[2],
    marginTop: theme.spacing[2],
    marginBottom: theme.spacing[4],
  },
  checkboxContainer: {
    marginTop: theme.spacing[0.5],
  },
  termsText: {
    flex: 1,
    color: theme.colors.text.primary,
  },
  termsLink: {
    color: theme.colors.primary.DEFAULT,
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
  submitButton: {
    backgroundColor: theme.colors.primary.DEFAULT,
    paddingVertical: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: theme.colors.border.primary,
    opacity: 0.5,
  },
  submitButtonText: {
    color: theme.colors.text.inverse,
  },
});

