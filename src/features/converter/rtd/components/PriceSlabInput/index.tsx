import React, { useCallback } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { Text } from '@shared/components/Text';
import { CustomButton } from '@shared/components/CustomButton';
import { useTheme } from '@theme/index';
import { AppIcon } from '@assets/svgs';
import type { PriceSlabInputProps, PriceSlabRow } from './@types';
import { createStyles } from './styles';

export type { PriceSlabRow } from './@types';

export const PriceSlabInput: React.FC<PriceSlabInputProps> = ({
  slabs,
  onSlabsChange,
  errors = [],
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const handleFieldChange = useCallback(
    (index: number, field: keyof PriceSlabRow, value: string) => {
      const next = [...slabs];
      next[index] = { ...next[index], [field]: value };
      onSlabsChange(next);
    },
    [slabs, onSlabsChange]
  );

  const handleAddSlab = useCallback(() => {
    onSlabsChange([
      ...slabs,
      { min_qty: '', max_qty: '', price_per_unit: '' },
    ]);
  }, [slabs, onSlabsChange]);

  const handleRemoveSlab = useCallback(
    (index: number) => {
      if (slabs.length <= 1) return;
      const next = slabs.filter((_, i) => i !== index);
      onSlabsChange(next);
    },
    [slabs, onSlabsChange]
  );

  return (
    <View style={styles.container}>
      {slabs.map((slab, index) => (
        <View key={index} style={styles.row}>
          <View style={styles.inputContainer}>
            <Text variant="captionSmall" style={styles.inputLabel}>
             If  Min Qty is
            </Text>
            <TextInput
              value={slab.min_qty}
              onChangeText={(v) => handleFieldChange(index, 'min_qty', v)}
              placeholder="0"
              placeholderTextColor={theme.colors.text.placeholder}
              keyboardType="numeric"
              // returnKeyType="done"
              style={styles.input}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text variant="captionSmall" style={styles.inputLabel}>
            and Max Qty is
            </Text>
            <TextInput
              value={slab.max_qty}
              onChangeText={(v) => handleFieldChange(index, 'max_qty', v)}
              placeholder="0"
              placeholderTextColor={theme.colors.text.placeholder}
              keyboardType="numeric"
              // returnKeyType="done"
              style={styles.input}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text variant="captionSmall" style={styles.inputLabel}>
             =  Price/Unit
            </Text>
            <TextInput
              value={slab.price_per_unit}
              onChangeText={(v) =>
                handleFieldChange(index, 'price_per_unit', v)
              }
              placeholder="0"
              placeholderTextColor={theme.colors.text.placeholder}
              keyboardType="numeric"
              // returnKeyType="done"
              style={styles.input}
            />
          </View>
          {slabs.length > 1 && (
            <Pressable
              onPress={() => handleRemoveSlab(index)}
              style={styles.deleteButton}
              hitSlop={8}
            >
              <AppIcon.Close
                width={20}
                height={20}
                color={theme.colors.error.DEFAULT}
              />
            </Pressable>
          )}
        </View>
      ))}
      <CustomButton
        title="Add Slab"
        onPress={handleAddSlab}
        variant="outline"
        size="sm"
        style={styles.addButton}
      />
      {errors.length > 0 && (
        <View style={styles.errorsContainer}>
          {errors.map((err, i) => (
            <Text key={i} variant="captionSmall" style={styles.errorText}>
              {err}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};
