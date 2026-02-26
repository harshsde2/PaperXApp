import React, { memo, useCallback } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import type { RTDFilterBarProps, RTDFilterConfig, RTDFilterKey } from './@types';
import { createStyles } from './styles';

const FILTER_CONFIG: RTDFilterConfig[] = [
  { key: 'category', label: 'Category' ,icon:AppIcon.ChevronDown},
  { key: 'leadTime', label: 'Lead Time' ,icon:AppIcon.ChevronDown},
  { key: 'moq', label: 'MOQ' ,icon:AppIcon.ChevronDown},
  { key: 'price', label: 'Price' ,icon:AppIcon.ChevronDown},
  { key: 'filter', label: 'Filter' ,icon:AppIcon.Filter},
];

export const RTDFilterBar = memo<RTDFilterBarProps>(
  function RTDFilterBar({ filters, onFilterChange }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    const renderChip = useCallback(
      ({ key, label, icon }: RTDFilterConfig) => {
        const isActive = filters[key] != null;
        const Icon = icon;  

        return (
          <Pressable
            key={key}
            onPress={() => onFilterChange(key)}
            style={[
              styles.chip,
              isActive ? styles.chipActive : styles.chipInactive,
            ]}
          >
            <Text
              variant="captionLarge"
              style={
                isActive ? styles.chipTextActive : styles.chipTextInactive
              }
            >
              {label}
            </Text>
            <Icon width={14} height={14} color={isActive ? theme.colors.primary.DEFAULT : theme.colors.text.tertiary} />
              {/* <AppIcon.ChevronDown
                width={14}
                height={14}
                color={
                  isActive
                    ? (theme.colors.primary.DEFAULT as string)
                    : (theme.colors.text.tertiary as string)
                }
              /> */}
          </Pressable>
        );
      },
      [filters, onFilterChange, styles, theme],
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
