import React, { useState, useMemo, useCallback } from 'react';
import { View, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { CustomButton } from '@shared/components/CustomButton';
import { AppIcon } from '@assets/svgs';
import { useGetRtdProductDetail } from '@services/api';
import { useGetBrandRtdOrders } from '@services/api/brandRtdApi';
import { SCREENS } from '@navigation/constants';
import { ACTIVE_RTD_STATUSES, getOrderProductId } from '../../constants';
import { ProductSpecsGrid } from '../../components/ProductSpecsGrid';
import { QuantityPricingCard } from '../../components/QuantityPricingCard';
import { EscrowBanner } from '../../components/EscrowBanner';
import type { RtdPriceSlab } from '@services/api/rtdApi/@types';
import type { BrandRTDProductDetailScreenProps } from './@types';
import { createStyles } from './styles';

const findMatchingSlab = (
  slabs: RtdPriceSlab[] | undefined,
  quantity: number,
): RtdPriceSlab | null => {
  if (!slabs?.length) return null;
  return (
    slabs.find((s) => quantity >= s.min_qty && quantity <= s.max_qty) ??
    slabs[slabs.length - 1]
  );
};

export const BrandRTDProductDetailScreen: React.FC<
  BrandRTDProductDetailScreenProps
> = ({ navigation, route }) => {
  const { productId } = route.params;
  const theme = useTheme();
  const styles = createStyles(theme);

  const {
    data: product,
    isLoading,
  } = useGetRtdProductDetail(productId, { enabled: !!productId });

  const { data: rtdOrders } = useGetBrandRtdOrders();
  const existingOrder = useMemo(
    () =>
      (rtdOrders ?? []).find(
        (o) => getOrderProductId(o) === productId && ACTIVE_RTD_STATUSES.includes(o.status),
      ),
    [rtdOrders, productId],
  );
  const hasActiveOrder = !!existingOrder;

  const [quantity, setQuantity] = useState<number | null>(null);

  const effectiveQuantity = quantity ?? product?.moq ?? 1;

  const priceSlab = useMemo(
    () => findMatchingSlab(product?.price_slabs, effectiveQuantity),
    [product?.price_slabs, effectiveQuantity],
  );

  const handleQuantityChange = useCallback((newQty: number) => {
    setQuantity(newQty);
  }, []);

  const handleRequestOrder = useCallback(() => {
    if (hasActiveOrder && existingOrder) {
      navigation.navigate(SCREENS.BRAND_RTD.ORDER_DETAIL as any, {
        orderId: existingOrder.id,
      });
      return;
    }
    navigation.navigate(SCREENS.BRAND_RTD.REQUEST_ORDER, {
      productId,
      quantity: effectiveQuantity,
    });
  }, [navigation, productId, effectiveQuantity, hasActiveOrder, existingOrder]);

  if (isLoading || !product) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={theme.colors.primary.DEFAULT} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.imageContainer}>
          {product.image_path ? (
            <Image
              source={{ uri: product.image_path }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <>
              <AppIcon.Market
                width={48}
                height={48}
                color={theme.colors.text.tertiary as string}
              />
              <Text style={styles.imagePlaceholderText}>No image available</Text>
            </>
          )}
        </View>

        <View style={styles.infoSection}>
          <Text fontWeight="bold" style={styles.title}>
            {product.product_name}
          </Text>

          {product.lead_time_label && (
            <View style={styles.leadTimeBadge}>
              <Text fontWeight="bold" style={styles.leadTimeBadgeText}>
                {product.lead_time_label}
              </Text>
            </View>
          )}

          {product.category && (
            <Text style={styles.description}>{product.category}</Text>
          )}
        </View>

        <View style={styles.sectionWrapper}>
          <ProductSpecsGrid product={product} />
        </View>

        <View style={styles.sectionWrapper}>
          <QuantityPricingCard
            product={product}
            quantity={effectiveQuantity}
            onQuantityChange={handleQuantityChange}
            priceSlab={priceSlab}
          />
        </View>

        <View style={styles.infoBanner}>
          <AppIcon.Security
            width={20}
            height={20}
            color={theme.colors.primary.DEFAULT as string}
          />
          <Text style={styles.infoBannerText}>
            PaperX Trade Assurance — Your payment is protected through our
            escrow service until order fulfilment is verified.
          </Text>
        </View>

        <View style={styles.escrowWrapper}>
          <EscrowBanner />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={styles.footerLabel}>Est. Delivery</Text>
          <Text fontWeight="bold" style={styles.footerValue}>
            {product.lead_time_label ?? 'Contact Seller'}
          </Text>
        </View>
        <CustomButton
          title={hasActiveOrder ? 'View Active Order' : 'Request Order'}
          variant={hasActiveOrder ? 'primary' : 'gradient'}
          onPress={handleRequestOrder}
        />
      </View>
    </View>
  );
};
