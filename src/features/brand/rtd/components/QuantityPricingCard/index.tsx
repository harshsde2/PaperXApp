import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { View, Pressable, TextInput, type TextStyle } from 'react-native';
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

const DEFAULT_MAX_ORDER_QTY = 9_999_999;

function clampOrderQuantity(value: number, moq: number, maxCapacity?: number): number {
  const max = maxCapacity ?? DEFAULT_MAX_ORDER_QTY;
  const int = Number.isFinite(value) ? Math.trunc(value) : moq;
  return Math.max(moq, Math.min(max, int));
}

export const QuantityPricingCard = memo<QuantityPricingCardProps>(
  function QuantityPricingCard({ product, quantity, onQuantityChange, priceSlab, sellerGstRegistered = true }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    const maxOrderQty = useMemo(
      () => product.max_capacity ?? DEFAULT_MAX_ORDER_QTY,
      [product.max_capacity],
    );

    const [draft, setDraft] = useState(String(quantity));

    useEffect(() => {
      setDraft(String(quantity));
    }, [quantity]);

    const commitDraft = useCallback(() => {
      const digitsOnly = draft.replace(/\D/g, '');
      const parsed = digitsOnly === '' ? product.moq : parseInt(digitsOnly, 10);
      const next = clampOrderQuantity(
        Number.isNaN(parsed) ? product.moq : parsed,
        product.moq,
        product.max_capacity,
      );
      onQuantityChange(next);
      setDraft(String(next));
    }, [draft, product.moq, product.max_capacity, onQuantityChange]);

    const handleQuantityTextChange = useCallback((text: string) => {
      setDraft(text.replace(/\D/g, ''));
    }, []);

    const handleDecrement = useCallback(() => {
      if (quantity > product.moq) {
        onQuantityChange(quantity - 1);
      }
    }, [quantity, product.moq, onQuantityChange]);

    const handleIncrement = useCallback(() => {
      if (quantity >= maxOrderQty) return;
      onQuantityChange(quantity + 1);
    }, [quantity, maxOrderQty, onQuantityChange]);

    const pricing = useMemo(() => {
      const pricePerUnit = priceSlab
        ? Number(priceSlab.price_per_unit)
        : parseFloat(product.base_price);
      const subtotal = Math.round(pricePerUnit * quantity * 100) / 100;
      const platformFeePercent = getPlatformFeePercent(subtotal);
      const platformFee = Math.round(subtotal * (platformFeePercent / 100) * 100) / 100;
      const gst = sellerGstRegistered
        ? Math.round(platformFee * GST_RATE * 100) / 100
        : 0;
      const platformTotal = Math.round((platformFee + gst) * 100) / 100;

      return {
        subtotal: subtotal.toFixed(2),
        platformFee: platformFee.toFixed(2),
        gst: gst.toFixed(2),
        platformTotal: platformTotal.toFixed(2),
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

          <View style={styles.quantityInputOuter}>
            <TextInput
              value={draft}
              onChangeText={handleQuantityTextChange}
              onBlur={commitDraft}
              onSubmitEditing={commitDraft}
              keyboardType="number-pad"
              returnKeyType="done"
              selectTextOnFocus
              placeholder={String(product.moq)}
              placeholderTextColor={theme.colors.text.placeholder}
              style={styles.quantityInput as TextStyle}
            />
          </View>

          <Pressable
            onPress={handleIncrement}
            style={styles.quantityButton}
            disabled={quantity >= maxOrderQty}
          >
            <Text variant="bodyLarge" fontWeight="semibold" style={styles.quantityButtonText}>
              +
            </Text>
          </Pressable>
        </View>

        <View style={styles.separator} />

        <View style={styles.pricingRow}>
          <Text variant="bodySmall" style={styles.pricingLabel}>
            Order value (pay direct to converter)
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
              GST on platform fee (18%)
            </Text>
            <Text variant="bodySmall" style={styles.pricingValue}>
              ₹{pricing.gst}
            </Text>
          </View>
        )}

        <View style={styles.totalRow}>
          <Text variant="bodyMedium" fontWeight="bold" style={styles.totalLabel}>
            You Pay to PaperX
          </Text>
          <Text variant="h5" fontWeight="extrabold" style={styles.totalValue}>
            ₹{pricing.platformTotal}
          </Text>
        </View>

        <Text variant="captionMedium" style={styles.facilitatorText}>
          Product payment and delivery are arranged directly with the converter after connecting.
        </Text>
      </View>
    );
  },
);
