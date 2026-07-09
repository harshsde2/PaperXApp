import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BottomSheetFlatList, BottomSheetModal, BottomSheetModalProvider, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { GorhomBottomSheetModal } from '@shared/components/GorhomBottomSheetModal';
import { KeyboardDoneBar } from '@shared/components/KeyboardDoneBar';
import { useTheme } from '@theme/index';
import { AppIcon } from '@assets/svgs';
import { Card } from '@shared/components/Card';
import { CustomButton } from '@shared/components/CustomButton';
import { DropdownButton } from '@shared/components/DropdownButton';
import { ImagePicker } from '@shared/components/ImagePicker';
import MultiSelectBottomSheetContent from '@shared/components/MultiSelectBottomSheetContent';
import { LocationPicker } from '@shared/location';
import type { Location } from '@shared/location/types';
import { Text } from '@shared/components/Text';
import {
  useCreateMaterial,
  useCreateRtdProduct,
  useGetMaterialFinishesInfinite,
  useGetMaterialsInfinite,
  useGetProfile,
  useGetRtdProductDetail,
  useGetRtdEntitlement,
  useGetWalletBalance,
  useUpdateRtdProduct,
  useUploadImage,
  type CreateRtdProductRequest,
  type Material,
  type MaterialFinish,
  type RtdLeadTime,
  type RtdProduct,
} from '@services/api';
import { normalizePostingLocationsFromProfile } from '@services/api/userApi/locationNormalizer';
import { resolveMediaUrl } from '@shared/utils/resolveMediaUrl';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { showToast } from '@store/slices/uiSlice';
import { DeliveryLocationSheetContent } from '../../components/DeliveryLocationSheetContent';
import { PriceSlabInput } from '../../components/PriceSlabInput';
import type { PriceSlabRow } from '../../components/PriceSlabInput';
import { ProductListingSuccessModal } from '../../components/ProductListingSuccessModal';
import { RtdListingPackModal } from '../../components/RtdListingPackModal';
import type { FormData, FormErrors, SavedLocation } from './@types';
import {
  BRANDING_METHOD_OPTIONS,
  GST_RATE_OPTIONS,
  RTD_CATEGORY_OPTIONS,
  SIZE_UNIT_OPTIONS,
  THICKNESS_UNIT_OPTIONS,
} from './constants';
import { createStyles } from './styles';

const LEAD_TIME_OPTIONS: { value: RtdLeadTime; label: string }[] = [
  { value: 'H24', label: 'Within 24 hours' },
  { value: 'H48', label: '24-48 hours' },
  { value: 'DAYS_3_5', label: '48-72 hours' },
];

const INITIAL_FORM: FormData = {
  category: '',
  product_name: '',
  image: null,
  image_path: null,
  size: '',
  size_unit: 'inches',
  material_id: undefined,
  material: '',
  thickness: '',
  thickness_unit: 'GSM',
  finish_ids: [],
  finish: '',
  branding_enabled: false,
  branding_methods: [],
  branding_method: '',
  lead_time: '',
  moq: '',
  max_capacity: '',
  base_price: '',
  buy_now_enabled: true,
  gst_rate: '',
  delivery_geography: '',
  location_id: undefined,
  location_source: undefined,
  latitude: undefined,
  longitude: undefined,
  price_slabs: [{ min_qty: '', max_qty: '', price_per_unit: '' }],
};

