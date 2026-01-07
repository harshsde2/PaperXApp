import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { Section } from '@shared/components/Section';
import { AppIcon } from '@assets/svgs';
import { useAppSelector } from '@store/hooks';
import { styles } from '../styles';

interface DealerDashboardViewProps {
  profileData: any;
}

export const DealerDashboardView: React.FC<DealerDashboardViewProps> = ({ profileData }) => {
  const navigation = useNavigation<any>();
  const { user } = useAppSelector((state) => state.auth);

  const companyName = profileData?.company_name || 'Your Company';
  const primaryRole = profileData?.primary_role || 'DEALER';

  // Mock data - Replace with actual API calls
  const activeSessions = 3;
  const pendingResponses = 5;
  const recentSessions = [
    {
      id: '1',
      material: 'PE Granules',
      quantity: '50 Tons',
      status: 'NEGOTIATING',
      statusColor: '#4CAF50',
      time: '2h ago',
      description: 'Waiting for Brand response',
    },
    {
      id: '2',
      material: 'PP Raffia',
      quantity: '20 Tons',
      status: 'PENDING',
      statusColor: '#9E9E9E',
      time: '5h ago',
      description: 'Sent offer to Converter',
    },
  ];

  return (
    <ScrollView 
      style={styles.dashboardScrollView}
      contentContainerStyle={styles.dashboardContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Dashboard Title */}
      <View style={styles.dashboardTitleSection}>
        <Text style={styles.dashboardTitle}>Dashboard</Text>
        <Text style={styles.dashboardSubtitle}>Manage your inventory and sessions</Text>
      </View>

      {/* Summary Statistics */}
      <View style={styles.summaryStatsContainer}>
        <Card style={styles.summaryCard}>
          <View style={styles.summaryCardIcon}>
            <Text style={styles.summaryCardIconText}>📋</Text>
          </View>
          <Text style={styles.summaryCardNumber}>{activeSessions}</Text>
          <Text style={styles.summaryCardLabel}>Active Sessions</Text>
        </Card>

        <Card style={styles.summaryCard}>
          <View style={styles.summaryCardIcon}>
            <Text style={styles.summaryCardIconText}>📷</Text>
          </View>
          <Text style={[styles.summaryCardNumber, styles.summaryCardNumberSecondary]}>
            {pendingResponses}
          </Text>
          <Text style={styles.summaryCardLabel}>Pending Responses</Text>
        </Card>
      </View>

      {/* Quick Actions */}
      <Section title="Quick Actions" style={styles.section}>
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.quickActionButtonPrimary}>
            <View style={styles.quickActionIconContainer}>
              <Text style={styles.quickActionIconText}>🛒</Text>
            </View>
            <Text style={styles.quickActionTitlePrimary}>Post Buy Req</Text>
            <Text style={styles.quickActionSubtitlePrimary}>Find Materials</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionButtonSecondary}>
            <View style={styles.quickActionIconContainerSecondary}>
              <Text style={styles.quickActionIconTextSecondary}>🏷️</Text>
            </View>
            <Text style={styles.quickActionTitleSecondary}>Post Sell Offer</Text>
            <Text style={styles.quickActionSubtitleSecondary}>List Inventory</Text>
          </TouchableOpacity>
        </View>
      </Section>

      {/* Recent Sessions */}
      <View style={styles.recentSessionsHeader}>
        <Text style={styles.recentSessionsTitle}>Recent Sessions</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllLink}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.recentSessionsContainer}>
        {recentSessions.map((session) => (
          <Card key={session.id} style={styles.sessionCard}>
            <View style={styles.sessionCardLeft}>
              <View style={styles.sessionIcon}>
                <Text style={styles.sessionIconText}>📦</Text>
              </View>
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionMaterial}>
                  {session.material} - {session.quantity}
                </Text>
                <Text style={styles.sessionDescription}>
                  {session.description} • {session.time}
                </Text>
              </View>
            </View>
            <View style={[styles.sessionStatusBadge, { backgroundColor: session.statusColor }]}>
              <Text style={styles.sessionStatusText}>{session.status}</Text>
            </View>
          </Card>
        ))}
      </View>

      {/* Additional Cards */}
      <View style={styles.additionalCardsContainer}>
        <Card style={styles.additionalCard} onPress={() => {}}>
          <View style={styles.additionalCardIcon}>
            <Text style={styles.additionalCardIconText}>🏭</Text>
          </View>
          <Text style={styles.additionalCardTitle}>Warehouse</Text>
          <Text style={styles.additionalCardSubtitle}>Manage Profile</Text>
          <Text style={styles.additionalCardInfo}>80% Full</Text>
        </Card>

        <Card style={styles.additionalCard} onPress={() => {}}>
          <View style={styles.additionalCardIcon}>
            <Text style={styles.additionalCardIconText}>🕐</Text>
          </View>
          <Text style={styles.additionalCardTitle}>History</Text>
          <Text style={styles.additionalCardSubtitle}>Past Deals</Text>
        </Card>
      </View>

      {/* Market Insight */}
      <Card style={styles.marketInsightCard}>
        <Text style={styles.marketInsightLabel}>MARKET INSIGHT</Text>
        <Text style={styles.marketInsightTitle}>Polymers demand rising in Q3</Text>
        <TouchableOpacity style={styles.marketInsightLink}>
          <Text style={styles.marketInsightLinkText}>Read Report</Text>
          <AppIcon.ArrowRight width={16} height={16} />
        </TouchableOpacity>
      </Card>
    </ScrollView>
  );
};

