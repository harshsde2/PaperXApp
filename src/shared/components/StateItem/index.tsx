import React, { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { StateItemProps } from './@types';
import { createStyles } from './styles';

export const StateItem = memo(({ item, isSelected, onSelect, theme }: StateItemProps) => {
  const styles = createStyles(theme);

  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.containerSelected]}
      onPress={() => onSelect(item.name)}
      activeOpacity={0.7}
    >
      <Text
        variant="bodyMedium"
        style={[styles.text, isSelected && styles.textSelected]}
      >
        {item.name}
      </Text>
      {isSelected && (
        <AppIcon.TickCheckedBox width={20} height={20} color={theme.colors.primary.DEFAULT} />
      )}
    </TouchableOpacity>
  );
});
