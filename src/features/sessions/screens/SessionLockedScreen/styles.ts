/**
 * SessionLockedScreen Styles
 */

import { StyleSheet, Dimensions } from 'react-native';
import { Theme } from '@theme/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_HEIGHT = 200;

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    },

    // Header
    header: {
      backgroundColor: theme.colors.background.primary,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[2],
    },
    backText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text.primary,
    },
    headerTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.colors.text.primary,
    },
    headerSpacer: {
      width: 60,
    },

    // Hero Banner
    heroBanner: {
      height: BANNER_HEIGHT,
      width: '100%',
      position: 'relative',
    },
    heroBannerGradient: {
      flex: 1,
      justifyContent: 'flex-end',
      padding: theme.spacing[6],
    },
    lockIcon: {
      position: 'absolute',
      top: theme.spacing[4],
      right: theme.spacing[4],
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    heroProjectId: {
      fontSize: 10,
      fontWeight: '700',
      color: 'rgba(255, 255, 255, 0.8)',
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: theme.spacing[2],
    },
    heroTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: '#FFFFFF',
      lineHeight: 28,
    },

    // Info Banner
    infoBanner: {
      marginHorizontal: theme.spacing[4],
      marginTop: theme.spacing[4],
      backgroundColor: theme.colors.primary.light,
      borderWidth: 1,
      borderColor: 'rgba(59, 130, 246, 0.2)',
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing[4],
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing[3],
    },
    infoBannerText: {
      flex: 1,
      fontSize: 13,
      fontWeight: '500',
      color: theme.colors.text.primary,
      lineHeight: 19,
    },

    // Section Header
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing[4],
      paddingTop: theme.spacing[6],
      paddingBottom: theme.spacing[2],
    },
    sectionTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: theme.colors.text.primary,
    },
    sectionCount: {
      fontSize: 11,
      fontWeight: '700',
      color: theme.colors.text.tertiary,
      backgroundColor: theme.colors.background.primary,
      paddingHorizontal: theme.spacing[2],
      paddingVertical: theme.spacing[1],
      borderRadius: theme.borderRadius.full,
      textTransform: 'uppercase',
    },

    // Partner Card
    partnerCard: {
      marginHorizontal: theme.spacing[4],
      marginTop: theme.spacing[3],
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing[4],
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'stretch',
      gap: theme.spacing[4],
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
    },
    partnerInfo: {
      flex: 1,
      justifyContent: 'space-between',
    },
    partnerNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[2],
      marginBottom: 4,
    },
    partnerName: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.colors.text.primary,
    },
    partnerSpecialty: {
      fontSize: 13,
      color: theme.colors.text.tertiary,
      marginBottom: theme.spacing[1],
    },
    partnerLocation: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    partnerLocationText: {
      fontSize: 11,
      color: theme.colors.text.tertiary,
    },
    viewProfileButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[2],
      backgroundColor: theme.colors.background.secondary,
      paddingVertical: theme.spacing[2],
      paddingHorizontal: theme.spacing[3],
      borderRadius: theme.borderRadius.lg,
      marginTop: theme.spacing[3],
      alignSelf: 'flex-start',
    },
    viewProfileText: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    partnerImage: {
      width: 96,
      height: 96,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background.secondary,
    },
    partnerImagePlaceholder: {
      width: 96,
      height: 96,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background.secondary,
      justifyContent: 'center',
      alignItems: 'center',
    },

    // End of Selection
    endText: {
      textAlign: 'center',
      fontSize: 10,
      fontWeight: '700',
      color: theme.colors.text.tertiary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      paddingVertical: theme.spacing[8],
    },

    // Bottom CTA
    bottomContainer: {
      backgroundColor: theme.colors.background.primary,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.primary,
      padding: theme.spacing[4],
    },
    chatButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary.DEFAULT,
      borderRadius: theme.borderRadius.xl,
      height: 56,
      gap: theme.spacing[3],
      shadowColor: theme.colors.primary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    chatButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
    },
  });
