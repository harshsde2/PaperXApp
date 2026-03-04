import React, { memo, useCallback, useMemo } from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import type { QuantityPricingCardProps } from './@types';
import { createStyles } from './styles';

const GST_RATE = 0.18;

export const QuantityPricingCard = memo<QuantityPricingCardProps>(
  function QuantityPricingCard({ product, quantity, onQuantityChange, priceSlab }) {
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
      const subtotal = pricePerUnit * quantity;
      const gst = subtotal * GST_RATE;
      const total = subtotal + gst;

      return {
        subtotal: subtotal.toFixed(2),
        gst: gst.toFixed(2),
        total: total.toFixed(2),
      };
    }, [priceSlab, product.base_price, quantity]);

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
            Subtotal
          </Text>
          <Text variant="bodySmall" style={styles.pricingValue}>
            ₹{pricing.subtotal}
          </Text>
        </View>

        <View style={styles.pricingRow}>
          <Text variant="bodySmall" style={styles.pricingLabel}>
            GST (18%)
          </Text>
          <Text variant="bodySmall" style={styles.pricingValue}>
            ₹{pricing.gst}
          </Text>
        </View>

        <View style={styles.totalRow}>
          <Text variant="bodyMedium" fontWeight="bold" style={styles.totalLabel}>
            Total Amount
          </Text>
          <Text variant="h5" fontWeight="extrabold" style={styles.totalValue}>
            ₹{pricing.total}
          </Text>
        </View>

        {/* <View style={styles.escrowBadge}>
          <View style={styles.escrowIcon}>
            <AppIcon.Security
              width={12}
              height={12}
              color={theme.colors.text.inverse as string}
            />
          </View>
          <Text variant="captionLarge" style={styles.escrowText}>
            Escrow Protected
          </Text>
        </View> */}
      </View>
    );
  },
);
