import React, { memo } from 'react';
import { View, Image } from 'react-native';
import { Text } from '@shared/components/Text';
import { useTheme } from '@theme/index';
import type { OrderSummaryCardProps } from './@types';
import { createStyles } from './styles';

const formatPrice = (val: string | number | undefined): string => {
  if (val == null || val === '') return '0';
  const n = typeof val === 'string' ? parseFloat(val) : val;
  return isNaN(n) ? '0' : n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const OrderSummaryCard = memo<OrderSummaryCardProps>(function OrderSummaryCard({
  order,
}) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const product = order.product;
  const productName = product?.product_name ?? 'Product';
  const category = product?.category ?? '-';
  const imagePath = product?.image_path;

  const unitPrice = order.unit_price ?? order.price_per_unit;
  const unitPriceNum = typeof unitPrice === 'string' ? parseFloat(unitPrice) : Number(unitPrice);
  const converterTotal = !isNaN(unitPriceNum) ? order.quantity * unitPriceNum : 0;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {imagePath ? (
          <Image
            source={{ uri: imagePath }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage} />
        )}
        <View style={styles.productInfo}>
          <Text variant="bodyMedium" style={styles.productName}>
            {productName}
          </Text>
          <Text variant="captionMedium" style={styles.category}>
            {category}
          </Text>
          <Text variant="captionMedium" style={styles.quantity}>
            Qty: {order.quantity}
          </Text>
        </View>
      </View>

      <View style={styles.financials}>
        <View style={styles.rowItem}>
          <Text variant="captionMedium" style={styles.label}>
            Price per unit
          </Text>
          <Text variant="captionMedium" style={styles.value}>
            ₹{formatPrice(order.unit_price ?? order.price_per_unit)}
          </Text>
        </View>
        <View style={styles.totalRow}>
          <Text variant="bodyMedium" style={styles.totalLabel}>
            Total
          </Text>
          <Text variant="bodyMedium" style={styles.totalValue}>
            ₹{formatPrice(converterTotal)}
          </Text>
        </View>
      </View>
    </View>
  );
});
