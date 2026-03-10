import React, { memo, useCallback, useMemo } from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import type { QuantityPricingCardProps } from './@types';
import { createStyles } from './styles';

const GST_RATE = 0.18;

/** Platform fee slabs (match backend CommissionCalculator): ≤25k→9%, ≤75k→8%, ≤200k→6%, ≤300k→5% */
const PLATFORM_FEE_SLABS: { max: number; percent: number }[] = [
  { max: 25000, percent: 9 },
  { max: 75000, percent: 8 },
  { max: 200000, percent: 6 },
  { max: 300000, percent: 5 },
];

function getPlatformFeePercent(subtotal: number): number {
  for (const slab of PLATFORM_FEE_SLABS) {
    if (subtotal <= slab.max) return slab.percent;
  }
  return PLATFORM_FEE_SLABS[PLATFORM_FEE_SLABS.length - 1].percent;
}

export const QuantityPricingCard = memo<QuantityPricingCardProps>(
  function QuantityPricingCard({ product, quantity, onQuantityChange, priceSlab, sellerGstRegistered = true }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    const handleDecrement = useCallback(() => {
      if (quantity > product.moq) {
        onQuantityChange(quantity - 1);
      }
    }, [quantity, product.moq, onQuantityChange]);

    const handleIncrement = useCallback(() => {
      onQuantityChange(quantity + 1);
    }, [quantity, onQuantityChange]);

    const pricing = useMemo(() => {
      const pricePerUnit = priceSlab
        ? Number(priceSlab.price_per_unit)
        : parseFloat(product.base_price);
      const subtotal = Math.round(pricePerUnit * quantity * 100) / 100;
      const platformFeePercent = getPlatformFeePercent(subtotal);
      const platformFee = Math.round(subtotal * (platformFeePercent / 100) * 100) / 100;
      const gst = sellerGstRegistered
        ? Math.round((subtotal + platformFee) * GST_RATE * 100) / 100
        : 0;
      const total = Math.round((subtotal + platformFee + gst) * 100) / 100;

      return {
        subtotal: subtotal.toFixed(2),
        platformFee: platformFee.toFixed(2),
        gst: gst.toFixed(2),
        total: total.toFixed(2),
        showGst: sellerGstRegistered,
      };
    }, [priceSlab, product.base_price, quantity, sellerGstRegistered]);

    return (
      <View style={styles.card}>
        <View style={styles.quantityRow}>
          <Pressable
            onPress={handleDecrement}
            style={styles.quantityButton}
            disabled={quantity <= product.moq}
          >
            <Text variant="bodyLarge" fontWeight="semibold" style={styles.quantityButtonText}>
              −
            </Text>
          </Pressable>

          <Text variant="h4" fontWeight="bold" style={styles.quantityValue}>
            {quantity}
          </Text>

          <Pressable
            onPress={handleIncrement}
            style={styles.quantityButton}
          >
            <Text variant="bodyLarge" fontWeight="semibold" style={styles.quantityButtonText}>
              +
            </Text>
          </Pressable>
        </View>

        <View style={styles.separator} />

        <View style={styles.pricingRow}>
          <Text variant="bodySmall" style={styles.pricingLabel}>
            Product value (on behalf of seller)
          </Text>
          <Text variant="bodySmall" style={styles.pricingValue}>
            ₹{pricing.subtotal}
          </Text>
        </View>

        <View style={styles.pricingRow}>
          <Text variant="bodySmall" style={styles.pricingLabel}>
            Platform fee (Zupply)
          </Text>
          <Text variant="bodySmall" style={styles.pricingValue}>
            ₹{pricing.platformFee}
          </Text>
        </View>

        {pricing.showGst && (
          <View style={styles.pricingRow}>
            <Text variant="bodySmall" style={styles.pricingLabel}>
              GST (18%)
            </Text>
            <Text variant="bodySmall" style={styles.pricingValue}>
              ₹{pricing.gst}
            </Text>
          </View>
        )}

        <View style={styles.totalRow}>
          <Text variant="bodyMedium" fontWeight="bold" style={styles.totalLabel}>
            Total Amount
          </Text>
          <Text variant="h5" fontWeight="extrabold" style={styles.totalValue}>
            ₹{pricing.total}
          </Text>
        </View>

        <Text variant="captionMedium" style={styles.facilitatorText}>
          Zupply acts as a payment collection facilitator on behalf of the seller.
        </Text>
      </View>
    );
  },
);
