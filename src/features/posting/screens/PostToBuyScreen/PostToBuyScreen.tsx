import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Alert,
  Modal,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Controller } from 'react-hook-form';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { FloatingBottomContainer } from '@shared/components/FloatingBottomContainer';
import { DropdownButton } from '@shared/components/DropdownButton';
import { useBottomSheet } from '@shared/components/BottomSheet';
import { LocationPicker } from '@shared/location';
import type { Location } from '@shared/location/types';
import { AppIcon } from '@assets/svgs';
import { useTheme, Theme } from '@theme/index';
import { useForm, FormInput, validationRules } from '@shared/forms';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGetMaterialsInfinite, Material } from '@services/api';
import { usePostDealerRequirement } from '@services/api';
import { useAppDispatch } from '@store/hooks';
import { showToast } from '@store/slices/uiSlice';
import { MainStackParamList } from '@navigation/MainNavigator';
import { SCREENS } from '@navigation/constants';
import { createStyles } from './styles';
import { PostToBuyFormData } from './@types';
import { MaterialsSelectionContent } from './MaterialsSelectionContent';

const ITEMS_PER_PAGE = 20;
const END_REACHED_THRESHOLD = 0.2;

export interface MaterialItemProps {
  material: Material;
  isSelected: boolean;
  onToggle: (materialId: number) => void;
  styles: any;
  theme: Theme;
}

export const MaterialItem = React.memo(
  ({ material, isSelected, onToggle, styles, theme }: MaterialItemProps) => {
    const handlePress = useCallback(() => {
      onToggle(material.id);
    }, [material.id, onToggle]);

    return (
      <TouchableOpacity
        style={[styles.materialItem, { paddingLeft: theme.spacing[4] }]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.materialItemContent}>
          <Text variant="bodyMedium" style={styles.materialItemName}>
            {material.name}
          </Text>
          {material.category && (
            <Text variant="captionSmall" style={styles.materialItemCategory}>
              {material.category}
            </Text>
          )}
        </View>
        {isSelected ? (
          <AppIcon.TickCheckedBox
            width={24}
            height={24}
            color={theme.colors.primary.DEFAULT}
          />
        ) : (
          <AppIcon.UntickCheckedBox
            width={24}
            height={24}
            color={theme.colors.text.primary}
          />
        )}
      </TouchableOpacity>
    );
  },
  // Custom comparison function to only re-render when selection or material data changes
  (prevProps, nextProps) => {
    return (
      prevProps.material.id === nextProps.material.id &&
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.material.name === nextProps.material.name &&
      prevProps.material.category === nextProps.material.category
    );
  }
);

MaterialItem.displayName = 'MaterialItem';

const INQUIRY_TYPE_OPTIONS = [
  { label: 'Material', value: 'material' },
  { label: 'Machine', value: 'machine' },
  { label: 'Job', value: 'job' },
];

const THICKNESS_UNIT_OPTIONS = [
  { label: 'GSM', value: 'GSM' },
  { label: 'MM', value: 'MM' },
  { label: 'OUNCE', value: 'OUNCE' },
  { label: 'BF', value: 'BF' },
  { label: 'MICRON', value: 'MICRON' },
];

const QUANTITY_UNIT_OPTIONS = [
  { label: 'kg', value: 'kg' },
  { label: 'tons', value: 'tons' },
  { label: 'sheets', value: 'sheets' },
  { label: 'reams', value: 'reams' },
  { label: 'rolls', value: 'rolls' },
  { label: 'pieces', value: 'pieces' },
];

const PRICE_UNIT_OPTIONS = [
  { label: 'Per Sheet', value: 'per_sheet' },
  { label: 'Per kg', value: 'per_kg' },
  { label: 'Per Ton', value: 'per_ton' },
  { label: 'Per Ream', value: 'per_ream' },
  { label: 'Per Roll', value: 'per_roll' },
  { label: 'Per Piece', value: 'per_piece' },
];

