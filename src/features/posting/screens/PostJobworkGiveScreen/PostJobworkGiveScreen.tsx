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
import type { JobworkTimeline, ConverterType } from '@services/api/converterApi/@types';

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

type Specification = {
  id: string;
  material_name: string;
  size: string;
  size_unit: SizeUnit;
  thickness: string;
  thickness_unit: ThicknessUnit;
  finish_ids: number[];
};

type PostJobworkGiveFormData = {
  jobwork_type_id: number | null;
  jobwork_type_custom: string;
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

const newSpec = (): Specification => ({
  id: Math.random().toString(36).slice(2),
  material_name: '',
  size: '',
  size_unit: 'inches',
  thickness: '',
  thickness_unit: 'GSM',
  finish_ids: [],
});

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
  } = useForm<PostJobworkGiveFormData>({
    defaultValues: {
      jobwork_type_id: null,
      jobwork_type_custom: '',
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

  // Multi-specification state (outside RHF — dynamic arrays)
  const [specifications, setSpecifications] = useState<Specification[]>([newSpec()]);
  const [activeSpecIndex, setActiveSpecIndex] = useState(0);

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

  const { data: finishesData } = useGetMaterialFinishesInfinite(50);
  const allFinishes = useMemo<MaterialFinish[]>(
    () => (finishesData?.pages ? finishesData.pages.flatMap((p) => p.finishes) : []),
    [finishesData?.pages],
  );

  // Per-spec helpers
  const updateSpec = useCallback((index: number, patch: Partial<Specification>) => {
    setSpecifications((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }, []);

  const addSpec = useCallback(() => {
    setSpecifications((prev) => [...prev, newSpec()]);
  }, []);

  const removeSpec = useCallback((index: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
    setActiveSpecIndex((prev) => (prev >= index && prev > 0 ? prev - 1 : prev));
  }, []);

  const buildFinishDisplay = useCallback(
    (finish_ids: number[]): string => {
      if (!finish_ids?.length) return '';
      const names = finish_ids
        .map((id) => allFinishes.find((f) => f.id === id)?.name)
        .filter(Boolean)
        .slice(0, 3);
      if (finish_ids.length > 3) return `${names.join(', ')} +${finish_ids.length - 3} more`;
      return names.join(', ');
    },
    [allFinishes],
  );

  const toggleFinish = useCallback((id: number) => {
    setSpecifications((prev) =>
      prev.map((s, i) => {
        if (i !== activeSpecIndex) return s;
        const next = s.finish_ids.includes(id)
          ? s.finish_ids.filter((f) => f !== id)
          : [...s.finish_ids, id];
        return { ...s, finish_ids: next };
      }),
    );
  }, [activeSpecIndex]);

  const handleAddCustomMaterial = useCallback(() => {
    const name = customMaterialName.trim();
    if (!name) return;
    updateSpec(activeSpecIndex, { material_name: name });
    setCustomMaterialName('');
  }, [customMaterialName, activeSpecIndex, updateSpec]);

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

      const firstSpec = specifications[0] ?? newSpec();
      const rawMaterials = specifications
        .map((s) => s.material_name)
        .filter(Boolean)
        .join(', ');

      const allFinishIds = Array.from(new Set(specifications.flatMap((s) => s.finish_ids)));
      const gradeFinish =
        allFinishIds
          .map((id) => allFinishes.find((f) => f.id === id)?.name)
          .filter(Boolean)
          .join(', ') || undefined;

      const apiPayload = {
        jobwork_type: jobworkTypeName,
        raw_materials: rawMaterials || undefined,
        size: firstSpec.size || undefined,
        size_unit: firstSpec.size ? firstSpec.size_unit : undefined,
        thickness: firstSpec.thickness || undefined,
        thickness_unit: firstSpec.thickness ? firstSpec.thickness_unit : undefined,
        grade_finish: gradeFinish,
        specifications: specifications.map((s) => ({
          material: s.material_name,
          size: s.size,
          size_unit: s.size_unit,
          thickness: s.thickness,
          thickness_unit: s.thickness_unit,
          finish: s.finish_ids
            .map((id) => allFinishes.find((f) => f.id === id)?.name)
            .filter(Boolean)
            .join(', '),
        })),
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
        materialName: rawMaterials || jobworkTypeName,
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
    [navigation, converterTypes, allFinishes, specifications],
  );

  const buttonHeight = 60;
  const bottomPadding = buttonHeight + theme.spacing[4] * 2 + insets.bottom;

  const activeSpec = specifications[activeSpecIndex];

  const renderSpecCard = (spec: Specification, index: number) => (
    <View
      key={spec.id}
      style={[
        styles.card,
        {
          marginBottom: index < specifications.length - 1 ? theme.spacing[3] : 0,
          borderWidth: 1,
          borderColor: theme.colors.border.primary,
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing[3],
        },
      ]}
    >
      {/* Spec card header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing[3] }}>
        <Text variant="bodyMedium" fontWeight="semibold" style={{ color: theme.colors.text.primary }}>
          Specification {index + 1}
        </Text>
        {specifications.length > 1 && (
          <TouchableOpacity onPress={() => removeSpec(index)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <AppIcon.Close width={18} height={18} color={theme.colors.text.tertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Material */}
      <View style={styles.formGroup}>
        <View style={styles.labelRow}>
          <Text variant="captionMedium" style={styles.label}>Material</Text>
          <Text variant="captionSmall" style={styles.optionalLabel}>(Optional)</Text>
        </View>
        <DropdownButton
          value={spec.material_name}
          placeholder="Select material"
          onPress={() => {
            setActiveSpecIndex(index);
            rawMaterialSheetRef.current?.present();
          }}
        />
        <View style={[styles.customMaterialRow, { marginTop: theme.spacing[2] }]}>
          <TextInput
            style={styles.customMaterialInput}
            value={index === activeSpecIndex ? customMaterialName : ''}
            onFocus={() => setActiveSpecIndex(index)}
            onChangeText={(v) => {
              setActiveSpecIndex(index);
              setCustomMaterialName(v);
            }}
            placeholder="Or type custom material name"
            placeholderTextColor={theme.colors.text.tertiary}
          />
          <TouchableOpacity
            style={[
              styles.addMaterialButton,
              ((!customMaterialName.trim() || index !== activeSpecIndex) && { opacity: 0.6 }),
            ]}
            onPress={handleAddCustomMaterial}
            disabled={!customMaterialName.trim() || index !== activeSpecIndex}
          >
            <Text variant="bodyMedium" style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Size + Size Unit */}
      <View style={[styles.row, styles.formGroup]}>
        <View style={[styles.fieldContainer, styles.halfField, { marginRight: theme.spacing[2] }]}>
          <View style={styles.labelRow}>
            <Text variant="captionMedium" style={styles.label}>Size</Text>
            <Text variant="captionSmall" style={styles.optionalLabel}>(Optional)</Text>
          </View>
          <TextInput
            value={spec.size}
            onChangeText={(v) => updateSpec(index, { size: v })}
            placeholder="e.g. 10x10"
            placeholderTextColor={theme.colors.text.tertiary}
            style={styles.input}
          />
        </View>
        <View style={[styles.fieldContainer, styles.halfField, { marginLeft: theme.spacing[2] }]}>
          <Text variant="captionMedium" style={styles.label}>Unit</Text>
          <DropdownButton
            value={SIZE_UNIT_OPTIONS.find((o) => o.value === spec.size_unit)?.label}
            placeholder="Select unit"
            onPress={() => {
              setActiveSpecIndex(index);
              sizeUnitSheetRef.current?.present();
            }}
          />
        </View>
      </View>

      {/* Thickness + Thickness Unit */}
      <View style={[styles.row, styles.formGroup]}>
        <View style={[styles.fieldContainer, styles.halfField, { marginRight: theme.spacing[2] }]}>
          <View style={styles.labelRow}>
            <Text variant="captionMedium" style={styles.label}>Thickness</Text>
            <Text variant="captionSmall" style={styles.optionalLabel}>(Optional)</Text>
          </View>
          <TextInput
            value={spec.thickness}
            onChangeText={(v) => updateSpec(index, { thickness: v })}
            placeholder="e.g. 350"
            placeholderTextColor={theme.colors.text.tertiary}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
        <View style={[styles.fieldContainer, styles.halfField, { marginLeft: theme.spacing[2] }]}>
          <Text variant="captionMedium" style={styles.label}>Unit</Text>
          <DropdownButton
            value={THICKNESS_UNIT_OPTIONS.find((o) => o.value === spec.thickness_unit)?.label}
            placeholder="Select unit"
            onPress={() => {
              setActiveSpecIndex(index);
              thicknessUnitSheetRef.current?.present();
            }}
          />
        </View>
      </View>

      {/* Grade / Finish */}
      <View style={{ marginBottom: 0 }}>
        <View style={styles.labelRow}>
          <Text variant="captionMedium" style={styles.label}>Grade / Finish / Certifications</Text>
          <Text variant="captionSmall" style={styles.optionalLabel}>(Optional)</Text>
        </View>
        <DropdownButton
          value={buildFinishDisplay(spec.finish_ids)}
          placeholder="Select finish options"
          onPress={() => {
            setActiveSpecIndex(index);
            finishSheetRef.current?.present();
          }}
        />
      </View>
    </View>
  );

  return (
    <BottomSheetModalProvider>
      <ScreenWrapper
        backgroundColor={theme.colors.background.secondary}
        scrollable
        safeAreaEdges={[]}
        keyboardAvoiding
        keyboardDoneBar
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
                Jobwork & Quantity
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

            {/* Card: Specifications (multi) */}
            <Card style={styles.card}>
              <Text variant="h6" fontWeight="semibold" style={styles.sectionTitle}>
                Specifications
              </Text>
              <Text variant="captionMedium" style={[styles.label, { marginBottom: theme.spacing[3] }]}>
                Add one or more material specifications for this jobwork.
              </Text>

              {specifications.map((spec, index) => renderSpecCard(spec, index))}

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: theme.spacing[3],
                  paddingVertical: theme.spacing[3],
                  borderWidth: 1,
                  borderColor: theme.colors.primary.DEFAULT,
                  borderStyle: 'dashed',
                  borderRadius: theme.borderRadius.md,
                  gap: theme.spacing[2],
                }}
                onPress={addSpec}
                activeOpacity={0.7}
              >
                <AppIcon.PlusCircle width={18} height={18} color={theme.colors.primary.DEFAULT} />
                <Text variant="bodyMedium" style={{ color: theme.colors.primary.DEFAULT }}>
                  Add Specification
                </Text>
              </TouchableOpacity>

              <FormInput
                name="quality_requirements"
                control={control}
                label="Quality Requirements / Certifications (optional)"
                placeholder="e.g., Tolerance ±0.5mm, FSSAI, pharma grade..."
                multiline
                numberOfLines={3}
                containerStyle={{ marginTop: theme.spacing[4], marginBottom: 0 }}
              />
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
          <BottomSheetFlatList<ConverterType>
            data={filteredJobworkTypes}
            keyExtractor={(item: ConverterType) => String(item.id)}
            contentContainerStyle={{ paddingBottom: theme.spacing[6] }}
            renderItem={({ item }: { item: ConverterType }) => (
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
          <BottomSheetFlatList<{ label: string; value: JobworkTimeline }>
            data={TIMELINE_OPTIONS}
            keyExtractor={(item: { label: string; value: JobworkTimeline }) => item.value}
            contentContainerStyle={{ paddingBottom: theme.spacing[6] }}
            renderItem={({ item }: { item: { label: string; value: JobworkTimeline } }) => (
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

      {/* Raw Material Bottom Sheet (shared, writes to activeSpecIndex) */}
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
                style={[
                  styles.modalOption,
                  activeSpec?.material_name === item.name && styles.locationOptionSelected,
                ]}
                onPress={() => {
                  updateSpec(activeSpecIndex, { material_name: item.name ?? '' });
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

      {/* Size unit sheet (shared, writes to activeSpecIndex) */}
      <GorhomBottomSheetModal ref={sizeUnitSheetRef} snapPoints={['40%']} enablePanDownToClose>
        <View style={{ paddingHorizontal: theme.spacing[4], paddingTop: theme.spacing[4] }}>
          <Text variant="h4" fontWeight="semibold" style={{ marginBottom: theme.spacing[4] }}>
            Select size unit
          </Text>
          <BottomSheetFlatList<{ label: string; value: SizeUnit }>
            data={SIZE_UNIT_OPTIONS}
            keyExtractor={(item: { label: string; value: SizeUnit }) => item.value}
            renderItem={({ item }: { item: { label: string; value: SizeUnit } }) => (
              <TouchableOpacity
                style={[
                  styles.modalOption,
                  activeSpec?.size_unit === item.value && styles.locationOptionSelected,
                ]}
                onPress={() => {
                  updateSpec(activeSpecIndex, { size_unit: item.value });
                  sizeUnitSheetRef.current?.dismiss();
                }}
              >
                <Text variant="bodyMedium">{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </GorhomBottomSheetModal>

      {/* Thickness unit sheet (shared, writes to activeSpecIndex) */}
      <GorhomBottomSheetModal ref={thicknessUnitSheetRef} snapPoints={['50%']} enablePanDownToClose>
        <View style={{ paddingHorizontal: theme.spacing[4], paddingTop: theme.spacing[4] }}>
          <Text variant="h4" fontWeight="semibold" style={{ marginBottom: theme.spacing[4] }}>
            Select thickness unit
          </Text>
          <BottomSheetFlatList<{ label: string; value: ThicknessUnit }>
            data={THICKNESS_UNIT_OPTIONS}
            keyExtractor={(item: { label: string; value: ThicknessUnit }) => item.value}
            renderItem={({ item }: { item: { label: string; value: ThicknessUnit } }) => (
              <TouchableOpacity
                style={[
                  styles.modalOption,
                  activeSpec?.thickness_unit === item.value && styles.locationOptionSelected,
                ]}
                onPress={() => {
                  updateSpec(activeSpecIndex, { thickness_unit: item.value });
                  thicknessUnitSheetRef.current?.dismiss();
                }}
              >
                <Text variant="bodyMedium">{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </GorhomBottomSheetModal>

      {/* Finish sheet (shared multi-select, writes to activeSpecIndex) */}
      <GorhomBottomSheetModal
        ref={finishSheetRef}
        doneFooter
        snapPoints={['70%', '95%']}
        enablePanDownToClose
        onDismiss={() => setFinishSearch('')}
      >
        <MultiSelectBottomSheetContent
          title="Select Grade / Finish / Certifications"
          searchQuery={finishSearch}
          onSearchChange={setFinishSearch}
          items={allFinishes.map((item) => ({ id: item.id, name: item.name }))}
          selectedIds={activeSpec?.finish_ids ?? []}
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
                  <Text variant="bodyMedium" style={{ color: theme.colors.text.tertiary }}>
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
                    <Text variant="bodyMedium">{loc.address || loc.city}</Text>
                    <Text variant="captionSmall" style={{ color: theme.colors.text.tertiary }}>
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
                <Text variant="bodyMedium" style={{ color: theme.colors.primary.DEFAULT }}>
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
