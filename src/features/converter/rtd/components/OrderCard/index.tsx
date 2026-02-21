import React, { memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '@shared/components/Text';
import { useTheme } from '@theme/index';
import { OrderStatusBadge } from '../OrderStatusBadge';
import type { OrderCardProps } from './@types';
import { createStyles } from './styles';

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export const OrderCard = memo<OrderCardProps>(function OrderCard({
  order,
  onPress,
}) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const productName = order.product?.product_name ?? 'Product';
  const brandName = order.brand?.name ?? 'Brand';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(order.id)}
      activeOpacity={0.7}
    >
      <View style={styles.row}>
        <Text variant="bodyMedium" style={styles.productName} numberOfLines={2}>
          {productName}
        </Text>
        <OrderStatusBadge status={order.status} />
      </View>
      <Text variant="captionMedium" style={styles.brandName}>
        {brandName}
      </Text>
      <Text variant="captionMedium" style={styles.quantity}>
        Qty: {order.quantity}
      </Text>
      <View style={styles.row}>
        <Text variant="captionMedium" style={styles.date}>
          {formatDate(order.created_at)}
        </Text>
        <Text variant="bodyMedium" style={styles.totalAmount}>
          ₹{order.total_amount}
        </Text>
      </View>
    </TouchableOpacity>
  );
});
