import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    scrollContent: {
      paddingBottom: theme.spacing[6],
    },
    container: {
      flex: 1,
      padding: theme.spacing[4],
      gap: theme.spacing[3],
    },
    description: {
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing[2],
    },
    card: {
      marginBottom: theme.spacing[3],
      padding: theme.spacing[4],
    },
    formGroup: {},
    label: {
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[2],
    },
    manualAddLinkText: {
      color: theme.colors.primary.DEFAULT,
      marginTop: theme.spacing[2],
    },
    disclosureContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing[2],
    },
    disclosureTextContainer: {
      flex: 1,
    },
    disclosureText: {
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[1],
    },
    disclosureSubtext: {
      color: theme.colors.text.tertiary,
    },
    relationshipSection: {},
    relationshipTitle: {
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[3],
    },
    relationshipCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing[4],
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface.primary,
      marginBottom: theme.spacing[3],
    },
    relationshipCardSelected: {
      borderColor: theme.colors.primary.DEFAULT,
    },
    relationshipLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
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
    relationshipContent: {
      flex: 1,
    },
    relationshipLabel: {
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[0.5],
    },
    relationshipSubtext: {
      color: theme.colors.text.tertiary,
    },
    button: {
      backgroundColor: theme.colors.primary.DEFAULT,
      paddingVertical: theme.spacing[4],
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: theme.spacing[2],
      width: '100%',
    },
    buttonText: {
      color: theme.colors.text.inverse,
    },
  });
