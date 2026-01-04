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
  welcomeText: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[6],
  },
  section: {
    marginBottom: theme.spacing[6],
  },
  sectionTitle: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  sectionSubtitle: {
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing[4],
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[3],
  },
  roleCard: {
    width: '47%',
    height: 150,
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    position: 'relative',
  },
  roleCardSelected: {
    borderColor: theme.colors.primary.DEFAULT,
    borderWidth: 2,
  },
  checkmarkContainer: {
    position: 'absolute',
    top: theme.spacing[2],
    right: theme.spacing[2],
  },
  roleIcon: {
    fontSize: 32,
    marginBottom: theme.spacing[2],
  },
  roleLabel: {
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  roleLabelSelected: {
    color: theme.colors.primary.DEFAULT,
  },
  secondaryRoleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  secondaryRoleHeaderLeft: {
    flex: 1,
    marginRight: theme.spacing[4],
  },
  secondaryRoleGridContainer: {
    marginTop: theme.spacing[4],
  },
  geographyList: {
    gap: theme.spacing[3],
  },
  geographyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  geographyCardSelected: {
    borderColor: theme.colors.primary.DEFAULT,
    borderWidth: 2,
  },
  geographyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: theme.borderRadius.full,
    borderWidth: 2,
    borderColor: theme.colors.border.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: theme.colors.primary.DEFAULT,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary.DEFAULT,
  },
  geographyLabel: {
    color: theme.colors.text.primary,
  },
  geographyIcon: {
    fontSize: 20,
  },
  button: {
    backgroundColor: theme.colors.primary.DEFAULT,
    paddingVertical: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing[4],
    marginBottom: theme.spacing[4],
  },
  buttonText: {
    color: theme.colors.text.inverse,
  },
});
