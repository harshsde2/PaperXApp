import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';

interface Session {
  id: string;
  machineName: string;
  machineType: string;
  buyerName: string;
  buyerCompany: string;
  status: 'ACTIVE' | 'NEGOTIATION' | 'PENDING' | 'COMPLETED';
  stage: string;
  lastUpdate: string;
  price?: string;
  image?: string;
}

const mockSessions: Session[] = [
  {
    id: '1',
    machineName: 'Flexo Printing Press 6C',
    machineType: 'Printing',
    buyerName: 'Rajesh Kumar',
    buyerCompany: 'PrintPack Solutions',
    status: 'NEGOTIATION',
    stage: 'Price Discussion',
    lastUpdate: '30m ago',
    price: '₹45,00,000',
  },
  {
    id: '2',
    machineName: 'Lamination Machine',
    machineType: 'Finishing',
    buyerName: 'Anita Sharma',
    buyerCompany: 'FlexiFilm Corp',
    status: 'ACTIVE',
    stage: 'Document Verification',
    lastUpdate: '2h ago',
    price: '₹28,00,000',
  },
  {
    id: '3',
    machineName: 'Rotogravure Unit',
    machineType: 'Printing',
    buyerName: 'Vikram Singh',
    buyerCompany: 'Premium Packaging',
    status: 'PENDING',
    stage: 'Awaiting Response',
    lastUpdate: '1d ago',
    price: '₹62,00,000',
  },
  {
    id: '4',
    machineName: 'Bag Making Machine',
    machineType: 'Converting',
    buyerName: 'Meera Patel',
    buyerCompany: 'EcoBags Ltd',
    status: 'COMPLETED',
    stage: 'Deal Closed',
    lastUpdate: '3d ago',
    price: '₹18,00,000',
  },
];

const SessionsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return { bg: '#DCFCE7', text: '#16A34A' };
      case 'NEGOTIATION':
        return { bg: '#FEF3C7', text: '#D97706' };
      case 'PENDING':
        return { bg: '#E0E7FF', text: '#4F46E5' };
      case 'COMPLETED':
        return { bg: '#F3F4F6', text: '#6B7280' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  const renderSessionCard = ({ item }: { item: Session }) => {
    const statusColors = getStatusColor(item.status);
    
    return (
      <TouchableOpacity style={styles.sessionCard} activeOpacity={0.7}>
        {/* Machine Info */}
        <View style={styles.machineSection}>
          <View style={styles.machineImagePlaceholder}>
            <AppIcon.MachineDealer width={32} height={32} color="#4F46E5" />
          </View>
          <View style={styles.machineInfo}>
            <Text style={styles.machineName}>{item.machineName}</Text>
            <Text style={styles.machineType}>{item.machineType}</Text>
          </View>
          {item.price && (
            <Text style={styles.priceText}>{item.price}</Text>
          )}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Buyer Info */}
        <View style={styles.buyerSection}>
          <View style={styles.buyerAvatar}>
            <Text style={styles.buyerAvatarText}>{item.buyerName.charAt(0)}</Text>
          </View>
          <View style={styles.buyerInfo}>
            <Text style={styles.buyerName}>{item.buyerName}</Text>
            <Text style={styles.buyerCompany}>{item.buyerCompany}</Text>
          </View>
        </View>

        {/* Status Footer */}
        <View style={styles.statusSection}>
          <View style={styles.stageInfo}>
            <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
              <Text style={[styles.statusText, { color: statusColors.text }]}>{item.status}</Text>
            </View>
            <Text style={styles.stageText}>{item.stage}</Text>
          </View>
          <Text style={styles.updateText}>{item.lastUpdate}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const filteredSessions = mockSessions.filter(session => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return ['ACTIVE', 'NEGOTIATION', 'PENDING'].includes(session.status);
    if (activeTab === 'completed') return session.status === 'COMPLETED';
    return true;
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Sessions</Text>
        <TouchableOpacity style={styles.filterButton}>
          <AppIcon.Search width={24} height={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {mockSessions.filter(s => s.status !== 'COMPLETED').length}
          </Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {mockSessions.filter(s => s.status === 'NEGOTIATION').length}
          </Text>
          <Text style={styles.statLabel}>Negotiating</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {mockSessions.filter(s => s.status === 'COMPLETED').length}
          </Text>
          <Text style={styles.statLabel}>Closed</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {(['all', 'active', 'completed'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sessions List */}
      <FlatList
        data={filteredSessions}
        renderItem={renderSessionCard}
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
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
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
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  machineSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  machineImagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  machineInfo: {
    flex: 1,
  },
  machineName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  machineType: {
    fontSize: 13,
    color: '#6B7280',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16A34A',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 14,
  },
  buyerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  buyerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  buyerAvatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
  },
  buyerInfo: {
    flex: 1,
  },
  buyerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  buyerCompany: {
    fontSize: 13,
    color: '#6B7280',
  },
  statusSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  stageText: {
    fontSize: 13,
    color: '#6B7280',
  },
  updateText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});

export default SessionsScreen;
