import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    title: {
      marginBottom: theme.spacing[4],
      color: theme.colors.text.primary,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: theme.spacing[4],
    },
    optionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing[3],
      paddingHorizontal: theme.spacing[4],
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing[2],
      borderWidth: 1,
    },
    optionButtonDefault: {
      backgroundColor: theme.colors.surface.primary,
      borderColor: theme.colors.border.primary,
    },
    optionButtonSelected: {
      backgroundColor: theme.colors.primary.light || `${theme.colors.primary.DEFAULT}15`,
      borderColor: theme.colors.primary.DEFAULT,
    },
    radioButton: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing[3],
    },
    radioButtonDefault: {
      borderColor: theme.colors.border.primary,
    },
    radioButtonSelected: {
      borderColor: theme.colors.primary.DEFAULT,
    },
    radioButtonInner: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: theme.colors.primary.DEFAULT,
    },
    optionText: {
      color: theme.colors.text.primary,
    },
    optionTextSelected: {
      color: theme.colors.primary.DEFAULT,
    },
  });
