import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    },
    // ── Header ──
    header: {
      backgroundColor: theme.colors.surface.primary,
      paddingHorizontal: theme.spacing[4],
      paddingBottom: theme.spacing[3],
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.divider.secondary,
      borderBottomLeftRadius: theme.borderRadius[24] ?? theme.borderRadius['2xl'],
      borderBottomRightRadius: theme.borderRadius[24] ?? theme.borderRadius['2xl'],
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 6,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: theme.spacing[3],
    },
    backButton: {
      width: 36,
      height: 36,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.surface.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing[3],
    },
    headerTitleWrap: {
      flex: 1,
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: theme.fontFamily.bold,
      color: theme.colors.text.primary,
    },
    rolePill: {
      paddingHorizontal: theme.spacing[2],
      paddingVertical: 4,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.primary[50],
      borderWidth: 1,
      borderColor: theme.colors.primary[100],
      marginLeft: theme.spacing[2],
    },
    rolePillText: {
      fontSize: 11,
      fontFamily: theme.fontFamily.semibold,
      color: theme.colors.primary[700],
      textTransform: 'capitalize',
    },
    // ── Metrics strip ──
    metricsStrip: {
      flexDirection: 'row',
      marginTop: theme.spacing[3],
      gap: theme.spacing[2],
    },
    metricBox: {
      flex: 1,
      backgroundColor: theme.colors.surface.secondary,
      borderRadius: theme.borderRadius.lg,
      paddingVertical: theme.spacing[2],
      paddingHorizontal: theme.spacing[2],
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
    },
    metricBoxValue: {
      fontSize: 18,
      fontFamily: theme.fontFamily.bold,
      color: theme.colors.primary[700],
    },
    metricBoxLabel: {
      fontSize: 10,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.text.tertiary,
      marginTop: 2,
      textAlign: 'center',
    },
    // ── Content ──
    scrollContent: {
      paddingHorizontal: theme.spacing[4],
      paddingTop: theme.spacing[3],
      paddingBottom: theme.spacing[8],
    },
    // ── Loading ──
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    // ── Error ──
    errorWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing[6],
    },
    errorTitle: {
      fontSize: 16,
      fontFamily: theme.fontFamily.semibold,
      color: theme.colors.text.primary,
      marginTop: theme.spacing[3],
      textAlign: 'center',
    },
    errorSubtitle: {
      fontSize: 13,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.text.tertiary,
      marginTop: theme.spacing[1],
      textAlign: 'center',
    },
    retryButton: {
      marginTop: theme.spacing[4],
      paddingHorizontal: theme.spacing[5],
      paddingVertical: theme.spacing[2],
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.primary.DEFAULT,
    },
    retryText: {
      fontSize: 14,
      fontFamily: theme.fontFamily.semibold,
      color: theme.colors.white,
    },
    // ── Empty ──
    emptyCard: {
      marginTop: theme.spacing[6],
      padding: theme.spacing[5],
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface.primary,
      alignItems: 'center',
    },
    emptyTitle: {
      fontSize: 16,
      fontFamily: theme.fontFamily.semibold,
      color: theme.colors.text.primary,
      marginTop: theme.spacing[3],
    },
    emptySubtitle: {
      fontSize: 13,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.text.tertiary,
      marginTop: theme.spacing[1],
      textAlign: 'center',
      lineHeight: 18,
    },
  });
