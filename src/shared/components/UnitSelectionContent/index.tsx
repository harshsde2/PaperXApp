import React, { memo, useCallback } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from '@shared/components/Text';
import { UnitSelectionContentProps } from './@types';
import { createStyles } from './styles';

export const UnitSelectionContent = memo(({
  units,
  selectedUnit,
  onSelect,
  theme,
  title = 'Select Unit',
}: UnitSelectionContentProps) => {
  const styles = createStyles(theme);

  const handleSelect = useCallback(
    (unit: string) => {
      onSelect(unit);
    },
    [onSelect]
  );

  return (
    <View style={styles.container}>
      <Text variant="h4" fontWeight="semibold" style={styles.title}>
        {title}
      </Text>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {units.map((unitOption) => {
          const isSelected = selectedUnit === unitOption;
          return (
            <TouchableOpacity
              key={unitOption}
              style={[
                styles.optionButton,
                isSelected ? styles.optionButtonSelected : styles.optionButtonDefault,
              ]}
              onPress={() => handleSelect(unitOption)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.radioButton,
                  isSelected ? styles.radioButtonSelected : styles.radioButtonDefault,
                ]}
              >
                {isSelected && <View style={styles.radioButtonInner} />}
              </View>
              <Text
                variant="bodyMedium"
                fontWeight={isSelected ? 'semibold' : 'regular'}
                style={isSelected ? styles.optionTextSelected : styles.optionText}
              >
                {unitOption}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
});

UnitSelectionContent.displayName = 'UnitSelectionContent';

export type { UnitSelectionContentProps } from './@types';
