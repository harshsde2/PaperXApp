import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@theme/index';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Text } from '@shared/components/Text';
import { CustomButton } from '@shared/components/CustomButton';
import { useCreateRtdProduct, useGetRtdProductDetail, useUpdateRtdProduct } from '@services/api';
import type { CreateRtdProductRequest, RtdLeadTime, RtdProduct } from '@services/api';
import { SCREENS } from '@navigation/constants';
import { PriceSlabInput } from '../../components/PriceSlabInput';
import type { PriceSlabRow } from '../../components/PriceSlabInput';
import { ProductListingSuccessModal } from '../../components/ProductListingSuccessModal';
import type { FormData, FormErrors } from './@types';
import { createStyles } from './styles';

const LEAD_TIME_OPTIONS: { value: RtdLeadTime; label: string }[] = [
  { value: 'SAME_DAY', label: 'Same Day' },
  { value: 'H24', label: '24 Hours' },
  { value: 'H48', label: '48 Hours' },
  { value: 'DAYS_3_5', label: '3-5 Days' },
];

const INITIAL_FORM: FormData = {
  category: '',
  product_name: '',
  size: '',
  material: '',
  gsm: '',
  finish: '',
  branding_method: '',
  lead_time: '',
  moq: '',
  max_capacity: '',
  base_price: '',
  buy_now_enabled: true,
  delivery_geography: '',
  price_slabs: [{ min_qty: '', max_qty: '', price_per_unit: '' }],
};

const validateForm = (form: FormData): FormErrors => {
  const errors: FormErrors = {};
  if (!form.category?.trim()) errors.category = 'Category is required';
  if (!form.product_name?.trim()) errors.product_name = 'Product name is required';
  if (!form.lead_time) errors.lead_time = 'Lead time is required';
  const moqNum = parseFloat(form.moq);
  if (!form.moq || isNaN(moqNum) || moqNum <= 0) {
    errors.moq = 'MOQ must be greater than 0';
  }
  const basePriceNum = parseFloat(form.base_price);
  if (!form.base_price || isNaN(basePriceNum) || basePriceNum <= 0) {
    errors.base_price = 'Base price must be greater than 0';
  }

  const slabErrors: string[] = [];
  form.price_slabs.forEach((slab, i) => {
    const min = parseFloat(slab.min_qty);
    const max = parseFloat(slab.max_qty);
    const price = parseFloat(slab.price_per_unit);
    if (!slab.min_qty || !slab.max_qty || !slab.price_per_unit) {
      slabErrors.push(`Slab ${i + 1}: All fields required`);
      return;
    }
    if (isNaN(min) || isNaN(max) || isNaN(price)) {
      slabErrors.push(`Slab ${i + 1}: Invalid numbers`);
      return;
    }
    if (min >= max) slabErrors.push(`Slab ${i + 1}: Min qty must be less than max qty`);
  });

  for (let i = 0; i < form.price_slabs.length; i++) {
    for (let j = i + 1; j < form.price_slabs.length; j++) {
      const a = form.price_slabs[i];
      const b = form.price_slabs[j];
      const aMin = parseFloat(a.min_qty);
      const aMax = parseFloat(a.max_qty);
      const bMin = parseFloat(b.min_qty);
      const bMax = parseFloat(b.max_qty);
      if (
        !(aMax < bMin || bMax < aMin)
      ) {
        slabErrors.push('Price slabs must not overlap');
        break;
      }
    }
    if (slabErrors.length > 0) break;
  }
  if (slabErrors.length > 0) errors.price_slabs = slabErrors;

  return errors;
};

