import { StyleSheet, Dimensions } from 'react-native';
import type { Theme } from '@theme/types';

const { width } = Dimensions.get('window');

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: theme.spacing[4],
      paddingTop: theme.spacing[3],
      paddingBottom: theme.spacing[2],
    },
    requirementCard: {
      backgroundColor: theme.colors.surface.primary,
      borderRadius: 16,
      padding: theme.spacing[4],
      marginBottom: theme.spacing[3],
      borderWidth: 1,
      borderColor: theme.colors.border.secondary || '#F3F4F6',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
      overflow: 'hidden',
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing[3],
    },
    headerContent: {
      flex: 1,
      marginRight: theme.spacing[2],
    },
    requirementTitle: {
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[2],
      fontSize: 16,
      lineHeight: 22,
    },
    badgeContainer: {
      flexDirection: 'row',
      gap: theme.spacing[2],
      flexWrap: 'wrap',
      marginTop: theme.spacing[1],
    },
    urgencyBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing[2],
      paddingVertical: theme.spacing[1],
      borderRadius: 6,
      gap: 6,
    },
    badgeDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    urgencyBadgeText: {
      fontSize: 10,
      letterSpacing: 0.3,
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing[2],
      paddingVertical: theme.spacing[1],
      borderRadius: 6,
      gap: 6,
    },
    statusBadgeText: {
      fontSize: 10,
      letterSpacing: 0.3,
    },
    chevronContainer: {
      paddingTop: theme.spacing[1],
    },
    requirementDescription: {
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing[3],
      lineHeight: 20,
      fontSize: 14,
    },
    materialsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing[3],
      paddingVertical: theme.spacing[2],
      paddingHorizontal: theme.spacing[2],
      backgroundColor: theme.colors.primary?.light || '#EEF2FF',
      borderRadius: 8,
      gap: theme.spacing[2],
    },
    materialIconContainer: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.colors.primary?.DEFAULT || '#2563EB',
      alignItems: 'center',
      justifyContent: 'center',
    },
    materialsText: {
      flex: 1,
      color: theme.colors.text.primary,
      fontSize: 13,
      fontWeight: '500',
    },
    detailsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: theme.spacing[3],
      gap: theme.spacing[3],
    },
    detailItem: {
      flex: 1,
      minWidth: (width - theme.spacing[4] * 2 - theme.spacing[4] * 2 - theme.spacing[3]) / 2,
      maxWidth: '48%',
    },
    detailLabel: {
      color: theme.colors.text.tertiary,
      marginBottom: theme.spacing[1],
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    detailValue: {
      color: theme.colors.text.primary,
      fontSize: 14,
    },
    negotiableText: {
      color: theme.colors.text.tertiary,
      fontSize: 11,
    },
    responseBadge: {
      backgroundColor: theme.colors.success?.light || '#D1FAE5',
      paddingHorizontal: theme.spacing[2],
      paddingVertical: theme.spacing[1],
      borderRadius: 12,
      alignSelf: 'flex-start',
    },
    responseCount: {
      color: theme.colors.success?.DEFAULT || '#10B981',
      fontSize: 13,
    },
    requirementFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: theme.spacing[3],
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.secondary || '#F3F4F6',
    },
    footerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[1],
    },
    footerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[1],
    },
    dateText: {
      color: theme.colors.text.tertiary,
      fontSize: 11,
    },
    responseIndicator: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.colors.success?.DEFAULT || '#10B981',
    },
    responseText: {
      color: theme.colors.text.secondary,
      fontSize: 11,
    },
    footerLoader: {
      paddingVertical: theme.spacing[4],
      alignItems: 'center',
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing[16],
      paddingHorizontal: theme.spacing[4],
    },
    emptyTitle: {
      color: theme.colors.text.primary,
      marginTop: theme.spacing[4],
      marginBottom: theme.spacing[2],
    },
    emptyText: {
      color: theme.colors.text.secondary,
      textAlign: 'center',
    },
  });
