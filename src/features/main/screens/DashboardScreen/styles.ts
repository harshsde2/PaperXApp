import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Dashboard Wrapper
  dashboardWrapper: {
    flex: 1,
  },
  dashboardScrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  dashboardContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  // Loading & Error States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },

  // Incomplete Profile Container
  incompleteProfileContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    height:300,
  },

  // Profile Completion Card - Clean Approach
  profileCompletionContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
  },
  profileCompletionCardWrapper: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  profileCompletionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileCompletionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileCompletionHeaderText: {
    flex: 1,
  },
  profileCompletionSubheading: {
    marginBottom: 24,
    lineHeight: 20,
  },
  profileCompletionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  profileCompletionButtonText: {
    marginRight: 8,
  },
  profileCompletionIconWrapper: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: -24,
    zIndex: 10,
  },
  profileCompletionIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFC107',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  profileCompletionIconText: {
    fontSize: 28,
  },
  profileCompletionCard: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 20,
    paddingTop: 40,
    minHeight: 100,
  },
  profileCompletionProgressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  profileCompletionProgressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  completeProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completeProfileButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },

  // Dashboard Header - New Reusable Component
  dashboardHeaderContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dashboardHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  dashboardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  // Brand Header Styles
  brandLogoContainer: {
    marginRight: 12,
  },
  brandLogoImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  brandLogoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandInfoContainer: {
    flex: 1,
  },
  verifiedBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  verifiedIconContainer: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  verifiedCheckmark: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  // Dealer Header Styles
  dealerAvatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  dealerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 25,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dealerInfoContainer: {
    flex: 1,
  },
  roleBadgeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
  },

  // Machine Dealer Header Styles
  machineDealerAvatarContainer: {
    marginRight: 12,
  },
  machineDealerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B3D9FF',
  },
  machineDealerInfoContainer: {
    flex: 1,
  },

  // Converter Header Styles
  converterAvatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  converterAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  converterInfoContainer: {
    flex: 1,
  },

  // Common Styles
  onlineStatusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  notificationButtonContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },

  // Dashboard Header - Legacy (keeping for backward compatibility)
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  profileHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileHeaderInfo: {
    flex: 1,
  },
  companyNameHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  roleBadgeHeader: {
    alignSelf: 'flex-start',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  roleBadgeTextHeader: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1976D2',
  },
  notificationButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    fontSize: 24,
  },

  // Dashboard Title Section
  dashboardTitleSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  dashboardTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  dashboardSubtitle: {
    fontSize: 14,
    color: '#666666',
  },

  // Summary Statistics
  summaryStatsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryCardIcon: {
    marginBottom: 12,
  },
  summaryCardIconText: {
    fontSize: 32,
  },
  summaryCardNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 4,
  },
  summaryCardNumberSecondary: {
    color: '#000000',
  },
  summaryCardLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },

  // Section
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },

  // Quick Actions
  quickActionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  quickActionButtonPrimary: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  quickActionButtonSecondary: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  quickActionIconContainer: {
    marginBottom: 12,
  },
  quickActionIconContainerSecondary: {
    marginBottom: 12,
  },
  quickActionIconText: {
    fontSize: 32,
  },
  quickActionIconTextSecondary: {
    fontSize: 32,
  },
  quickActionTitlePrimary: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  quickActionSubtitlePrimary: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  quickActionTitleSecondary: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  quickActionSubtitleSecondary: {
    fontSize: 12,
    color: '#666666',
  },

  // Recent Sessions
  recentSessionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  recentSessionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  viewAllLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  recentSessionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  sessionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sessionCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sessionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sessionIconText: {
    fontSize: 20,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionMaterial: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  sessionDescription: {
    fontSize: 12,
    color: '#666666',
  },
  sessionStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 12,
  },
  sessionStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Additional Cards
  additionalCardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  additionalCard: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  additionalCardIcon: {
    marginBottom: 12,
  },
  additionalCardIconText: {
    fontSize: 32,
  },
  additionalCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  additionalCardSubtitle: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  additionalCardInfo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },

  // Market Insight
  marketInsightCard: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#1E3A5F',
    borderRadius: 12,
  },
  marketInsightLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 8,
    letterSpacing: 1,
  },
  marketInsightTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  marketInsightLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  marketInsightLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
});
