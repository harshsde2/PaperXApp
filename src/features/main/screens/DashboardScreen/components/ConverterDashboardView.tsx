import React, { useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import type { ConverterDashboardData } from '@services/api';
import type { ActiveSessionListItem } from '@services/api/sessionApi/@types';
import { SCREENS } from '@navigation/constants';

const { width } = Dimensions.get('window');

interface ConverterDashboardViewProps {
  profileData: any;
  dashboardData?: ConverterDashboardData;
  onRefresh?: () => void;
  refreshing?: boolean;
}

// Default/fallback data
const defaultData = {
  inquiriesCount: 0,
  newInquiries: 0,
  avgResponseSpeed: '-',
  avgResponseChange: '-',
  winRate: 0,
  newInquiriesList: [],
  activeSessions: [],
  productionCapacity: { current: 0, max: 100, unit: '%' },
};

export const ConverterDashboardView: React.FC<ConverterDashboardViewProps> = ({
  profileData,
  dashboardData: apiData,
  onRefresh,
  refreshing = false,
}) => {
  const navigation = useNavigation<any>();

  // Use API data with fallback to default data
  // Handle both snake_case (from converter API) and camelCase (from dashboard API)
  const activeSessionsData = (apiData as any)?.activeSessions || (apiData as any)?.active_sessions || [];
  
  const dashboardData = {
    inquiriesCount: apiData?.inquiriesCount ?? defaultData.inquiriesCount,
    newInquiries: apiData?.newInquiries ?? defaultData.newInquiries,
    avgResponseSpeed: apiData?.avgResponseSpeed ?? defaultData.avgResponseSpeed,
    avgResponseChange: apiData?.avgResponseChange ?? defaultData.avgResponseChange,
    winRate: apiData?.winRate ?? defaultData.winRate,
    newInquiriesList: apiData?.newInquiriesList ?? defaultData.newInquiriesList,
    activeSessions: activeSessionsData as ActiveSessionListItem[], // Top 5 active sessions from API
    productionCapacity: {
      current: apiData?.productionCapacity?.current ?? defaultData.productionCapacity.current,
      max: apiData?.productionCapacity?.max ?? defaultData.productionCapacity.max,
      unit: apiData?.productionCapacity?.unit ?? defaultData.productionCapacity.unit,
    },
  };

  // Transform API session data to component format
  const transformedSessions = useMemo(() => {
    if (!dashboardData.activeSessions || dashboardData.activeSessions.length === 0) {
      return [];
    }

    return dashboardData.activeSessions.slice(0, 5).map((session: ActiveSessionListItem) => {
      const firstItem = session.items?.[0];
      const totalQuantity = session.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      
      // Map API status to component status
      let status: 'NEGOTIATION' | 'PENDING_INFO' | 'WAITING' | 'ACTIVE' = 'ACTIVE';
      if (session.status === 'RESPONSES_RECEIVED' || session.status === 'CHAT_ACTIVE') {
        status = 'NEGOTIATION';
      } else if (session.status === 'MATCHING') {
        status = 'WAITING';
      }

      // Format time remaining from countdown
      let timeRemaining = '';
      if (session.countdown) {
        const { days, hours, minutes } = session.countdown;
        if (days > 0) {
          timeRemaining = `${days}d ${hours}h`;
        } else if (hours > 0) {
          timeRemaining = `${hours}h ${minutes}m`;
        } else {
          timeRemaining = `${minutes}m`;
        }
      }

      // Get company name from title or use default
      const companyName = session.title.split('-')[0]?.trim() || 'Company';
      const companyAvatar = companyName.charAt(0).toUpperCase();

      // Description from material and quantity
      const materialName = firstItem?.material_category || 'Material';
      const quantityUnit = firstItem?.quantity_unit || 'units';
      const description = `${materialName} • ${totalQuantity} ${quantityUnit}`;

      // Step progress (simplified - you may want to get this from API)
      const stepProgress = session.responses_received > 0 ? 2 : 1;
      const totalSteps = 4;
      const step = session.responses_received > 0 ? 'Reviewing Responses' : 'Waiting for Responses';
      const waitingOn = session.responses_received > 0 ? 'Reviewing' : 'Waiting for responses';
      const actionRequired = session.status === 'RESPONSES_RECEIVED';

      return {
        id: String(session.id),
        status,
        timeRemaining,
        companyAvatar,
        company: companyName,
        description,
        actionRequired,
        stepProgress,
        totalSteps,
        step,
        waitingOn,
      };
    });
  }, [dashboardData.activeSessions]);

  const handleViewAllSessions = () => {
    navigation.navigate(SCREENS.SESSIONS.DASHBOARD, {
      initialTab: 'all',
    });
  };

  const handleSessionPress = (sessionId: string) => {
    navigation.navigate(SCREENS.SESSIONS.DETAILS, {
      sessionId,
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#2563EB"
            colors={['#2563EB']}
          />
        ) : undefined
      }
    >
      {/* Status Pills */}
      <View style={styles.statusPillsContainer}>
        <View style={styles.statusPill}>
          <View style={styles.statusDot} />
          <Text style={styles.statusPillText}>Status: Available</Text>
          <AppIcon.ChevronDown width={14} height={14} color="#16A34A" />
        </View>
        <View style={[styles.statusPill, styles.statusPillOutline]}>
          <AppIcon.Capacity width={14} height={14} color="#6B7280" />
          <Text style={styles.statusPillTextMuted}>Capacity: {dashboardData.productionCapacity.current}%</Text>
        </View>
      </View>

      {/* Stats Row */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.statsScrollView}
        contentContainerStyle={styles.statsScrollContent}
      >
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <AppIcon.Inquiries width={18} height={18} color="#6B7280" />
            <Text style={styles.statHeaderLabel}>INQUIRIES</Text>
          </View>
          <View style={styles.statValueRow}>
            <Text style={styles.statValue}>{dashboardData.inquiriesCount}</Text>
            <View style={styles.statBadge}>
              <Text style={styles.statBadgeText}>+{dashboardData.newInquiries} new</Text>
            </View>
          </View>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <AppIcon.Sessions width={18} height={18} color="#6B7280" />
            <Text style={styles.statHeaderLabel}>AVG{'\n'}SPEED</Text>
          </View>
          <View style={styles.statValueRow}>
            <Text style={styles.statValue}>{dashboardData.avgResponseSpeed}</Text>
            <Text style={styles.statSubValue}>{dashboardData.avgResponseChange}</Text>
          </View>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <AppIcon.ArrowRight width={18} height={18} color="#6B7280" />
            <Text style={styles.statHeaderLabel}>WIN{'\n'}RATE</Text>
          </View>
          <Text style={styles.statValue}>{dashboardData.winRate}%</Text>
        </View>
      </ScrollView>

      {/* New Inquiries */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>New Inquiries</Text>
        
        {dashboardData.newInquiriesList.map((inquiry, index) => (
          <View key={inquiry.id} style={[styles.inquiryCard, index === 0 && styles.inquiryCardUrgent]}>
            {inquiry.urgency === 'URGENT' && (
              <View style={styles.urgentBadge}>
                <Text style={styles.urgentBadgeText}>URGENT</Text>
              </View>
            )}
            
            <View style={styles.inquiryHeader}>
              <View style={styles.brandIconContainer}>
                <AppIcon.Brand width={24} height={24} color="#4F46E5" />
              </View>
              <View style={styles.inquiryInfo}>
                <Text style={styles.inquiryBrand}>Brand: {inquiry.brand}</Text>
                <Text style={styles.inquiryTitle}>{inquiry.title}</Text>
                <Text style={styles.inquirySpecs}>{inquiry.quantity} • {inquiry.specs}{inquiry.time ? ` • ${inquiry.time}` : ''}</Text>
              </View>
            </View>

            <View style={styles.inquiryActions}>
              <TouchableOpacity style={styles.passButton}>
                <Text style={styles.passButtonText}>Pass</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.reviewButton, inquiry.urgency === 'URGENT' && styles.reviewButtonUrgent]}>
                <Text style={styles.reviewButtonText}>{inquiry.urgency === 'URGENT' ? 'Review Inquiry' : 'Details'}</Text>
                {inquiry.urgency === 'URGENT' && <AppIcon.ArrowRight width={16} height={16} color="#FFFFFF" />}
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Active Sessions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Sessions</Text>
          {transformedSessions.length > 0 && (
            <TouchableOpacity onPress={handleViewAllSessions}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          )}
        </View>

        {transformedSessions.length === 0 ? (
          <View style={styles.emptySessionsContainer}>
            <Text style={styles.emptySessionsText}>No active sessions</Text>
            <TouchableOpacity style={styles.viewAllButton} onPress={handleViewAllSessions}>
              <Text style={styles.viewAllButtonText}>View All Sessions</Text>
            </TouchableOpacity>
          </View>
        ) : (
          transformedSessions.map((session) => (
            <TouchableOpacity
              key={session.id}
              style={styles.sessionCard}
              onPress={() => handleSessionPress(session.id)}
              activeOpacity={0.7}
            >
              <View style={styles.sessionHeader}>
                <View style={styles.sessionStatusBadge}>
                  <View style={[styles.sessionStatusDot, { backgroundColor: session.status === 'NEGOTIATION' ? '#16A34A' : '#F59E0B' }]} />
                  <Text style={styles.sessionStatusText}>{session.status.replace('_', ' ')}</Text>
                </View>
                {session.timeRemaining && (
                  <View style={styles.sessionTimeContainer}>
                    <AppIcon.Sessions width={14} height={14} color="#6B7280" />
                    <Text style={styles.sessionTimeText}>{session.timeRemaining}</Text>
                  </View>
                )}
              </View>

              <View style={styles.sessionContent}>
                <View style={styles.sessionAvatar}>
                  <Text style={styles.sessionAvatarText}>{session.companyAvatar}</Text>
                </View>
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionCompany}>{session.company}</Text>
                  <Text style={styles.sessionDescription}>{session.description}</Text>
                </View>
                {session.actionRequired ? (
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Action</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.chatButton}>
                    <AppIcon.Messages width={20} height={20} color="#6B7280" />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.sessionProgress}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${(session.stepProgress / session.totalSteps) * 100}%` }]} />
                </View>
              </View>

              <View style={styles.sessionFooter}>
                <Text style={styles.sessionStep}>Step {session.stepProgress}/{session.totalSteps}: {session.step}</Text>
                <Text style={styles.sessionWaiting}>{session.actionRequired ? 'Your Turn' : session.waitingOn}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Production Capacity Card */}
      <View style={styles.capacityCard}>
        <View style={styles.capacityIcon}>
          <AppIcon.Capacity width={32} height={32} color="#6B7280" />
        </View>
        <Text style={styles.capacityTitle}>Production Capacity</Text>
        <Text style={styles.capacityDescription}>
          You are at {dashboardData.productionCapacity.current}% capacity. Increase visibility to receive more inquiries?
        </Text>
        <TouchableOpacity>
          <Text style={styles.adjustLink}>Adjust Settings</Text>
        </TouchableOpacity>
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
  statusPillsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    gap: 6,
  },
  statusPillOutline: {
    backgroundColor: '#F3F4F6',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  statusPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#16A34A',
  },
  statusPillTextMuted: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  statsScrollView: {
    backgroundColor: '#FFFFFF',
  },
  statsScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  statCard: {
    width: 120,
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 16,
    marginRight: 12,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 10,
  },
  statHeaderLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginRight: 4,
  },
  statSubValue: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  statBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#16A34A',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
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
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  inquiryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inquiryCardUrgent: {
    borderColor: '#FCA5A5',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  urgentBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  urgentBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#DC2626',
    letterSpacing: 0.5,
  },
  inquiryHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  brandIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  inquiryInfo: {
    flex: 1,
  },
  inquiryBrand: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  inquiryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  inquirySpecs: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  inquiryActions: {
    flexDirection: 'row',
    gap: 10,
  },
  passButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  passButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  reviewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  reviewButtonUrgent: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  reviewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sessionStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sessionStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sessionStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
    letterSpacing: 0.3,
  },
  sessionTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  sessionTimeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
  },
  sessionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sessionAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sessionAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4F46E5',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionCompany: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  sessionDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  chatButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sessionProgress: {
    marginBottom: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 2,
  },
  sessionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sessionStep: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  sessionWaiting: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  capacityCard: {
    margin: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  capacityIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  capacityTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  capacityDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 12,
  },
  adjustLink: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2563EB',
  },
  emptySessionsContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptySessionsText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  viewAllButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
  },
  viewAllButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
});
