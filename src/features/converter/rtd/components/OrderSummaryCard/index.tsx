import React, { memo, useCallback, useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Text } from '@shared/components/Text';
import { useTheme } from '@theme/index';
import { FullScreenImageModal } from '@shared/components/FullScreenImageModal';
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
  const [logoPreviewVisible, setLogoPreviewVisible] = useState(false);

  const product = order.product;
  const productName = product?.display_name ?? product?.product_name ?? product?.category ?? 'Product';
  const category = product?.category ?? '-';
  const imagePath = product?.image_path;
  const logoPath = order.logo_path;

  const unitPrice = order.unit_price ?? order.price_per_unit;
  const unitPriceNum = typeof unitPrice === 'string' ? parseFloat(unitPrice) : Number(unitPrice);
  const converterTotal = !isNaN(unitPriceNum) ? order.quantity * unitPriceNum : 0;

  const handleOpenLogo = useCallback(() => {
    if (logoPath) {
      setLogoPreviewVisible(true);
    }
  }, [logoPath]);

  const handleCloseLogo = useCallback(() => {
    setLogoPreviewVisible(false);
  }, []);

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
          {logoPath && (
            <TouchableOpacity
              style={styles.logoRow}
              activeOpacity={0.8}
              onPress={handleOpenLogo}
            >
              <Image
                source={{ uri: logoPath }}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Text variant="captionMedium" style={styles.logoLabel}>
                Brand logo attached (tap to view)
              </Text>
            </TouchableOpacity>
          )}
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

      {logoPath && (
        <FullScreenImageModal
          visible={logoPreviewVisible}
          imageUrl={logoPath}
          onClose={handleCloseLogo}
        />
      )}
    </View>
  );
});
