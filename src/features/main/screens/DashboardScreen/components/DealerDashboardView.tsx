import React from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import type { DealerDashboardData } from '@services/api';
import { SCREENS } from '@navigation/constants';

const { width } = Dimensions.get('window');

interface DealerDashboardViewProps {
  profileData: any;
  dashboardData?: DealerDashboardData;
}

export const DealerDashboardView: React.FC<DealerDashboardViewProps> = ({ profileData, dashboardData: apiData }) => {
  const navigation = useNavigation<any>();

  const companyName = profileData?.company_name || 'Your Company';

  console.log('apiData', apiData);

  // Use API data with fallback to defaults
  const dashboardData = {
    profileCompletionPercentage: apiData?.profile_completion_percentage ?? 0,
    activeOpportunities: apiData?.active_opportunities_count ?? 0,
    lockedSessions: apiData?.locked_sessions_count ?? 0,
    expiredSessions: apiData?.expired_sessions_count ?? 0,
    unreadNotifications: apiData?.unread_notifications_count ?? 0,
    postedRequirements: apiData?.posted_requirements_count ?? 0,
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Manage your opportunities and sessions.</Text>
      </View>

      {/* Profile Completion Progress */}
      {dashboardData.profileCompletionPercentage < 100 && (
        <TouchableOpacity style={styles.profileProgressCard} activeOpacity={0.8}>
          <View style={styles.profileProgressHeader}>
            <View style={styles.profileProgressIconContainer}>
              <AppIcon.Profile width={20} height={20} color="#F59E0B" />
            </View>
            <View style={styles.profileProgressInfo}>
              <Text style={styles.profileProgressTitle}>Complete Your Profile</Text>
              <Text style={styles.profileProgressSubtitle}>
                {dashboardData.profileCompletionPercentage}% complete
              </Text>
            </View>
            <AppIcon.ChevronRight width={20} height={20} color="#9CA3AF" />
          </View>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${dashboardData.profileCompletionPercentage}%` }
              ]} 
            />
          </View>
        </TouchableOpacity>
      )}

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <AppIcon.Market width={22} height={22} color="#2563EB" />
          </View>
          <Text style={styles.statValue}>{dashboardData.activeOpportunities}</Text>
          <Text style={styles.statLabel}>Active{'\n'}Opportunities</Text>
        </View>

        <View style={[styles.statCard, styles.statCardDark]}>
          <View style={[styles.statIconContainer, styles.statIconDark]}>
            <AppIcon.Sessions width={22} height={22} color="#FFFFFF" />
          </View>
          <Text style={[styles.statValue, styles.statValueDark]}>{dashboardData.lockedSessions}</Text>
          <Text style={[styles.statLabel, styles.statLabelDark]}>Locked{'\n'}Sessions</Text>
        </View>
      </View>

      {/* Secondary Stats Row */}
      <View style={styles.secondaryStatsContainer}>
        <View style={styles.secondaryStatCard}>
          <View style={[styles.secondaryStatIcon, { backgroundColor: '#FEF3C7' }]}>
            <AppIcon.Sessions width={18} height={18} color="#F59E0B" />
          </View>
          <View style={styles.secondaryStatInfo}>
            <Text style={styles.secondaryStatValue}>{dashboardData.expiredSessions}</Text>
            <Text style={styles.secondaryStatLabel}>Expired Sessions</Text>
          </View>
        </View>

        <View style={styles.secondaryStatCard}>
          <View style={[styles.secondaryStatIcon, { backgroundColor: '#FEE2E2' }]}>
            <AppIcon.Messages width={18} height={18} color="#EF4444" />
          </View>
          <View style={styles.secondaryStatInfo}>
            <Text style={styles.secondaryStatValue}>{dashboardData.unreadNotifications}</Text>
            <Text style={styles.secondaryStatLabel}>Unread Notifications</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionCardPrimary} activeOpacity={0.85}>
            <View style={styles.actionIcon}>
              <AppIcon.Market width={28} height={28} color="#FFFFFF" />
            </View>
            <Text style={styles.actionTitlePrimary}>Post Buy Req</Text>
            <Text style={styles.actionSubtitlePrimary}>Find Materials</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCardSecondary} activeOpacity={0.85}>
            <View style={styles.actionIconSecondary}>
              <AppIcon.Inquiries width={28} height={28} color="#2563EB" />
            </View>
            <Text style={styles.actionTitleSecondary}>Post Sell Offer</Text>
            <Text style={styles.actionSubtitleSecondary}>List Inventory</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Additional Cards */}
      <View style={styles.additionalCardsRow}>
        <TouchableOpacity style={styles.additionalCard} activeOpacity={0.7}>
          <View style={styles.additionalIconContainer}>
            <AppIcon.Market width={24} height={24} color="#4F46E5" />
          </View>
          <Text style={styles.additionalCardTitle}>Opportunities</Text>
          <Text style={styles.additionalCardSubtitle}>View all opportunities</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.additionalCard} 
          activeOpacity={0.7}
          onPress={() => navigation.navigate(SCREENS.MAIN.REQUIREMENTS)}
        >
          <View style={styles.additionalIconContainer}>
            <AppIcon.Inquiries width={24} height={24} color="#4F46E5" />
          </View>
          <Text style={styles.additionalCardTitle}>My Requirements</Text>
          <Text style={styles.additionalCardSubtitle}>
            {dashboardData.postedRequirements} posted
          </Text>
        </TouchableOpacity>
      </View>

      {/* Market Insight */}
      <TouchableOpacity style={styles.insightCard} activeOpacity={0.8}>
        <Text style={styles.insightCategory}>MARKET INSIGHT</Text>
        <Text style={styles.insightTitle}>Explore market trends and opportunities</Text>
        <View style={styles.insightLink}>
          <Text style={styles.insightLinkText}>View Market</Text>
          <AppIcon.ArrowRight width={18} height={18} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  titleSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
  },
  profileProgressCard: {
    marginHorizontal: 20,
    marginTop: 8,
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  profileProgressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileProgressIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileProgressInfo: {
    flex: 1,
  },
  profileProgressTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 2,
  },
  profileProgressSubtitle: {
    fontSize: 13,
    color: '#B45309',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#FDE68A',
    borderRadius: 3,
    marginTop: 14,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 3,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  secondaryStatsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  secondaryStatCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  secondaryStatIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  secondaryStatInfo: {
    flex: 1,
  },
  secondaryStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  secondaryStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statCardDark: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statIconDark: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2563EB',
    marginBottom: 4,
  },
  statValueDark: {
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  statLabelDark: {
    color: 'rgba(255,255,255,0.7)',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  actionCardPrimary: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  actionCardSecondary: {
    flex: 1,
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  actionIconSecondary: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  actionTitlePrimary: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  actionSubtitlePrimary: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  actionTitleSecondary: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  actionSubtitleSecondary: {
    fontSize: 13,
    color: '#6B7280',
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  sessionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  sessionDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  sessionStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 10,
  },
  sessionStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  additionalCardsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  additionalCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  additionalIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  additionalCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  additionalCardSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  additionalCardHighlight: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
    marginTop: 8,
  },
  insightCard: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: '#1E3A5F',
    borderRadius: 20,
    padding: 24,
  },
  insightCategory: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1,
    marginBottom: 10,
  },
  insightTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 28,
    marginBottom: 16,
  },
  insightLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
});