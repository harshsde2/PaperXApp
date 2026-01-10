import React, { memo, useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { BrandItemProps } from './@types';
import { createStyles } from './styles';

export const BrandItem = memo(({ item, isSelected, onSelect, theme }: BrandItemProps) => {
  const styles = createStyles(theme);

  const handlePress = useCallback(() => {
    onSelect(item);
  }, [item, onSelect]);

  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.containerSelected]}
      onPress={handlePress}
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

BrandItem.displayName = 'BrandItem';

export type { BrandItemData, BrandItemProps } from './@types';
