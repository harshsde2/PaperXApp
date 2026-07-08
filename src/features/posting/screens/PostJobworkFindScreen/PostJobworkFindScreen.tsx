import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Controller } from 'react-hook-form';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { GorhomBottomSheetModal } from '@shared/components/GorhomBottomSheetModal';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { FloatingBottomContainer } from '@shared/components/FloatingBottomContainer';
import { DropdownButton } from '@shared/components/DropdownButton';
import { ImagePicker } from '@shared/components/ImagePicker';
import MultiSelectBottomSheetContent from '@shared/components/MultiSelectBottomSheetContent';
import { LocationPicker } from '@shared/location';
import type { Location } from '@shared/location/types';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { useForm, FormInput, validationRules } from '@shared/forms';
import {
  useGetConverterReferenceData,
  useGetProfile,
  useUploadImage,
} from '@services/api';
import { normalizePostingLocationsFromProfile } from '@services/api/userApi/locationNormalizer';
import { SCREENS } from '@navigation/constants';
import { useAppSelector } from '@store/hooks';
import { createStyles } from '../PostToBuyScreen/styles';
import type { JobworkTimeline } from '@services/api/converterApi/@types';
import type { PickedImage } from '@shared/utils/imagePicker';

type PostJobworkFindFormData = {
  jobwork_type_id: number | null;
  jobwork_type_custom: string;
  machine_ids: number[];
  timeline: JobworkTimeline;
  minimum_order_quantity?: number;
  special_instructions?: string;
  sample_available: boolean;
  sample_image: string | null;
  location: string;
  city: string;
  latitude?: number;
  longitude?: number;
  location_id?: number;
  location_source: 'saved' | 'manual';
};

const TIMELINE_OPTIONS: { label: string; value: JobworkTimeline }[] = [
  { label: 'Normal', value: 'Normal' },
  { label: 'Urgent', value: 'Urgent' },
];

type SavedLocation = {
  id: number;
  address: string;
  latitude: string;
  longitude: string;
  city: string;
  state: string | null;
  backend_location_id?: number;
};

const PostJobworkFindScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const user = useAppSelector((state) => state.auth.user);
  const { data: referenceData, isLoading: isLoadingReference } = useGetConverterReferenceData();
  const { data: profileData } = useGetProfile();
  const uploadImage = useUploadImage();

  const jobworkTypeSheetRef = useRef<BottomSheetModal>(null);
  const machinerySheetRef = useRef<BottomSheetModal>(null);
  const timelineSheetRef = useRef<BottomSheetModal>(null);

  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [jobworkTypeSearchQuery, setJobworkTypeSearchQuery] = useState('');
  const [machinerySearchQuery, setMachinerySearchQuery] = useState('');
  const [sampleImageFile, setSampleImageFile] = useState<PickedImage | null>(null);
  const [sampleImagePreviewUri, setSampleImagePreviewUri] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    getValues,
  } = useForm<PostJobworkFindFormData>({
    defaultValues: {
      jobwork_type_id: null,
      jobwork_type_custom: '',
      machine_ids: [],
      timeline: 'Normal',
      minimum_order_quantity: undefined,
      special_instructions: '',
      sample_available: false,
      sample_image: null,
      location: '',
      city: '',
      latitude: undefined,
      longitude: undefined,
      location_id: undefined,
      location_source: 'saved',
    },
    mode: 'onBlur',
  });

  const jobworkTypeId = watch('jobwork_type_id');
  const jobworkTypeCustom = watch('jobwork_type_custom');
  const machineIds = watch('machine_ids') ?? [];
  const timelineValue = watch('timeline');
  const sampleAvailable = watch('sample_available');
  const locationValue = watch('location');
  const locationIdValue = watch('location_id');
  const locationSourceValue = watch('location_source');
  const latitudeValue = watch('latitude');
  const longitudeValue = watch('longitude');

  const converterTypes = referenceData?.converter_types ?? [];
  const machines = referenceData?.machines ?? [];

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
          address: loc?.address || `${loc?.city || ''}${loc?.state ? `, ${loc.state}` : ''}`.trim(),
          latitude,
          longitude,
          city: loc?.city || '',
          state: loc?.state ?? null,
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

  const getMachineryDisplay = useCallback((ids: number[], items: Array<{ id: number; name: string }>): string => {
    if (!ids?.length) return '';
    if (ids.length === 1) {
      const item = items.find((i) => i.id === ids[0]);
      return item?.name || '';
    }
    return `${ids.length} selected`;
  }, []);

  const machineryDisplay = useMemo(
    () => getMachineryDisplay(machineIds, machines),
    [machineIds, machines, getMachineryDisplay],
  );

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
    return locationValue || '';
  }, [locationIdValue, locationSourceValue, locationValue, userLocations]);

  const handleSavedLocationSelect = useCallback(
    (savedLocation: SavedLocation) => {
      setValue('location_id', savedLocation.backend_location_id ?? savedLocation.id, { shouldValidate: true });
      setValue('location_source', 'saved', { shouldValidate: true });
      setValue(
        'location',
        savedLocation.address || `${savedLocation.city}${savedLocation.state ? `, ${savedLocation.state}` : ''}`.trim(),
        { shouldValidate: true },
      );
      setValue('city', savedLocation.city || '', { shouldValidate: true });
      setValue('latitude', parseFloat(savedLocation.latitude), { shouldValidate: true });
      setValue('longitude', parseFloat(savedLocation.longitude), { shouldValidate: true });
      setShowLocationDropdown(false);
    },
    [setValue],
  );

  const handleLocationSelect = useCallback(
    (location: Location) => {
      const address =
        location.address?.formattedAddress ||
        location.address?.streetAddress ||
        location.name ||
        '';
      const city = location.address?.city ?? '';
      setValue('location_id', undefined, { shouldValidate: true });
      setValue('location_source', 'manual', { shouldValidate: true });
      setValue('location', address, { shouldValidate: true });
      setValue('city', city, { shouldValidate: true });
      setValue('latitude', location.latitude, { shouldValidate: true });
      setValue('longitude', location.longitude, { shouldValidate: true });
      setShowLocationPicker(false);
    },
    [setValue],
  );

  const handleSampleImageChange = useCallback((image: PickedImage | null) => {
    setSampleImageFile(image);
    setSampleImagePreviewUri(image ? image.uri : null);
  }, []);

  const onSubmit = useCallback(
    async (data: PostJobworkFindFormData) => {
      if (data.jobwork_type_id === null) {
        Alert.alert('Validation Error', 'Please select a jobwork type.');
        return;
      }
      if (!data.machine_ids?.length) {
        Alert.alert('Validation Error', 'Please select at least one machinery available.');
        return;
      }
      if (!data.timeline) {
        Alert.alert('Validation Error', 'Please select a timeline.');
        return;
      }
      if (!data.latitude || !data.longitude) {
        Alert.alert('Validation Error', 'Please select a location (saved or on map).');
        return;
      }
      if (!data.location?.trim()) {
        Alert.alert('Validation Error', 'Please select a valid location.');
        return;
      }

      let jobworkTypeName = (data.jobwork_type_custom || '').trim();
      if (!jobworkTypeName) {
        const ct = converterTypes.find((c) => c.id === data.jobwork_type_id);
        jobworkTypeName = ct?.name ?? 'Printing';
      }
      const jobwork_type = jobworkTypeName;
      const machinery_available = machines
        .filter((m) => (data.machine_ids ?? []).includes(m.id))
        .map((m) => m.name)
        .join(', ');

      let sample_image: string | null = data.sample_image ?? null;
      if (data.sample_available && sampleImageFile) {
        try {
          sample_image = await uploadImage.mutateAsync({ file: sampleImageFile });
        } catch (e) {
          Alert.alert('Upload Error', 'Failed to upload sample image. Please try again.');
          return;
        }
      }

      const apiPayload = {
        jobwork_type,
        machinery_available,
        timeline: data.timeline,
        minimum_order_quantity: data.minimum_order_quantity || undefined,
        special_instructions: data.special_instructions?.trim() || undefined,
        sample_available: !!data.sample_available,
        sample_image,
        location: data.location?.trim(),
        city: data.city?.trim(),
        latitude: data.latitude,
        longitude: data.longitude,
      };

      const refNumber = `#${Math.floor(Math.random() * 9000) + 1000}`;
      const urgencyLabel = data.timeline === 'Urgent' ? 'Urgent' : 'Normal';

      const listingDetails = {
        title: `${jobworkTypeName} Jobwork – Find Work`,
        referenceNumber: refNumber,
        grade: jobworkTypeName,
        materialName: jobworkTypeName,
        quantity: data.minimum_order_quantity ? String(data.minimum_order_quantity) : '',
        quantityUnit: 'pieces',
        urgency: urgencyLabel,
        tags: [
          'Jobwork',
          jobworkTypeName,
          'Find',
          ...(urgencyLabel === 'Urgent' ? ['Urgent'] : []),
        ],
      };

      navigation.navigate(SCREENS.MAIN.PAYMENT_CONFIRMATION as any, {
        listingDetails,
        formData: apiPayload,
        requirementType: 'converter-jobwork-find',
      });
    },
    [
      navigation,
      converterTypes,
      machines,
      sampleImageFile,
      uploadImage,
    ],
  );

  const buttonHeight = 60;
  const bottomPadding = buttonHeight + theme.spacing[4] * 2 + insets.bottom;

  if (isLoadingReference) {
    return null;
  }

  return (
    <BottomSheetModalProvider>
      <ScreenWrapper
        backgroundColor={theme.colors.background.secondary}
        scrollable
        safeAreaEdges={[]}
        keyboardAvoiding
        keyboardDoneBar
      >
        <Animated.View
          style={[styles.container, { paddingBottom: bottomPadding }]}
          entering={FadeIn.duration(300)}
        >
          <Text variant="h3" fontWeight="bold" style={styles.title}>
            Post to Find Jobwork
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            Share your available capacity so other converters can send you jobwork.
          </Text>

          <View style={styles.formContainer}>
            {/* Jobwork Type */}
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

            {/* Machinery Available */}
            <View style={styles.formGroup}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Machinery Available in the Factory
              </Text>
              <DropdownButton
                value={machineryDisplay}
                placeholder="Select machinery"
                onPress={() => machinerySheetRef.current?.present()}
              />
            </View>

            {/* Timeline */}
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

            {/* Location */}
            <View style={styles.formGroup}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Location
              </Text>
              <Controller
                control={control}
                name="location"
                rules={validationRules.required('Please select location') as any}
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
                            {displayValue || 'Select location'}
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

            {/* Minimum Order Quantity */}
            <FormInput
              name="minimum_order_quantity"
              control={control}
              label="Minimum Order Quantity (optional)"
              placeholder="e.g., 1000"
              keyboardType="numeric"
              containerStyle={styles.formGroup}
            />

            {/* Special Instructions */}
            <FormInput
              name="special_instructions"
              control={control}
              label="Special Instructions (optional)"
              placeholder="Any preferences on job size, run length, finishing, etc."
              multiline
              numberOfLines={4}
              containerStyle={styles.formGroup}
            />

            {/* Sample Available */}
            <View style={styles.formGroup}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ flex: 1, marginRight: theme.spacing[2] }}>
                  <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                    Sample Available
                  </Text>
                  <Text variant="captionSmall" style={{ color: theme.colors.text.tertiary }}>
                    Toggle on if you can show sample output for this jobwork.
                  </Text>
                </View>
                <Switch
                  value={sampleAvailable}
                  onValueChange={(value) =>
                    setValue('sample_available', value, { shouldValidate: true })
                  }
                  thumbColor={sampleAvailable ? theme.colors.primary.DEFAULT : '#f4f3f4'}
                  trackColor={{ false: '#d1d5db', true: theme.colors.primary.light || '#bfdbfe' }}
                />
              </View>
              {sampleAvailable && (
                <View style={{ marginTop: theme.spacing[2] }}>
                  <Text variant="captionMedium" style={styles.label}>
                    Sample Image
                  </Text>
                  <ImagePicker
                    value={sampleImageFile}
                    onChange={handleSampleImageChange}
                    previewUri={sampleImagePreviewUri}
                    placeholderText="Add sample photo"
                    showCamera
                  />
                </View>
              )}
            </View>
          </View>
        </Animated.View>
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

      {/* Jobwork Type Bottom Sheet (converter types + Other) */}
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
            keyExtractor={(item: { id: number }) => String(item.id)}
            contentContainerStyle={{ paddingBottom: theme.spacing[6] }}
            renderItem={({ item }: { item: { id: number; name: string } }) => (
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

      {/* Machinery Bottom Sheet */}
      <GorhomBottomSheetModal
        ref={machinerySheetRef}
        doneFooter
        snapPoints={['60%', '90%']}
        enablePanDownToClose
        onDismiss={() => setMachinerySearchQuery('')}
      >
        <MultiSelectBottomSheetContent
          title="Select Machinery"
          searchQuery={machinerySearchQuery}
          onSearchChange={setMachinerySearchQuery}
          items={machines}
          selectedIds={machineIds}
          onSelect={(id) => {
            const current = getValues('machine_ids') ?? [];
            if (!current.includes(id)) setValue('machine_ids', [...current, id], { shouldValidate: true });
          }}
          onDeselect={(id) => {
            const current = getValues('machine_ids') ?? [];
            setValue('machine_ids', current.filter((i) => i !== id), { shouldValidate: true });
          }}
          theme={theme}
          ListComponent={BottomSheetFlatList}
        />
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
            keyExtractor={(item: { value: string }) => item.value}
            contentContainerStyle={{ paddingBottom: theme.spacing[6] }}
            renderItem={({ item }: { item: { value: string; label: string } }) => (
              <TouchableOpacity
                style={[
                  styles.modalOption,
                  timelineValue === item.value && styles.locationOptionSelected,
                ]}
                onPress={() => {
                  setValue('timeline', item.value as JobworkTimeline, { shouldValidate: true });
                  timelineSheetRef.current?.dismiss();
                }}
              >
                <Text variant="bodyMedium">{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </GorhomBottomSheetModal>

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
          title="Select Location"
        />
      </Modal>

      {/* Saved Location Dropdown */}
      {showLocationDropdown && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '80%' }]}>
            <View style={styles.modalHeader}>
              <Text variant="h4" fontWeight="semibold">
                Select Location
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
                    key={`loc-${loc.id}`}
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
    </BottomSheetModalProvider>
  );
};

export default PostJobworkFindScreen;
