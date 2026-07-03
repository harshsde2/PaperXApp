import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
  Modal,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Controller } from 'react-hook-form';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { GorhomBottomSheetModal } from '@shared/components/GorhomBottomSheetModal';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { FloatingBottomContainer } from '@shared/components/FloatingBottomContainer';
import { DropdownButton } from '@shared/components/DropdownButton';
import { LocationPicker } from '@shared/location';
import type { Location } from '@shared/location/types';
import { AppIcon } from '@assets/svgs';
import { useTheme, Theme } from '@theme/index';
import { useForm, FormInput, validationRules } from '@shared/forms';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useGetMaterialsInfinite,
  Material,
  useGetMaterialFinishesInfinite,
  MaterialFinish,
  useCreateMaterial,
  useGetProfile,
} from '@services/api';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { showToast } from '@store/slices/uiSlice';
import { SCREENS } from '@navigation/constants';
import { normalizePostingLocationsFromProfile } from '@services/api/userApi/locationNormalizer';
import { createStyles } from './styles';
import { PostToBuyFormData, SizeUnit, SavedLocation, VisibilityType } from './@types';
import { MaterialsSelectionContent, type GradeListItem } from './MaterialsSelectionContent';

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

const THICKNESS_UNIT_OPTIONS = [
  { label: 'GSM', value: 'GSM' },
  { label: 'MM', value: 'MM' },
  { label: 'OUNCE', value: 'OUNCE' },
  { label: 'BF', value: 'BF' },
  { label: 'MICRON', value: 'MICRON' },
];

const SIZE_UNIT_OPTIONS: { label: string; value: SizeUnit }[] = [
  { label: 'Inches', value: 'inches' },
  { label: 'CM', value: 'cm' },
  { label: 'MM', value: 'mm' },
];

const QUANTITY_UNIT_OPTIONS = [
  { label: "kg's", value: "kg's" },
  { label: 'tonnes', value: 'tonnes' },
  { label: 'sheets', value: 'sheets' },
  { label: 'reels', value: 'reels' },
  { label: 'reams', value: 'reams' },
  { label: 'rolls', value: 'rolls' },
  { label: 'bundles', value: 'bundles' },
];

const URGENCY_OPTIONS = [
  { label: 'Normal 3-5 Days', value: 'normal' },
  { label: 'Urgent 1-2 Days', value: 'urgent' },
];

const VISIBILITY_OPTIONS: { label: string; value: VisibilityType }[] = [
  { label: 'Paper / Paperboard / Raw material dealers', value: 'dealers' },
  { label: 'Converters', value: 'converters' },
  { label: 'All (Paper / Paperboard / Raw material dealers, Converters)', value: 'all' },
];

// Special option for manual location selection
const MANUAL_LOCATION_OPTION = {
  id: -1,
  label: 'Select on Map',
  value: 'manual',
};

const PostToBuyScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const materialsSheetRef = useRef<BottomSheetModal>(null);
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const { data: profileData, refetch: refetchProfile } = useGetProfile();

  React.useEffect(() => {
    refetchProfile();
  }, [refetchProfile]);



  // Get intent from route params, default to 'buy' for backward compatibility
  const intent = (route.params?.intent as 'buy' | 'sell') || 'buy';
  const isSellMode = intent === 'sell';

  console.log('user ->', JSON.stringify(user, null, 2));


  const {
    data: materialsData,
    isLoading: isLoadingMaterials,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetMaterialsInfinite(ITEMS_PER_PAGE);

  // Fetch material finishes for grade/finish/variant selection
  const {
    data: finishesData,
    isLoading: isLoadingFinishes,
    fetchNextPage: fetchNextFinishesPage,
    hasNextPage: hasNextFinishesPage,
    isFetchingNextPage: isFetchingNextFinishesPage,
  } = useGetMaterialFinishesInfinite(50);

  // Get user's saved locations from their profile
  const userLocations: SavedLocation[] = useMemo(() => {
    const profileLocations = normalizePostingLocationsFromProfile(profileData as any);
    const sourceLocations =
      profileLocations.length > 0
        ? profileLocations
        : Array.isArray(user?.locations)
          ? user.locations
          : [];

    return sourceLocations
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
      .filter((loc): loc is SavedLocation => !!loc);
  }, [profileData, user?.locations]);

  const { control, handleSubmit, setValue, watch } = useForm<PostToBuyFormData>({
    defaultValues: {
      inquiry_type: 'material',
      intent: intent,
      material_id: undefined,
      thickness: undefined,
      thickness_unit: 'GSM',
      size: '',
      size_unit: 'inches',
      finish_ids: [],
      quantity: undefined,
      quantity_unit: 'sheets',
      price: undefined,
      price_unit: 'per_sheet',
      price_negotiable: true,
      urgency: 'normal',
      visibility: undefined as unknown as VisibilityType, // Required - no default
      location_id: undefined,
      location_source: 'saved',
      location: '',
      latitude: undefined,
      longitude: undefined,
    },
    mode: 'onBlur',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [finishSearchQuery, setFinishSearchQuery] = useState('');
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null);
  const [selectedGradeId, setSelectedGradeId] = useState<number | null>(null);
  const [selectedMaterialDisplayName, setSelectedMaterialDisplayName] = useState<string>('');
  const [selectedFinishIds, setSelectedFinishIds] = useState<Set<number>>(new Set());
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [isMaterialsSheetOpen, setIsMaterialsSheetOpen] = useState(false);
  const [isFinishesSheetOpen, setIsFinishesSheetOpen] = useState(false);
  const [showThicknessUnitPicker, setShowThicknessUnitPicker] = useState(false);
  const [showSizeUnitPicker, setShowSizeUnitPicker] = useState(false);
  const [showQuantityUnitPicker, setShowQuantityUnitPicker] = useState(false);
  const [showUrgencyPicker, setShowUrgencyPicker] = useState(false);
  const [showVisibilityPicker, setShowVisibilityPicker] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [customMaterialName, setCustomMaterialName] = useState('');

  const { mutateAsync: createMaterial, isPending: isCreatingMaterial } = useCreateMaterial();

  const isLoadingMoreRef = useRef(false);
  const scrollViewRef = useRef<FlatList>(null);
  const selectGradeRef = useRef<(materialId: number, gradeId: number, materialName?: string, gradeName?: string) => void>(() => { });

  const locationValue = watch('location');
  const latitudeValue = watch('latitude');
  const longitudeValue = watch('longitude');
  const locationIdValue = watch('location_id');
  const locationSourceValue = watch('location_source');

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

  // Single material selection (one row per material; form uses material_id). Closes sheet on select.
  const selectGrade = useCallback(
    (materialId: number, gradeId: number, materialName?: string, _gradeName?: string) => {
      const isSame = selectedMaterialId === materialId && selectedGradeId === gradeId;
      if (isSame) {
        setSelectedMaterialId(null);
        setSelectedGradeId(null);
        setSelectedMaterialDisplayName('');
        setValue('material_id', undefined, { shouldValidate: true });
      } else {
        setSelectedMaterialId(materialId);
        setSelectedGradeId(gradeId);
        setSelectedMaterialDisplayName(materialName || '');
        setValue('material_id', materialId, { shouldValidate: true });
        materialsSheetRef.current?.dismiss();
      }
    },
    [selectedMaterialId, selectedGradeId, setValue],
  );
  selectGradeRef.current = selectGrade;
  const onSelectGradeStable = useCallback((materialId: number, gradeId: number, materialName?: string, gradeName?: string) => {
    selectGradeRef.current(materialId, gradeId, materialName, gradeName);
  }, []);

  const clearMaterial = useCallback(() => {
    setSelectedMaterialId(null);
    setSelectedGradeId(null);
    setSelectedMaterialDisplayName('');
    setValue('material_id', undefined, { shouldValidate: true });
  }, [setValue]);

  const handleAddCustomMaterial = useCallback(async () => {
    const name = customMaterialName.trim();
    if (!name) {
      dispatch(showToast({ message: 'Please enter a material name', type: 'error' }));
      return;
    }
    try {
      const material = await createMaterial({ name });
      const firstGrade = material?.grades?.[0];
      if (material && firstGrade) {
        selectGrade(material.id, firstGrade.id, material.name, firstGrade.name);
        setCustomMaterialName('');
        dispatch(showToast({ message: 'Material added successfully', type: 'success' }));
      } else {
        dispatch(showToast({ message: 'Failed to add material', type: 'error' }));
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Failed to add material';
      dispatch(showToast({ message: msg, type: 'error' }));
    }
  }, [customMaterialName, createMaterial, selectGrade, dispatch]);

  const isGradeSelected = useCallback(
    (materialId: number, gradeId: number) =>
      selectedMaterialId === materialId && selectedGradeId === gradeId,
    [selectedMaterialId, selectedGradeId],
  );

  // Get selected display name (material name only); use stored name so dropdown updates immediately
  const selectedMaterialName = useMemo(() => {
    if (selectedMaterialDisplayName) return selectedMaterialDisplayName;
    if (!selectedMaterialId) return '';
    const material = allMaterials.find(m => m.id === selectedMaterialId);
    return material?.name || '';
  }, [selectedMaterialDisplayName, selectedMaterialId, allMaterials]);

  const filteredMaterials = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return allMaterials;

    return allMaterials.filter(material =>
      material.name.toLowerCase().includes(query) ||
      material.category?.toLowerCase().includes(query)
    );
  }, [allMaterials, searchQuery]);

  // Material list: one row per material (using first grade for backend compatibility)
  const gradeList = useMemo((): GradeListItem[] => {
    const query = searchQuery.toLowerCase().trim();
    const items: GradeListItem[] = [];

    allMaterials.forEach(material => {
      const grades = material.grades || [];
      if (grades.length === 0) return;

      const firstGrade = grades[0];
      const category = material.category || 'Other';
      const matchesMaterial = !query || (material.name || '').toLowerCase().includes(query);
      const matchesCategory = !query || category.toLowerCase().includes(query);

      if (matchesMaterial || matchesCategory) {
        items.push({
          type: 'grade',
          id: `material-${material.id}`,
          data: {
            materialId: material.id,
            materialName: material.name,
            gradeId: firstGrade.id,
            gradeName: firstGrade.name,
            category,
          },
        });
      }
    });
    return items;
  }, [allMaterials, searchQuery]);

  // Flatten all finishes pages into a single array
  const allFinishes = useMemo(() => {
    if (!finishesData?.pages) return [];
    const allFinishesList = finishesData.pages.flatMap(page => page.finishes);

    // Deduplicate by name
    const finishesMap = new Map<string, MaterialFinish>();
    allFinishesList.forEach(finish => {
      const key = (finish.name || '').toLowerCase().trim();
      if (!finishesMap.has(key)) {
        finishesMap.set(key, finish);
      }
    });

    return Array.from(finishesMap.values());
  }, [finishesData?.pages]);

  const toggleFinish = useCallback((finishId: number) => {
    setSelectedFinishIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(finishId)) {
        newSet.delete(finishId);
      } else {
        newSet.add(finishId);
      }
      setValue('finish_ids', Array.from(newSet), { shouldValidate: true });
      return newSet;
    });
  }, [setValue]);

  const clearFinishes = useCallback(() => {
    setSelectedFinishIds(new Set());
    setValue('finish_ids', [], { shouldValidate: true });
  }, [setValue]);

  const isFinishSelected = useCallback(
    (finishId: number) => selectedFinishIds.has(finishId),
    [selectedFinishIds],
  );

  const filteredFinishes = useMemo(() => {
    const query = finishSearchQuery.toLowerCase().trim();
    if (!query) return allFinishes;

    return allFinishes.filter(finish =>
      finish.name.toLowerCase().includes(query)
    );
  }, [allFinishes, finishSearchQuery]);

  // Handle selection of a saved location from dropdown
  const handleSavedLocationSelect = useCallback(
    (savedLocation: SavedLocation) => {
      const backendLocationId =
        typeof savedLocation.backend_location_id === 'number' && savedLocation.backend_location_id > 0
          ? savedLocation.backend_location_id
          : undefined;
      setValue('location_id', backendLocationId, { shouldValidate: true });
      setValue('location_source', 'saved', { shouldValidate: true });
      setValue('location', savedLocation.address || `${savedLocation.city}${savedLocation.state ? `, ${savedLocation.state}` : ''}`, {
        shouldValidate: true,
      });
      setValue('latitude', parseFloat(savedLocation.latitude), {
        shouldValidate: true,
      });
      setValue('longitude', parseFloat(savedLocation.longitude), {
        shouldValidate: true,
      });
      setShowLocationDropdown(false);

      dispatch(
        showToast({
          message: 'Location selected!',
          type: 'success',
        }),
      );
    },
    [setValue, dispatch],
  );

  // Handle manual location selection from map
  const handleLocationSelect = useCallback(
    (location: Location) => {
      setValue('location_id', undefined, { shouldValidate: true });
      setValue('location_source', 'manual', { shouldValidate: true });
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

  // Get display text for selected location
  const getSelectedLocationDisplay = useCallback(() => {
    if (locationIdValue && locationSourceValue === 'saved') {
      const savedLoc = userLocations.find(loc => loc.id === locationIdValue);
      if (savedLoc) {
        return savedLoc.address || `${savedLoc.city}${savedLoc.state ? `, ${savedLoc.state}` : ''}`;
      }
    }
    return locationValue || '';
  }, [locationIdValue, locationSourceValue, locationValue, userLocations]);

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
      // console.error('Error fetching next page:', error);
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

  // Selection key for grade mode (materialId-gradeId)
  const selectedGradeKey = useMemo(() => {
    if (selectedMaterialId != null && selectedGradeId != null) {
      return `${selectedMaterialId}-${selectedGradeId}`;
    }
    return null;
  }, [selectedMaterialId, selectedGradeId]);

  const selectedFinishIdsArray = useMemo(() => {
    return Array.from(selectedFinishIds).sort((a, b) => a - b);
  }, [selectedFinishIds]);

  // Get display names for selected finishes
  const selectedFinishesDisplay = useMemo(() => {
    if (selectedFinishIds.size === 0) return '';
    const names = Array.from(selectedFinishIds)
      .map(id => allFinishes.find(f => f.id === id)?.name)
      .filter(Boolean)
      .slice(0, 3);
    if (selectedFinishIds.size > 3) {
      return `${names.join(', ')} +${selectedFinishIds.size - 3} more`;
    }
    return names.join(', ');
  }, [selectedFinishIds, allFinishes]);

  const onSubmit = useCallback(
    (data: PostToBuyFormData) => {
      // Validate material_id
      if (!data.material_id) {
        Alert.alert('Validation Error', 'Please select a material');
        return;
      }

      // Validate thickness
      if (!data.thickness || data.thickness <= 0) {
        Alert.alert('Validation Error', 'Please enter a valid thickness');
        return;
      }

      // Validate thickness unit
      if (!data.thickness_unit) {
        Alert.alert('Validation Error', 'Please select thickness unit');
        return;
      }

      // Validate size
      if (!data.size || !data.size.trim()) {
        Alert.alert('Validation Error', 'Please enter size');
        return;
      }

      // Validate size format (e.g., "28x40")
      const sizePattern = /^\d+(\.\d+)?x\d+(\.\d+)?$/i;
      if (!sizePattern.test(data.size.trim())) {
        Alert.alert('Validation Error', 'Please enter size in correct format (e.g., 28x40)');
        return;
      }

      // Validate size unit
      if (!data.size_unit) {
        Alert.alert('Validation Error', 'Please select size unit');
        return;
      }

      // Validate quantity
      if (!data.quantity || data.quantity <= 0) {
        Alert.alert('Validation Error', 'Please enter a valid quantity');
        return;
      }

      // Validate location
      if (!data.latitude || !data.longitude) {
        Alert.alert('Validation Error', 'Please select a location');
        return;
      }

      // Validate visibility
      if (!data.visibility) {
        Alert.alert('Validation Error', 'Please select visibility');
        return;
      }

      // Prepare API request (backend expects "title")
      const title = selectedMaterialName || 'Material Requirement';
      const apiData = {
        title,
        inquiry_type: data.inquiry_type,
        intent: data.intent,
        material_id: data.material_id,
        thickness: data.thickness,
        thickness_unit: data.thickness_unit,
        size: data.size.trim(),
        size_unit: data.size_unit,
        finish_ids: data.finish_ids.length > 0 ? data.finish_ids : null,
        quantity: data.quantity!,
        quantity_unit: data.quantity_unit,
        urgency: data.urgency,
        visibility: data.visibility,
        // Location data
        location_id: data.location_id || null, // ID of saved location (if selected)
        location_source: data.location_source, // 'saved' or 'manual'
        location: data.location.trim(),
        latitude: data.latitude!,
        longitude: data.longitude!,
      };

      console.log('apiData', JSON.stringify(apiData, null, 2));

      // Generate reference number
      const refNumber = `#${Math.floor(Math.random() * 9000) + 1000}`;

      // Determine urgency label for display
      const isUrgent = data.urgency === 'urgent';
      const urgencyLabel = isUrgent ? 'Urgent 1-2 Days' : 'Normal 3-5 Days';

      // Prepare listing details for payment confirmation
      const listingDetails = {
        title,
        referenceNumber: refNumber,
        grade: selectedFinishesDisplay || 'Standard',
        materialName: selectedMaterialName || 'Material',
        quantity: String(data.quantity),
        quantityUnit: data.quantity_unit,
        urgency: urgencyLabel,
        tags: isUrgent
          ? ['Material', 'Urgent']
          : ['Material'],
      };

      // Navigate to payment confirmation screen
      navigation.navigate(SCREENS.MAIN.PAYMENT_CONFIRMATION, {
        listingDetails,
        formData: apiData,
        requirementType: user?.primary_role,
      });
    },
    [navigation, selectedMaterialName, selectedFinishesDisplay],
  );

  const buttonHeight = 60;
  const bottomPadding = buttonHeight + theme.spacing[4] * 2 + insets.bottom;

  return (
    <BottomSheetModalProvider>
      <View style={{ flex: 1 }}>
        <>
          <ScreenWrapper
            backgroundColor={theme.colors.background.secondary}
            scrollable={true}
            safeAreaEdges={[]}
          >
            <View style={[styles.container, { paddingBottom: bottomPadding }]}>
              <Text variant="h3" fontWeight="bold" style={styles.title}>
                {isSellMode ? 'Post to Sell' : 'Post to Buy'}
              </Text>
              <Text variant="bodyMedium" style={styles.description}>
                {isSellMode
                  ? 'Fill in the details to post your material for sale'
                  : 'Fill in the details to post your requirement'}
              </Text>

              <View style={styles.formContainer}>
                {/* Material Selection (Single) */}
                <View style={styles.formGroup}>
                  <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                    Material
                  </Text>
                  <Controller
                    control={control}
                    name="material_id"
                    rules={validationRules.required('Please select a material') as any}
                    render={({ field: { value }, fieldState: { error } }) => (
                      <>
                        <TouchableOpacity
                          style={styles.materialsButton}
                          onPress={() => {
                            setSearchQuery('');
                            setIsMaterialsSheetOpen(true);
                            materialsSheetRef.current?.present();
                          }}
                          activeOpacity={0.7}
                        >
                          <Text
                            variant="bodyMedium"
                            style={[
                              selectedMaterialId
                                ? { color: theme.colors.text.primary, flex: 1 }
                                : { color: theme.colors.text.tertiary, flex: 1 },
                            ]}
                            numberOfLines={1}
                          >
                            {selectedMaterialId
                              ? selectedMaterialName
                              : 'Select material'}
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

                {/* Custom Material (Optional) - Add if not in list */}
                <View style={styles.formGroup}>
                  <View style={styles.labelRow}>
                    <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                      Custom Material
                    </Text>
                    <Text variant="captionSmall" style={styles.optionalLabel}>
                      (Optional)
                    </Text>
                  </View>
                  <Text variant="captionSmall" style={{ color: theme.colors.text.tertiary, marginBottom: theme.spacing[2] }}>
                    Add material if not in list above
                  </Text>
                  <View style={styles.customMaterialRow}>
                    <TextInput
                      style={styles.customMaterialInput}
                      placeholder="Enter material name if not in list"
                      placeholderTextColor={theme.colors.text.tertiary}
                      value={customMaterialName}
                      onChangeText={setCustomMaterialName}
                      editable={!isCreatingMaterial}
                    />
                    <TouchableOpacity
                      style={[styles.addMaterialButton, isCreatingMaterial && { opacity: 0.6 }]}
                      onPress={handleAddCustomMaterial}
                      disabled={isCreatingMaterial || !customMaterialName.trim()}
                      activeOpacity={0.8}
                    >
                      {isCreatingMaterial ? (
                        <ActivityIndicator size="small" color={theme.colors.text.inverse} />
                      ) : (
                        <Text variant="bodyMedium" fontWeight="medium" style={styles.buttonText}>
                          Add
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
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
                      rules={validationRules.required('Please enter thickness') as any}
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
                      rules={validationRules.required('Please select unit') as any}
                      render={({ field: { value }, fieldState: { error } }) => (
                        <>
                          <DropdownButton
                            value={THICKNESS_UNIT_OPTIONS.find(opt => opt.value === value)?.label}
                            placeholder="Select Unit"
                            onPress={() => setShowThicknessUnitPicker(true)}
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

                {/* Size */}
                <View style={styles.row}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: theme.spacing[2] }]}>
                    <FormInput
                      name="size"
                      control={control}
                      label="Size"
                      placeholder="e.g., 28x40"
                      rules={validationRules.required('Please enter size') as any}
                      containerStyle={{ marginBottom: 0 }}
                      helperText="Format: Length x Width"
                    />
                  </View>
                  <View style={[styles.formGroup, { flex: 1, marginLeft: theme.spacing[2] }]}>
                    <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                      Unit
                    </Text>
                    <Controller
                      control={control}
                      name="size_unit"
                      rules={validationRules.required('Please select unit') as any}
                      render={({ field: { value }, fieldState: { error } }) => (
                        <>
                          <DropdownButton
                            value={SIZE_UNIT_OPTIONS.find(opt => opt.value === value)?.label}
                            placeholder="Select Unit"
                            onPress={() => setShowSizeUnitPicker(true)}
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

                {/* Grade / Finishes / Variant (Optional) */}
                <View style={styles.formGroup}>
                  <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                    Grade / Finish / Certifications (Optional)
                  </Text>
                  <Controller
                    control={control}
                    name="finish_ids"
                    render={({ field: { value } }) => (
                      <TouchableOpacity
                        style={styles.materialsButton}
                        onPress={() => setIsFinishesSheetOpen(true)}
                        activeOpacity={0.7}
                      >
                        <Text
                          variant="bodyMedium"
                          style={[
                            selectedFinishIds.size > 0
                              ? { color: theme.colors.text.primary, flex: 1 }
                              : { color: theme.colors.text.tertiary, flex: 1 },
                          ]}
                          numberOfLines={1}
                        >
                          {selectedFinishIds.size > 0
                            ? selectedFinishesDisplay
                            : 'Select grade, finish, variant...'}
                        </Text>
                        <AppIcon.ChevronDown
                          width={20}
                          height={20}
                          color={theme.colors.text.tertiary}
                        />
                      </TouchableOpacity>
                    )}
                  />
                  {selectedFinishIds.size > 0 && (
                    <Text
                      variant="captionSmall"
                      style={{ color: theme.colors.text.tertiary, marginTop: 4 }}
                    >
                      {selectedFinishIds.size} item(s) selected
                    </Text>
                  )}
                </View>

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

                {/* Urgency */}
                <View style={styles.formGroup}>
                  <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                    Material Requirement Timeline
                  </Text>
                  <Controller
                    control={control}
                    name="urgency"
                    rules={validationRules.required('Please select priority') as any}
                    render={({ field: { value }, fieldState: { error } }) => (
                      <>
                        <DropdownButton
                          value={URGENCY_OPTIONS.find(opt => opt.value === value)?.label}
                          placeholder="Select Timeline"
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

                {/* Visibility */}
                <View style={styles.formGroup}>
                  <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                    Visibility
                  </Text>
                  <Controller
                    control={control}
                    name="visibility"
                    rules={validationRules.required('Please select visibility') as any}
                    render={({ field: { value }, fieldState: { error } }) => (
                      <>
                        <DropdownButton
                          value={VISIBILITY_OPTIONS.find(opt => opt.value === value)?.label}
                          placeholder="Select who can see this"
                          onPress={() => setShowVisibilityPicker(true)}
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
                    {isSellMode ? 'Pickup Location' : 'Delivery Location'}
                  </Text>
                  <Controller
                    control={control}
                    name="location"
                    rules={validationRules.required('Please select a location') as any}
                    render={({ field: { value }, fieldState: { error } }) => {
                      const displayValue = getSelectedLocationDisplay();
                      return (
                        <>
                          <TouchableOpacity
                            style={styles.locationButton}
                            onPress={() => setShowLocationDropdown(true)}
                            activeOpacity={0.7}
                          >
                            <View style={{ flex: 1 }}>
                              <Text
                                variant="bodyMedium"
                                style={[
                                  !displayValue
                                    ? { color: theme.colors.text.tertiary }
                                    : { color: theme.colors.text.primary },
                                ]}
                                numberOfLines={1}
                              >
                                {displayValue || (isSellMode ? 'Select pickup location' : 'Select delivery location')}
                              </Text>
                              {locationSourceValue === 'saved' && locationIdValue && (
                                <Text
                                  variant="captionSmall"
                                  style={{ color: theme.colors.text.tertiary, marginTop: 2 }}
                                >
                                  From saved locations
                                </Text>
                              )}
                              {locationSourceValue === 'manual' && displayValue && (
                                <Text
                                  variant="captionSmall"
                                  style={{ color: theme.colors.text.tertiary, marginTop: 2 }}
                                >
                                  Custom location
                                </Text>
                              )}
                            </View>
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
                          {userLocations.length === 0 && (
                            <Text
                              variant="captionSmall"
                              style={{ color: theme.colors.text.tertiary, marginTop: 4 }}
                            >
                              No saved locations found. You can select a location on the map.
                            </Text>
                          )}
                        </>
                      );
                    }}
                  />
                </View>

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

          {/* Size Unit Picker */}
          {showSizeUnitPicker && (
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text variant="h4" fontWeight="semibold">
                    Select Size Unit
                  </Text>
                  <TouchableOpacity onPress={() => setShowSizeUnitPicker(false)}>
                    <Text style={{ fontSize: 24 }}>×</Text>
                  </TouchableOpacity>
                </View>
                {SIZE_UNIT_OPTIONS.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.modalOption}
                    onPress={() => {
                      setValue('size_unit', option.value, { shouldValidate: true });
                      setShowSizeUnitPicker(false);
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

          {/* Urgency Picker */}
          {showUrgencyPicker && (
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text variant="h4" fontWeight="semibold">
                    Select Priority
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

          {/* Visibility Picker */}
          {showVisibilityPicker && (
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text variant="h4" fontWeight="semibold">
                    Select Visibility
                  </Text>
                  <TouchableOpacity onPress={() => setShowVisibilityPicker(false)}>
                    <Text style={{ fontSize: 24 }}>×</Text>
                  </TouchableOpacity>
                </View>
                {VISIBILITY_OPTIONS.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.modalOption}
                    onPress={() => {
                      setValue('visibility', option.value, { shouldValidate: true });
                      setShowVisibilityPicker(false);
                    }}
                  >
                    <Text variant="bodyMedium">{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Location Dropdown */}
          {showLocationDropdown && (
            <View style={styles.modalOverlay}>
              <TouchableOpacity
                style={StyleSheet.absoluteFill}
                onPress={() => setShowLocationDropdown(false)}
                activeOpacity={1}
              />
              <View style={[styles.modalContent, { maxHeight: '80%' }]}>
                <View style={styles.modalHeader}>
                  <Text variant="h4" fontWeight="semibold">
                    {isSellMode ? 'Select Pickup Location' : 'Select Delivery Location'}
                  </Text>
                  <TouchableOpacity onPress={() => setShowLocationDropdown(false)}>
                    <Text style={{ fontSize: 24 }}>×</Text>
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={userLocations}
                  keyExtractor={(item) => `location-${item.id}`}
                  ListHeaderComponent={
                    userLocations.length > 0 ? (
                      <Text
                        variant="captionSmall"
                        style={{
                          color: theme.colors.text.tertiary,
                          marginBottom: theme.spacing[2],
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                        }}
                      >
                        Your Saved Locations ({userLocations.length})
                      </Text>
                    ) : null
                  }
                  ListEmptyComponent={
                    <View style={{ paddingVertical: theme.spacing[3], alignItems: 'center' }}>
                      <Text
                        variant="bodyMedium"
                        style={{ color: theme.colors.text.tertiary, textAlign: 'center' }}
                      >
                        No saved locations found.{'\n'}Please select a location on the map.
                      </Text>
                    </View>
                  }
                  renderItem={({ item: location }) => (
                    <TouchableOpacity
                      style={[
                        styles.modalOption,
                        locationIdValue === location.id && {
                          backgroundColor: theme.colors.primary.light || theme.colors.primary.DEFAULT + '10',
                        },
                      ]}
                      onPress={() => handleSavedLocationSelect(location)}
                    >
                      <View style={{ flex: 1 }}>
                        <Text variant="bodyMedium" style={{ marginBottom: 2 }}>
                          {location.address || location.city}
                        </Text>
                        <Text
                          variant="captionSmall"
                          style={{ color: theme.colors.text.tertiary }}
                        >
                          {location.type === 'warehouse' ? 'Warehouse' : location.type}
                          {location.city && ` • ${location.city}`}
                          {location.state && `, ${location.state}`}
                        </Text>
                      </View>
                      {locationIdValue === location.id && (
                        <AppIcon.TickCheckedBox
                          width={20}
                          height={20}
                          color={theme.colors.primary.DEFAULT}
                        />
                      )}
                    </TouchableOpacity>
                  )}
                  ListFooterComponent={
                    <View style={{
                      borderTopWidth: userLocations.length > 0 ? 1 : 0,
                      borderTopColor: theme.colors.border.secondary,
                      paddingTop: theme.spacing[3],
                      marginTop: userLocations.length > 0 ? theme.spacing[2] : 0,
                    }}>
                      <TouchableOpacity
                        style={[
                          styles.modalOption,
                          {
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: theme.colors.surface.secondary,
                            borderRadius: theme.borderRadius.md,
                            paddingVertical: theme.spacing[3],
                            paddingHorizontal: theme.spacing[3],
                            borderBottomWidth: 0,
                          },
                        ]}
                        onPress={() => {
                          setShowLocationDropdown(false);
                          setShowLocationPicker(true);
                        }}
                      >
                        <AppIcon.Location
                          width={20}
                          height={20}
                          color={theme.colors.primary.DEFAULT}
                        />
                        <View style={{ flex: 1, marginLeft: theme.spacing[2] }}>
                          <Text
                            variant="bodyMedium"
                            fontWeight="medium"
                            style={{ color: theme.colors.primary.DEFAULT }}
                          >
                            Select on Map
                          </Text>
                          <Text
                            variant="captionSmall"
                            style={{ color: theme.colors.text.tertiary }}
                          >
                            {isSellMode
                              ? 'Choose a custom pickup location'
                              : 'Choose a custom delivery location'}
                          </Text>
                        </View>
                        <AppIcon.ChevronRight
                          width={16}
                          height={16}
                          color={theme.colors.primary.DEFAULT}
                        />
                      </TouchableOpacity>
                    </View>
                  }
                  contentContainerStyle={{ paddingBottom: theme.spacing[2] }}
                  showsVerticalScrollIndicator={true}
                />
              </View>
            </View>
          )}

          {/* Finishes Selection Modal */}
          {isFinishesSheetOpen && (
            <View style={styles.modalOverlay}>
              <TouchableOpacity
                style={StyleSheet.absoluteFill}
                onPress={() => {
                  setIsFinishesSheetOpen(false);
                  setFinishSearchQuery('');
                }}
                activeOpacity={1}
              />
              <View style={[styles.modalContent, { maxHeight: '80%' }]}>
                <View style={styles.modalHeader}>
                  <Text variant="h4" fontWeight="semibold">
                    Select Grade / Finish / Variant
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setIsFinishesSheetOpen(false);
                      setFinishSearchQuery('');
                    }}
                  >
                    <Text style={{ fontSize: 24 }}>×</Text>
                  </TouchableOpacity>
                </View>

                {/* Search */}
                <View style={[styles.searchContainer, { marginBottom: theme.spacing[3] }]}>
                  <View style={styles.searchIcon}>
                    <AppIcon.Search
                      width={18}
                      height={18}
                      color={theme.colors.text.tertiary}
                    />
                  </View>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search finishes, coatings, grades..."
                    placeholderTextColor={theme.colors.text.tertiary}
                    value={finishSearchQuery}
                    onChangeText={setFinishSearchQuery}
                  />
                </View>

                {/* Selected count and clear button */}
                {selectedFinishIds.size > 0 && (
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: theme.spacing[2],
                    paddingHorizontal: theme.spacing[1],
                  }}>
                    <Text variant="bodySmall" style={{ color: theme.colors.text.secondary }}>
                      {selectedFinishIds.size} selected
                    </Text>
                    <TouchableOpacity onPress={clearFinishes}>
                      <Text variant="bodySmall" style={{ color: theme.colors.primary.DEFAULT }}>
                        Clear all
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {isLoadingFinishes ? (
                  <View style={{ paddingVertical: theme.spacing[8], alignItems: 'center' }}>
                    <ActivityIndicator size="small" color={theme.colors.primary.DEFAULT} />
                    <Text
                      variant="bodyMedium"
                      style={{ color: theme.colors.text.tertiary, marginTop: theme.spacing[2] }}
                    >
                      Loading options...
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={filteredFinishes}
                    keyExtractor={(item) => `finish-${item.id}`}
                    ListEmptyComponent={
                      <View style={{ paddingVertical: theme.spacing[4], alignItems: 'center', }}>
                        <Text
                          variant="bodyMedium"
                          style={{ color: theme.colors.text.tertiary, textAlign: 'center' }}
                        >
                          {finishSearchQuery
                            ? 'No options found matching your search'
                            : 'No options available'}
                        </Text>
                      </View>
                    }
                    renderItem={({ item: finish }) => (
                      <TouchableOpacity
                        style={[
                          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing[3], paddingHorizontal: theme.spacing[3] },
                          // styles.modalOption,
                          isFinishSelected(finish.id) && {
                            backgroundColor: theme.colors.primary.light || theme.colors.primary.DEFAULT + '10',
                          },
                        ]}
                        onPress={() => toggleFinish(finish.id)}
                      >
                        <View style={{ flex: 1 }}>
                          <Text variant="bodyMedium">
                            {finish.name}
                          </Text>
                          {finish.type && (
                            <Text
                              variant="captionSmall"
                              style={{ color: theme.colors.text.tertiary, textTransform: 'capitalize' }}
                            >
                              {finish.type}
                            </Text>
                          )}
                        </View>
                        {isFinishSelected(finish.id) ? (
                          <AppIcon.TickCheckedBox
                            width={22}
                            height={22}
                            color={theme.colors.primary.DEFAULT}
                          />
                        ) : (
                          <AppIcon.UntickCheckedBox
                            width={22}
                            height={22}
                            color={theme.colors.text.tertiary}
                          />
                        )}
                      </TouchableOpacity>
                    )}
                    ListFooterComponent={
                      isFetchingNextFinishesPage ? (
                        <View style={{ paddingVertical: theme.spacing[3], alignItems: 'center' }}>
                          <ActivityIndicator size="small" color={theme.colors.primary.DEFAULT} />
                        </View>
                      ) : null
                    }
                    onEndReached={() => {
                      if (hasNextFinishesPage && !isFetchingNextFinishesPage) {
                        fetchNextFinishesPage();
                      }
                    }}
                    onEndReachedThreshold={0.3}
                    contentContainerStyle={{ paddingBottom: theme.spacing[2] }}
                    showsVerticalScrollIndicator={true}
                  />
                )}

                {/* Done Button */}
                <TouchableOpacity
                  style={[
                    styles.button,
                    { marginTop: theme.spacing[3] },
                  ]}
                  onPress={() => {
                    setIsFinishesSheetOpen(false);
                    setFinishSearchQuery('');
                  }}
                  activeOpacity={0.8}
                >
                  <Text variant="buttonMedium" style={styles.buttonText}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <FloatingBottomContainer>
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit(onSubmit)}
              activeOpacity={0.8}
            >
              <Text variant="buttonMedium" style={styles.buttonText}>
                Continue to Payment
              </Text>
              <AppIcon.ArrowRight
                width={20}
                height={20}
                color={theme.colors.text.inverse}
              />
            </TouchableOpacity>
          </FloatingBottomContainer>

          <GorhomBottomSheetModal
            ref={materialsSheetRef}
            snapPoints={['70%', '95%']}
            enablePanDownToClose
            onDismiss={() => {
              setSearchQuery('');
              setIsMaterialsSheetOpen(false);
            }}
          >
            <MaterialsSelectionContent
              mode="grade"
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              gradeList={gradeList}
              selectedMaterialId={selectedMaterialId}
              selectedGradeId={selectedGradeId}
              isLoading={isLoadingMaterials}
              isFetchingNextPage={isFetchingNextPage}
              onToggleGrade={onSelectGradeStable}
              onClear={clearMaterial}
              onLoadMore={handleLoadMore}
              onScroll={handleScroll}
              theme={theme}
              ListComponent={BottomSheetFlatList}
            />
          </GorhomBottomSheetModal>
        </>
      </View>
    </BottomSheetModalProvider>
  );
};

export default PostToBuyScreen;