const validateForm = (form: FormData): FormErrors => {
  const errors: FormErrors = {};
  if (!form.category?.trim()) errors.category = 'Category is required';
  // product_name is optional (additional details)
  if (!form.lead_time) errors.lead_time = 'Lead time is required';
  if (!form.delivery_geography?.trim()) errors.delivery_geography = 'Location is required';

  const moqNum = parseFloat(form.moq);
  if (!form.moq || isNaN(moqNum) || moqNum <= 0) errors.moq = 'MOQ must be greater than 0';

  const basePriceNum = parseFloat(form.base_price);
  if (!form.base_price || isNaN(basePriceNum) || basePriceNum <= 0) {
    errors.base_price = 'Base price must be greater than 0';
  }

  if (form.branding_enabled && form.branding_methods.length === 0) {
    errors.branding_methods = 'Select at least one branding method';
  }
  if (form.branding_methods.length > 2) {
    errors.branding_methods = 'You can select up to 2 branding methods only';
  }

  const slabErrors: string[] = [];
  const filledSlabs = form.price_slabs.filter(
    (slab) => slab.min_qty || slab.max_qty || slab.price_per_unit,
  );
  filledSlabs.forEach((slab, i) => {
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
  if (slabErrors.length > 0) errors.price_slabs = slabErrors;
  return errors;
};

export const ConverterRTDAddProductScreen: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();
  const route = useRoute();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { data: profileData } = useGetProfile();
  const productId = (route.params as { productId?: number } | undefined)?.productId;
  const isEdit = !!productId && productId > 0;

  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPackModal, setShowPackModal] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showSizeUnitPicker, setShowSizeUnitPicker] = useState(false);
  const [showThicknessUnitPicker, setShowThicknessUnitPicker] = useState(false);
  const [showGstPicker, setShowGstPicker] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [materialSearch, setMaterialSearch] = useState('');
  const [finishSearch, setFinishSearch] = useState('');
  const [brandingSearch, setBrandingSearch] = useState('');
  const [customMaterialName, setCustomMaterialName] = useState('');

  const categorySheetRef = useRef<BottomSheetModal>(null);
  const materialSheetRef = useRef<BottomSheetModal>(null);
  const finishSheetRef = useRef<BottomSheetModal>(null);
  const brandingSheetRef = useRef<BottomSheetModal>(null);
  const deliveryLocationSheetRef = useRef<BottomSheetModal>(null);

  const createProduct = useCreateRtdProduct();
  const { data: entitlementData } = useGetRtdEntitlement();
  const hasEntitlement = Boolean(
    entitlementData?.entitlement && (entitlementData.entitlement.remaining_slots ?? 0) > 0
  );
  const { data: wallet, isLoading: walletBalanceLoading, refetch: refetchWallet } = useGetWalletBalance();
  const updateProduct = useUpdateRtdProduct();
  const uploadImage = useUploadImage();
  const { mutateAsync: createMaterial, isPending: isCreatingMaterial } = useCreateMaterial();
  const { data: product, isLoading: isLoadingProduct } = useGetRtdProductDetail(productId ?? 0, {
    enabled: isEdit,
  });
  const {
    data: materialsData,
    isLoading: isLoadingMaterials,
    hasNextPage: hasNextMaterialsPage,
    isFetchingNextPage: isFetchingNextMaterialsPage,
    fetchNextPage: fetchNextMaterialsPage,
  } = useGetMaterialsInfinite(20);
  const { data: finishesData } = useGetMaterialFinishesInfinite(50);
  const isFormReady = !isEdit || !isLoadingProduct;

  const profileLocations = useMemo(
    () => normalizePostingLocationsFromProfile(profileData as any),
    [profileData],
  );
  const userLocations = useMemo<SavedLocation[]>(() => {
    const source = profileLocations.length > 0 ? profileLocations : Array.isArray(user?.locations) ? user.locations : [];
    return source
      .map((loc: any, index: number) => {
        const latitude = String(loc?.latitude ?? '').trim();
        const longitude = String(loc?.longitude ?? '').trim();
        if (!latitude || !longitude) return null;
        const idCandidate = Number(loc?.id);
        return {
          id: Number.isFinite(idCandidate) ? idCandidate : -(1000 + index + 1),
          type: loc?.type || loc?.source || 'saved_location',
          address: loc?.address || `${loc?.city || ''}${loc?.state ? `, ${loc.state}` : ''}`.trim(),
          latitude,
          longitude,
          city: loc?.city || '',
          state: loc?.state || null,
          source: loc?.source,
          backend_location_id:
            typeof loc?.backend_location_id === 'number'
              ? loc.backend_location_id
              : Number.isFinite(idCandidate) && idCandidate > 0
                ? idCandidate
                : undefined,
        } as SavedLocation;
      })
      .filter((item): item is SavedLocation => !!item);
  }, [profileLocations, user?.locations]);

  const allMaterials = useMemo<Material[]>(
    () => (materialsData?.pages ? materialsData.pages.flatMap((page) => page.materials) : []),
    [materialsData?.pages],
  );
  const allFinishes = useMemo<MaterialFinish[]>(
    () => (finishesData?.pages ? finishesData.pages.flatMap((page) => page.finishes) : []),
    [finishesData?.pages],
  );

  const updateField = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    if (!isEdit || !product) return;
    const p = product as RtdProduct;
    const brandingMethods = Array.isArray((p as any).branding_methods)
      ? ((p as any).branding_methods as string[])
      : p.branding_method
        ? p.branding_method.split(',').map((item) => item.trim()).filter(Boolean)
        : [];

    setForm({
      category: p.category ?? '',
      product_name: p.product_name ?? '',
      image: null,
      image_path: p.image_path ?? null,
      size: p.size ?? '',
      size_unit: ((p as any).size_unit as FormData['size_unit']) ?? 'inches',
      material_id: (p as any).material_id ?? undefined,
      material: p.material ?? '',
      thickness: ((p as any).thickness as string) ?? '',
      thickness_unit: ((p as any).thickness_unit as FormData['thickness_unit']) ?? 'GSM',
      finish_ids: Array.isArray((p as any).finish_ids) ? (p as any).finish_ids : [],
      finish: p.finish ?? '',
      branding_enabled: brandingMethods.length > 0,
      branding_methods: brandingMethods,
      branding_method: p.branding_method ?? '',
      lead_time: (p.lead_time as RtdLeadTime) ?? '',
      moq: String(p.moq ?? ''),
      max_capacity: p.max_capacity != null ? String(p.max_capacity) : '',
      base_price: p.base_price ?? '',
      buy_now_enabled: p.buy_now_enabled ?? true,
      gst_rate: (p as any).gst_rate ?? '',
      delivery_geography: p.delivery_geography ?? '',
      location_id: (p as any).location_id ?? undefined,
      location_source: (p as any).location_source ?? undefined,
      latitude: (p as any).latitude ?? undefined,
      longitude: (p as any).longitude ?? undefined,
      price_slabs:
        p.price_slabs && p.price_slabs.length > 0
          ? p.price_slabs.map((s) => ({
              min_qty: String(s.min_qty),
              max_qty: String(s.max_qty),
              price_per_unit: String(s.price_per_unit),
            }))
          : [{ min_qty: '', max_qty: '', price_per_unit: '' }],
    });
  }, [isEdit, product]);

  const selectedMaterialName = useMemo(() => {
    const fromList = form.material_id != null ? allMaterials.find((m) => m.id === form.material_id)?.name : '';
    return fromList || form.material;
  }, [allMaterials, form.material_id, form.material]);

  const selectedFinishesDisplay = useMemo(() => {
    if (form.finish_ids.length === 0) return '';
    const names = form.finish_ids
      .map((id) => allFinishes.find((item) => item.id === id)?.name)
      .filter(Boolean)
      .slice(0, 3);
    if (form.finish_ids.length > 3) return `${names.join(', ')} +${form.finish_ids.length - 3} more`;
    return names.join(', ');
  }, [allFinishes, form.finish_ids]);

  const selectedBrandingDisplay = useMemo(
    () => form.branding_methods.join(', '),
    [form.branding_methods],
  );

  const filteredCategories = useMemo(() => {
    const query = categorySearch.trim().toLowerCase();
    return query ? RTD_CATEGORY_OPTIONS.filter((item) => item.toLowerCase().includes(query)) : RTD_CATEGORY_OPTIONS;
  }, [categorySearch]);
  const filteredMaterials = useMemo(() => {
    const query = materialSearch.trim().toLowerCase();
    return query
      ? allMaterials.filter((item) => item.name.toLowerCase().includes(query) || (item.category || '').toLowerCase().includes(query))
      : allMaterials;
  }, [allMaterials, materialSearch]);
  const filteredBrandingMethods = useMemo(() => {
    const query = brandingSearch.trim().toLowerCase();
    return query ? BRANDING_METHOD_OPTIONS.filter((item) => item.toLowerCase().includes(query)) : BRANDING_METHOD_OPTIONS;
  }, [brandingSearch]);

  const handleSlabsChange = useCallback((slabs: PriceSlabRow[]) => updateField('price_slabs', slabs), [updateField]);
  const handleImageChange = useCallback(
    (image: import('@shared/utils/imagePicker').PickedImage | null) => {
      setForm((prev) => ({
        ...prev,
        image: image ?? null,
        image_path: image != null ? prev.image_path : null,
      }));
    },
    [],
  );
  const handleSavedLocationSelect = useCallback((savedLocation: SavedLocation) => {
    const addressText = savedLocation.address || `${savedLocation.city}${savedLocation.state ? `, ${savedLocation.state}` : ''}`.trim();
    setForm((prev) => ({
      ...prev,
      location_id: savedLocation.backend_location_id ?? savedLocation.id,
      location_source: 'saved',
      delivery_geography: addressText || prev.delivery_geography,
      latitude: parseFloat(savedLocation.latitude),
      longitude: parseFloat(savedLocation.longitude),
    }));
    deliveryLocationSheetRef.current?.dismiss();
  }, []);
  const handleLocationSelect = useCallback((location: Location) => {
    const addressText = location.address?.formattedAddress || location.address?.streetAddress || location.name || '';
    setForm((prev) => ({
      ...prev,
      location_id: undefined,
      location_source: 'manual',
      delivery_geography: addressText.trim() || prev.delivery_geography,
      latitude: location.latitude,
      longitude: location.longitude,
    }));
    setShowLocationPicker(false);
  }, []);

  const getSelectedLocationDisplay = useCallback(() => {
    if (form.location_id != null && form.location_source === 'saved') {
      const saved = userLocations.find((loc) => loc.id === form.location_id || loc.backend_location_id === form.location_id);
      if (saved) return saved.address || `${saved.city}${saved.state ? `, ${saved.state}` : ''}`.trim();
    }
    return form.delivery_geography || '';
  }, [form.delivery_geography, form.location_id, form.location_source, userLocations]);

  const handleAddCustomMaterial = useCallback(async () => {
    const name = customMaterialName.trim();
    if (!name) return;
    try {
      const material = await createMaterial({ name });
      updateField('material_id', material.id);
      updateField('material', material.name);
      setCustomMaterialName('');
      dispatch(showToast({ message: 'Material added successfully', type: 'success' }));
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Failed to add material';
      dispatch(showToast({ message: msg, type: 'error' }));
    }
  }, [createMaterial, customMaterialName, dispatch, updateField]);

  const toggleFinish = useCallback((id: number) => {
    setForm((prev) => {
      const next = new Set(prev.finish_ids);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      const finishText = Array.from(next)
        .map((itemId) => allFinishes.find((item) => item.id === itemId)?.name)
        .filter(Boolean)
        .join(', ');
      return { ...prev, finish_ids: Array.from(next), finish: finishText };
    });
  }, [allFinishes]);

  const toggleBrandingMethod = useCallback((method: string) => {
    setForm((prev) => {
      const exists = prev.branding_methods.includes(method);
      if (!exists && prev.branding_methods.length >= 2) {
        Alert.alert('Limit reached', 'You can select up to 2 branding methods.');
        return prev;
      }
      const next = exists ? prev.branding_methods.filter((item) => item !== method) : [...prev.branding_methods, method];
      return { ...prev, branding_methods: next, branding_method: next.join(', ') };
    });
  }, []);

  const performCreateProduct = useCallback(async () => {
    const priceSlabs = form.price_slabs
      .filter((slab) => slab.min_qty && slab.max_qty && slab.price_per_unit)
      .map((slab) => ({
        min_qty: parseFloat(slab.min_qty),
        max_qty: parseFloat(slab.max_qty),
        price_per_unit: parseFloat(slab.price_per_unit),
      }));

    let imagePath: string | null = form.image_path;
    if (form.image) {
      try {
        imagePath = await uploadImage.mutateAsync({ file: form.image });
      } catch (error: any) {
        Alert.alert('Error', error?.response?.data?.message ?? error?.message ?? 'Image upload failed');
        return;
      }
    }

    const payload: CreateRtdProductRequest = {
      category: form.category.trim(),
      product_name: form.product_name?.trim() ?? '',
      image_path: imagePath,
      size: form.size.trim() || undefined,
      size_unit: form.size ? (form.size_unit as 'inches' | 'cm' | 'mm') : undefined,
      material_id: form.material_id ?? undefined,
      material: form.material.trim() || undefined,
      thickness: form.thickness.trim() || undefined,
      thickness_unit: form.thickness ? (form.thickness_unit as 'GSM' | 'MM' | 'OUNCE' | 'BF' | 'MICRON') : undefined,
      finish_ids: form.finish_ids,
      finish: form.finish.trim() || undefined,
      branding_methods: form.branding_enabled ? form.branding_methods : [],
      branding_method: form.branding_enabled ? form.branding_method || undefined : undefined,
      lead_time: form.lead_time as RtdLeadTime,
      moq: parseFloat(form.moq),
      max_capacity: form.max_capacity ? parseFloat(form.max_capacity) : undefined,
      base_price: parseFloat(form.base_price),
      gst_rate: form.gst_rate || undefined,
      buy_now_enabled: form.buy_now_enabled,
      delivery_geography: form.delivery_geography.trim() || undefined,
      location_id: undefined,
      location_source: form.location_source,
      latitude: form.latitude,
      longitude: form.longitude,
      price_slabs: priceSlabs,
    };

    createProduct.mutate(payload, {
      onSuccess: () => setShowSuccessModal(true),
      onError: (error: any) => {
        const msg = error?.response?.data?.message ?? error?.message ?? 'Failed to list product';
        Alert.alert('Error', msg);
      },
    });
  }, [createProduct, form, uploadImage]);

  const handleSubmit = useCallback(async () => {
    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const onError = (error: any, update: boolean) => {
      const msg = error?.response?.data?.message ?? error?.message ?? (update ? 'Failed to update product' : 'Failed to list product');
      Alert.alert('Error', msg);
    };

    if (isEdit && productId) {
      const priceSlabs = form.price_slabs
        .filter((slab) => slab.min_qty && slab.max_qty && slab.price_per_unit)
        .map((slab) => ({
          min_qty: parseFloat(slab.min_qty),
          max_qty: parseFloat(slab.max_qty),
          price_per_unit: parseFloat(slab.price_per_unit),
        }));
      let imagePath: string | null = form.image_path;
      if (form.image) {
        try {
          imagePath = await uploadImage.mutateAsync({ file: form.image });
        } catch (error: any) {
          Alert.alert('Error', error?.response?.data?.message ?? error?.message ?? 'Image upload failed');
          return;
        }
      }
      const payload = {
        category: form.category.trim(),
        product_name: form.product_name?.trim() ?? '',
        image_path: imagePath,
        size: form.size.trim() || undefined,
        size_unit: form.size ? form.size_unit : undefined,
        material_id: form.material_id ?? undefined,
        material: form.material.trim() || undefined,
        thickness: form.thickness.trim() || undefined,
        thickness_unit: form.thickness ? form.thickness_unit : undefined,
        finish_ids: form.finish_ids,
        finish: form.finish.trim() || undefined,
        branding_methods: form.branding_enabled ? form.branding_methods : [],
        branding_method: form.branding_enabled ? form.branding_method || undefined : undefined,
        lead_time: form.lead_time as RtdLeadTime,
        moq: parseFloat(form.moq),
        max_capacity: form.max_capacity ? parseFloat(form.max_capacity) : undefined,
        base_price: parseFloat(form.base_price),
        gst_rate: form.gst_rate || undefined,
        buy_now_enabled: form.buy_now_enabled,
        delivery_geography: form.delivery_geography.trim() || undefined,
        location_id: undefined,
        location_source: form.location_source,
        latitude: form.latitude,
        longitude: form.longitude,
        price_slabs: priceSlabs,
      };
      updateProduct.mutate(
        { id: productId, data: payload as any },
        { onSuccess: () => setShowSuccessModal(true), onError: (error: any) => onError(error, true) },
      );
      return;
    }

    if (!hasEntitlement) {
      void refetchWallet();
      setShowPackModal(true);
      return;
    }

    performCreateProduct();
  }, [form, isEdit, productId, hasEntitlement, performCreateProduct, updateProduct, uploadImage, refetchWallet]);

  const handlePackPurchaseSuccess = useCallback(() => {
    setShowPackModal(false);
    performCreateProduct();
  }, [performCreateProduct]);

  if (!isFormReady) {
    return null;
  }

  return (
    <BottomSheetModalProvider>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <Animated.View style={styles.container} entering={FadeIn.duration(300)}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {!isEdit && (
            hasEntitlement ? (
              <View style={[styles.slotsBanner, styles.slotsBannerHasSlots]}>
                <View style={styles.slotsBannerText}>
                  <Text variant="bodySmall" fontWeight="semibold" style={styles.slotsBannerTitle}>
                    {entitlementData?.entitlement?.remaining_slots} of {entitlementData?.entitlement?.product_limit} listing slots left
                  </Text>
                  <Text variant="captionSmall" style={styles.slotsBannerSubtitle}>
                    This product uses 1 slot. No payment needed while slots remain.
                  </Text>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.slotsBanner, styles.slotsBannerNoSlots]}
                onPress={() => setShowPackModal(true)}
                activeOpacity={0.7}
              >
                <View style={styles.slotsBannerText}>
                  <Text variant="bodySmall" fontWeight="semibold" style={styles.slotsBannerTitle}>
                    No listing slots left
                  </Text>
                  <Text variant="captionSmall" style={styles.slotsBannerSubtitle}>
                    Buy a listing pack to add products.
                  </Text>
                </View>
                <Text variant="bodySmall" style={styles.slotsBannerCta}>Buy a pack</Text>
              </TouchableOpacity>
            )
          )}
          <Card style={styles.card}>
            <Text variant="h6" fontWeight="semibold" style={styles.sectionTitle}>Product Details</Text>
            <View style={styles.fieldContainer}>
              <Text variant="bodySmall" style={styles.label}>Category</Text>
              <DropdownButton value={form.category} placeholder="Select category" onPress={() => categorySheetRef.current?.present()} disabled={isEdit} />
              {!!errors.category && <Text variant="captionSmall" style={styles.errorText}>{errors.category}</Text>}
            </View>
            <View style={styles.fieldContainer}>
              <Text variant="bodySmall" style={styles.label}>Additional details about the product / Mention use of this product (Optional)</Text>
              <TextInput
                value={form.product_name}
                onChangeText={(value) => updateField('product_name', value)}
                placeholder="e.g. Corrugated box with matte finish"
                placeholderTextColor={theme.colors.text.placeholder}
                style={[styles.input, errors.product_name && styles.inputError]}
                multiline
                numberOfLines={3}
              />
              {!!errors.product_name && <Text variant="captionSmall" style={styles.errorText}>{errors.product_name}</Text>}
            </View>
            <View style={styles.fieldContainer}>
              <Text variant="bodySmall" style={styles.label}>Product Image</Text>
              <ImagePicker
                value={form.image}
                onChange={handleImageChange}
                previewUri={resolveMediaUrl(form.image_path)}
                placeholderText="Add product photo"
                showCamera
              />
            </View>
          </Card>

          <Card style={styles.card}>
            <Text variant="h6" fontWeight="semibold" style={styles.sectionTitle}>Specifications</Text>
            <View style={styles.row}>
              <View style={[styles.fieldContainer, styles.halfField, { marginRight: theme.spacing[2] }]}>
                <Text variant="bodySmall" style={styles.label}>Size</Text>
                <TextInput value={form.size} onChangeText={(v) => updateField('size', v)} placeholder="e.g. 10x10" placeholderTextColor={theme.colors.text.placeholder} style={styles.input} />
              </View>
              <View style={[styles.fieldContainer, styles.halfField, { marginLeft: theme.spacing[2] }]}>
                <Text variant="bodySmall" style={styles.label}>Unit</Text>
                <DropdownButton value={SIZE_UNIT_OPTIONS.find((item) => item.value === form.size_unit)?.label} placeholder="Select unit" onPress={() => setShowSizeUnitPicker(true)} />
              </View>
            </View>
            <View style={styles.fieldContainer}>
              <Text variant="bodySmall" style={styles.label}>Material (Optional)</Text>
              <DropdownButton value={selectedMaterialName} placeholder="Select material" onPress={() => materialSheetRef.current?.present()} />
            </View>
            <View style={styles.fieldContainer}>
              <View style={styles.labelRow}>
                <Text variant="bodySmall" style={styles.label}>Custom Material</Text>
                <Text variant="captionMedium" style={styles.optionalLabel}>(Optional)</Text>
              </View>
              <View style={styles.customMaterialRow}>
                <TextInput style={styles.customMaterialInput} value={customMaterialName} onChangeText={setCustomMaterialName} placeholder="Enter material if not in list" placeholderTextColor={theme.colors.text.tertiary} />
                <TouchableOpacity style={[styles.addMaterialButton, isCreatingMaterial && { opacity: 0.6 }]} onPress={handleAddCustomMaterial} disabled={isCreatingMaterial || !customMaterialName.trim()}>
                  {isCreatingMaterial ? <ActivityIndicator size="small" color={theme.colors.text.inverse} /> : <Text variant="bodyMedium" style={styles.buttonText}>Add</Text>}
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.fieldContainer, styles.halfField, { marginRight: theme.spacing[2] }]}>
                <View style={styles.labelRow}>
                  <Text variant="bodySmall" style={styles.label}>Thickness</Text>
                  <Text variant="captionMedium" style={styles.optionalLabel}>(Optional)</Text>
                </View>
                <TextInput value={form.thickness} onChangeText={(v) => updateField('thickness', v)} placeholder="e.g. 350" placeholderTextColor={theme.colors.text.placeholder} keyboardType="numeric" style={styles.input} />
              </View>
              <View style={[styles.fieldContainer, styles.halfField, { marginLeft: theme.spacing[2] }]}>
                <Text variant="bodySmall" style={styles.label}>Unit</Text>
                <DropdownButton value={THICKNESS_UNIT_OPTIONS.find((item) => item.value === form.thickness_unit)?.label} placeholder="Select unit" onPress={() => setShowThicknessUnitPicker(true)} />
              </View>
            </View>
            <View style={styles.fieldContainer}>
              <View style={styles.labelRow}>
                <Text variant="bodySmall" style={styles.label}>Grade / Finish / Certifications</Text>
                <Text variant="captionMedium" style={styles.optionalLabel}>(Optional)</Text>
              </View>
              <DropdownButton value={selectedFinishesDisplay} placeholder="Select finish options" onPress={() => finishSheetRef.current?.present()} />
            </View>
            <View style={styles.fieldContainer}>
              <View style={styles.switchRow}>
                <Text variant="bodyMedium" style={styles.switchLabel}>Enable branding methods / Printing methods (Optional)</Text>
                <Switch
                  value={form.branding_enabled}
                  onValueChange={(value) => {
                    updateField('branding_enabled', value);
                    if (!value) {
                      updateField('branding_methods', []);
                      updateField('branding_method', '');
                    }
                  }}
                  trackColor={{ false: theme.colors.border.primary, true: theme.colors.primary[300] }}
                  thumbColor={theme.colors.background.primary}
                />
              </View>
              {form.branding_enabled && (
                <>
                  <DropdownButton value={selectedBrandingDisplay} placeholder="Select up to 2 methods" onPress={() => brandingSheetRef.current?.present()} />
                  {!!errors.branding_methods && <Text variant="captionSmall" style={styles.errorText}>{errors.branding_methods}</Text>}
                </>
              )}
            </View>
          </Card>

          <Card style={styles.card}>
            <Text variant="h6" fontWeight="semibold" style={styles.sectionTitle}>Pricing and Other Details</Text>
            <View style={styles.fieldContainer}>
              <Text variant="bodySmall" style={styles.label}>Dispatch Lead Time</Text>
              <View style={styles.leadTimeChipsContainer}>
                {LEAD_TIME_OPTIONS.map((opt) => {
                  const isActive = form.lead_time === opt.value;
                  return (
                    <Pressable key={opt.value} style={[styles.leadTimeChip, isActive && styles.leadTimeChipActive]} onPress={() => updateField('lead_time', opt.value)}>
                      <Text variant="captionMedium" style={[styles.leadTimeChipText, isActive && styles.leadTimeChipTextActive]}>{opt.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
              <Text variant="captionSmall" color={theme.colors.text.tertiary} size={12} style={{fontStyle: 'italic'}} >This is a commitment. Failure to honour affects your visibility & trust score and may result in the product being de-listed.</Text>
              {!!errors.lead_time && <Text variant="captionSmall" style={styles.errorText}>{errors.lead_time}</Text>}
            </View>
            <Text variant="h6" fontWeight="semibold" style={styles.sectionTitle}>Standard Capacity and Price Details</Text>

            <View style={styles.fieldContainer}>
              <Text variant="bodySmall" style={styles.label}>MOQ per order</Text>
              <TextInput value={form.moq} onChangeText={(v) => updateField('moq', v)} placeholder="e.g. 10" placeholderTextColor={theme.colors.text.placeholder} keyboardType="numeric" style={[styles.input, errors.moq && styles.inputError]} />
              {!!errors.moq && <Text variant="captionSmall" style={styles.errorText}>{errors.moq}</Text>}
            </View>
            <View style={styles.fieldContainer}>
              <Text variant="bodySmall" style={styles.label}>Max Capacity (optional)</Text>
              <TextInput value={form.max_capacity} onChangeText={(v) => updateField('max_capacity', v)} placeholder="e.g. 1000" placeholderTextColor={theme.colors.text.placeholder} keyboardType="numeric" style={styles.input} />
            </View>
            <View style={styles.fieldContainer}>
              <Text variant="bodySmall" style={styles.label}>Base Price (₹ per unit)</Text>
              <TextInput value={form.base_price} onChangeText={(v) => updateField('base_price', v)} placeholder="e.g. 25.50" placeholderTextColor={theme.colors.text.placeholder} keyboardType="decimal-pad" style={[styles.input, errors.base_price && styles.inputError]} />
              {!!errors.base_price && <Text variant="captionSmall" style={styles.errorText}>{errors.base_price}</Text>}
            </View>
            <View style={styles.fieldContainer}>
              <View style={styles.labelRow}>
                <Text variant="bodySmall" style={styles.label}>GST Rate</Text>
                <Text variant="captionMedium" style={styles.optionalLabel}>(Optional)</Text>
              </View>
              <DropdownButton
                value={GST_RATE_OPTIONS.find((o) => o.value === form.gst_rate)?.label}
                placeholder="Select GST rate"
                onPress={() => setShowGstPicker(true)}
              />
            </View>
            <Text variant="h6" fontWeight="semibold" style={styles.sectionTitle}>Price slab according to the quantity (Optional)</Text>
            <View style={styles.fieldContainer}>
              <PriceSlabInput slabs={form.price_slabs} onSlabsChange={handleSlabsChange} errors={errors.price_slabs ?? []} />
            </View>
          </Card>

          <Card style={styles.card}>
            <Text variant="h6" fontWeight="semibold" style={styles.sectionTitle}>Dispatch</Text>
            <View style={styles.fieldContainer}>
              <Text variant="bodySmall" style={styles.label}>Dispatch Location</Text>
              <TouchableOpacity style={styles.locationButton} onPress={() => deliveryLocationSheetRef.current?.present()}>
                <View style={{ flex: 1 }}>
                  <Text variant="bodyMedium" style={!getSelectedLocationDisplay() ? { color: theme.colors.text.tertiary } : { color: theme.colors.text.primary }} numberOfLines={1}>
                    {getSelectedLocationDisplay() || 'Select delivery location'}
                  </Text>
                </View>
                <AppIcon.ChevronDown width={20} height={20} color={theme.colors.text.tertiary} />
              </TouchableOpacity>
              {!!errors.delivery_geography && <Text variant="captionSmall" style={styles.errorText}>{errors.delivery_geography}</Text>}
            </View>
          </Card>

          <Card style={styles.card}>
            <View style={styles.switchRow}>
              <Text variant="bodyMedium" style={styles.switchLabel}>Buy Now Available</Text>
              <Switch value={form.buy_now_enabled} onValueChange={(v) => updateField('buy_now_enabled', v)} trackColor={{ false: theme.colors.border.primary, true: theme.colors.primary[300] }} thumbColor={theme.colors.background.primary} />
            </View>
          </Card>

          <View style={styles.submitButtonContainer}>
            <CustomButton title={isEdit ? 'Update Product' : 'List Product'} variant="gradient" onPress={handleSubmit} loading={uploadImage.isPending || createProduct.isPending || updateProduct.isPending} fullWidth />
          </View>
        </ScrollView>
        </Animated.View>

        <RtdListingPackModal
          visible={showPackModal}
          onClose={() => setShowPackModal(false)}
          onPurchaseSuccess={handlePackPurchaseSuccess}
          walletBalance={wallet?.balance ?? 0}
          walletBalanceLoading={walletBalanceLoading}
        />
        <ProductListingSuccessModal
          visible={showSuccessModal}
          productName={form.product_name?.trim() || form.category}
          onViewListing={() => {
            setShowSuccessModal(false);
            navigation.goBack();
          }}
          onAddAnother={() => {
            setShowSuccessModal(false);
            setForm(INITIAL_FORM);
            setErrors({});
          }}
          isUpdate={isEdit}
        />
      </KeyboardAvoidingView>

      <KeyboardDoneBar />

      <GorhomBottomSheetModal
        ref={categorySheetRef}
        snapPoints={['70%', '95%']}
        enablePanDownToClose
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        onDismiss={() => setCategorySearch('')}
      >
        <View style={styles.sheetContainer}>
          <Text variant="h4" fontWeight="semibold" style={styles.sheetTitle}>Select Category</Text>
          <BottomSheetTextInput
            value={categorySearch}
            onChangeText={setCategorySearch}
            placeholder="Search category..."
            placeholderTextColor={theme.colors.text.tertiary}
            style={styles.searchInput}
          />
          <BottomSheetFlatList
            data={filteredCategories}
            keyExtractor={(item: string) => item}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }: { item: string }) => (
              <TouchableOpacity style={styles.sheetOption} onPress={() => { updateField('category', item); categorySheetRef.current?.dismiss(); }}>
                <Text variant="bodyMedium">{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </GorhomBottomSheetModal>

      <GorhomBottomSheetModal
        ref={materialSheetRef}
        snapPoints={['70%', '95%']}
        enablePanDownToClose
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        onDismiss={() => setMaterialSearch('')}
      >
        <View style={styles.sheetContainer}>
          <Text variant="h4" fontWeight="semibold" style={styles.sheetTitle}>Select Material</Text>
          <BottomSheetTextInput
            value={materialSearch}
            onChangeText={setMaterialSearch}
            placeholder="Search material..."
            placeholderTextColor={theme.colors.text.tertiary}
            style={styles.searchInput}
          />
          <BottomSheetFlatList
            data={filteredMaterials}
            keyExtractor={(item: Material) => `material-${item.id}`}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }: { item: Material }) => (
              <TouchableOpacity style={styles.sheetOption} onPress={() => { updateField('material_id', item.id); updateField('material', item.name); materialSheetRef.current?.dismiss(); }}>
                <Text variant="bodyMedium">{item.name}</Text>
              </TouchableOpacity>
            )}
            onEndReached={() => {
              if (hasNextMaterialsPage && !isFetchingNextMaterialsPage) fetchNextMaterialsPage();
            }}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              isFetchingNextMaterialsPage ? (
                <View style={styles.loadingMore}>
                  <ActivityIndicator size="small" color={theme.colors.primary.DEFAULT} />
                </View>
              ) : null
            }
            ListEmptyComponent={
              isLoadingMaterials ? (
                <View style={styles.loadingMore}>
                  <ActivityIndicator size="small" color={theme.colors.primary.DEFAULT} />
                </View>
              ) : null
            }
          />
        </View>
      </GorhomBottomSheetModal>

      <GorhomBottomSheetModal ref={finishSheetRef} snapPoints={['70%', '95%']} enablePanDownToClose doneFooter onDismiss={() => setFinishSearch('')}>
        <MultiSelectBottomSheetContent
          title="Select Grade / Finish / Certifications"
          searchQuery={finishSearch}
          onSearchChange={setFinishSearch}
          items={allFinishes.map((item) => ({ id: item.id, name: item.name }))}
          selectedIds={form.finish_ids}
          onSelect={toggleFinish}
          onDeselect={toggleFinish}
          theme={theme}
          ListComponent={BottomSheetFlatList}
        />
      </GorhomBottomSheetModal>

      <GorhomBottomSheetModal
        ref={brandingSheetRef}
        snapPoints={['80%']}
        enablePanDownToClose
        doneFooter
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        onDismiss={() => setBrandingSearch('')}
      >
        <View style={styles.sheetContainer}>
          <Text variant="h4" fontWeight="semibold" style={styles.sheetTitle}>Select Branding Methods (max 2)</Text>
          <BottomSheetTextInput
            value={brandingSearch}
            onChangeText={setBrandingSearch}
            placeholder="Search branding method..."
            placeholderTextColor={theme.colors.text.tertiary}
            style={styles.searchInput}
          />
          <BottomSheetFlatList
            data={filteredBrandingMethods}
            keyExtractor={(item: string) => item}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 96 }}
            renderItem={({ item }: { item: string }) => (
              <TouchableOpacity style={styles.sheetOption} onPress={() => toggleBrandingMethod(item)}>
                <Text variant="bodyMedium" style={{ flex: 1 }}>{item}</Text>
                {form.branding_methods.includes(item) && <AppIcon.TickCheckedBox width={20} height={20} color={theme.colors.primary.DEFAULT} />}
              </TouchableOpacity>
            )}
          />
        </View>
      </GorhomBottomSheetModal>

      <GorhomBottomSheetModal ref={deliveryLocationSheetRef} snapPoints={['50%', '85%']} enablePanDownToClose>
        <DeliveryLocationSheetContent
          userLocations={userLocations}
          selectedLocationId={form.location_id}
          selectedSource={form.location_source}
          onSelectSavedLocation={handleSavedLocationSelect}
          onAddLocation={() => {
            deliveryLocationSheetRef.current?.dismiss();
            setShowLocationPicker(true);
          }}
          theme={theme}
          ListComponent={BottomSheetFlatList}
        />
      </GorhomBottomSheetModal>

      <Modal visible={showLocationPicker} animationType="slide" presentationStyle="fullScreen" onRequestClose={() => setShowLocationPicker(false)}>
        <LocationPicker
          initialLocation={form.latitude != null && form.longitude != null ? { latitude: form.latitude, longitude: form.longitude } : undefined}
          onLocationSelect={handleLocationSelect}
          onCancel={() => setShowLocationPicker(false)}
          allowMapTap
          confirmButtonText="Confirm Location"
          title="Select Delivery Location"
        />
      </Modal>

      {showSizeUnitPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text variant="h4" fontWeight="semibold">Select Size Unit</Text>
              <TouchableOpacity onPress={() => setShowSizeUnitPicker(false)}>
                <Text style={styles.closeIcon}>x</Text>
              </TouchableOpacity>
            </View>
            {SIZE_UNIT_OPTIONS.map((option) => (
              <TouchableOpacity key={option.value} style={styles.modalOption} onPress={() => { updateField('size_unit', option.value); setShowSizeUnitPicker(false); }}>
                <Text variant="bodyMedium">{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {showThicknessUnitPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text variant="h4" fontWeight="semibold">Select Thickness Unit</Text>
              <TouchableOpacity onPress={() => setShowThicknessUnitPicker(false)}>
                <Text style={styles.closeIcon}>x</Text>
              </TouchableOpacity>
            </View>
            {THICKNESS_UNIT_OPTIONS.map((option) => (
              <TouchableOpacity key={option.value} style={styles.modalOption} onPress={() => { updateField('thickness_unit', option.value); setShowThicknessUnitPicker(false); }}>
                <Text variant="bodyMedium">{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {showGstPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text variant="h4" fontWeight="semibold">Select GST Rate</Text>
              <TouchableOpacity onPress={() => setShowGstPicker(false)}>
                <Text style={styles.closeIcon}>x</Text>
              </TouchableOpacity>
            </View>
            {GST_RATE_OPTIONS.map((option) => (
              <TouchableOpacity key={option.value} style={[styles.modalOption, form.gst_rate === option.value && { backgroundColor: theme.colors.primary[50] }]} onPress={() => { updateField('gst_rate', option.value); setShowGstPicker(false); }}>
                <Text variant="bodyMedium">{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </BottomSheetModalProvider>
  );
};
