import React, { memo } from 'react';
import { View, Image } from 'react-native';
import { Text } from '@shared/components/Text';
import { useTheme } from '@theme/index';
import type { OrderSummaryCardProps } from './@types';
import { createStyles } from './styles';

export const OrderSummaryCard = memo<OrderSummaryCardProps>(function OrderSummaryCard({
  order,
}) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const product = order.product;
  const productName = product?.product_name ?? 'Product';
  const category = product?.category ?? '-';
  const imagePath = product?.image_path;

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
            ₹{order.price_per_unit}
          </Text>
        </View>
        <View style={styles.rowItem}>
          <Text variant="captionMedium" style={styles.label}>
            Subtotal
          </Text>
          <Text variant="captionMedium" style={styles.value}>
            ₹{order.subtotal}
          </Text>
        </View>
        <View style={styles.rowItem}>
          <Text variant="captionMedium" style={styles.label}>
            Commission
          </Text>
          <Text variant="captionMedium" style={styles.value}>
            ₹{order.commission_amount}
          </Text>
        </View>
        <View style={styles.rowItem}>
          <Text variant="captionMedium" style={styles.label}>
            GST
          </Text>
          <Text variant="captionMedium" style={styles.value}>
            ₹{order.gst_amount}
          </Text>
        </View>
        <View style={styles.totalRow}>
          <Text variant="bodyMedium" style={styles.totalLabel}>
            Total
          </Text>
          <Text variant="bodyMedium" style={styles.totalValue}>
            ₹{order.total_amount}
          </Text>
        </View>
      </View>
    </View>
  );
});
