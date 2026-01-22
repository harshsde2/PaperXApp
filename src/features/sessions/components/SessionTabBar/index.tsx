/**
 * SessionTabBar Component
 * Horizontal scrollable tab bar for session filtering
 */

import React, { useCallback } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { SessionTabType } from '../../@types';
import { SessionTabBarProps, TabItem } from './@types';
import { createStyles } from './styles';

const DEFAULT_TABS: TabItem[] = [
  { key: 'all', label: 'All' },
  { key: 'finding_matches', label: 'Finding Matches' },
  { key: 'active', label: 'Active' },
  { key: 'locked', label: 'Locked' },
];

export const SessionTabBar: React.FC<SessionTabBarProps> = ({
  activeTab,
  onTabChange,
  tabs = DEFAULT_TABS,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const handleTabPress = useCallback(
    (tab: SessionTabType) => {
      onTabChange(tab);
    },
    [onTabChange]
  );

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabItem, isActive && styles.tabItemActive]}
              onPress={() => handleTabPress(tab.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.tabText, isActive && styles.tabTextActive]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default SessionTabBar;