export const ConverterRTDAddProductScreen: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();
  const route = useRoute<{ params?: { productId?: number } }>();
  const productId = route.params?.productId;

  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const createProduct = useCreateRtdProduct();
  const updateProduct = useUpdateRtdProduct();
  const { data: product, isLoading: isLoadingProduct } = useGetRtdProductDetail(
    productId ?? 0,
    { enabled: !!productId && productId > 0 },
  );

  const isEdit = !!productId && productId > 0;

  useEffect(() => {
    if (!product || !isEdit) return;
    const p = product as RtdProduct;
    setForm({
      category: p.category ?? '',
      product_name: p.product_name ?? '',
      size: p.size ?? '',
      material: p.material ?? '',
      gsm: p.gsm ?? '',
      finish: p.finish ?? '',
      branding_method: p.branding_method ?? '',
      lead_time: (p.lead_time as RtdLeadTime) ?? '',
      moq: String(p.moq ?? ''),
      max_capacity: p.max_capacity != null ? String(p.max_capacity) : '',
      base_price: p.base_price ?? '',
      buy_now_enabled: p.buy_now_enabled ?? true,
      delivery_geography: p.delivery_geography ?? '',
      price_slabs:
        p.price_slabs && p.price_slabs.length > 0
          ? p.price_slabs.map((s) => ({
              min_qty: String(s.min_qty),
              max_qty: String(s.max_qty),
              price_per_unit: String(s.price_per_unit),
            }))
          : [{ min_qty: '', max_qty: '', price_per_unit: '' }],
    });
  }, [product, isEdit]);

  const updateField = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSlabsChange = useCallback((slabs: PriceSlabRow[]) => {
    updateField('price_slabs', slabs);
  }, [updateField]);

  const handleSubmit = useCallback(() => {
    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const priceSlabs = form.price_slabs
      .filter((s) => s.min_qty && s.max_qty && s.price_per_unit)
      .map((s) => ({
        min_qty: parseFloat(s.min_qty),
        max_qty: parseFloat(s.max_qty),
        price_per_unit: parseFloat(s.price_per_unit),
      }));

    if (isEdit && productId) {
      updateProduct.mutate(
        {
          id: productId,
          data: {
            product_name: form.product_name.trim(),
            image_path: null,
            size: form.size.trim() || undefined,
            material: form.material.trim() || undefined,
            gsm: form.gsm.trim() || undefined,
            finish: form.finish.trim() || undefined,
            branding_method: form.branding_method.trim() || undefined,
            lead_time: form.lead_time ? (form.lead_time as RtdLeadTime) : undefined,
            moq: parseFloat(form.moq),
            max_capacity: form.max_capacity ? parseFloat(form.max_capacity) : undefined,
            base_price: parseFloat(form.base_price),
            buy_now_enabled: form.buy_now_enabled,
            delivery_geography: form.delivery_geography.trim() || undefined,
            price_slabs: priceSlabs.length > 0 ? priceSlabs : undefined,
          },
        },
        {
          onSuccess: () => setShowSuccessModal(true),
          onError: (err: any) => {
            const msg =
              err?.response?.data?.message ??
              err?.message ??
              'Failed to update product';
            Alert.alert('Error', msg);
          },
        },
      );
    } else {
      const payload: CreateRtdProductRequest = {
        category: form.category.trim(),
        product_name: form.product_name.trim(),
        image_path: null,
        size: form.size.trim() || undefined,
        material: form.material.trim() || undefined,
        gsm: form.gsm.trim() || undefined,
        finish: form.finish.trim() || undefined,
        branding_method: form.branding_method.trim() || undefined,
        lead_time: form.lead_time as RtdLeadTime,
        moq: parseFloat(form.moq),
        max_capacity: form.max_capacity ? parseFloat(form.max_capacity) : undefined,
        base_price: parseFloat(form.base_price),
        buy_now_enabled: form.buy_now_enabled,
        delivery_geography: form.delivery_geography.trim() || undefined,
        price_slabs: priceSlabs,
      };
      createProduct.mutate(payload, {
        onSuccess: () => setShowSuccessModal(true),
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ??
            err?.message ??
            'Failed to list product';
          Alert.alert('Error', msg);
        },
      });
    }
  }, [form, isEdit, productId, createProduct, updateProduct]);

  const handleViewListing = useCallback(() => {
    setShowSuccessModal(false);
    navigation.navigate(SCREENS.CONVERTER_RTD.LISTING);
  }, [navigation]);

  const handleAddAnother = useCallback(() => {
    setShowSuccessModal(false);
    setForm(INITIAL_FORM);
    setErrors({});
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Product Details */}
        <View style={styles.sectionContainer}>
          <Text variant="h6" fontWeight="semibold" style={styles.sectionTitle}>
            Product Details
          </Text>
          <View style={styles.fieldContainer}>
            <Text variant="captionMedium" style={styles.label}>Category</Text>
            <TextInput
              value={form.category}
              onChangeText={(v) => updateField('category', v)}
              placeholder="e.g. Box"
              placeholderTextColor={theme.colors.text.placeholder}
              style={[styles.input, errors.category && styles.inputError, isEdit && styles.inputReadOnly]}
              editable={!isEdit}
            />
            {errors.category && (
              <Text variant="captionSmall" style={[styles.errorText, { color: theme.colors.error.DEFAULT }]}>
                {errors.category}
              </Text>
            )}
          </View>
          <View style={styles.fieldContainer}>
            <Text variant="captionMedium" style={styles.label}>Product Name</Text>
            <TextInput
              value={form.product_name}
              onChangeText={(v) => updateField('product_name', v)}
              placeholder="e.g. Corrugated Box 10x10"
              placeholderTextColor={theme.colors.text.placeholder}
              style={[styles.input, errors.product_name && styles.inputError]}
            />
            {errors.product_name && (
              <Text variant="captionSmall" style={[styles.errorText, { color: theme.colors.error.DEFAULT }]}>
                {errors.product_name}
              </Text>
            )}
          </View>
        </View>

        {/* Specifications */}
        <View style={styles.sectionContainer}>
          <Text variant="h6" fontWeight="semibold" style={styles.sectionTitle}>
            Specifications
          </Text>
          <View style={styles.fieldContainer}>
            <Text variant="captionMedium" style={styles.label}>Size</Text>
            <TextInput
              value={form.size}
              onChangeText={(v) => updateField('size', v)}
              placeholder="e.g. 10x10x10"
              placeholderTextColor={theme.colors.text.placeholder}
              style={styles.input}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text variant="captionMedium" style={styles.label}>Material</Text>
            <TextInput
              value={form.material}
              onChangeText={(v) => updateField('material', v)}
              placeholder="e.g. Paper"
              placeholderTextColor={theme.colors.text.placeholder}
              style={styles.input}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text variant="captionMedium" style={styles.label}>GSM</Text>
            <TextInput
              value={form.gsm}
              onChangeText={(v) => updateField('gsm', v)}
              placeholder="e.g. 300"
              placeholderTextColor={theme.colors.text.placeholder}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text variant="captionMedium" style={styles.label}>Finish</Text>
            <TextInput
              value={form.finish}
              onChangeText={(v) => updateField('finish', v)}
              placeholder="e.g. Matte"
              placeholderTextColor={theme.colors.text.placeholder}
              style={styles.input}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text variant="captionMedium" style={styles.label}>Branding Method</Text>
            <TextInput
              value={form.branding_method}
              onChangeText={(v) => updateField('branding_method', v)}
              placeholder="e.g. Sticker"
              placeholderTextColor={theme.colors.text.placeholder}
              style={styles.input}
            />
          </View>
        </View>

        {/* Pricing */}
        <View style={styles.sectionContainer}>
          <Text variant="h6" fontWeight="semibold" style={styles.sectionTitle}>
            Pricing
          </Text>
          <View style={styles.fieldContainer}>
            <Text variant="captionMedium" style={styles.label}>Lead Time</Text>
            <View style={styles.leadTimeChipsContainer}>
              {LEAD_TIME_OPTIONS.map((opt) => {
                const isActive = form.lead_time === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    style={[
                      styles.leadTimeChip,
                      isActive && styles.leadTimeChipActive,
                    ]}
                    onPress={() => updateField('lead_time', opt.value)}
                  >
                    <Text
                      variant="captionMedium"
                      style={[
                        styles.leadTimeChipText,
                        isActive && styles.leadTimeChipTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {errors.lead_time && (
              <Text variant="captionSmall" style={[styles.errorText, { color: theme.colors.error.DEFAULT }]}>
                {errors.lead_time}
              </Text>
            )}
          </View>
          <View style={styles.fieldContainer}>
            <Text variant="captionMedium" style={styles.label}>MOQ (units)</Text>
            <TextInput
              value={form.moq}
              onChangeText={(v) => updateField('moq', v)}
              placeholder="e.g. 10"
              placeholderTextColor={theme.colors.text.placeholder}
              keyboardType="numeric"
              style={[styles.input, errors.moq && styles.inputError]}
            />
            {errors.moq && (
              <Text variant="captionSmall" style={[styles.errorText, { color: theme.colors.error.DEFAULT }]}>
                {errors.moq}
              </Text>
            )}
          </View>
          <View style={styles.fieldContainer}>
            <Text variant="captionMedium" style={styles.label}>Max Capacity (optional)</Text>
            <TextInput
              value={form.max_capacity}
              onChangeText={(v) => updateField('max_capacity', v)}
              placeholder="e.g. 1000"
              placeholderTextColor={theme.colors.text.placeholder}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text variant="captionMedium" style={styles.label}>Base Price (₹ per unit)</Text>
            <TextInput
              value={form.base_price}
              onChangeText={(v) => updateField('base_price', v)}
              placeholder="e.g. 25.50"
              placeholderTextColor={theme.colors.text.placeholder}
              keyboardType="decimal-pad"
              style={[styles.input, errors.base_price && styles.inputError]}
            />
            {errors.base_price && (
              <Text variant="captionSmall" style={[styles.errorText, { color: theme.colors.error.DEFAULT }]}>
                {errors.base_price}
              </Text>
            )}
          </View>
          <View style={styles.switchRow}>
            <Text variant="bodyMedium" style={styles.switchLabel}>
              Buy Now Enabled
            </Text>
            <Switch
              value={form.buy_now_enabled}
              onValueChange={(v) => updateField('buy_now_enabled', v)}
              trackColor={{
                false: theme.colors.border.primary,
                true: theme.colors.primary[300],
              }}
              thumbColor={theme.colors.background.primary}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text variant="captionMedium" style={styles.label}>Price Slabs</Text>
            <PriceSlabInput
              slabs={form.price_slabs}
              onSlabsChange={handleSlabsChange}
              errors={errors.price_slabs ?? []}
            />
          </View>
        </View>

        {/* Delivery */}
        <View style={styles.sectionContainer}>
          <Text variant="h6" fontWeight="semibold" style={styles.sectionTitle}>
            Delivery
          </Text>
          <View style={styles.fieldContainer}>
            <Text variant="captionMedium" style={styles.label}>Delivery Geography</Text>
            <TextInput
              value={form.delivery_geography}
              onChangeText={(v) => updateField('delivery_geography', v)}
              placeholder="e.g. North India"
              placeholderTextColor={theme.colors.text.placeholder}
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.submitButtonContainer}>
          {isLoadingProduct ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="large" color={theme.colors.primary.DEFAULT} />
              <Text variant="bodyMedium" style={styles.loadingText}>Loading product...</Text>
            </View>
          ) : (
            <CustomButton
              title={isEdit ? 'Update Product' : 'List Product'}
              variant="gradient"
              onPress={handleSubmit}
              loading={createProduct.isPending || updateProduct.isPending}
              fullWidth
            />
          )}
        </View>
      </ScrollView>

      <ProductListingSuccessModal
        visible={showSuccessModal}
        productName={form.product_name}
        onViewListing={handleViewListing}
        onAddAnother={handleAddAnother}
        isUpdate={isEdit}
      />
    </KeyboardAvoidingView>
  );
};
