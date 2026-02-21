import React, { useState, useCallback, useMemo } from 'react';
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
import { CustomButton } from '@shared/components/CustomButton';
import { AppIcon } from '@assets/svgs';
import { SCREENS } from '@navigation/constants';
import { useGetRtdProductDetail } from '@services/api';
import {
  useRequestRtdOrder,
  useRequestRtdOrderWithLogo,
} from '@services/api/brandRtdApi';
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
  const requestOrder = useRequestRtdOrder();
  const requestOrderWithLogo = useRequestRtdOrderWithLogo();

  const [form, setForm] = useState<OrderFormState>({
    quantity: String(initialQty ?? ''),
    deliveryAddress: '',
    orderNotes: '',
    logoFile: null,
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const qty = parseInt(form.quantity, 10) || 0;
  const pricePerUnit = useMemo(
    () => findMatchingSlab(product?.price_slabs, qty, product?.base_price ?? '0'),
    [product?.price_slabs, product?.base_price, qty],
  );
  const subtotal = qty * pricePerUnit;
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

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
      Alert.alert('Order Failed', err?.message ?? 'Something went wrong. Please try again.');
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
          {!form.logoFile ? (
            <TouchableOpacity style={styles.uploadArea} activeOpacity={0.7}>
              <View style={styles.uploadIconContainer}>
                <AppIcon.PlusCircle width={24} height={24} color={theme.colors.primary.DEFAULT} />
              </View>
              <Text style={styles.uploadTitle}>Select File</Text>
              <Text style={styles.uploadHint}>SVG, PNG, or PDF (Max 10MB)</Text>
              <TouchableOpacity style={styles.chooseFileButton} activeOpacity={0.8}>
                <Text style={styles.chooseFileText}>Choose File</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ) : (
            <View style={styles.selectedFileRow}>
              <AppIcon.TickCheckedBox width={16} height={16} color={theme.colors.primary.DEFAULT} />
              <Text style={styles.selectedFileName} numberOfLines={1}>
                {form.logoFile.name}
              </Text>
              <TouchableOpacity
                style={styles.removeFileButton}
                onPress={() => setForm((s) => ({ ...s, logoFile: null }))}
              >
                <AppIcon.Close width={16} height={16} color={theme.colors.text.tertiary} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Logistics */}
        <View style={styles.section}>
          <Text fontWeight="bold" style={styles.sectionTitle}>
            Logistics
          </Text>

          <Text style={styles.fieldLabel}>Delivery Address</Text>
          <View
            style={[
              styles.textareaContainer,
              focusedField === 'address' && styles.textareaContainerFocused,
            ]}
          >
            <TextInput
              style={styles.textarea}
              value={form.deliveryAddress}
              onChangeText={(v) => setForm((s) => ({ ...s, deliveryAddress: v }))}
              placeholder="Enter delivery address"
              placeholderTextColor={theme.colors.text.placeholder}
              multiline
              numberOfLines={3}
              onFocus={() => setFocusedField('address')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <View style={styles.leadTimeCard}>
            <View style={styles.leadTimeIconWrapper}>
              <AppIcon.Sessions width={20} height={20} color={theme.colors.primary.DEFAULT} />
            </View>
            <View style={styles.leadTimeContent}>
              <Text style={styles.leadTimeLabel}>Lead Time Commitment</Text>
              <Text fontWeight="bold" style={styles.leadTimeValue}>
                {product?.lead_time_label ?? 'Standard: 5-7 Business Days'}
              </Text>
            </View>
          </View>
        </View>

        {/* Additional Info */}
        <View style={styles.section}>
          <Text fontWeight="bold" style={styles.sectionTitle}>
            Additional Info
          </Text>

          <Text style={styles.fieldLabel}>
            Order Notes <Text style={styles.optionalTag}>(Optional)</Text>
          </Text>
          <View
            style={[
              styles.textareaContainer,
              focusedField === 'notes' && styles.textareaContainerFocused,
            ]}
          >
            <TextInput
              style={styles.textarea}
              value={form.orderNotes}
              onChangeText={(v) => setForm((s) => ({ ...s, orderNotes: v }))}
              placeholder="Any special instructions..."
              placeholderTextColor={theme.colors.text.placeholder}
              multiline
              numberOfLines={3}
              onFocus={() => setFocusedField('notes')}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerTotalRow}>
          <Text style={styles.footerTotalLabel}>Order Total Estimate</Text>
          <Text fontWeight="bold" style={styles.footerTotalValue}>
            ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
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
          By clicking Request Order, you agree to PaperX Terms of Service
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};
