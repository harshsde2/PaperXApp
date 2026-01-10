import React from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import type { MachineDealerDashboardData } from '@services/api';

const { width } = Dimensions.get('window');

interface MachineDealerDashboardViewProps {
  profileData: any;
  dashboardData?: MachineDealerDashboardData;
}

export const MachineDealerDashboardView: React.FC<MachineDealerDashboardViewProps> = ({ profileData, dashboardData: apiData }) => {
  const navigation = useNavigation<any>();
  const companyName = profileData?.company_name || 'Industrial Solutions';

  // Use API data with fallback to default values
  const dashboardData = {
    greeting: `Hello, ${companyName}`,
    subtitle: "Here is what's happening today.",
    overview: [
      {
        id: '1',
        title: 'Buy Requests',
        subtitle: 'OPPORTUNITIES',
        count: apiData?.opportunities ?? 0,
        image: 'blueprints',
      },
      {
        id: '2',
        title: 'Active Sessions',
        subtitle: 'NEGOTIATIONS',
        count: apiData?.activeSessions ?? 0,
        badge: 'Active',
        image: 'negotiations',
      },
      {
        id: '3',
        title: 'Responses',
        subtitle: 'ACTIVITY',
        count: apiData?.responses ?? 0,
        image: 'responses',
      },
      {
        id: '4',
        title: 'My Inventory',
        subtitle: 'MANAGE',
        count: apiData?.inventoryCount,
        image: 'inventory',
      },
    ],
  };

  const renderOverviewCard = (item: any, index: number) => {
    const isLarge = index < 2;
    
    return (
      <TouchableOpacity 
        key={item.id} 
        style={[
          styles.overviewCard,
          isLarge && styles.overviewCardLarge,
          { backgroundColor: getCardColor(index) }
        ]}
        activeOpacity={0.85}
      >
        <View style={styles.cardOverlay} />
        
        {item.count !== undefined && (
          <View style={styles.cardBadge}>
            <AppIcon.Messages width={12} height={12} color="#FFFFFF" />
            <Text style={styles.cardBadgeText}>{item.count}</Text>
          </View>
        )}

        {item.badge && (
          <View style={styles.activeBadge}>
            <View style={styles.activeDot} />
            <Text style={styles.activeBadgeText}>{item.badge}</Text>
          </View>
        )}

        <View style={styles.cardContent}>
          <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
          <Text style={styles.cardTitle}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const getCardColor = (index: number) => {
    const colors = ['#374151', '#64748B', '#475569', '#6B7280'];
    return colors[index % colors.length];
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>{dashboardData.greeting}</Text>
        <Text style={styles.subtitle}>{dashboardData.subtitle}</Text>
      </View>

      {/* New Listing Card */}
      <View style={styles.newListingCard}>
        <View style={styles.newListingHeader}>
          <View style={styles.newListingBadge}>
            <AppIcon.Inquiries width={14} height={14} color="#2563EB" />
            <Text style={styles.newListingBadgeText}>NEW LISTING</Text>
          </View>
        </View>
        <Text style={styles.newListingTitle}>Sell Machinery</Text>
        <Text style={styles.newListingDescription}>
          List a new machine for private matching with qualified buyers. No public listings.
        </Text>
        <TouchableOpacity style={styles.postButton} activeOpacity={0.85}>
          <Text style={styles.postButtonText}>Post Machine for Sale</Text>
        </TouchableOpacity>
      </View>

      {/* Overview Section */}
      <View style={styles.overviewSection}>
        <View style={styles.overviewHeader}>
          <Text style={styles.overviewTitle}>Overview</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.overviewGrid}>
          {dashboardData.overview.slice(0, 2).map((item, index) => renderOverviewCard(item, index))}
        </View>
        <View style={styles.overviewGrid}>
          {dashboardData.overview.slice(2, 4).map((item, index) => renderOverviewCard(item, index + 2))}
        </View>
      </View>

      {/* Support Card */}
      <View style={styles.supportSection}>
        <Text style={styles.supportText}>Need assistance with a listing?</Text>
        <TouchableOpacity>
          <Text style={styles.supportLink}>Contact Support</Text>
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
  newListingCard: {
    marginHorizontal: 20,
    marginVertical: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  newListingHeader: {
    marginBottom: 12,
  },
  newListingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
  },
  newListingBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 0.5,
  },
  newListingTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  newListingDescription: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 20,
  },
  postButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  postButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  overviewSection: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  overviewGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  overviewCard: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'flex-end',
    position: 'relative',
    overflow: 'hidden',
  },
  overviewCardLarge: {
    aspectRatio: 1,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  cardBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  cardBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  activeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22C55E',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  activeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardContent: {
    zIndex: 1,
  },
  cardSubtitle: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  supportSection: {
    alignItems: 'center',
    paddingVertical: 24,
    marginTop: 8,
  },
  supportText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  supportLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
});
