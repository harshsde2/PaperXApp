import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';

interface Inquiry {
  id: string;
  title: string;
  brand: string;
  quantity: string;
  specifications: string[];
  status: 'MATCHING' | 'OPEN' | 'CLOSED' | 'NEW';
  time: string;
  matchCount?: number;
  urgency: 'URGENT' | 'NORMAL';
}

const mockInquiries: Inquiry[] = [
  {
    id: '1',
    title: '50k Units - Flexible Pouch',
    brand: 'Organic Co.',
    quantity: '50k units',
    specifications: ['Recycled PET', 'Food Grade', 'Barrier'],
    status: 'MATCHING',
    time: '2h ago',
    matchCount: 3,
    urgency: 'URGENT',
  },
  {
    id: '2',
    title: 'Industrial Cardboard Boxes',
    brand: 'Heavy Duty Ltd.',
    quantity: '5000 units',
    specifications: ['Corrugated', 'Heavy Duty'],
    status: 'OPEN',
    time: 'Yesterday',
    urgency: 'NORMAL',
  },
  {
    id: '3',
    title: 'HDPE Bottles 500ml',
    brand: 'BevCo',
    quantity: '10000 units',
    specifications: ['HDPE', 'Food Grade', 'Recyclable'],
    status: 'CLOSED',
    time: 'Oct 24',
    matchCount: 1,
    urgency: 'NORMAL',
  },
];

const InquiriesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'closed'>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'MATCHING':
        return { bg: '#DCFCE7', text: '#16A34A' };
      case 'OPEN':
        return { bg: '#E0E7FF', text: '#4F46E5' };
      case 'CLOSED':
        return { bg: '#F3F4F6', text: '#6B7280' };
      case 'NEW':
        return { bg: '#FEF3C7', text: '#D97706' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  const renderInquiryCard = ({ item }: { item: Inquiry }) => {
    const statusColors = getStatusColor(item.status);
    
    return (
      <TouchableOpacity style={styles.inquiryCard} activeOpacity={0.7}>
        {item.urgency === 'URGENT' && (
          <View style={styles.urgentBadge}>
            <Text style={styles.urgentText}>URGENT</Text>
          </View>
        )}
        
        <View style={styles.cardHeader}>
          <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColors.text }]} />
            <Text style={[styles.statusText, { color: statusColors.text }]}>{item.status}</Text>
          </View>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>

        <Text style={styles.inquiryTitle}>{item.title}</Text>
        
        <View style={styles.specsContainer}>
          {item.specifications.map((spec, index) => (
            <View key={index} style={styles.specBadge}>
              <Text style={styles.specText}>{spec}</Text>
            </View>
          ))}
        </View>

        {item.matchCount !== undefined && item.status !== 'CLOSED' && (
          <TouchableOpacity style={styles.matchButton}>
            <View style={styles.avatarStack}>
              {[...Array(Math.min(item.matchCount, 3))].map((_, i) => (
                <View key={i} style={[styles.miniAvatar, { marginLeft: i > 0 ? -8 : 0 }]}>
                  <Text style={styles.miniAvatarText}>S</Text>
                </View>
              ))}
              {item.matchCount > 3 && (
                <View style={[styles.miniAvatar, styles.miniAvatarMore, { marginLeft: -8 }]}>
                  <Text style={styles.miniAvatarMoreText}>+{item.matchCount - 3}</Text>
                </View>
              )}
            </View>
            <Text style={styles.matchText}>View {item.matchCount} Matches</Text>
            <AppIcon.ChevronRight width={16} height={16} color="#2563EB" />
          </TouchableOpacity>
        )}

        {item.status === 'CLOSED' && (
          <View style={styles.closedInfo}>
            <Text style={styles.closedText}>Matched with Converter #{Math.floor(Math.random() * 9000) + 1000}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Inquiries</Text>
        <TouchableOpacity style={styles.filterButton}>
          <AppIcon.Search width={24} height={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {['all', 'active', 'closed'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Inquiries List */}
      <FlatList
        data={mockInquiries}
        renderItem={renderInquiryCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  filterButton: {
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
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  tabActive: {
    backgroundColor: '#111827',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 20,
  },
  inquiryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
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
  urgentText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#DC2626',
    letterSpacing: 0.5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  timeText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  inquiryTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  specsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  specBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  specText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  matchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
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
    fontWeight: '600',
    color: '#4F46E5',
  },
  miniAvatarMore: {
    backgroundColor: '#F3F4F6',
  },
  miniAvatarMoreText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
  },
  matchText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  closedInfo: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  closedText: {
    fontSize: 13,
    color: '#6B7280',
  },
});

export default InquiriesScreen;
