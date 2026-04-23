import React, { useMemo } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@shared/components/Text';
import { useTheme } from '@theme/index';
import type { FilterChipRowProps } from './@types';
import { createStyles } from './styles';

export const FilterChipRow: React.FC<FilterChipRowProps> = ({
  chips,
  activeFilter,
  onSelectFilter,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <ScrollView
      horizontal
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsHorizontalScrollIndicator={false}
    >
      {chips.map((chip) => {
        const isActive = chip.label === activeFilter;
        return (
          <TouchableOpacity
            key={chip.label}
            activeOpacity={0.75}
            onPress={() => onSelectFilter(chip.label)}
            style={[
              styles.chip,
              {
                borderColor: isActive ? theme.colors.primary.DEFAULT : theme.colors.border.primary,
                backgroundColor: isActive
                  ? theme.colors.primary.DEFAULT
                  : theme.colors.surface.primary,
              },
            ]}
          >
            <Text
              variant="captionMedium"
              style={[
                styles.chipLabel,
                { color: isActive ? theme.colors.text.inverse : theme.colors.primary.DEFAULT },
              ]}
            >
              {chip.label}
            </Text>
            <Text
              variant="captionSmall"
              style={[
                styles.chipCount,
                { color: isActive ? theme.colors.text.inverse : theme.colors.text.tertiary },
              ]}
            >
              {chip.count}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default FilterChipRow;
