import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: theme.spacing[4],
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: theme.spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },
    headerTitle: {
      color: theme.colors.text.primary,
    },
    resetText: {
      color: theme.colors.primary.DEFAULT,
      fontWeight: fontWeightForPlatform('600'),
    },
    scrollContent: {
      paddingBottom: theme.spacing[6],
    },
    section: {
      paddingTop: theme.spacing[5],
    },
    sectionLabel: {
      color: theme.colors.text.primary,
      fontWeight: fontWeightForPlatform('600'),
      marginBottom: theme.spacing[3],
    },
    textInput: {
      backgroundColor: theme.colors.surface.tertiary,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[3],
      fontSize: 14,
      color: theme.colors.text.primary,
    },
    rangeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[3],
    },
    rangeInput: {
      flex: 1,
      backgroundColor: theme.colors.surface.tertiary,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[3],
      fontSize: 14,
      color: theme.colors.text.primary,
    },
    rangeSeparator: {
      color: theme.colors.text.tertiary,
    },
    chipsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing[2],
    },
    chip: {
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[2],
      borderRadius: theme.borderRadius.badge,
      borderWidth: 1,
    },
    chipInactive: {
      backgroundColor: theme.colors.surface.tertiary,
      borderColor: theme.colors.border.primary,
    },
    chipActive: {
      backgroundColor: theme.colors.primary[50],
      borderColor: theme.colors.primary.DEFAULT,
    },
    chipTextInactive: {
      color: theme.colors.text.primary,
      fontWeight: fontWeightForPlatform('500'),
    },
    chipTextActive: {
      color: theme.colors.primary.DEFAULT,
      fontWeight: fontWeightForPlatform('600'),
    },
    chipTab: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 80,
    },
    chipSmall: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      marginBottom: 6,
    },
    categoryChipsWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    selectedCategoryChip: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: theme.spacing[2],
      backgroundColor: theme.colors.primary[50],
      borderWidth: 1,
      borderColor: theme.colors.primary.DEFAULT,
      borderRadius: theme.borderRadius.badge,
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[2],
      marginBottom: theme.spacing[2],
    },
    selectedCategoryText: {
      color: theme.colors.primary.DEFAULT,
      fontWeight: fontWeightForPlatform('600'),
      maxWidth: 260,
    },
    categorySearchInput: {
      backgroundColor: theme.colors.surface.tertiary,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[3],
      fontSize: 14,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[2],
    },
    categoryDropdown: {
      maxHeight: 200,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface.primary,
    },
    categoryDropdownItem: {
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },
    categoryDropdownItemActive: {
      backgroundColor: theme.colors.primary[50],
    },
    categoryDropdownText: {
      color: theme.colors.text.primary,
    },
    categoryDropdownTextActive: {
      color: theme.colors.primary.DEFAULT,
      fontWeight: fontWeightForPlatform('600'),
    },
    footer: {
      paddingVertical: theme.spacing[4],
      paddingHorizontal: theme.spacing[4],
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.primary,
    },
  });
