import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[3],
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },
    backButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surface.secondary,
    },
    headerTitle: {
      flex: 1,
      color: theme.colors.text.primary,
    },
    content: {
      padding: theme.spacing[4],
      gap: theme.spacing[4],
      paddingBottom: theme.spacing[8],
    },
    label: {
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[2],
    },
    optionalLabel: {
      color: theme.colors.text.tertiary,
    },
    fieldGroup: {
      marginBottom: theme.spacing[2],
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[3],
      fontSize: 16,
      color: theme.colors.text.primary,
      backgroundColor: theme.colors.surface.primary,
      fontFamily: theme.fontFamily.regular,
    },
    inputDisabled: {
      backgroundColor: theme.colors.surface.secondary,
      color: theme.colors.text.tertiary,
    },
    pillsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing[2],
    },
    pill: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[2],
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      backgroundColor: theme.colors.surface.primary,
    },
    pillActive: {
      borderColor: theme.colors.primary.DEFAULT,
      backgroundColor: theme.colors.primary[50],
    },
    pillText: {
      color: theme.colors.text.secondary,
    },
    pillTextActive: {
      color: theme.colors.primary.DEFAULT,
      fontWeight: fontWeightForPlatform('600'),
    },
    addressPreview: {
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[3],
      backgroundColor: theme.colors.surface.primary,
      marginBottom: theme.spacing[2],
    },
    addressText: {
      color: theme.colors.text.primary,
    },
    addressPlaceholder: {
      color: theme.colors.text.tertiary,
    },
    footer: {
      padding: theme.spacing[4],
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.primary,
      backgroundColor: theme.colors.background.primary,
    },
    sheetSelectedText: {
      color: theme.colors.text.secondary,
      marginTop: theme.spacing[2],
    },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing[8],
      gap: theme.spacing[2],
    },
  });
