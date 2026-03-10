import React, { useCallback, useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useTheme } from '@theme/index';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@shared/components/Text';
import { CustomButton } from '@shared/components/CustomButton';
import {
  useGetRtdListingPacks,
  usePurchaseRtdListingPack,
} from '@services/api';
import type { RtdListingPackItem } from '@services/api';
import { SCREENS } from '@navigation/constants';
import { createStyles } from './styles';

export const ConverterRTDListingPackScreen: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();
  const [purchasingPackSlug, setPurchasingPackSlug] = useState<string | null>(null);
  const { data: packs = [], isLoading } = useGetRtdListingPacks();
  const purchaseMutation = usePurchaseRtdListingPack();

  const handleBuy = useCallback(
    async (pack: RtdListingPackItem) => {
      setPurchasingPackSlug(pack.slug);
      try {
        await purchaseMutation.mutateAsync({ pack_slug: pack.slug });
        setPurchasingPackSlug(null);
        navigation.replace(SCREENS.CONVERTER_RTD.ADD_PRODUCT);
      } catch (err: any) {
        setPurchasingPackSlug(null);
        const message =
          err?.response?.data?.message ??
          err?.message ??
          'Purchase failed. Please try again.';
        Alert.alert('Purchase failed', message);
      }
    },
    [purchaseMutation, navigation]
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Choose a listing pack</Text>
        <Text style={styles.subtitle}>
          Pay once from your wallet balance (credits). Valid for 120 days.
        </Text>

        {isLoading ? (
          <Text style={styles.subtitle}>Loading packs...</Text>
        ) : (
          packs.map((pack) => {
            const isPopular = pack.slug === 'pack_5';
            return (
              <View
                key={pack.slug}
                style={[styles.packCard, isPopular && styles.packCardPopular]}
              >
                {isPopular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>Popular</Text>
                  </View>
                )}
                <Text style={styles.packName}>{pack.name}</Text>
                <Text style={styles.packMeta}>
                  {pack.product_limit} product{pack.product_limit !== 1 ? 's' : ''} · {pack.validity_days} days validity
                </Text>
                <View style={styles.packPriceRow}>
                  <Text style={styles.packPrice}>{pack.price} Credits</Text>
                  <CustomButton
                    title="Buy"
                    onPress={() => handleBuy(pack)}
                    variant="gradient"
                    size="sm"
                    loading={purchasingPackSlug === pack.slug}
                    disabled={purchaseMutation.isPending}
                    style={styles.buyButton}
                  />
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};
