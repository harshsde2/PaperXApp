import React, { useCallback, useState } from 'react';
import {
  Modal,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Pressable,
} from 'react-native';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { CustomButton } from '@shared/components/CustomButton';
import { AppIcon } from '@assets/svgs';
import {
  useGetRtdListingPacks,
  usePurchaseRtdListingPack,
} from '@services/api';
import type { RtdListingPackItem } from '@services/api';
import type { RtdListingPackModalProps } from './@types';
import { createStyles } from './styles';

export const RtdListingPackModal: React.FC<RtdListingPackModalProps> = ({
  visible,
  onClose,
  onPurchaseSuccess,
  walletBalance,
  walletBalanceLoading = false,
  onInsufficientBalanceForPack,
  onBuyWalletCredits,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [purchasingPackSlug, setPurchasingPackSlug] = useState<string | null>(null);
  const { data: packs = [], isLoading } = useGetRtdListingPacks();
  const purchaseMutation = usePurchaseRtdListingPack();

  const handleBuy = useCallback(
    async (pack: RtdListingPackItem) => {
      if (walletBalanceLoading) {
        return;
      }
      if (walletBalance < pack.price) {
        onInsufficientBalanceForPack?.(pack);
        return;
      }

      setPurchasingPackSlug(pack.slug);
      try {
        await purchaseMutation.mutateAsync({ pack_slug: pack.slug });
        setPurchasingPackSlug(null);
        onClose();
        onPurchaseSuccess();
      } catch (err: any) {
        setPurchasingPackSlug(null);
        const message =
          err?.response?.data?.message ??
          err?.message ??
          'Purchase failed. Please try again.';
        const isInsufficientBalance =
          typeof message === 'string' &&
          (message.toLowerCase().includes('insufficient') ||
            message.toLowerCase().includes('balance'));
        if (isInsufficientBalance && onBuyWalletCredits) {
          Alert.alert('Purchase failed', message, [
            { text: 'OK' },
            {
              text: 'Add credits',
              onPress: () => {
                onClose();
                onBuyWalletCredits();
              },
            },
          ]);
        } else {
          Alert.alert('Purchase failed', message);
        }
      }
    },
    [
      walletBalance,
      walletBalanceLoading,
      onInsufficientBalanceForPack,
      purchaseMutation,
      onClose,
      onPurchaseSuccess,
      onBuyWalletCredits,
    ]
  );

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Choose a listing pack</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <AppIcon.Close width={24} height={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>
            Pay once from your wallet balance (credits). Valid for 120 days.
          </Text>
          <ScrollView
            style={{ maxHeight: 400 }}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
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
                      {pack.product_limit} product{pack.product_limit !== 1 ? 's' : ''} ·{' '}
                      {pack.validity_days} days validity
                    </Text>
                    <View style={styles.packPriceRow}>
                      <Text style={styles.packPrice}>{pack.price} Credits</Text>
                      <CustomButton
                        title="Buy"
                        onPress={() => handleBuy(pack)}
                        variant="gradient"
                        size="sm"
                        loading={purchasingPackSlug === pack.slug}
                        disabled={purchaseMutation.isPending || walletBalanceLoading}
                        style={styles.buyButton}
                      />
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
