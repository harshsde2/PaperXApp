/**
 * CreditPackCard Component
 * Displays a credit pack with pricing and selection state
 */

import React, { useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { CreditPackCardProps } from './@types';
import { createStyles } from './styles';

export const CreditPackCard: React.FC<CreditPackCardProps> = ({
  pack,
  isSelected = false,
  onPress,
  style,
  disabled = false,
  testID,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const handlePress = useCallback(() => {
    if (!disabled && onPress) {
      onPress(pack);
    }
  }, [disabled, onPress, pack]);

  const formatPrice = (price: number): string => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.containerSelected,
        disabled && styles.containerDisabled,
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={disabled}
      testID={testID}
    >
      {/* Best Value Badge */}
      {pack.is_best_value && (
        <View style={styles.bestValueBadge}>
          <Text style={styles.bestValueText}>BEST VALUE</Text>
        </View>
      )}

      {/* Selected Indicator */}
      {isSelected && (
        <View style={styles.selectedIndicator}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{pack.name}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {pack.description}
          </Text>
        </View>
        <View style={styles.creditsContainer}>
          <Text style={styles.creditsValue}>{pack.credits}</Text>
          <Text style={styles.creditsLabel}>Credits</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Price Section */}
      <View style={styles.priceSection}>
        <View style={styles.priceBreakdown}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Base Price</Text>
            <Text style={styles.priceValue}>{formatPrice(pack.price)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>GST ({pack.gst_percentage}%)</Text>
            <Text style={styles.priceValue}>{formatPrice(pack.gst_amount)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(pack.total_price)}</Text>
          </View>
        </View>
      </View>

      {/* Validity Badge */}
      <View style={styles.validityBadge}>
        <Text style={styles.validityText}>Validity: {pack.validity}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CreditPackCard;
