import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Controller } from 'react-hook-form';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { GorhomBottomSheetModal } from '@shared/components/GorhomBottomSheetModal';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { FloatingBottomContainer } from '@shared/components/FloatingBottomContainer';
import { DropdownButton } from '@shared/components/DropdownButton';
import MultiSelectBottomSheetContent from '@shared/components/MultiSelectBottomSheetContent';
import { LocationPicker } from '@shared/location';
import type { Location } from '@shared/location/types';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { useForm, FormInput, validationRules } from '@shared/forms';
import {
  useGetConverterReferenceData,
  useGetProfile,
  useGetMaterialsInfinite,
  useGetMaterialFinishesInfinite,
  type Material,
  type MaterialFinish,
} from '@services/api';
import { useAppSelector, useAppDispatch } from '@store/hooks';
import { showToast } from '@store/slices/uiSlice';
import { SCREENS } from '@navigation/constants';
import { normalizePostingLocationsFromProfile } from '@services/api/userApi/locationNormalizer';
import { createStyles } from '../PostToBuyScreen/styles';
import type { JobworkTimeline } from '@services/api/converterApi/@types';

type SavedLocation = {
  id: number;
  type: string;
  address: string;
  latitude: string;
  longitude: string;
  city: string;
  state: string | null;
  source?: string;
  backend_location_id?: number;
};

type SizeUnit = 'inches' | 'cm' | 'mm';
type ThicknessUnit = 'GSM' | 'MM' | 'OUNCE' | 'BF' | 'MICRON';

type PostJobworkGiveFormData = {
  jobwork_type_id: number | null;
  jobwork_type_custom: string;
  raw_materials?: string;
  size?: string;
  size_unit?: SizeUnit;
  thickness?: string;
  thickness_unit?: ThicknessUnit;
  finish_ids: number[];
  quantity: number | undefined;
  quality_requirements?: string;
  timeline: JobworkTimeline;
  delivery_location: string;
  latitude?: number;
  longitude?: number;
  location_source: 'saved' | 'manual';
  location_id?: number;
  other_instructions?: string;
};

const TIMELINE_OPTIONS: { label: string; value: JobworkTimeline }[] = [
  { label: 'Normal', value: 'Normal' },
  { label: 'Urgent', value: 'Urgent' },
];

const SIZE_UNIT_OPTIONS: { label: string; value: SizeUnit }[] = [
  { label: 'Inches', value: 'inches' },
  { label: 'CM', value: 'cm' },
  { label: 'MM', value: 'mm' },
];

const THICKNESS_UNIT_OPTIONS: { label: string; value: ThicknessUnit }[] = [
  { label: 'GSM', value: 'GSM' },
  { label: 'MM', value: 'MM' },
  { label: 'OUNCE', value: 'OUNCE' },
  { label: 'BF', value: 'BF' },
  { label: 'MICRON', value: 'MICRON' },
];

const PostJobworkGiveScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { data: profileData } = useGetProfile();
  const { data: referenceData } = useGetConverterReferenceData();

  const jobworkTypeSheetRef = useRef<BottomSheetModal>(null);
  const timelineSheetRef = useRef<BottomSheetModal>(null);
  const rawMaterialSheetRef = useRef<BottomSheetModal>(null);
  const sizeUnitSheetRef = useRef<BottomSheetModal>(null);
  const thicknessUnitSheetRef = useRef<BottomSheetModal>(null);
  const finishSheetRef = useRef<BottomSheetModal>(null);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    getValues,
  } = useForm<PostJobworkGiveFormData>({
    defaultValues: {
      jobwork_type_id: null,
      jobwork_type_custom: '',
      raw_materials: '',
      size: '',
      size_unit: 'inches',
      thickness: '',
      thickness_unit: 'GSM',
      finish_ids: [],
      quantity: undefined,
      quality_requirements: '',
      timeline: 'Normal',
      delivery_location: '',
      latitude: undefined,
      longitude: undefined,
      location_source: 'saved',
      location_id: undefined,
      other_instructions: '',
    },
    mode: 'onBlur',
  });

  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [jobworkTypeSearchQuery, setJobworkTypeSearchQuery] = useState('');
  const [materialSearch, setMaterialSearch] = useState('');
  const [customMaterialName, setCustomMaterialName] = useState('');
  const [finishSearch, setFinishSearch] = useState('');

  const jobworkTypeId = watch('jobwork_type_id');
  const timelineValue = watch('timeline');
  const deliveryLocationValue = watch('delivery_location');
  const locationSourceValue = watch('location_source');
  const locationIdValue = watch('location_id');
  const latitudeValue = watch('latitude');
  const longitudeValue = watch('longitude');

  const converterTypes = referenceData?.converter_types ?? [];

  const jobworkTypeDisplay = useMemo(() => {
    if (jobworkTypeId === null) return '';
    const ct = converterTypes.find((c) => c.id === jobworkTypeId);
    return ct?.name ?? '';
  }, [jobworkTypeId, converterTypes]);

  const filteredJobworkTypes = useMemo(() => {
    const query = jobworkTypeSearchQuery.trim().toLowerCase();
    if (!query) return converterTypes;
    return converterTypes.filter((item) =>
      (item.name || '').toLowerCase().includes(query),
    );
  }, [converterTypes, jobworkTypeSearchQuery]);

  const {
    data: materialsData,
    isLoading: isLoadingMaterials,
    hasNextPage: hasNextMaterialsPage,
    isFetchingNextPage: isFetchingNextMaterialsPage,
    fetchNextPage: fetchNextMaterialsPage,
  } = useGetMaterialsInfinite(20);

  const allMaterials = useMemo<Material[]>(
    () => (materialsData?.pages ? materialsData.pages.flatMap((p) => p.materials) : []),
    [materialsData?.pages],
  );

  const filteredMaterials = useMemo(() => {
    const query = materialSearch.trim().toLowerCase();
    if (!query) return allMaterials;
    return allMaterials.filter(
      (item) =>
        (item.name || '').toLowerCase().includes(query) ||
        (item.category || '').toLowerCase().includes(query),
    );
  }, [allMaterials, materialSearch]);

  const rawMaterialsValue = watch('raw_materials');
  const sizeValue = watch('size');
  const sizeUnitValue = watch('size_unit');
  const thicknessValue = watch('thickness');
  const thicknessUnitValue = watch('thickness_unit');
  const finishIdsValue = watch('finish_ids') ?? [];

  const { data: finishesData } = useGetMaterialFinishesInfinite(50);
  const allFinishes = useMemo<MaterialFinish[]>(
    () => (finishesData?.pages ? finishesData.pages.flatMap((p) => p.finishes) : []),
    [finishesData?.pages],
  );
  const selectedFinishesDisplay = useMemo(() => {
    if (!finishIdsValue?.length) return '';
    const names = finishIdsValue
      .map((id) => allFinishes.find((f) => f.id === id)?.name)
      .filter(Boolean)
      .slice(0, 3);
    if (finishIdsValue.length > 3) return `${names.join(', ')} +${finishIdsValue.length - 3} more`;
    return names.join(', ');
  }, [allFinishes, finishIdsValue]);

  const toggleFinish = useCallback(
    (id: number) => {
      const current = getValues('finish_ids') ?? [];
      const next = current.includes(id) ? current.filter((i) => i !== id) : [...current, id];
      setValue('finish_ids', next, { shouldValidate: true });
    },
    [getValues, setValue],
  );

  const handleAddCustomMaterial = useCallback(() => {
    const name = customMaterialName.trim();
    if (!name) return;
    const current = getValues('raw_materials') ?? '';
    const next = current ? `${current}, ${name}` : name;
    setValue('raw_materials', next, { shouldValidate: true });
    setCustomMaterialName('');
  }, [customMaterialName, getValues, setValue]);

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
          state: loc?.state ?? null,
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

  const selectedTimelineLabel = useMemo(
    () => TIMELINE_OPTIONS.find((o) => o.value === timelineValue)?.label ?? 'Normal',
    [timelineValue],
  );

  const getSelectedLocationDisplay = useCallback(() => {
    if (locationIdValue != null && locationSourceValue === 'saved') {
      const saved = userLocations.find(
        (loc) => loc.id === locationIdValue || loc.backend_location_id === locationIdValue,
      );
      if (saved) return saved.address || `${saved.city}${saved.state ? `, ${saved.state}` : ''}`.trim();
    }
    return deliveryLocationValue || '';
  }, [locationIdValue, locationSourceValue, deliveryLocationValue, userLocations]);

  const handleSavedLocationSelect = useCallback(
    (savedLocation: SavedLocation) => {
      setValue('location_id', savedLocation.backend_location_id ?? savedLocation.id, { shouldValidate: true });
      setValue('location_source', 'saved', { shouldValidate: true });
      setValue(
        'delivery_location',
        savedLocation.address || `${savedLocation.city}${savedLocation.state ? `, ${savedLocation.state}` : ''}`.trim(),
        { shouldValidate: true },
      );
      setValue('latitude', parseFloat(savedLocation.latitude), { shouldValidate: true });
      setValue('longitude', parseFloat(savedLocation.longitude), { shouldValidate: true });
      setShowLocationDropdown(false);
      dispatch(showToast({ message: 'Delivery location selected!', type: 'success' }));
    },
    [setValue, dispatch],
  );

  const handleLocationSelect = useCallback(
    (location: Location) => {
      const address =
        location.address?.formattedAddress ||
        location.address?.streetAddress ||
        location.name ||
        '';
      setValue('location_id', undefined, { shouldValidate: true });
      setValue('location_source', 'manual', { shouldValidate: true });
      setValue('delivery_location', address, { shouldValidate: true });
      setValue('latitude', location.latitude, { shouldValidate: true });
      setValue('longitude', location.longitude, { shouldValidate: true });
      setShowLocationPicker(false);
      dispatch(showToast({ message: 'Delivery location selected successfully!', type: 'success' }));
    },
    [setValue, dispatch],
  );

  const onSubmit = useCallback(
    (data: PostJobworkGiveFormData) => {
      if (data.jobwork_type_id === null && !(data.jobwork_type_custom || '').trim()) {
        Alert.alert('Validation Error', 'Please select a jobwork type or enter a custom one.');
        return;
      }
      if (!data.quantity || data.quantity <= 0) {
        Alert.alert('Validation Error', 'Please enter a valid quantity in pieces.');
        return;
      }
      if (!data.timeline) {
        Alert.alert('Validation Error', 'Please select a timeline.');
        return;
      }
      if (!data.delivery_location.trim()) {
        Alert.alert('Validation Error', 'Please select a delivery location.');
        return;
      }
      if (!data.latitude || !data.longitude) {
        Alert.alert('Validation Error', 'Please select delivery location on the map or from saved locations.');
        return;
      }

      let jobworkTypeName = (data.jobwork_type_custom || '').trim();
      if (!jobworkTypeName) {
        const ct = converterTypes.find((c) => c.id === data.jobwork_type_id);
        jobworkTypeName = ct?.name ?? 'Printing';
      }

      const gradeFinish = (data.finish_ids ?? [])
        .map((id) => allFinishes.find((f) => f.id === id)?.name)
        .filter(Boolean)
        .join(', ') || undefined;

      const apiPayload = {
        jobwork_type: jobworkTypeName,
        raw_materials: data.raw_materials?.trim() || undefined,
        size: data.size?.trim() || undefined,
        size_unit: data.size_unit || undefined,
        thickness: data.thickness?.trim() || undefined,
        thickness_unit: data.thickness_unit || undefined,
        grade_finish: gradeFinish,
        quantity: data.quantity,
        quality_requirements: data.quality_requirements?.trim() || undefined,
        timeline: data.timeline,
        delivery_location: data.delivery_location.trim(),
        latitude: data.latitude,
        longitude: data.longitude,
        other_instructions: data.other_instructions?.trim() || undefined,
      };

      const refNumber = `#${Math.floor(Math.random() * 9000) + 1000}`;
      const urgencyLabel = data.timeline === 'Urgent' ? 'Urgent' : 'Normal';

      const listingDetails = {
        title: `${jobworkTypeName} Jobwork – Give ${data.quantity} pcs`,
        referenceNumber: refNumber,
        grade: data.quality_requirements?.trim() || 'Standard',
        materialName: jobworkTypeName,
        quantity: String(data.quantity),
        quantityUnit: 'pieces',
        urgency: urgencyLabel,
        tags: [
          'Jobwork',
          jobworkTypeName,
          'Give',
          ...(urgencyLabel === 'Urgent' ? ['Urgent'] : []),
        ],
      };

      navigation.navigate(SCREENS.MAIN.PAYMENT_CONFIRMATION as any, {
        listingDetails,
        formData: apiPayload,
        requirementType: 'converter-jobwork-give',
      });
    },
    [navigation, converterTypes, allFinishes],
  );

  const buttonHeight = 60;
  const bottomPadding = buttonHeight + theme.spacing[4] * 2 + insets.bottom;

  return (
    <BottomSheetModalProvider>
      <ScreenWrapper
        backgroundColor={theme.colors.background.secondary}
        scrollable
        safeAreaEdges={[]}
      >
        <View style={[styles.container, { paddingBottom: bottomPadding }]}>
          <Text variant="h3" fontWeight="bold" style={styles.title}>
            Post to Give Jobwork
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            Share jobwork you want to outsource so other converters can take it up.
          </Text>

          <View style={styles.formContainer}>
            {/* Card: Jobwork & quantity */}
            <Card style={styles.card}>
              <Text variant="h6" fontWeight="semibold" style={styles.sectionTitle}>
                Jobwork & quantity
              </Text>
              <View style={styles.formGroup}>
                <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                  Jobwork Type
                </Text>
                <DropdownButton
                  value={jobworkTypeDisplay}
                  placeholder="Select jobwork type"
                  onPress={() => jobworkTypeSheetRef.current?.present()}
                />
                <View style={{ marginTop: theme.spacing[3] }}>
                  <View style={styles.labelRow}>
                    <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                      Custom Jobwork Type
                    </Text>
                    <Text variant="captionSmall" style={styles.optionalLabel}>
                      (Optional)
                    </Text>
                  </View>
                  <FormInput
                    name="jobwork_type_custom"
                    control={control}
                    placeholder="Enter custom jobwork type if not in list"
                    containerStyle={{ marginBottom: 0 }}
                    showLabel={false}
                  />
                </View>
              </View>
              <View style={styles.formGroup}>
                <View style={styles.labelRow}>
                  <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                    Raw Materials / Material
                  </Text>
                  <Text variant="captionSmall" style={styles.optionalLabel}>
                    (Optional)
                  </Text>
                </View>
                <DropdownButton
                  value={rawMaterialsValue || ''}
                  placeholder="Select material"
                  onPress={() => rawMaterialSheetRef.current?.present()}
                />
                <View style={{ marginTop: theme.spacing[3] }}>
                  <View style={styles.labelRow}>
                    <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                      Custom Material
                    </Text>
                    <Text variant="captionSmall" style={styles.optionalLabel}>
                      (Optional)
                    </Text>
                  </View>
                  <View style={styles.customMaterialRow}>
                    <TextInput
                      style={styles.customMaterialInput}
                      value={customMaterialName}
                      onChangeText={setCustomMaterialName}
                      placeholder="Enter material if not in list"
                      placeholderTextColor={theme.colors.text.tertiary}
                    />
                    <TouchableOpacity
                      style={[
                        styles.addMaterialButton,
                        (!customMaterialName.trim() && { opacity: 0.6 }),
                      ]}
                      onPress={handleAddCustomMaterial}
                      disabled={!customMaterialName.trim()}
                    >
                      <Text variant="bodyMedium" style={styles.buttonText}>
                        Add
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <FormInput
                name="quantity"
                control={control}
                label="Quantity (pieces)"
                placeholder="e.g., 5000"
                keyboardType="numeric"
                rules={validationRules.required('Please enter quantity') as any}
                containerStyle={styles.formGroup}
              />
            </Card>

            {/* Card: Specifications */}
            <Card style={styles.card}>
              <Text variant="h6" fontWeight="semibold" style={styles.sectionTitle}>
                Specifications
              </Text>
              <View style={[styles.row, styles.formGroup]}>
                <View style={[styles.fieldContainer, styles.halfField, { marginRight: theme.spacing[2] }]}>
                  <Text variant="captionMedium" style={styles.label}>
                    Size
                  </Text>
                  <Controller
                    control={control}
                    name="size"
                    render={({ field: { value, onChange } }) => (
                      <TextInput
                        value={value ?? ''}
                        onChangeText={onChange}
                        placeholder="e.g. 10x10"
                        placeholderTextColor={theme.colors.text.tertiary}
                        style={styles.input}
                      />
                    )}
                  />
                </View>
                <View style={[styles.fieldContainer, styles.halfField, { marginLeft: theme.spacing[2] }]}>
                  <Text variant="captionMedium" style={styles.label}>
                    Unit
                  </Text>
                  <DropdownButton
                    value={SIZE_UNIT_OPTIONS.find((o) => o.value === sizeUnitValue)?.label}
                    placeholder="Select unit"
                    onPress={() => sizeUnitSheetRef.current?.present()}
                  />
                </View>
              </View>
              <View style={[styles.row, styles.formGroup]}>
                <View style={[styles.fieldContainer, styles.halfField, { marginRight: theme.spacing[2] }]}>
                  <View style={styles.labelRow}>
                    <Text variant="captionMedium" style={styles.label}>
                      Thickness
                    </Text>
                    <Text variant="captionSmall" style={styles.optionalLabel}>
                      (Optional)
                    </Text>
                  </View>
                  <Controller
                    control={control}
                    name="thickness"
                    render={({ field: { value, onChange } }) => (
                      <TextInput
                        value={value ?? ''}
                        onChangeText={onChange}
                        placeholder="e.g. 350"
                        placeholderTextColor={theme.colors.text.tertiary}
                        keyboardType="numeric"
                        style={styles.input}
                      />
                    )}
                  />
                </View>
                <View style={[styles.fieldContainer, styles.halfField, { marginLeft: theme.spacing[2] }]}>
                  <Text variant="captionMedium" style={styles.label}>
                    Unit
                  </Text>
                  <DropdownButton
                    value={THICKNESS_UNIT_OPTIONS.find((o) => o.value === thicknessUnitValue)?.label}
                    placeholder="Select unit"
                    onPress={() => thicknessUnitSheetRef.current?.present()}
                  />
                </View>
              </View>
              <View style={styles.formGroup}>
                <View style={styles.labelRow}>
                  <Text variant="captionMedium" style={styles.label}>
                    Grade / Finish / Certifications
                  </Text>
                  <Text variant="captionSmall" style={styles.optionalLabel}>
                    (Optional)
                  </Text>
                </View>
                <DropdownButton
                  value={selectedFinishesDisplay}
                  placeholder="Select finish options"
                  onPress={() => finishSheetRef.current?.present()}
                />
              </View>
              <FormInput
                name="quality_requirements"
                control={control}
                label="Quality Requirements / Certifications (optional)"
                placeholder="e.g., Tolerance ±0.5mm, FSSAI, pharma grade..."
                multiline
                numberOfLines={3}
                containerStyle={styles.formGroup}
              />
            </Card>

            {/* Card: Timeline & delivery */}
            <Card style={styles.card}>
              <Text variant="h6" fontWeight="semibold" style={styles.sectionTitle}>
                Timeline & delivery
              </Text>
              <View style={styles.formGroup}>
                <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                  Timeline
                </Text>
                <DropdownButton
                  value={selectedTimelineLabel}
                  placeholder="Select timeline"
                  onPress={() => timelineSheetRef.current?.present()}
                />
              </View>
              <View style={styles.formGroup}>
                <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                  Delivery Location
                </Text>
                <Controller
                  control={control}
                  name="delivery_location"
                  rules={validationRules.required('Please select delivery location') as any}
                  render={({ fieldState: { error } }) => {
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
                              style={
                                !displayValue
                                  ? { color: theme.colors.text.tertiary }
                                  : { color: theme.colors.text.primary }
                              }
                              numberOfLines={1}
                            >
                              {displayValue || 'Select delivery location'}
                            </Text>
                            {locationSourceValue === 'saved' && locationIdValue != null && (
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
                            style={{ color: theme.colors.error?.DEFAULT ?? '#c00', marginTop: theme.spacing[1] }}
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
            </Card>

            {/* Other instructions */}
            <Card style={styles.card}>
              <FormInput
                name="other_instructions"
                control={control}
                label="Any Other Specific Instructions (optional)"
                placeholder="Any packing, dispatch, or coordination notes for this jobwork."
                multiline
                numberOfLines={3}
                containerStyle={styles.formGroup}
              />
            </Card>
          </View>
        </View>
      </ScreenWrapper>

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

      {/* Jobwork Type Bottom Sheet */}
      <GorhomBottomSheetModal
        ref={jobworkTypeSheetRef}
        snapPoints={['50%', '75%']}
        enablePanDownToClose
        onDismiss={() => setJobworkTypeSearchQuery('')}
      >
        <View style={{ paddingHorizontal: theme.spacing[4], paddingTop: theme.spacing[2], flex: 1 }}>
          <Text variant="h4" fontWeight="semibold" style={{ marginBottom: theme.spacing[4] }}>
            Select Jobwork Type
          </Text>
          <View style={styles.searchContainer}>
            <AppIcon.Location
              width={18}
              height={18}
              color={theme.colors.text.tertiary}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search jobwork type"
              placeholderTextColor={theme.colors.text.tertiary}
              value={jobworkTypeSearchQuery}
              onChangeText={setJobworkTypeSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <BottomSheetFlatList
            data={filteredJobworkTypes}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ paddingBottom: theme.spacing[6] }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.modalOption,
                  jobworkTypeId === item.id && styles.locationOptionSelected,
                ]}
                onPress={() => {
                  setValue('jobwork_type_id', item.id, { shouldValidate: true });
                  jobworkTypeSheetRef.current?.dismiss();
                }}
              >
                <Text variant="bodyMedium">{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </GorhomBottomSheetModal>

      {/* Timeline Bottom Sheet */}
      <GorhomBottomSheetModal
        ref={timelineSheetRef}
        snapPoints={['50%', '80%']}
        index={1}
        enablePanDownToClose
      >
        <View style={{ paddingHorizontal: theme.spacing[4], paddingTop: theme.spacing[4], flex: 1 }}>
          <Text variant="h4" fontWeight="semibold" style={{ marginBottom: theme.spacing[4] }}>
            Select Timeline
          </Text>
          <BottomSheetFlatList
            data={TIMELINE_OPTIONS}
            keyExtractor={(item) => item.value}
            contentContainerStyle={{ paddingBottom: theme.spacing[6] }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.modalOption,
                  timelineValue === item.value && styles.locationOptionSelected,
                ]}
                onPress={() => {
                  setValue('timeline', item.value, { shouldValidate: true });
                  timelineSheetRef.current?.dismiss();
                }}
              >
                <Text variant="bodyMedium">{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </GorhomBottomSheetModal>

      {/* Raw Material Bottom Sheet */}
      <GorhomBottomSheetModal
        ref={rawMaterialSheetRef}
        snapPoints={['70%', '95%']}
        enablePanDownToClose
        onDismiss={() => setMaterialSearch('')}
      >
        <View style={{ paddingHorizontal: theme.spacing[4], paddingTop: theme.spacing[4], flex: 1 }}>
          <Text variant="h4" fontWeight="semibold" style={{ marginBottom: theme.spacing[3] }}>
            Select Material
          </Text>
          <View style={styles.searchContainer}>
            <AppIcon.Location
              width={18}
              height={18}
              color={theme.colors.text.tertiary}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search material..."
              placeholderTextColor={theme.colors.text.tertiary}
              value={materialSearch}
              onChangeText={setMaterialSearch}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <BottomSheetFlatList
            data={filteredMaterials}
            keyExtractor={(item: Material) => `material-${item.id}`}
            contentContainerStyle={{ paddingBottom: theme.spacing[6] }}
            renderItem={({ item }: { item: Material }) => (
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setValue('raw_materials', item.name ?? '', { shouldValidate: true });
                  rawMaterialSheetRef.current?.dismiss();
                }}
              >
                <Text variant="bodyMedium">{item.name}</Text>
              </TouchableOpacity>
            )}
            onEndReached={() => {
              if (hasNextMaterialsPage && !isFetchingNextMaterialsPage) fetchNextMaterialsPage();
            }}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              isFetchingNextMaterialsPage ? (
                <View style={{ paddingVertical: theme.spacing[2], alignItems: 'center' }}>
                  <ActivityIndicator size="small" color={theme.colors.primary.DEFAULT} />
                </View>
              ) : null
            }
            ListEmptyComponent={
              isLoadingMaterials ? (
                <View style={{ paddingVertical: theme.spacing[4], alignItems: 'center' }}>
                  <ActivityIndicator size="small" color={theme.colors.primary.DEFAULT} />
                </View>
              ) : null
            }
          />
        </View>
      </GorhomBottomSheetModal>

      {/* Size unit sheet */}
      <GorhomBottomSheetModal ref={sizeUnitSheetRef} snapPoints={['40%']} enablePanDownToClose>
        <View style={{ paddingHorizontal: theme.spacing[4], paddingTop: theme.spacing[4] }}>
          <Text variant="h4" fontWeight="semibold" style={{ marginBottom: theme.spacing[4] }}>
            Select size unit
          </Text>
          <BottomSheetFlatList
            data={SIZE_UNIT_OPTIONS}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.modalOption, sizeUnitValue === item.value && styles.locationOptionSelected]}
                onPress={() => {
                  setValue('size_unit', item.value, { shouldValidate: true });
                  sizeUnitSheetRef.current?.dismiss();
                }}
              >
                <Text variant="bodyMedium">{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </GorhomBottomSheetModal>

      {/* Thickness unit sheet */}
      <GorhomBottomSheetModal ref={thicknessUnitSheetRef} snapPoints={['50%']} enablePanDownToClose>
        <View style={{ paddingHorizontal: theme.spacing[4], paddingTop: theme.spacing[4] }}>
          <Text variant="h4" fontWeight="semibold" style={{ marginBottom: theme.spacing[4] }}>
            Select thickness unit
          </Text>
          <BottomSheetFlatList
            data={THICKNESS_UNIT_OPTIONS}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.modalOption, thicknessUnitValue === item.value && styles.locationOptionSelected]}
                onPress={() => {
                  setValue('thickness_unit', item.value, { shouldValidate: true });
                  thicknessUnitSheetRef.current?.dismiss();
                }}
              >
                <Text variant="bodyMedium">{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </GorhomBottomSheetModal>

      {/* Finish sheet */}
      <GorhomBottomSheetModal
        ref={finishSheetRef}
        snapPoints={['70%', '95%']}
        enablePanDownToClose
        onDismiss={() => setFinishSearch('')}
      >
        <MultiSelectBottomSheetContent
          title="Select Grade / Finish / Certifications"
          searchQuery={finishSearch}
          onSearchChange={setFinishSearch}
          items={allFinishes.map((item) => ({ id: item.id, name: item.name }))}
          selectedIds={finishIdsValue}
          onSelect={toggleFinish}
          onDeselect={toggleFinish}
          theme={theme}
          ListComponent={BottomSheetFlatList}
        />
      </GorhomBottomSheetModal>

      {/* Location Dropdown */}
      {showLocationDropdown && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
            onPress={() => setShowLocationDropdown(false)}
            activeOpacity={1}
          />
          <View style={[styles.modalContent, { maxHeight: '80%' }]}>
            <View style={styles.modalHeader}>
              <Text variant="h4" fontWeight="semibold">
                Select Delivery Location
              </Text>
              <TouchableOpacity onPress={() => setShowLocationDropdown(false)}>
                <AppIcon.Close width={24} height={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {userLocations.length === 0 ? (
                <View style={{ paddingVertical: theme.spacing[2] }}>
                  <Text
                    variant="bodyMedium"
                    style={{ color: theme.colors.text.tertiary }}
                  >
                    No saved locations found.
                  </Text>
                </View>
              ) : (
                userLocations.map((loc) => (
                  <TouchableOpacity
                    key={loc.id}
                    style={styles.modalOption}
                    onPress={() => handleSavedLocationSelect(loc)}
                  >
                    <Text variant="bodyMedium">
                      {loc.address || loc.city}
                    </Text>
                    <Text
                      variant="captionSmall"
                      style={{ color: theme.colors.text.tertiary }}
                    >
                      {loc.city}
                      {loc.state ? `, ${loc.state}` : ''}
                    </Text>
                  </TouchableOpacity>
                ))
              )}

              <TouchableOpacity
                style={[
                  styles.modalOption,
                  {
                    backgroundColor: theme.colors.surface.secondary,
                    borderRadius: theme.borderRadius.md,
                    marginTop: theme.spacing[2],
                  },
                ]}
                onPress={() => {
                  setShowLocationDropdown(false);
                  setShowLocationPicker(true);
                }}
              >
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.primary.DEFAULT }}
                >
                  Select on Map
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      )}

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
              ? { latitude: latitudeValue, longitude: longitudeValue }
              : undefined
          }
          onLocationSelect={handleLocationSelect}
          onCancel={() => setShowLocationPicker(false)}
          allowMapTap
          confirmButtonText="Confirm Location"
          title="Select Delivery Location"
        />
      </Modal>
    </BottomSheetModalProvider>
  );
};

export default PostJobworkGiveScreen;

