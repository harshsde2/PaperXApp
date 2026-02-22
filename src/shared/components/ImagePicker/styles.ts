import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing[4],
    },
    previewContainer: {
      width: '100%',
      borderRadius: theme.borderRadius.card.lg,
      overflow: 'hidden',
      backgroundColor: theme.colors.surface.secondary,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    previewImage: {
      width: '100%',
      aspectRatio: 1,
    },
    placeholder: {
      width: '100%',
      minHeight: 160,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: theme.spacing[8],
      paddingHorizontal: theme.spacing[6],
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.card.lg,
      backgroundColor: theme.colors.background.primary,
    },
    iconCircle: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.primary[50],
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing[3],
    },
    placeholderTitle: {
      color: theme.colors.text.primary,
      textAlign: 'center',
      marginBottom: theme.spacing[1],
    },
    placeholderHint: {
      color: theme.colors.text.tertiary,
      textAlign: 'center',
    },
    actionsRow: {
      flexDirection: 'row',
      marginTop: theme.spacing[4],
      gap: theme.spacing[3],
    },
    actionButton: {
      flex: 1,
    },
    removeButton: {
      minWidth: 0,
    },
  });
