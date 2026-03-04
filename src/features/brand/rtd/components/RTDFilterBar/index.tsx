import React, { memo, useCallback } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import type { RTDFilterBarProps, RTDFilterConfig, RTDFilterKey } from './@types';
import { createStyles } from './styles';

const FILTER_CONFIG: RTDFilterConfig[] = [
  // { key: 'category', label: 'Category', icon: AppIcon.ChevronDown },
  // { key: 'leadTime', label: 'Lead Time', icon: AppIcon.ChevronDown },
  // { key: 'moq', label: 'MOQ', icon: AppIcon.ChevronDown },
  // { key: 'price', label: 'Price', icon: AppIcon.ChevronDown },
  { key: 'filter', label: 'Filter', icon: AppIcon.Filter },
];

export const RTDFilterBar = memo<RTDFilterBarProps>(
  function RTDFilterBar({ filters, onFilterChange, onFilterPress, activeFilterCount = 0 }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    const handleChipPress = useCallback(
      (key: RTDFilterKey) => {
        if (key === 'filter' && onFilterPress) {
          onFilterPress();
          return;
        }
        onFilterChange(key);
      },
      [onFilterChange, onFilterPress],
    );

    const renderChip = useCallback(
      ({ key, label, icon }: RTDFilterConfig) => {
        const isFilterChip = key === 'filter';
        const isActive = isFilterChip ? activeFilterCount > 0 : filters[key] != null;
        const Icon = icon;

        return (
          <Pressable
            key={key}
            onPress={() => handleChipPress(key)}
            style={[
              styles.chip,
              isActive ? styles.chipActive : styles.chipInactive,
            ]}
          >
            <Text
              variant="captionLarge"
              style={isActive ? styles.chipTextActive : styles.chipTextInactive}
            >
              {label}
            </Text>
            {isFilterChip && activeFilterCount > 0 && (
              <View style={styles.badge}>
                <Text variant="captionSmall" style={styles.badgeText}>
                  {activeFilterCount}
                </Text>
              </View>
            )}
            <Icon
              width={14}
              height={14}
              color={isActive ? theme.colors.primary.DEFAULT : theme.colors.text.tertiary}
            />
          </Pressable>
        );
      },
      [filters, handleChipPress, activeFilterCount, styles, theme],
    );

    return (
      <View style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {FILTER_CONFIG.map(renderChip)}
        </ScrollView>
      </View>
    );
  },
);
