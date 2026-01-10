import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';

const { width } = Dimensions.get('window');

interface CapacityData {
  current: number;
  max: number;
  unit: string;
  status: 'Available' | 'Busy' | 'Full';
}

const CapacityScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<'Available' | 'Busy' | 'Full'>('Available');

  const capacityData: CapacityData = {
    current: 75,
    max: 100,
    unit: '%',
    status: currentStatus,
  };

  const machines = [
    { id: '1', name: 'Flexo Printing Machine', capacity: 80, status: 'Active', jobs: 3 },
    { id: '2', name: 'Lamination Unit', capacity: 65, status: 'Active', jobs: 2 },
    { id: '3', name: 'Slitting Machine', capacity: 45, status: 'Idle', jobs: 0 },
    { id: '4', name: 'Bag Making Unit', capacity: 90, status: 'Active', jobs: 4 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return { bg: '#DCFCE7', text: '#16A34A', dot: '#22C55E' };
      case 'Busy':
        return { bg: '#FEF3C7', text: '#D97706', dot: '#F59E0B' };
      case 'Full':
        return { bg: '#FEE2E2', text: '#DC2626', dot: '#EF4444' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280', dot: '#9CA3AF' };
    }
  };

  const statusColor = getStatusColor(capacityData.status);
  const progressPercentage = (capacityData.current / capacityData.max) * 100;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Capacity</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <AppIcon.Settings width={24} height={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>Production Status</Text>
            <TouchableOpacity 
              style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}
              onPress={() => setStatusDropdownOpen(!statusDropdownOpen)}
            >
              <View style={[styles.statusDot, { backgroundColor: statusColor.dot }]} />
              <Text style={[styles.statusText, { color: statusColor.text }]}>{currentStatus}</Text>
              <AppIcon.ChevronDown width={16} height={16} color={statusColor.text} />
            </TouchableOpacity>
          </View>

          {statusDropdownOpen && (
            <View style={styles.statusDropdown}>
              {(['Available', 'Busy', 'Full'] as const).map((status) => {
                const colors = getStatusColor(status);
                return (
                  <TouchableOpacity
                    key={status}
                    style={styles.statusOption}
                    onPress={() => {
                      setCurrentStatus(status);
                      setStatusDropdownOpen(false);
                    }}
                  >
                    <View style={[styles.statusDot, { backgroundColor: colors.dot }]} />
                    <Text style={styles.statusOptionText}>{status}</Text>
                    {currentStatus === status && (
                      <AppIcon.TickCheckedBox width={18} height={18} color="#2563EB" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Capacity Gauge */}
          <View style={styles.gaugeContainer}>
            <View style={styles.gaugeCircle}>
              <View style={styles.gaugeInner}>
                <Text style={styles.gaugeValue}>{capacityData.current}</Text>
                <Text style={styles.gaugeUnit}>{capacityData.unit}</Text>
              </View>
              <View style={[styles.gaugeProgress, { width: `${progressPercentage}%` }]} />
            </View>
          </View>

          <Text style={styles.capacityInfo}>
            You are at <Text style={styles.capacityHighlight}>{capacityData.current}%</Text> capacity. 
            Increase visibility to receive more inquiries.
          </Text>

          <TouchableOpacity style={styles.adjustButton}>
            <Text style={styles.adjustButtonText}>Adjust Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Machine Utilization */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Machine Utilization</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {machines.map((machine) => (
          <View key={machine.id} style={styles.machineCard}>
            <View style={styles.machineHeader}>
              <View style={styles.machineIcon}>
                <AppIcon.Process width={24} height={24} color="#4F46E5" />
              </View>
              <View style={styles.machineInfo}>
                <Text style={styles.machineName}>{machine.name}</Text>
                <Text style={styles.machineJobs}>{machine.jobs} active jobs</Text>
              </View>
              <View style={[
                styles.machineStatusBadge,
                { backgroundColor: machine.status === 'Active' ? '#DCFCE7' : '#F3F4F6' }
              ]}>
                <Text style={[
                  styles.machineStatusText,
                  { color: machine.status === 'Active' ? '#16A34A' : '#6B7280' }
                ]}>
                  {machine.status}
                </Text>
              </View>
            </View>
            
            <View style={styles.machineProgressContainer}>
              <View style={styles.machineProgressBar}>
                <View 
                  style={[
                    styles.machineProgressFill,
                    { 
                      width: `${machine.capacity}%`,
                      backgroundColor: machine.capacity > 80 ? '#EF4444' : machine.capacity > 60 ? '#F59E0B' : '#22C55E'
                    }
                  ]} 
                />
              </View>
              <Text style={styles.machineCapacityText}>{machine.capacity}%</Text>
            </View>
          </View>
        ))}
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
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    marginRight: 6,
  },
  statusDropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  statusOptionText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    marginLeft: 10,
  },
  gaugeContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  gaugeCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  gaugeInner: {
    alignItems: 'center',
    zIndex: 1,
  },
  gaugeValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#111827',
  },
  gaugeUnit: {
    fontSize: 18,
    color: '#6B7280',
    marginTop: -4,
  },
  gaugeProgress: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: '100%',
    backgroundColor: '#E0E7FF',
    opacity: 0.5,
  },
  capacityInfo: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  capacityHighlight: {
    fontWeight: '700',
    color: '#111827',
  },
  adjustButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  adjustButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
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
  machineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  machineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  machineIcon: {
    width: 48,
    height: 48,
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
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  machineJobs: {
    fontSize: 13,
    color: '#6B7280',
  },
  machineStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  machineStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  machineProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  machineProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginRight: 12,
    overflow: 'hidden',
  },
  machineProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  machineCapacityText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    width: 40,
    textAlign: 'right',
  },
});

export default CapacityScreen;
