import React, { memo, useCallback } from 'react';
import { View, Image } from 'react-native';
import { Text } from '@shared/components/Text';
import { CustomButton } from '@shared/components/CustomButton';
import { useTheme } from '@theme/index';
import type { RTDProductCardProps } from './@types';
import { createStyles } from './styles';

export const RTDProductCard = memo<RTDProductCardProps>(
  function RTDProductCard({ product, onBuyNow, hasActiveOrder = false, activeOrderId, onViewOrder }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    const handlePress = useCallback(() => {
      if (hasActiveOrder && activeOrderId && onViewOrder) {
        onViewOrder(activeOrderId);
      } else {
        onBuyNow(product);
      }
    }, [hasActiveOrder, activeOrderId, onViewOrder, onBuyNow, product]);

    const subtitle = [product.size, product.material]
      .filter(Boolean)
      .join(' · ');

    const pricePerUnit = `₹${parseFloat(product.base_price).toFixed(2)} / unit`;

    return (
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          {product.image_path && (
            <Image
              source={{ uri: product.image_path }}
              style={styles.image}
              resizeMode="cover"
            />
          )}
          {product.lead_time_label && (
            <View style={styles.badgeContainer}>
              <View style={styles.badge}>
                <Text variant="captionSmall" style={styles.badgeText}>
                  {product.lead_time_label}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text variant="bodyLarge" fontWeight="bold" style={styles.title}>
            {product.product_name}
          </Text>

          {subtitle ? (
            <Text variant="bodySmall" style={styles.subtitle}>
              {subtitle}
            </Text>
          ) : null}

          <View style={styles.infoRow}>
            <Text variant="captionMedium" style={styles.moqLabel}>
              MOQ{' '}
            </Text>
            <Text
              variant="captionMedium"
              fontWeight="bold"
              style={styles.moqValue}
            >
              {product.moq}
            </Text>
            <View style={styles.divider} />
            <Text variant="bodySmall" fontWeight="bold" style={styles.priceText}>
              {pricePerUnit}
            </Text>
          </View>

          <CustomButton
            title={hasActiveOrder ? 'View Order' : 'Buy Now'}
            onPress={handlePress}
            variant={hasActiveOrder ? 'secondary' : 'gradient'}
            fullWidth
            disabled={!hasActiveOrder && !product.buy_now_enabled}
          />
        </View>
      </View>
    );
  },
);
