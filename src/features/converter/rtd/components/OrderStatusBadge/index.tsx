import React, { memo } from 'react';
import { View, type ViewStyle } from 'react-native';
import { Text } from '@shared/components/Text';
import { useTheme } from '@theme/index';
import type { OrderStatusBadgeProps, OrderStatusBadgeStyleKey } from './@types';
import { createStyles } from './styles';

const STATUS_LABELS: Record<string, string> = {
  REQUESTED: 'Requested',
  ACCEPTED: 'Accepted',
  PAID: 'Paid',
  IN_PRODUCTION: 'In Production',
  DISPATCHED: 'Dispatched',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  DISPUTED: 'Disputed',
};

const BG_MAP: Record<string, OrderStatusBadgeStyleKey> = {
  REQUESTED: 'requested',
  ACCEPTED: 'accepted',
  PAID: 'paid',
  IN_PRODUCTION: 'inProduction',
  DISPATCHED: 'dispatched',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  DISPUTED: 'disputed',
};

const TEXT_MAP: Record<string, OrderStatusBadgeStyleKey> = {
  REQUESTED: 'textRequested',
  ACCEPTED: 'textAccepted',
  PAID: 'textPaid',
  IN_PRODUCTION: 'textInProduction',
  DISPATCHED: 'textDispatched',
  COMPLETED: 'textCompleted',
  CANCELLED: 'textCancelled',
  DISPUTED: 'textDisputed',
};

export const OrderStatusBadge = memo<OrderStatusBadgeProps>(function OrderStatusBadge({
  status,
}) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const bgKey = BG_MAP[status] ?? 'requested';
  const bgStyle = (styles[bgKey] ?? styles.requested) as ViewStyle;
  const textStyle = styles[TEXT_MAP[status] ?? 'textRequested'] ?? styles.textRequested;

  return (
    <View style={[styles.badge, bgStyle]}>
      <Text
        variant="captionMedium"
        style={[styles.text, textStyle]}
      >
        {STATUS_LABELS[status] ?? status}
      </Text>
    </View>
  );
});
