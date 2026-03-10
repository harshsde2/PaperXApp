import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing[4],
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing[2],
      paddingHorizontal: 4,
    },
    iconWrap: {
      width: 28,
      height: 28,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.primary[50],
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing[2],
    },
    sectionTitle: {
      fontSize: 13,
      fontFamily: theme.fontFamily.semibold,
      color: theme.colors.text.secondary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    card: {
      backgroundColor: theme.colors.surface.primary,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 4,
    },
    // value row
    valueRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingHorizontal: theme.spacing[3],
      paddingVertical: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.divider.secondary,
    },
    valueRowLast: {
      borderBottomWidth: 0,
    },
    rowLabel: {
      fontSize: 13,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.text.tertiary,
      flex: 0.45,
    },
    rowValue: {
      fontSize: 14,
      fontFamily: theme.fontFamily.semibold,
      color: theme.colors.text.primary,
      flex: 0.55,
      textAlign: 'right',
    },
    // metric row
    metricRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing[3],
      paddingVertical: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.divider.secondary,
    },
    metricValue: {
      fontSize: 20,
      fontFamily: theme.fontFamily.bold,
      color: theme.colors.primary.DEFAULT,
    },
    metricLabel: {
      fontSize: 12,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.text.tertiary,
    },
    // chip-list
    chipContainer: {
      paddingHorizontal: theme.spacing[3],
      paddingVertical: 14,
    },
    chipLabel: {
      fontSize: 12,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.text.tertiary,
      marginBottom: theme.spacing[2],
    },
    chipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    chip: {
      paddingHorizontal: theme.spacing[2],
      paddingVertical: 6,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.primary[50],
      borderWidth: 1,
      borderColor: theme.colors.primary[100],
    },
    chipText: {
      fontSize: 12,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.primary[700],
    },
    // address row
    addressRow: {
      paddingHorizontal: theme.spacing[3],
      paddingVertical: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.divider.secondary,
    },
    addressLabel: {
      fontSize: 12,
      fontFamily: theme.fontFamily.semibold,
      color: theme.colors.text.tertiary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 4,
    },
    addressValue: {
      fontSize: 14,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.text.primary,
      lineHeight: 20,
    },
    // detail-card row (materials with sub-chips)
    detailCard: {
      paddingHorizontal: theme.spacing[3],
      paddingVertical: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.divider.secondary,
    },
    detailCardTitle: {
      fontSize: 15,
      fontFamily: theme.fontFamily.semibold,
      color: theme.colors.text.primary,
    },
    detailCardSubtitle: {
      fontSize: 12,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.text.tertiary,
      marginTop: 2,
    },
    detailChipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 8,
    },
    detailChip: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.surface.secondary,
    },
    detailChipText: {
      fontSize: 11,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.text.secondary,
    },
  });
