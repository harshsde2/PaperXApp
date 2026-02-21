import React, { memo } from 'react';
import { View, Image } from 'react-native';
import { Text } from '@shared/components/Text';
import { useTheme } from '@theme/index';
import type { BrandOrderSummaryCardProps } from './@types';
import { createStyles } from './styles';

export const BrandOrderSummaryCard = memo<BrandOrderSummaryCardProps>(
  function BrandOrderSummaryCard({ order }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    const product = order.product;
    const productName = product?.product_name ?? 'Product';
    const imagePath = product?.image_path;
    const converterName = order.brand?.company_name ?? order.brand?.name ?? '-';

    return (
      <View style={styles.card}>
        <Text style={styles.header}>Order Summary</Text>

        <View style={styles.productRow}>
          {imagePath ? (
            <Image
              source={{ uri: imagePath }}
              style={styles.thumbnailImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.thumbnail} />
          )}

          <View style={styles.productDetails}>
            <Text variant="bodySmall" style={styles.productName}>
              {productName}
            </Text>
            <Text variant="captionSmall" style={styles.quantity}>
              Qty: {order.quantity}
            </Text>
          </View>

          <Text variant="bodySmall" style={styles.price}>
            ₹{order.total_amount}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text variant="captionMedium" style={styles.detailLabel}>
            Converter
          </Text>
          <Text variant="captionMedium" style={styles.detailValuePrimary}>
            {converterName}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text variant="captionMedium" style={styles.detailLabel}>
            Order ID
          </Text>
          <Text variant="captionMedium" style={styles.detailValueMedium}>
            #PX-{order.id}
          </Text>
        </View>
      </View>
    );
  },
);
