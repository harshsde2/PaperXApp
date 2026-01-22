/**
 * MatchmakingSuccessScreen Styles
 */

import { StyleSheet, Dimensions } from 'react-native';
import { Theme } from '@theme/types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: theme.spacing[8],
    },

    // ==========================================
    // CLOSE BUTTON
    // ==========================================
    closeButton: {
      position: 'absolute',
      top: theme.spacing[2],
      right: theme.spacing[4],
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.background.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },

    // ==========================================
    // SUCCESS ANIMATION AREA
    // ==========================================
    animationContainer: {
      alignItems: 'center',
      paddingTop: theme.spacing[8],
      paddingHorizontal: theme.spacing[6],
    },
    radarContainer: {
      width: 200,
      height: 200,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing[6],
    },
    radarOuter: {
      width: 200,
      height: 200,
      borderRadius: 100,
      borderWidth: 2,
      borderColor: 'rgba(59, 130, 246, 0.15)',
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
    },
    radarMiddle: {
      width: 150,
      height: 150,
      borderRadius: 75,
      borderWidth: 2,
      borderColor: 'rgba(59, 130, 246, 0.25)',
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
    },
    radarInner: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 2,
      borderColor: 'rgba(59, 130, 246, 0.4)',
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
    },
    radarCenter: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: theme.colors.primary.light,
      justifyContent: 'center',
      alignItems: 'center',
    },
    radarDot: {
      position: 'absolute',
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: theme.colors.primary.DEFAULT,
    },
    radarDot1: {
      top: 93,
      left: 93,
    },
    radarDot2: {
      bottom: 40,
      right: 30,
    },

    // ==========================================
    // SUCCESS TEXT
    // ==========================================
    successTitle: {
      fontSize: 28,
      fontWeight: '800',
      color: theme.colors.text.primary,
      textAlign: 'center',
      marginBottom: theme.spacing[3],
      letterSpacing: -0.5,
    },
    successSubtitle: {
      fontSize: 15,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      lineHeight: 22,
      paddingHorizontal: theme.spacing[4],
    },

    // ==========================================
    // REQUIREMENT CARD
    // ==========================================
    requirementSection: {
      paddingHorizontal: theme.spacing[4],
      marginTop: theme.spacing[8],
    },
    requirementCard: {
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing[4],
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    requirementHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    requirementImage: {
      width: 60,
      height: 60,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background.primary,
      marginRight: theme.spacing[3],
    },
    requirementImagePlaceholder: {
      width: 60,
      height: 60,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing[3],
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    requirementContent: {
      flex: 1,
    },
    requirementTitleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing[1],
    },
    requirementTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.text.primary,
    },
    requirementTime: {
      fontSize: 12,
      color: theme.colors.text.tertiary,
    },
    requirementDetails: {
      fontSize: 13,
      color: theme.colors.text.secondary,
      lineHeight: 18,
    },

    // Status Badge
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.primary.light,
      borderRadius: theme.borderRadius.lg,
      paddingVertical: theme.spacing[2],
      paddingHorizontal: theme.spacing[3],
      marginTop: theme.spacing[3],
      justifyContent: 'space-between',
    },
    statusLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.primary.DEFAULT,
      marginRight: theme.spacing[2],
    },
    statusText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.primary.DEFAULT,
    },
    statusIcon: {
      opacity: 0.7,
    },

    // ==========================================
    // BOTTOM BUTTONS
    // ==========================================
    bottomContainer: {
      padding: theme.spacing[4],
      marginTop: 'auto',
    },
    viewSessionButton: {
      backgroundColor: theme.colors.primary.DEFAULT,
      borderRadius: theme.borderRadius.xl,
      paddingVertical: theme.spacing[4],
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.colors.primary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    viewSessionButtonText: {
      fontSize: 17,
      fontWeight: '700',
      color: '#FFFFFF',
      marginRight: theme.spacing[2],
    },
    returnButton: {
      paddingVertical: theme.spacing[3],
      alignItems: 'center',
      marginTop: theme.spacing[2],
    },
    returnButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.text.tertiary,
    },

    // ==========================================
    // ANIMATED ELEMENTS
    // ==========================================
    pulseRing: {
      position: 'absolute',
      width: 200,
      height: 200,
      borderRadius: 100,
      borderWidth: 2,
      borderColor: theme.colors.primary.DEFAULT,
      opacity: 0.3,
    },
  });
