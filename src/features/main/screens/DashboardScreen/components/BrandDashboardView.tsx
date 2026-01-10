import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import type { BrandDashboardData } from '@services/api';

const { width } = Dimensions.get('window');

interface BrandDashboardViewProps {
  profileData: any;
  dashboardData?: BrandDashboardData;
}

// Default/fallback data
const defaultData = {
  activeInquiries: 0,
  newProposals: 0,
  unreadMessages: 0,
  recentInquiries: [],
};

export const BrandDashboardView: React.FC<BrandDashboardViewProps> = ({ profileData, dashboardData: apiData }) => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<'inquiries' | 'messages'>('inquiries');

  // Use API data with fallback to default data
  const dashboardData = {
    activeInquiries: apiData?.activeInquiries ?? defaultData.activeInquiries,
    newProposals: apiData?.newProposals ?? defaultData.newProposals,
    unreadMessages: apiData?.unreadMessages ?? defaultData.unreadMessages,
    recentInquiries: apiData?.recentInquiries ?? defaultData.recentInquiries,
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>What are you sourcing?</Text>
        <Text style={styles.subtitle}>Post a requirement to get matched with suppliers.</Text>
      </View>

      {/* Post Requirement Card */}
      <View style={styles.postRequirementCard}>
        <View style={styles.identityBadge}>
          <AppIcon.Security width={14} height={14} color="#9CA3AF" />
          <Text style={styles.identityBadgeText}>Identity hidden until matched</Text>
        </View>
        <Text style={styles.postTitle}>Post New Requirement</Text>
        <TouchableOpacity style={styles.createButton} activeOpacity={0.85}>
          <View style={styles.createButtonIcon}>
            <AppIcon.Inquiries width={18} height={18} color="#FFFFFF" />
          </View>
          <Text style={styles.createButtonText}>Create Request</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Row */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{dashboardData.activeInquiries}</Text>
          <Text style={styles.statLabel}>Active{'\n'}Inquiries</Text>
        </View>

        <View style={[styles.statCard, styles.statCardHighlight]}>
          <Text style={[styles.statValue, styles.statValueHighlight]}>{dashboardData.newProposals}</Text>
          <Text style={[styles.statLabel, styles.statLabelHighlight]}>New{'\n'}Proposals</Text>
          <View style={styles.notificationDot} />
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{dashboardData.unreadMessages}</Text>
          <Text style={styles.statLabel}>Unread{'\n'}Messages</Text>
        </View>
      </View>

      {/* Recent Inquiries Section */}
      <View style={styles.recentSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Inquiries</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'inquiries' && styles.tabActive]}
            onPress={() => setActiveTab('inquiries')}
          >
            <Text style={[styles.tabText, activeTab === 'inquiries' && styles.tabTextActive]}>Inquiries</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'messages' && styles.tabActive]}
            onPress={() => setActiveTab('messages')}
          >
            <Text style={[styles.tabText, activeTab === 'messages' && styles.tabTextActive]}>Messages</Text>
          </TouchableOpacity>
        </View>

        {/* Inquiries List */}
        {dashboardData.recentInquiries.map((inquiry) => (
          <TouchableOpacity key={inquiry.id} style={styles.inquiryCard} activeOpacity={0.7}>
            <View style={styles.inquiryHeader}>
              <View style={styles.inquiryStatusContainer}>
                <View style={[styles.statusDot, { backgroundColor: inquiry.statusColor }]} />
                <Text style={[styles.statusText, { color: inquiry.statusColor }]}>{inquiry.status}</Text>
              </View>
              <Text style={styles.inquiryTime}>{inquiry.time}</Text>
            </View>

            <Text style={styles.inquiryTitle}>{inquiry.title}</Text>
            
            {inquiry.specs.length > 0 && (
              <View style={styles.specsContainer}>
                {inquiry.specs.map((spec, index) => (
                  <React.Fragment key={spec}>
                    <Text style={styles.specText}>{spec}</Text>
                    {index < inquiry.specs.length - 1 && <Text style={styles.specDot}>•</Text>}
                  </React.Fragment>
                ))}
              </View>
            )}

            {inquiry.matchCount && (
              <TouchableOpacity style={styles.matchesButton}>
                <View style={styles.avatarStack}>
                  {[...Array(Math.min(inquiry.matchCount, 2))].map((_, i) => (
                    <View key={i} style={[styles.miniAvatar, { marginLeft: i > 0 ? -8 : 0 }]}>
                      <Text style={styles.miniAvatarText}>S</Text>
                    </View>
                  ))}
                  {inquiry.matchCount > 2 && (
                    <View style={[styles.miniAvatar, styles.miniAvatarMore, { marginLeft: -8 }]}>
                      <Text style={styles.miniAvatarMoreText}>+{inquiry.matchCount - 2}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.matchesText}>View {inquiry.matchCount} Matches</Text>
                <AppIcon.ChevronRight width={16} height={16} color="#2563EB" />
              </TouchableOpacity>
            )}

            {inquiry.matchedWith && (
              <View style={styles.matchedInfo}>
                <Text style={styles.matchedText}>Matched with {inquiry.matchedWith}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
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
    paddingBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
  },
  postRequirementCard: {
    marginHorizontal: 20,
    marginVertical: 16,
    backgroundColor: '#1E3A5F',
    borderRadius: 20,
    padding: 24,
  },
  identityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  identityBadgeText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  postTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 10,
  },
  createButtonIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 10,
    backgroundColor: '#FFFFFF',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  statCardHighlight: {
    borderColor: '#2563EB',
    borderWidth: 1.5,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  statValueHighlight: {
    color: '#2563EB',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  statLabelHighlight: {
    color: '#2563EB',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
  },
  recentSection: {
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
  },
  tabActive: {
    backgroundColor: '#111827',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  inquiryCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inquiryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  inquiryStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  inquiryTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  inquiryTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  specsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 16,
  },
  specText: {
    fontSize: 13,
    color: '#6B7280',
  },
  specDot: {
    fontSize: 13,
    color: '#9CA3AF',
    marginHorizontal: 6,
  },
  matchesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  avatarStack: {
    flexDirection: 'row',
    marginRight: 12,
  },
  miniAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  miniAvatarText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
  },
  miniAvatarMore: {
    backgroundColor: '#F3F4F6',
  },
  miniAvatarMoreText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
  },
  matchesText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  matchedInfo: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  matchedText: {
    fontSize: 13,
    color: '#6B7280',
  },
});
