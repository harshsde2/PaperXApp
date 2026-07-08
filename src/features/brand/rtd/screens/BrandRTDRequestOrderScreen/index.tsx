import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { KeyboardDoneBar } from '@shared/components/KeyboardDoneBar';
import { CustomButton } from '@shared/components/CustomButton';
import { ImagePicker } from '@shared/components/ImagePicker';
import { AppIcon } from '@assets/svgs';
import { SCREENS } from '@navigation/constants';
import { useGetRtdProductDetail } from '@services/api';
import {
  useRequestRtdOrder,
  useRequestRtdOrderWithLogo,
  useGetBrandRtdOrders,
} from '@services/api/brandRtdApi';
import { ACTIVE_RTD_STATUSES, getOrderProductId } from '../../constants';
import type { RtdPriceSlab } from '@services/api/rtdApi/@types';
import type { BrandRTDRequestOrderScreenProps, OrderFormState } from './@types';
import { createStyles } from './styles';

const PROGRESS_STEP = 3;
const TOTAL_STEPS = 4;

function findMatchingSlab(
  slabs: RtdPriceSlab[] | undefined,
  qty: number,
  basePrice: string,
): number {
  if (!slabs?.length) return parseFloat(basePrice) || 0;
  const match = slabs.find((s) => qty >= s.min_qty && qty <= s.max_qty);
  if (match) return parseFloat(String(match.price_per_unit));
  return parseFloat(basePrice) || 0;
}

function isQuantityInSlab(slabs: RtdPriceSlab[] | undefined, qty: number): boolean {
  if (!slabs?.length || qty <= 0) return false;
  return slabs.some((s) => qty >= s.min_qty && qty <= s.max_qty);
}

function getMaxSlabQty(slabs: RtdPriceSlab[] | undefined): number {
  if (!slabs?.length) return Infinity;
  return Math.max(...slabs.map((s) => s.max_qty));
}

