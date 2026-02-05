/**
 * Post to Buy Machine – form for machine dealers to post a machine requirement (want to buy).
 * Uses same API/payment flow; fields follow machine dealer buy spec.
 */

import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Controller } from 'react-hook-form';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { FloatingBottomContainer } from '@shared/components/FloatingBottomContainer';
import { DropdownButton } from '@shared/components/DropdownButton';
import { LocationPicker } from '@shared/location';
import type { Location } from '@shared/location/types';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { useForm, validationRules } from '@shared/forms';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGetMachines } from '@services/api';
import { useAppSelector, useAppDispatch } from '@store/hooks';
import { showToast } from '@store/slices/uiSlice';
import { SCREENS } from '@navigation/constants';
import {
  MACHINE_CATEGORY_OPTIONS,
  MACHINE_CONDITION_PREFERENCE_OPTIONS,
  MACHINE_BRAND_NAMES,
  URGENCY_OPTIONS,
} from '../../constants/machineConstants';
import { createStyles } from './styles';
import type { PostToBuyMachineFormData, SavedLocation } from './@types';

export const PostToBuyMachineScreen = () => {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showMachineTypePicker, setShowMachineTypePicker] = useState(false);
  const [showBrandPicker, setShowBrandPicker] = useState(false);
  const [showConditionPicker, setShowConditionPicker] = useState(false);
  const [showUrgencyPicker, setShowUrgencyPicker] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const { control, handleSubmit, setValue, watch } = useForm<PostToBuyMachineFormData>({
    defaultValues: {
      machine_category: undefined,
      machine_id: undefined,
      machine_type: '',
      preferred_brands: [],
      condition_preference: [],
      budget_min: undefined,
      budget_max: undefined,
      urgency: 'normal',
      location: '',
      latitude: undefined,
      longitude: undefined,
      location_id: undefined,
      location_source: 'saved',
      additional_requirements: '',
    },
    mode: 'onBlur',
  });

  const categoryValue = watch('machine_category');
  const machineIdValue = watch('machine_id');
  const preferredBrands = watch('preferred_brands');
  const conditionPreference = watch('condition_preference');
  const locationValue = watch('location');
  const locationIdValue = watch('location_id');
  const locationSourceValue = watch('location_source');
  const latitudeValue = watch('latitude');
  const longitudeValue = watch('longitude');

  const { data: machines = [], isLoading: isLoadingMachines } = useGetMachines(
    categoryValue ? { type: categoryValue } : undefined,
    { enabled: !!categoryValue }
  );

  const userLocations: SavedLocation[] = useMemo(() => {
    if (!user?.locations || !Array.isArray(user.locations)) return [];
    return user.locations.map((loc: any) => ({
      id: loc.id,
      type: loc.type || 'warehouse',
      address: loc.address || '',
      latitude: loc.latitude || '0',
      longitude: loc.longitude || '0',
      city: loc.city || '',
      state: loc.state ?? null,
    }));
  }, [user]);

  const selectedMachine = useMemo(() => machines.find((m) => m.id === machineIdValue), [machines, machineIdValue]);

  const toggleBrand = useCallback(
    (brand: string) => {
      setValue(
        'preferred_brands',
        preferredBrands.includes(brand) ? preferredBrands.filter((b) => b !== brand) : [...preferredBrands, brand],
        { shouldValidate: true }
      );
    },
    [preferredBrands, setValue]
  );

  const toggleCondition = useCallback(
    (value: string) => {
      setValue(
        'condition_preference',
        conditionPreference.includes(value) ? conditionPreference.filter((c) => c !== value) : [...conditionPreference, value],
        { shouldValidate: true }
      );
    },
    [conditionPreference, setValue]
  );

  const handleSavedLocationSelect = useCallback(
    (savedLocation: SavedLocation) => {
      setValue('location_id', savedLocation.id, { shouldValidate: true });
      setValue('location_source', 'saved', { shouldValidate: true });
      setValue(
        'location',
        savedLocation.address || `${savedLocation.city}${savedLocation.state ? `, ${savedLocation.state}` : ''}`,
        { shouldValidate: true }
      );
      setValue('latitude', parseFloat(savedLocation.latitude), { shouldValidate: true });
      setValue('longitude', parseFloat(savedLocation.longitude), { shouldValidate: true });
      setShowLocationDropdown(false);
      dispatch(showToast({ message: 'Location selected!', type: 'success' }));
    },
    [setValue, dispatch]
  );

  const handleLocationSelect = useCallback(
    (location: Location) => {
      setValue('location_id', undefined, { shouldValidate: true });
      setValue('location_source', 'manual', { shouldValidate: true });
      setValue(
        'location',
        location.address?.formattedAddress || location.address?.streetAddress || location.name || '',
        { shouldValidate: true }
      );
      setValue('latitude', location.latitude, { shouldValidate: true });
      setValue('longitude', location.longitude, { shouldValidate: true });
      setShowLocationPicker(false);
      dispatch(showToast({ message: 'Location selected successfully!', type: 'success' }));
    },
    [setValue, dispatch]
  );

  const getSelectedLocationDisplay = useCallback(() => {
    if (locationIdValue && locationSourceValue === 'saved') {
      const saved = userLocations.find((loc) => loc.id === locationIdValue);
      if (saved) return saved.address || `${saved.city}${saved.state ? `, ${saved.state}` : ''}`;
    }
    return locationValue || '';
  }, [locationIdValue, locationSourceValue, locationValue, userLocations]);

  // Backend expects one of: Brand New, Excellent, Working Condition, Needs Repair. "Any" is not valid.
  const conditionForApi = useMemo(() => {
    if (conditionPreference.length === 0) return 'Working Condition';
    if (conditionPreference.includes('Any')) return 'Working Condition';
    return conditionPreference[0];
  }, [conditionPreference]);

  const onSubmit = useCallback(
    (data: PostToBuyMachineFormData) => {
      if (!data.machine_id) {
        Alert.alert('Validation Error', 'Please select machine category and type');
        return;
      }
      if (conditionPreference.length === 0) {
        Alert.alert('Validation Error', 'Please select at least one condition preference');
        return;
      }
      if (!data.urgency) {
        Alert.alert('Validation Error', 'Please select timeline');
        return;
      }
      if (!data.latitude || !data.longitude) {
        Alert.alert('Validation Error', 'Please select a location');
        return;
      }

      const parts: string[] = [];
      if (data.additional_requirements?.trim()) parts.push(data.additional_requirements.trim());
      if (preferredBrands.length > 0) parts.push(`Preferred brands: ${preferredBrands.join(', ')}`);
      if (conditionPreference.length > 1 || conditionPreference.includes('Any')) parts.push(`Condition: ${conditionPreference.join(', ')}`);
      if (data.budget_min != null || data.budget_max != null) {
        const min = data.budget_min != null ? `₹${data.budget_min}` : '';
        const max = data.budget_max != null ? `₹${data.budget_max}` : '';
        parts.push(`Budget: ${min}${min && max ? ' - ' : ''}${max}`);
      }
      const description = parts.join('\n') || undefined;

      const apiData = {
        machine_id: data.machine_id,
        machine_brand_id: undefined as number | undefined,
        machine_type: data.machine_type || selectedMachine?.name || '',
        condition: conditionForApi,
        intent: 'buy' as const,
        urgency: data.urgency,
        description,
        currency: 'INR' as const,
        location: data.location.trim(),
        latitude: data.latitude!,
        longitude: data.longitude!,
      };

      const refNumber = `#${Math.floor(Math.random() * 9000) + 1000}`;
      const urgencyLabel = data.urgency === 'urgent' ? 'Urgent' : 'Normal';

      navigation.navigate(SCREENS.MAIN.PAYMENT_CONFIRMATION as any, {
        listingDetails: {
          title: selectedMachine?.name || 'Machine Wanted',
          referenceNumber: refNumber,
          grade: conditionPreference.join(', '),
          materialName: selectedMachine?.name || 'Machine',
          quantity: '1',
          quantityUnit: 'unit',
          urgency: urgencyLabel,
          tags: ['Machine', data.urgency === 'urgent' ? 'Urgent' : ''],
        },
        formData: apiData,
        requirementType: 'machineDealer',
      });
    },
    [navigation, selectedMachine, conditionPreference, preferredBrands, conditionForApi]
  );

  const buttonHeight = 60;
  const bottomPadding = buttonHeight + theme.spacing[4] * 2 + insets.bottom;

  return (
    <>
      <ScreenWrapper backgroundColor={theme.colors.background.secondary} scrollable safeAreaEdges={[]}>
        <View style={[styles.container, { paddingBottom: bottomPadding }]}>
          <Text variant="h3" fontWeight="bold" style={styles.title}>
            Post to Buy Machine
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            Fill in the details to post your machine requirement
          </Text>

          <View style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Machine Category <Text style={{ color: theme.colors.error?.DEFAULT }}>*</Text>
              </Text>
              <Controller
                control={control}
                name="machine_category"
                rules={validationRules.required('Please select category') as any}
                render={({ field: { value }, fieldState: { error } }) => (
                  <>
                    <DropdownButton
                      value={MACHINE_CATEGORY_OPTIONS.find((o) => o.value === value)?.label}
                      placeholder="Select category"
                      onPress={() => setShowCategoryPicker(true)}
                    />
                    {error && (
                      <Text variant="captionSmall" style={{ color: theme.colors.error?.DEFAULT, marginTop: 4 }}>
                        {error.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

            <View style={styles.formGroup}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Machine Type <Text style={{ color: theme.colors.error?.DEFAULT }}>*</Text>
              </Text>
              <Controller
                control={control}
                name="machine_id"
                rules={validationRules.required('Please select machine type') as any}
                render={({ fieldState: { error } }) => (
                  <>
                    <DropdownButton
                      value={selectedMachine?.name}
                      placeholder={categoryValue ? (isLoadingMachines ? 'Loading...' : 'Select machine type') : 'Select category first'}
                      onPress={() => categoryValue && setShowMachineTypePicker(true)}
                      disabled={!categoryValue || isLoadingMachines}
                    />
                    {error && (
                      <Text variant="captionSmall" style={{ color: theme.colors.error?.DEFAULT, marginTop: 4 }}>
                        {error.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

            <View style={styles.formGroup}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Preferred Brands (optional)
              </Text>
              <TouchableOpacity style={styles.locationButton} onPress={() => setShowBrandPicker(true)} activeOpacity={0.7}>
                <Text variant="bodyMedium" style={{ color: theme.colors.text.tertiary }} numberOfLines={1}>
                  {preferredBrands.length ? `${preferredBrands.length} selected` : 'Select brands'}
                </Text>
                <AppIcon.ChevronDown width={20} height={20} color={theme.colors.text.tertiary} />
              </TouchableOpacity>
              {preferredBrands.length > 0 && (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: theme.spacing[2] }}>
                  {preferredBrands.map((b) => (
                    <TouchableOpacity key={b} style={styles.chip} onPress={() => toggleBrand(b)}>
                      <Text variant="captionSmall">{b}</Text>
                      <Text style={{ marginLeft: 4, fontSize: 14 }}>×</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Condition Preference <Text style={{ color: theme.colors.error?.DEFAULT }}>*</Text>
              </Text>
              <Controller
                control={control}
                name="condition_preference"
                render={() => (
                  <>
                    <TouchableOpacity style={styles.locationButton} onPress={() => setShowConditionPicker(true)} activeOpacity={0.7}>
                      <Text variant="bodyMedium" style={conditionPreference.length ? { color: theme.colors.text.primary } : { color: theme.colors.text.tertiary }} numberOfLines={1}>
                        {conditionPreference.length ? conditionPreference.join(', ') : 'Select condition(s)'}
                      </Text>
                      <AppIcon.ChevronDown width={20} height={20} color={theme.colors.text.tertiary} />
                    </TouchableOpacity>
                    {conditionPreference.length === 0 && (
                      <Text variant="captionSmall" style={{ color: theme.colors.error?.DEFAULT, marginTop: 4 }}>
                        Select at least one
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

            <View style={styles.formGroup}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Budget Range (₹) (optional)
              </Text>
              <View style={styles.row}>
                <Controller
                  control={control}
                  name="budget_min"
                  render={({ field: { value, onChange } }) => (
                    <TextInput
                      style={{ flex: 1, borderWidth: 1, borderColor: theme.colors.border.primary, borderRadius: theme.borderRadius.lg, padding: theme.spacing[3], color: theme.colors.text.primary, fontSize: 14 }}
                      placeholder="Min"
                      placeholderTextColor={theme.colors.text.tertiary}
                      keyboardType="numeric"
                      value={value != null ? String(value) : ''}
                      onChangeText={(t) => onChange(t ? Number(t.replace(/\D/g, '')) : undefined)}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="budget_max"
                  render={({ field: { value, onChange } }) => (
                    <TextInput
                      style={{ flex: 1, borderWidth: 1, borderColor: theme.colors.border.primary, borderRadius: theme.borderRadius.lg, padding: theme.spacing[3], color: theme.colors.text.primary, fontSize: 14 }}
                      placeholder="Max"
                      placeholderTextColor={theme.colors.text.tertiary}
                      keyboardType="numeric"
                      value={value != null ? String(value) : ''}
                      onChangeText={(t) => onChange(t ? Number(t.replace(/\D/g, '')) : undefined)}
                    />
                  )}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Timeline <Text style={{ color: theme.colors.error?.DEFAULT }}>*</Text>
              </Text>
              <Controller
                control={control}
                name="urgency"
                rules={validationRules.required('Please select timeline') as any}
                render={({ field: { value }, fieldState: { error } }) => (
                  <>
                    <DropdownButton
                      value={URGENCY_OPTIONS.find((o) => o.value === value)?.label}
                      placeholder="Select timeline"
                      onPress={() => setShowUrgencyPicker(true)}
                    />
                    {error && (
                      <Text variant="captionSmall" style={{ color: theme.colors.error?.DEFAULT, marginTop: 4 }}>
                        {error.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

            <View style={styles.formGroup}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Location <Text style={{ color: theme.colors.error?.DEFAULT }}>*</Text>
              </Text>
              <Controller
                control={control}
                name="location"
                rules={validationRules.required('Please select a location') as any}
                render={({ fieldState: { error } }) => (
                  <>
                    <TouchableOpacity style={styles.locationButton} onPress={() => setShowLocationDropdown(true)} activeOpacity={0.7}>
                      <Text variant="bodyMedium" style={!getSelectedLocationDisplay() ? { color: theme.colors.text.tertiary } : { color: theme.colors.text.primary }} numberOfLines={1}>
                        {getSelectedLocationDisplay() || 'Select location'}
                      </Text>
                      <AppIcon.ChevronDown width={20} height={20} color={theme.colors.text.tertiary} />
                    </TouchableOpacity>
                    {error && (
                      <Text variant="captionSmall" style={{ color: theme.colors.error?.DEFAULT, marginTop: 4 }}>
                        {error.message}
                      </Text>
                    )}
                    {userLocations.length === 0 && (
                      <Text variant="captionSmall" style={{ color: theme.colors.text.tertiary, marginTop: 4 }}>
                        No saved locations. Select on map.
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

            <View style={styles.formGroup}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Additional Requirements (optional)
              </Text>
              <Controller
                control={control}
                name="additional_requirements"
                render={({ field: { value, onChange } }) => (
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: theme.colors.border.primary,
                      borderRadius: theme.borderRadius.lg,
                      padding: theme.spacing[3],
                      color: theme.colors.text.primary,
                      fontSize: 14,
                      minHeight: 80,
                      textAlignVertical: 'top',
                    }}
                    placeholder="Specific requirements"
                    placeholderTextColor={theme.colors.text.tertiary}
                    value={value}
                    onChangeText={onChange}
                    multiline
                  />
                )}
              />
            </View>
          </View>
        </View>
      </ScreenWrapper>

      <FloatingBottomContainer>
        <TouchableOpacity style={[styles.locationButton, { backgroundColor: theme.colors.primary.DEFAULT }]} onPress={handleSubmit(onSubmit)} activeOpacity={0.8}>
          <Text variant="bodyLarge" fontWeight="600" style={{ color: theme.colors.text.inverse }}>
            Continue to Payment
          </Text>
        </TouchableOpacity>
      </FloatingBottomContainer>

      <Modal visible={showLocationPicker} animationType="slide" presentationStyle="fullScreen" onRequestClose={() => setShowLocationPicker(false)}>
        <LocationPicker
          initialLocation={latitudeValue && longitudeValue ? { latitude: latitudeValue, longitude: longitudeValue } : undefined}
          onLocationSelect={handleLocationSelect}
          onCancel={() => setShowLocationPicker(false)}
          allowMapTap
          confirmButtonText="Confirm Location"
          title="Select Location"
        />
      </Modal>

      {showCategoryPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text variant="h4" fontWeight="semibold">Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryPicker(false)}><Text style={{ fontSize: 24 }}>×</Text></TouchableOpacity>
            </View>
            <ScrollView>
              {MACHINE_CATEGORY_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={styles.modalOption}
                  onPress={() => {
                    setValue('machine_category', opt.value, { shouldValidate: true });
                    setValue('machine_id', undefined, { shouldValidate: true });
                    setValue('machine_type', '', { shouldValidate: true });
                    setShowCategoryPicker(false);
                  }}
                >
                  <Text variant="bodyMedium">{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {showMachineTypePicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text variant="h4" fontWeight="semibold">Select Machine Type</Text>
              <TouchableOpacity onPress={() => setShowMachineTypePicker(false)}><Text style={{ fontSize: 24 }}>×</Text></TouchableOpacity>
            </View>
            <ScrollView>
              {machines.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  style={styles.modalOption}
                  onPress={() => {
                    setValue('machine_id', m.id, { shouldValidate: true });
                    setValue('machine_type', m.name, { shouldValidate: true });
                    setShowMachineTypePicker(false);
                  }}
                >
                  <Text variant="bodyMedium">{m.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {showBrandPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text variant="h4" fontWeight="semibold">Preferred Brands (multi-select)</Text>
              <TouchableOpacity onPress={() => setShowBrandPicker(false)}><Text style={{ fontSize: 24 }}>×</Text></TouchableOpacity>
            </View>
            <ScrollView>
              {MACHINE_BRAND_NAMES.map((name) => (
                <TouchableOpacity
                  key={name}
                  style={[
                    styles.modalOption,
                    preferredBrands.includes(name) && { backgroundColor: theme.colors.primary.light || 'rgba(0,0,0,0.05)' },
                    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
                  ]}
                  onPress={() => toggleBrand(name)}
                >
                  <Text variant="bodyMedium">{name}</Text>
                  {preferredBrands.includes(name) && <AppIcon.TickCheckedBox width={20} height={20} color={theme.colors.primary.DEFAULT} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {showConditionPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text variant="h4" fontWeight="semibold">Condition Preference (multi-select)</Text>
              <TouchableOpacity onPress={() => setShowConditionPicker(false)}><Text style={{ fontSize: 24 }}>×</Text></TouchableOpacity>
            </View>
            {MACHINE_CONDITION_PREFERENCE_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.modalOption,
                  conditionPreference.includes(opt.value) && { backgroundColor: theme.colors.primary.light || 'rgba(0,0,0,0.05)' },
                  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
                ]}
                onPress={() => toggleCondition(opt.value)}
              >
                <Text variant="bodyMedium">{opt.label}</Text>
                {conditionPreference.includes(opt.value) && <AppIcon.TickCheckedBox width={20} height={20} color={theme.colors.primary.DEFAULT} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {showUrgencyPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text variant="h4" fontWeight="semibold">Select Timeline</Text>
              <TouchableOpacity onPress={() => setShowUrgencyPicker(false)}><Text style={{ fontSize: 24 }}>×</Text></TouchableOpacity>
            </View>
            {URGENCY_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={styles.modalOption}
                onPress={() => {
                  setValue('urgency', opt.value as 'normal' | 'urgent', { shouldValidate: true });
                  setShowUrgencyPicker(false);
                }}
              >
                <Text variant="bodyMedium">{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {showLocationDropdown && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setShowLocationDropdown(false)} activeOpacity={1} />
          <View style={[styles.modalContent, { maxHeight: '80%' }]}>
            <View style={styles.modalHeader}>
              <Text variant="h4" fontWeight="semibold">Select Location</Text>
              <TouchableOpacity onPress={() => setShowLocationDropdown(false)}><Text style={{ fontSize: 24 }}>×</Text></TouchableOpacity>
            </View>
            <ScrollView>
              {userLocations.map((loc) => (
                <TouchableOpacity key={loc.id} style={styles.modalOption} onPress={() => handleSavedLocationSelect(loc)}>
                  <Text variant="bodyMedium">{loc.address || loc.city}</Text>
                  <Text variant="captionSmall" style={{ color: theme.colors.text.tertiary }}>{loc.city}{loc.state ? `, ${loc.state}` : ''}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.modalOption, { backgroundColor: theme.colors.surface.secondary, borderRadius: theme.borderRadius.md, marginTop: theme.spacing[2] }]}
                onPress={() => { setShowLocationDropdown(false); setShowLocationPicker(true); }}
              >
                <Text variant="bodyMedium" style={{ color: theme.colors.primary.DEFAULT }}>Select on Map</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      )}
    </>
  );
};

export default PostToBuyMachineScreen;
