import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';

const { width } = Dimensions.get('window');

interface MarketItem {
  id: string;
  material: string;
  grade: string;
  price: string;
  change: string;
  isUp: boolean;
  unit: string;
}

const mockMarketData: MarketItem[] = [
  { id: '1', material: 'LDPE', grade: 'Film Grade', price: '₹98,500', change: '+2.3%', isUp: true, unit: '/MT' },
  { id: '2', material: 'HDPE', grade: 'Injection', price: '₹102,200', change: '-1.2%', isUp: false, unit: '/MT' },
  { id: '3', material: 'PP', grade: 'Raffia', price: '₹95,800', change: '+0.8%', isUp: true, unit: '/MT' },
  { id: '4', material: 'PET', grade: 'Bottle Grade', price: '₹88,400', change: '+3.1%', isUp: true, unit: '/MT' },
  { id: '5', material: 'PVC', grade: 'Rigid', price: '₹78,600', change: '-0.5%', isUp: false, unit: '/MT' },
];

interface InsightCard {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
}

const mockInsights: InsightCard[] = [
  {
    id: '1',
    title: 'Polymer prices expected to rise in Q2',
    description: 'Industry experts predict a 5-8% increase due to supply constraints...',
    category: 'Analysis',
    readTime: '3 min read',
  },
  {
    id: '2',
    title: 'New recycling regulations announced',
    description: 'Government mandates 30% recycled content in packaging by 2027...',
    category: 'Regulatory',
    readTime: '5 min read',
  },
];

const MarketScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<'prices' | 'insights'>('prices');

  const renderPriceCard = (item: MarketItem) => (
    <View key={item.id} style={styles.priceCard}>
      <View style={styles.priceCardLeft}>
        <View style={styles.materialBadge}>
          <Text style={styles.materialText}>{item.material}</Text>
        </View>
        <Text style={styles.gradeText}>{item.grade}</Text>
      </View>
      <View style={styles.priceCardRight}>
        <Text style={styles.priceText}>{item.price}<Text style={styles.unitText}>{item.unit}</Text></Text>
        <View style={[styles.changeBadge, item.isUp ? styles.changeUp : styles.changeDown]}>
          <Text style={[styles.changeText, item.isUp ? styles.changeTextUp : styles.changeTextDown]}>
            {item.change}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderInsightCard = (item: InsightCard) => (
    <TouchableOpacity key={item.id} style={styles.insightCard} activeOpacity={0.7}>
      <View style={styles.insightCategory}>
        <Text style={styles.categoryText}>{item.category}</Text>
      </View>
      <Text style={styles.insightTitle}>{item.title}</Text>
      <Text style={styles.insightDescription} numberOfLines={2}>{item.description}</Text>
      <Text style={styles.readTime}>{item.readTime}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Market</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <AppIcon.Notification width={24} height={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'prices' && styles.tabActive]}
          onPress={() => setSelectedTab('prices')}
        >
          <Text style={[styles.tabText, selectedTab === 'prices' && styles.tabTextActive]}>
            Live Prices
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'insights' && styles.tabActive]}
          onPress={() => setSelectedTab('insights')}
        >
          <Text style={[styles.tabText, selectedTab === 'insights' && styles.tabTextActive]}>
            Insights
          </Text>
          <View style={styles.tabBadge}>
            <Text style={styles.tabBadgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {selectedTab === 'prices' ? (
          <>
            <View style={styles.updateInfo}>
              <Text style={styles.updateText}>Last updated: 10 mins ago</Text>
              <TouchableOpacity>
                <Text style={styles.refreshText}>Refresh</Text>
              </TouchableOpacity>
            </View>
            {mockMarketData.map(renderPriceCard)}
          </>
        ) : (
          mockInsights.map(renderInsightCard)
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
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
  tabBadge: {
    marginLeft: 6,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  updateInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  updateText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  refreshText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
  priceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  priceCardLeft: {
    flex: 1,
  },
  materialBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6,
  },
  materialText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4F46E5',
  },
  gradeText: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceCardRight: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  unitText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9CA3AF',
  },
  changeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  changeUp: {
    backgroundColor: '#DCFCE7',
  },
  changeDown: {
    backgroundColor: '#FEE2E2',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  changeTextUp: {
    color: '#16A34A',
  },
  changeTextDown: {
    color: '#DC2626',
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  insightCategory: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D97706',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  insightTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    lineHeight: 24,
  },
  insightDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  readTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});

export default MarketScreen;