export const BrandRTDRequestOrderScreen: React.FC<BrandRTDRequestOrderScreenProps> = ({
  route,
  navigation,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { productId, quantity: initialQty } = route.params;

  const { data: product, isLoading: productLoading } = useGetRtdProductDetail(productId);
  const { data: rtdOrders } = useGetBrandRtdOrders();
  const requestOrder = useRequestRtdOrder();
  const requestOrderWithLogo = useRequestRtdOrderWithLogo();

  useEffect(() => {
    if (!rtdOrders) return;
    const existing = rtdOrders.find(
      (o) => getOrderProductId(o) === productId && ACTIVE_RTD_STATUSES.includes(o.status),
    );
    if (existing) {
      Alert.alert(
        'Active Order Exists',
        'You already have an active order for this product.',
        [{
          text: 'View Order',
          onPress: () => navigation.replace(SCREENS.BRAND_RTD.ORDER_DETAIL as any, { orderId: existing.id }),
        }],
        { cancelable: false },
      );
    }
  }, [rtdOrders, productId, navigation]);

  const [form, setForm] = useState<OrderFormState>({
    quantity: String(initialQty ?? ''),
    logoFile: null,
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const qty = parseInt(form.quantity, 10) || 0;
  const pricePerUnit = useMemo(
    () => findMatchingSlab(product?.price_slabs, qty, product?.base_price ?? '0'),
    [product?.price_slabs, product?.base_price, qty],
  );
  const subtotal = qty * pricePerUnit;
  // Flat platform fee (match backend CommissionCalculator): always 9% of order value.
  const platformFeePercent = 9;
  const platformFee = subtotal * (platformFeePercent / 100);
  const sellerGstRegistered = product?.seller_gst_registered !== false;
  const gst = sellerGstRegistered ? platformFee * 0.18 : 0;
  const platformTotal = platformFee + gst;

  const isSubmitting = requestOrder.isPending || requestOrderWithLogo.isPending;
  const qtyInSlab = isQuantityInSlab(product?.price_slabs, qty);
  const maxQty = getMaxSlabQty(product?.price_slabs);
  const canSubmit = qty >= (product?.moq ?? 1) && qtyInSlab && !isSubmitting;

  const handleSubmit = useCallback(() => {
    if (!product || isSubmitting) return;
    if (qty < product.moq) {
      Alert.alert('Invalid Quantity', `Minimum order quantity is ${product.moq} units.`);
      return;
    }
    if (!isQuantityInSlab(product.price_slabs, qty)) {
      Alert.alert('Invalid Quantity', `Quantity ${qty} does not match any price slab. Max is ${getMaxSlabQty(product.price_slabs)}.`);
      return;
    }

    const onSuccess = (order: any) => {
      navigation.replace(SCREENS.BRAND_RTD.ORDER_DETAIL as any, { orderId: order.id });
    };

    const onError = (err: any) => {
      const status = err?.response?.status;
      const message = err?.response?.data?.message ?? err?.message;

      if (status === 422 && message?.includes('active order')) {
        Alert.alert(
          'Order Already Exists',
          message,
          [{ text: 'OK', onPress: () => navigation.goBack() }],
        );
        return;
      }

      Alert.alert('Order Failed', message ?? 'Something went wrong. Please try again.');
    };

    if (form.logoFile) {
      requestOrderWithLogo.mutate(
        { product_id: product.id, quantity: qty, logo: form.logoFile },
        { onSuccess, onError },
      );
    } else {
      requestOrder.mutate(
        { product_id: product.id, quantity: qty },
        { onSuccess, onError },
      );
    }
  }, [product, qty, form.logoFile, navigation, requestOrder, requestOrderWithLogo, isSubmitting]);

  if (productLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.DEFAULT} />
      </View>
    );
  }

  return (
    <>
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>
            Step {PROGRESS_STEP} of {TOTAL_STEPS}: Order Details
          </Text>
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${(PROGRESS_STEP / TOTAL_STEPS) * 100}%` },
              ]}
            />
          </View>
        </View>

        {/* Order Specifications */}
        <View style={styles.section}>
          <Text fontWeight="bold" style={styles.sectionTitle}>
            Order Specifications
          </Text>

          <Text style={styles.fieldLabel}>Quantity</Text>
          <View
            style={[
              styles.inputContainer,
              focusedField === 'quantity' && styles.inputContainerFocused,
              qty > 0 && qty < (product?.moq ?? 1) && styles.inputContainerError,
            ]}
          >
            <TextInput
              style={styles.textInput}
              value={form.quantity}
              onChangeText={(v) => setForm((s) => ({ ...s, quantity: v.replace(/[^0-9]/g, '') }))}
              keyboardType="number-pad"
              placeholder={`Min ${product?.moq ?? 1}`}
              placeholderTextColor={theme.colors.text.placeholder}
              onFocus={() => setFocusedField('quantity')}
              onBlur={() => setFocusedField(null)}
            />
            <Text style={styles.inputSuffix}>units</Text>
          </View>
          {qty > 0 && qty < (product?.moq ?? 1) && (
            <Text style={styles.errorText}>
              Minimum order quantity is {product?.moq} units
            </Text>
          )}
          {qty > 0 && qty >= (product?.moq ?? 1) && !qtyInSlab && (
            <Text style={styles.errorText}>
              Quantity must be within a price slab (max {maxQty})
            </Text>
          )}

          <View style={styles.fieldSpacer} />

          <Text style={styles.fieldLabel}>
            Upload Logo <Text style={styles.optionalTag}>(Optional)</Text>
          </Text>
          <ImagePicker
            value={form.logoFile}
            onChange={(logoFile) => setForm((s) => ({ ...s, logoFile }))}
            placeholderText="Add brand logo"
            hintText="PNG, JPG up to 10MB"
            showCamera={false}
          />
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <Text style={styles.footerLabel}>Order Value (pay direct to converter)</Text>
          <Text style={styles.footerValue}>
            ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </Text>
        </View>
        <View style={styles.footerRow}>
          <Text style={styles.footerLabel}>Platform Fee ({platformFeePercent}%)</Text>
          <Text style={styles.footerValue}>
            ₹{platformFee.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </Text>
        </View>
        {sellerGstRegistered && (
          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>GST on Platform Fee (18%)</Text>
            <Text style={styles.footerValue}>
              ₹{gst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </Text>
          </View>
        )}
        <View style={styles.footerDivider} />
        <View style={styles.footerTotalRow}>
          <Text style={styles.footerTotalLabel}>You Pay to Zupply</Text>
          <Text fontWeight="bold" style={styles.footerTotalValue}>
            ₹{platformTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </Text>
        </View>
        <CustomButton
          title={isSubmitting ? 'Requesting...' : 'Request Order'}
          onPress={handleSubmit}
          variant="gradient"
          size="lg"
          disabled={!canSubmit}
        />
        <Text style={styles.termsText}>
          By clicking Request Order, you agree to Zupply Terms of Service.
          You will pay the platform fee to Zupply after the converter accepts.
        </Text>
      </View>
    </KeyboardAvoidingView>
    <KeyboardDoneBar />
    </>
  );
};
