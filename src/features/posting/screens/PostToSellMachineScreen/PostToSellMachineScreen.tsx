/**
 * Post to Sell Machine – form for machine dealers to list a machine for sale.
 * Uses same API/payment flow as material posting; fields follow machine dealer spec.
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
  Switch,
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
  MACHINE_CONDITION_OPTIONS,
  MACHINE_BRAND_NAMES,
  URGENCY_OPTIONS,
} from '../../constants/machineConstants';
import { createStyles } from './styles';
import type { PostToSellMachineFormData, SavedLocation } from './@types';

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 40 }, (_, i) => currentYear - i);

export const PostToSellMachineScreen = () => {
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
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const { control, handleSubmit, setValue, watch } = useForm<PostToSellMachineFormData>({
    defaultValues: {
      machine_category: undefined,
      machine_id: undefined,
      machine_type: '',
      brand: '',
      model: '',
      condition: '',
      year_of_purchase: undefined,
      price: undefined,
      price_negotiable: true,
      urgency: 'normal',
      location: '',
      latitude: undefined,
      longitude: undefined,
      location_id: undefined,
      location_source: 'saved',
      description: '',
    },
    mode: 'onBlur',
  });

  const categoryValue = watch('machine_category');
  const machineIdValue = watch('machine_id');
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

  const selectedMachine = useMemo(
    () => machines.find((m) => m.id === machineIdValue),
    [machines, machineIdValue]
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

  const onSubmit = useCallback(
    (data: PostToSellMachineFormData) => {
      if (!data.machine_id) {
        Alert.alert('Validation Error', 'Please select machine category and type');
        return;
      }
      if (!data.condition) {
        Alert.alert('Validation Error', 'Please select machine condition');
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

      const apiData = {
        machine_id: data.machine_id,
        machine_brand_id: undefined as number | undefined,
        machine_type: data.machine_type || selectedMachine?.name || '',
        condition: data.condition,
        intent: 'sell' as const,
        urgency: data.urgency,
        description: data.description?.trim() || undefined,
        price: data.price ?? undefined,
        currency: 'INR' as const,
        location: data.location.trim(),
        latitude: data.latitude!,
        longitude: data.longitude!,
        year_of_manufacture: data.year_of_purchase,
      };

      const refNumber = `#${Math.floor(Math.random() * 9000) + 1000}`;
      const urgencyLabel = data.urgency === 'urgent' ? 'Urgent' : 'Normal';

      navigation.navigate(SCREENS.MAIN.PAYMENT_CONFIRMATION as any, {
        listingDetails: {
          title: selectedMachine?.name || 'Machine for Sale',
          referenceNumber: refNumber,
          grade: data.condition,
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
    [navigation, selectedMachine]
  );

  const buttonHeight = 60;
  const bottomPadding = buttonHeight + theme.spacing[4] * 2 + insets.bottom;

  return (
    <>
      <ScreenWrapper backgroundColor={theme.colors.background.secondary} scrollable safeAreaEdges={[]}>
        <View style={[styles.container, { paddingBottom: bottomPadding }]}>
          <Text variant="h3" fontWeight="bold" style={styles.title}>
            Post to Sell Machine
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            Fill in the details to list your machine for sale
          </Text>

          <View style={styles.formContainer}>
            {/* Machine Category */}
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

            {/* Machine Type */}
            <View style={styles.formGroup}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Machine Type <Text style={{ color: theme.colors.error?.DEFAULT }}>*</Text>
              </Text>
              <Controller
                control={control}
                name="machine_id"
                rules={validationRules.required('Please select machine type') as any}
                render={({ field: { value }, fieldState: { error } }) => (
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

            {/* Brand (optional) */}
            <View style={styles.formGroup}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Machine Brand (optional)
              </Text>
              <Controller
                control={control}
                name="brand"
                render={({ field: { value, onChange } }) => (
                  <>
                    <TouchableOpacity
                      style={styles.locationButton}
                      onPress={() => setShowBrandPicker(true)}
                      activeOpacity={0.7}
                    >
                      <Text
                        variant="bodyMedium"
                        style={value ? { color: theme.colors.text.primary } : { color: theme.colors.text.tertiary }}
                        numberOfLines={1}
                      >
                        {value || 'Select brand or type below'}
                      </Text>
                      <AppIcon.ChevronDown width={20} height={20} color={theme.colors.text.tertiary} />
                    </TouchableOpacity>
                    <TextInput
                      style={{
                        marginTop: theme.spacing[2],
                        borderWidth: 1,
                        borderColor: theme.colors.border.primary,
                        borderRadius: theme.borderRadius.lg,
                        padding: theme.spacing[3],
                        color: theme.colors.text.primary,
                        fontSize: 14,
                      }}
                      placeholder="Or type brand name"
                      placeholderTextColor={theme.colors.text.tertiary}
                      value={value}
                      onChangeText={(t) => {
                        onChange(t);
                        if (t.trim()) setValue('brand', t.trim());
                      }}
                    />
                  </>
                )}
              />
            </View>

            {/* Model (optional) */}
            <View style={styles.formGroup}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Machine Model (optional)
              </Text>
              <Controller
                control={control}
                name="model"
                render={({ field: { value, onChange } }) => (
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: theme.colors.border.primary,
                      borderRadius: theme.borderRadius.lg,
                      padding: theme.spacing[3],
                      color: theme.colors.text.primary,
                      fontSize: 14,
                    }}
                    placeholder="Model number"
                    placeholderTextColor={theme.colors.text.tertiary}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>

            {/* Condition */}
            <View style={styles.formGroup}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Machine Condition <Text style={{ color: theme.colors.error?.DEFAULT }}>*</Text>
              </Text>
              <Controller
                control={control}
                name="condition"
                rules={validationRules.required('Please select condition') as any}
                render={({ field: { value }, fieldState: { error } }) => (
                  <>
                    <DropdownButton
                      value={MACHINE_CONDITION_OPTIONS.find((o) => o.value === value)?.label ?? value}
                      placeholder="Select condition"
                      onPress={() => setShowConditionPicker(true)}
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

            {/* Year of Purchase (optional) */}
            <View style={styles.formGroup}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Year of Purchase (optional)
              </Text>
              <Controller
                control={control}
                name="year_of_purchase"
                render={({ field: { value } }) => (
                  <DropdownButton
                    value={value ? String(value) : ''}
                    placeholder="Select year"
                    onPress={() => setShowYearPicker(true)}
                  />
                )}
              />
            </View>

            {/* Expected Price (optional) */}
            <View style={styles.formGroup}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Expected Price (₹) (optional)
              </Text>
              <Controller
                control={control}
                name="price"
                render={({ field: { value, onChange } }) => (
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: theme.colors.border.primary,
                      borderRadius: theme.borderRadius.lg,
                      padding: theme.spacing[3],
                      color: theme.colors.text.primary,
                      fontSize: 14,
                    }}
                    placeholder="Price in ₹"
                    placeholderTextColor={theme.colors.text.tertiary}
                    keyboardType="numeric"
                    value={value != null ? String(value) : ''}
                    onChangeText={(t) => onChange(t ? Number(t.replace(/\D/g, '')) : undefined)}
                  />
                )}
              />
            </View>

            {/* Price Negotiable */}
            <View style={styles.formGroup}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                  Price Negotiable
                </Text>
                <Controller
                  control={control}
                  name="price_negotiable"
                  render={({ field: { value, onChange } }) => (
                    <Switch value={value} onValueChange={onChange} trackColor={{ false: '#767577', true: theme.colors.primary.DEFAULT }} thumbColor="#fff" />
                  )}
                />
              </View>
            </View>

            {/* Timeline */}
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

            {/* Location */}
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
                    <TouchableOpacity
                      style={styles.locationButton}
                      onPress={() => setShowLocationDropdown(true)}
                      activeOpacity={0.7}
                    >
                      <Text
                        variant="bodyMedium"
                        style={!getSelectedLocationDisplay() ? { color: theme.colors.text.tertiary } : { color: theme.colors.text.primary }}
                        numberOfLines={1}
                      >
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

            {/* Description (optional) */}
            <View style={styles.formGroup}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Description (optional)
              </Text>
              <Controller
                control={control}
                name="description"
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
                    placeholder="Additional details"
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

      {/* Category Picker */}
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

      {/* Machine Type Picker */}
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

      {/* Brand Picker */}
      {showBrandPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text variant="h4" fontWeight="semibold">Select Brand</Text>
              <TouchableOpacity onPress={() => setShowBrandPicker(false)}><Text style={{ fontSize: 24 }}>×</Text></TouchableOpacity>
            </View>
            <ScrollView>
              {MACHINE_BRAND_NAMES.map((name) => (
                <TouchableOpacity
                  key={name}
                  style={styles.modalOption}
                  onPress={() => {
                    setValue('brand', name, { shouldValidate: true });
                    setShowBrandPicker(false);
                  }}
                >
                  <Text variant="bodyMedium">{name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Condition Picker */}
      {showConditionPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text variant="h4" fontWeight="semibold">Select Condition</Text>
              <TouchableOpacity onPress={() => setShowConditionPicker(false)}><Text style={{ fontSize: 24 }}>×</Text></TouchableOpacity>
            </View>
            {MACHINE_CONDITION_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={styles.modalOption}
                onPress={() => {
                  setValue('condition', opt.value, { shouldValidate: true });
                  setShowConditionPicker(false);
                }}
              >
                <Text variant="bodyMedium">{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Year Picker */}
      {showYearPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text variant="h4" fontWeight="semibold">Select Year</Text>
              <TouchableOpacity onPress={() => setShowYearPicker(false)}><Text style={{ fontSize: 24 }}>×</Text></TouchableOpacity>
            </View>
            <ScrollView>
              {YEAR_OPTIONS.map((y) => (
                <TouchableOpacity
                  key={y}
                  style={styles.modalOption}
                  onPress={() => {
                    setValue('year_of_purchase', y, { shouldValidate: true });
                    setShowYearPicker(false);
                  }}
                >
                  <Text variant="bodyMedium">{y}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Urgency Picker */}
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

      {/* Location Dropdown */}
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

export default PostToSellMachineScreen;