const PRICE_NEGOTIABLE_OPTIONS = [
  { label: 'Yes', value: 'true' },
  { label: 'No', value: 'false' },
];

const URGENCY_OPTIONS = [
  { label: 'Normal', value: 'normal' },
  { label: 'Urgent', value: 'urgent' },
];

const PostToBuyScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const bottomSheet = useBottomSheet();
  const dispatch = useAppDispatch();

  const { mutate: postRequirement, isPending: isSubmitting } = usePostDealerRequirement();

  const {
    data: materialsData,
    isLoading: isLoadingMaterials,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetMaterialsInfinite(ITEMS_PER_PAGE);

  const { control, handleSubmit, setValue, watch } = useForm<PostToBuyFormData>({
    defaultValues: {
      inquiry_type: 'material',
      intent: 'buy',
      title: '',
      description: '',
      material_ids: [],
      thickness: undefined,
      thickness_unit: 'GSM',
      size: '',
      quantity: undefined,
      quantity_unit: 'sheets',
      price: undefined,
      price_unit: 'per_sheet',
      price_negotiable: true,
      urgency: 'normal',
      location: '',
      latitude: undefined,
      longitude: undefined,
      deadline: '',
    },
    mode: 'onBlur',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<Set<number>>(new Set());
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [isMaterialsSheetOpen, setIsMaterialsSheetOpen] = useState(false);
  const [showInquiryTypePicker, setShowInquiryTypePicker] = useState(false);
  const [showThicknessUnitPicker, setShowThicknessUnitPicker] = useState(false);
  const [showQuantityUnitPicker, setShowQuantityUnitPicker] = useState(false);
  const [showPriceUnitPicker, setShowPriceUnitPicker] = useState(false);
  const [showPriceNegotiablePicker, setShowPriceNegotiablePicker] = useState(false);
  const [showUrgencyPicker, setShowUrgencyPicker] = useState(false);

  const isLoadingMoreRef = useRef(false);
  const scrollViewRef = useRef<FlatList>(null);

  const inquiryType = watch('inquiry_type');
  const locationValue = watch('location');
  const latitudeValue = watch('latitude');
  const longitudeValue = watch('longitude');

  const allMaterials = useMemo(() => {
    if (!materialsData?.pages) return [];
    const allMaterialsList = materialsData.pages.flatMap(page => page.materials);
    
    // Deduplicate materials by name and category
    const materialsMap = new Map<string, Material>();
    allMaterialsList.forEach(material => {
      const key = `${(material.name || '').toLowerCase().trim()}-${(material.category || 'Other').toLowerCase().trim()}`;
      if (!materialsMap.has(key)) {
        materialsMap.set(key, material);
      }
    });
    
    return Array.from(materialsMap.values());
  }, [materialsData?.pages]);

  const toggleMaterial = useCallback((materialId: number) => {
    setSelectedMaterialIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(materialId)) {
        newSet.delete(materialId);
      } else {
        newSet.add(materialId);
      }
      setValue('material_ids', Array.from(newSet), { shouldValidate: true });
      return newSet;
    });
  }, [setValue]);

  const clearMaterials = useCallback(() => {
    setSelectedMaterialIds(new Set());
    setValue('material_ids', [], { shouldValidate: true });
  }, [setValue]);

  const isMaterialSelected = useCallback(
    (materialId: number) => selectedMaterialIds.has(materialId),
    [selectedMaterialIds],
  );

  const filteredMaterials = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return allMaterials;
    
    return allMaterials.filter(material =>
      material.name.toLowerCase().includes(query) ||
      material.category?.toLowerCase().includes(query)
    );
  }, [allMaterials, searchQuery]);

  const handleLocationSelect = useCallback(
    (location: Location) => {
      setValue('location', location.address?.formattedAddress || location.address?.streetAddress || location.name || '', {
        shouldValidate: true,
      });
      setValue('latitude', location.latitude, {
        shouldValidate: true,
      });
      setValue('longitude', location.longitude, {
        shouldValidate: true,
      });
      setShowLocationPicker(false);
      
      dispatch(
        showToast({
          message: 'Location selected successfully!',
          type: 'success',
        }),
      );
    },
    [setValue, dispatch],
  );

  const handleLoadMore = useCallback(() => {
    if (isLoadingMoreRef.current || isFetchingNextPage) {
      return;
    }

    const canLoadMore = hasNextPage !== false;

    if (!canLoadMore) {
      return;
    }

    isLoadingMoreRef.current = true;

    fetchNextPage().catch(error => {
      console.error('Error fetching next page:', error);
      isLoadingMoreRef.current = false;
    });
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  React.useEffect(() => {
    if (!isFetchingNextPage) {
      const timer = setTimeout(() => {
        isLoadingMoreRef.current = false;
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isFetchingNextPage]);

  const handleScroll = useCallback(
    (event: any) => {
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent;

      if (!contentSize.height || !layoutMeasurement.height) {
        return;
      }

      const distanceFromEnd =
        contentSize.height - (layoutMeasurement.height + contentOffset.y);
      const paddingToBottom = 500;

      const isCloseToBottom = distanceFromEnd < paddingToBottom;
      const canLoadMore =
        (hasNextPage !== false) &&
        !isFetchingNextPage &&
        !isLoadingMoreRef.current;

      if (isCloseToBottom && canLoadMore) {
        handleLoadMore();
      }
    },
    [hasNextPage, isFetchingNextPage, handleLoadMore],
  );

  // Memoize selected IDs array to prevent unnecessary re-renders
  const selectedIdsArray = useMemo(() => {
    return Array.from(selectedMaterialIds).sort((a, b) => a - b);
  }, [selectedMaterialIds]);

  // Create bottom sheet content component
  const createMaterialsSheetContent = useCallback(() => {
    return (
      <MaterialsSelectionContent
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedMaterialIds={selectedIdsArray}
        materials={allMaterials}
        filteredMaterials={filteredMaterials}
        isLoading={isLoadingMaterials}
        isFetchingNextPage={isFetchingNextPage}
        onToggle={toggleMaterial}
        onClear={clearMaterials}
        onLoadMore={handleLoadMore}
        onScroll={handleScroll}
        theme={theme}
      />
    );
  }, [
    searchQuery,
    selectedIdsArray,
    allMaterials,
    filteredMaterials,
    isLoadingMaterials,
    isFetchingNextPage,
    toggleMaterial,
    clearMaterials,
    handleLoadMore,
    handleScroll,
    theme,
  ]);

  // Update bottom sheet content when selection changes (only if sheet is open)
  // Use a ref to prevent unnecessary updates
  const lastSelectedIdsRef = useRef<string>('');
  React.useEffect(() => {
    if (isMaterialsSheetOpen && bottomSheet.isOpen) {
      const currentIdsKey = selectedIdsArray.join(',');
      // Only update if selection actually changed
      if (currentIdsKey !== lastSelectedIdsRef.current) {
        lastSelectedIdsRef.current = currentIdsKey;
        // Use a small debounce to batch rapid changes
        const timeoutId = setTimeout(() => {
          bottomSheet.updateContent(createMaterialsSheetContent());
        }, 50);
        return () => clearTimeout(timeoutId);
      }
    } else {
      lastSelectedIdsRef.current = '';
    }
  }, [selectedIdsArray, isMaterialsSheetOpen, bottomSheet, createMaterialsSheetContent]);

  const onSubmit = useCallback(
    (data: PostToBuyFormData) => {
      // Validate material_ids
      if (!data.material_ids || data.material_ids.length === 0) {
        Alert.alert('Validation Error', 'Please select at least one material');
        return;
      }

      // Validate quantity
      if (!data.quantity || data.quantity <= 0) {
        Alert.alert('Validation Error', 'Please enter a valid quantity');
        return;
      }

      // Validate location coordinates
      if (!data.latitude || !data.longitude) {
        Alert.alert('Validation Error', 'Please select a location on map');
        return;
      }

      // Prepare API request
      const apiData = {
        inquiry_type: data.inquiry_type,
        intent: data.intent,
        title: data.title.trim(),
        description: data.description.trim(),
        material_ids: data.material_ids,
        thickness: data.thickness,
        thickness_unit: data.thickness_unit,
        size: data.size?.trim(),
        quantity: data.quantity,
        quantity_unit: data.quantity_unit,
        price: data.price,
        price_unit: data.price_unit,
        price_negotiable: Boolean(data.price_negotiable),
        urgency: data.urgency,
        location: data.location.trim(),
        latitude: data.latitude,
        longitude: data.longitude,
        deadline: data.deadline || undefined,
      };

      console.log('apiData', JSON.stringify(apiData, null, 2));

      postRequirement(apiData, {
        onSuccess: (response) => {
          dispatch(
            showToast({
              message: response.message || 'Requirement posted successfully!',
              type: 'success',
            }),
          );
          // Navigate to dashboard tab screen
          navigation.navigate(SCREENS.MAIN.TABS, {
            screen: SCREENS.MAIN.DASHBOARD,
          });
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || error?.message || 'Failed to post requirement. Please try again.';
          Alert.alert('Error', errorMessage);
        },
      });
    },
    [postRequirement, dispatch, navigation],
  );

  const buttonHeight = 60;
  const bottomPadding = buttonHeight + theme.spacing[4] * 2 + insets.bottom;

  return (
    <>
      <ScreenWrapper
        backgroundColor={theme.colors.background.secondary}
        scrollable={true}
        safeAreaEdges={[]}
      >
        <View style={[styles.container, { paddingBottom: bottomPadding }]}>
          <Text variant="h3" fontWeight="bold" style={styles.title}>
            Post to Buy
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            Fill in the details to post your requirement
          </Text>

          <View style={styles.formContainer}>
            {/* Inquiry Type */}
            <View style={styles.formGroup}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Inquiry Type
              </Text>
              <Controller
                control={control}
                name="inquiry_type"
                rules={validationRules.required('Please select inquiry type') as any}
                render={({ field: { value }, fieldState: { error } }) => (
                  <>
                    <DropdownButton
                      value={INQUIRY_TYPE_OPTIONS.find(opt => opt.value === value)?.label}
                      placeholder="Select Inquiry Type"
                      onPress={() => setShowInquiryTypePicker(true)}
                    />
                    {error && (
                      <Text
                        variant="captionSmall"
                        style={{ color: (theme.colors.error as any)?.DEFAULT || '#FF3B30', marginTop: 4 }}
                      >
                        {error.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

            {/* Title */}
            <FormInput
              name="title"
              control={control}
              label="Title"
              placeholder="e.g., Need Duplex Board 350 GSM"
              rules={validationRules.required('Please enter title') as any}
              containerStyle={styles.formGroup}
            />

            {/* Description */}
            <FormInput
              name="description"
              control={control}
              label="Description"
              placeholder="e.g., Looking for high quality duplex board"
              rules={validationRules.required('Please enter description') as any}
              multiline
              numberOfLines={4}
              containerStyle={styles.formGroup}
            />

            {/* Materials Selection */}
            <View style={styles.formGroup}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Materials
              </Text>
              <Controller
                control={control}
                name="material_ids"
                rules={validationRules.required('Please select at least one material') as any}
                render={({ field: { value }, fieldState: { error } }) => (
                  <>
                    <TouchableOpacity
                      style={styles.materialsButton}
                      onPress={() => {
                        setSearchQuery('');
                        setIsMaterialsSheetOpen(true);
                        bottomSheet.open(
                          createMaterialsSheetContent(),
                          {
                            snapPoints: ['70%', '95%'],
                            initialSnapIndex: 0,
                            onClose: () => {
                              setSearchQuery('');
                              setIsMaterialsSheetOpen(false);
                            },
                          }
                        );
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        variant="bodyMedium"
                        style={[
                          selectedMaterialIds.size > 0
                            ? { color: theme.colors.text.primary }
                            : { color: theme.colors.text.tertiary },
                        ]}
                      >
                        {selectedMaterialIds.size > 0
                          ? `${selectedMaterialIds.size} material(s) selected`
                          : 'Select materials'}
                      </Text>
                      <AppIcon.ChevronDown
                        width={20}
                        height={20}
                        color={theme.colors.text.tertiary}
                      />
                    </TouchableOpacity>
                    {error && (
                      <Text
                        variant="captionSmall"
                        style={{ color: (theme.colors.error as any)?.DEFAULT || '#FF3B30', marginTop: 4 }}
                      >
                        {error.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

            {/* Thickness */}
            <View style={styles.row}>
              <View style={[styles.formGroup, { flex: 1, marginRight: theme.spacing[2] }]}>
                <FormInput
                  name="thickness"
                  control={control}
                  label="Thickness"
                  placeholder="e.g., 350"
                  keyboardType="numeric"
                  containerStyle={{ marginBottom: 0 }}
                />
              </View>
              <View style={[styles.formGroup, { flex: 1, marginLeft: theme.spacing[2] }]}>
                <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                  Unit
                </Text>
                <Controller
                  control={control}
                  name="thickness_unit"
                  render={({ field: { value } }) => (
                    <DropdownButton
                      value={THICKNESS_UNIT_OPTIONS.find(opt => opt.value === value)?.label}
                      placeholder="Select Unit"
                      onPress={() => setShowThicknessUnitPicker(true)}
                    />
                  )}
                />
              </View>
            </View>

            {/* Size */}
            <FormInput
              name="size"
              control={control}
              label="Size"
              placeholder="e.g., 28x40"
              containerStyle={styles.formGroup}
            />

            {/* Quantity */}
            <View style={styles.row}>
              <View style={[styles.formGroup, { flex: 1, marginRight: theme.spacing[2] }]}>
                <FormInput
                  name="quantity"
                  control={control}
                  label="Quantity"
                  placeholder="e.g., 2000"
                  keyboardType="numeric"
                  rules={validationRules.required('Please enter quantity') as any}
                  containerStyle={{ marginBottom: 0 }}
                />
              </View>
              <View style={[styles.formGroup, { flex: 1, marginLeft: theme.spacing[2] }]}>
                <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                  Unit
                </Text>
                <Controller
                  control={control}
                  name="quantity_unit"
                  rules={validationRules.required('Please select quantity unit') as any}
                  render={({ field: { value }, fieldState: { error } }) => (
                    <>
                      <DropdownButton
                        value={QUANTITY_UNIT_OPTIONS.find(opt => opt.value === value)?.label}
                        placeholder="Select Unit"
                        onPress={() => setShowQuantityUnitPicker(true)}
                      />
                      {error && (
                        <Text
                          variant="captionSmall"
                          style={{ color: (theme.colors.error as any)?.DEFAULT || '#FF3B30', marginTop: 4 }}
                        >
                          {error.message}
                        </Text>
                      )}
                    </>
                  )}
                />
              </View>
            </View>

            {/* Price */}
            <View style={styles.row}>
              <View style={[styles.formGroup, { flex: 1, marginRight: theme.spacing[2] }]}>
                <FormInput
                  name="price"
                  control={control}
                  label="Price"
                  placeholder="e.g., 50"
                  keyboardType="numeric"
                  containerStyle={{ marginBottom: 0 }}
                />
              </View>
              <View style={[styles.formGroup, { flex: 1, marginLeft: theme.spacing[2] }]}>
                <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                  Unit
                </Text>
                <Controller
                  control={control}
                  name="price_unit"
                  render={({ field: { value } }) => (
                    <DropdownButton
                      value={PRICE_UNIT_OPTIONS.find(opt => opt.value === value)?.label}
                      placeholder="Select Unit"
                      onPress={() => setShowPriceUnitPicker(true)}
                    />
                  )}
                />
              </View>
            </View>

            {/* Price Negotiable */}
            <View style={styles.formGroup}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Price Negotiable
              </Text>
              <Controller
                control={control}
                name="price_negotiable"
                render={({ field: { value } }) => (
                  <DropdownButton
                    value={PRICE_NEGOTIABLE_OPTIONS.find(opt => opt.value === String(value))?.label}
                    placeholder="Select"
                    onPress={() => setShowPriceNegotiablePicker(true)}
                  />
                )}
              />
            </View>

            {/* Urgency */}
            <View style={styles.formGroup}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Urgency
              </Text>
              <Controller
                control={control}
                name="urgency"
                rules={validationRules.required('Please select urgency') as any}
                render={({ field: { value }, fieldState: { error } }) => (
                  <>
                    <DropdownButton
                      value={URGENCY_OPTIONS.find(opt => opt.value === value)?.label}
                      placeholder="Select Urgency"
                      onPress={() => setShowUrgencyPicker(true)}
                    />
                    {error && (
                      <Text
                        variant="captionSmall"
                        style={{ color: (theme.colors.error as any)?.DEFAULT || '#FF3B30', marginTop: 4 }}
                      >
                        {error.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

            {/* Location */}
            <View style={styles.formGroup}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Location
              </Text>
              <Controller
                control={control}
                name="location"
                rules={validationRules.required('Please select location') as any}
                render={({ field: { value }, fieldState: { error } }) => (
                  <>
                    <TouchableOpacity
                      style={styles.locationButton}
                      onPress={() => setShowLocationPicker(true)}
                      activeOpacity={0.7}
                    >
                      <Text
                        variant="bodyMedium"
                        style={[
                          !value
                            ? { color: theme.colors.text.tertiary }
                            : { color: theme.colors.text.primary },
                        ]}
                      >
                        {value || 'Select location on map'}
                      </Text>
                      <AppIcon.Location
                        width={20}
                        height={20}
                        color={theme.colors.text.tertiary}
                      />
                    </TouchableOpacity>
                    {error && (
                      <Text
                        variant="captionSmall"
                        style={{ color: (theme.colors.error as any)?.DEFAULT || '#FF3B30', marginTop: 4 }}
                      >
                        {error.message}
                      </Text>
                    )}
                    {!value && (
                      <TouchableOpacity
                        onPress={() => setShowLocationPicker(true)}
                        style={styles.mapButton}
                        activeOpacity={0.8}
                      >
                        <Text
                          variant="bodyMedium"
                          style={{ color: theme.colors.text.inverse }}
                        >
                          Select Location on Map
                        </Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              />
            </View>

            {/* Deadline */}
            <FormInput
              name="deadline"
              control={control}
              label="Deadline (Optional)"
              placeholder="YYYY-MM-DD"
              containerStyle={styles.formGroup}
              helperText="Format: YYYY-MM-DD"
            />
          </View>
        </View>
      </ScreenWrapper>

      {/* Location Picker Modal */}
      <Modal
        visible={showLocationPicker}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowLocationPicker(false)}
      >
        <LocationPicker
          initialLocation={
            latitudeValue && longitudeValue
              ? {
                  latitude: latitudeValue,
                  longitude: longitudeValue,
                }
              : undefined
          }
          onLocationSelect={handleLocationSelect}
          onCancel={() => setShowLocationPicker(false)}
          allowMapTap={true}
          confirmButtonText="Confirm Location"
          title="Select Location"
        />
      </Modal>

      {/* Inquiry Type Picker */}
      {showInquiryTypePicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text variant="h4" fontWeight="semibold">
                Select Inquiry Type
              </Text>
              <TouchableOpacity onPress={() => setShowInquiryTypePicker(false)}>
                <Text style={{ fontSize: 24 }}>×</Text>
              </TouchableOpacity>
            </View>
            {INQUIRY_TYPE_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.value}
                style={styles.modalOption}
                onPress={() => {
                  setValue('inquiry_type', option.value as any, { shouldValidate: true });
                  setShowInquiryTypePicker(false);
                }}
              >
                <Text variant="bodyMedium">{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Thickness Unit Picker */}
      {showThicknessUnitPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text variant="h4" fontWeight="semibold">
                Select Thickness Unit
              </Text>
              <TouchableOpacity onPress={() => setShowThicknessUnitPicker(false)}>
                <Text style={{ fontSize: 24 }}>×</Text>
              </TouchableOpacity>
            </View>
            {THICKNESS_UNIT_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.value}
                style={styles.modalOption}
                onPress={() => {
                  setValue('thickness_unit', option.value as any, { shouldValidate: true });
                  setShowThicknessUnitPicker(false);
                }}
              >
                <Text variant="bodyMedium">{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Quantity Unit Picker */}
      {showQuantityUnitPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text variant="h4" fontWeight="semibold">
                Select Quantity Unit
              </Text>
              <TouchableOpacity onPress={() => setShowQuantityUnitPicker(false)}>
                <Text style={{ fontSize: 24 }}>×</Text>
              </TouchableOpacity>
            </View>
            {QUANTITY_UNIT_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.value}
                style={styles.modalOption}
                onPress={() => {
                  setValue('quantity_unit', option.value as any, { shouldValidate: true });
                  setShowQuantityUnitPicker(false);
                }}
              >
                <Text variant="bodyMedium">{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Price Unit Picker */}
      {showPriceUnitPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text variant="h4" fontWeight="semibold">
                Select Price Unit
              </Text>
              <TouchableOpacity onPress={() => setShowPriceUnitPicker(false)}>
                <Text style={{ fontSize: 24 }}>×</Text>
              </TouchableOpacity>
            </View>
            {PRICE_UNIT_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.value}
                style={styles.modalOption}
                onPress={() => {
                  setValue('price_unit', option.value as any, { shouldValidate: true });
                  setShowPriceUnitPicker(false);
                }}
              >
                <Text variant="bodyMedium">{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Price Negotiable Picker */}
      {showPriceNegotiablePicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text variant="h4" fontWeight="semibold">
                Price Negotiable
              </Text>
              <TouchableOpacity onPress={() => setShowPriceNegotiablePicker(false)}>
                <Text style={{ fontSize: 24 }}>×</Text>
              </TouchableOpacity>
            </View>
            {PRICE_NEGOTIABLE_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.value}
                style={styles.modalOption}
                onPress={() => {
                  setValue('price_negotiable', option.value === 'true', { shouldValidate: true });
                  setShowPriceNegotiablePicker(false);
                }}
              >
                <Text variant="bodyMedium">{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Urgency Picker */}
      {showUrgencyPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text variant="h4" fontWeight="semibold">
                Select Urgency
              </Text>
              <TouchableOpacity onPress={() => setShowUrgencyPicker(false)}>
                <Text style={{ fontSize: 24 }}>×</Text>
              </TouchableOpacity>
            </View>
            {URGENCY_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.value}
                style={styles.modalOption}
                onPress={() => {
                  setValue('urgency', option.value as any, { shouldValidate: true });
                  setShowUrgencyPicker(false);
                }}
              >
                <Text variant="bodyMedium">{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <FloatingBottomContainer>
        <TouchableOpacity
          style={[styles.button, isSubmitting && { opacity: 0.5 }]}
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.8}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={theme.colors.text.inverse} size="small" />
          ) : (
            <>
              <Text variant="buttonMedium" style={styles.buttonText}>
                Post Requirement
              </Text>
              <AppIcon.ArrowRight
                width={20}
                height={20}
                color={theme.colors.text.inverse}
              />
            </>
          )}
        </TouchableOpacity>
      </FloatingBottomContainer>
    </>
  );
};

export default PostToBuyScreen;
