/**
 * PostBrandRequirementScreen
 * Form screen for brands to post packaging/product requirements
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
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
import { useForm, FormInput, validationRules } from '@shared/forms';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  usePostBrandRequirement,
  BrandRequirementType,
  BrandPackagingType,
  BrandTimeline,
  BrandUrgency,
} from '@services/api';
import { useAppDispatch } from '@store/hooks';
import { showToast } from '@store/slices/uiSlice';
import { SCREENS } from '@navigation/constants';
import { createStyles } from './styles';
import { PostBrandRequirementFormData, DropdownOption } from './@types';

// Dropdown options
const REQUIREMENT_TYPE_OPTIONS: DropdownOption<BrandRequirementType>[] = [
  { label: 'Packaging', value: 'Packaging' },
  { label: 'Printing', value: 'Printing' },
  { label: 'Labels', value: 'Labels' },
  { label: 'Other', value: 'Other' },
];

const PACKAGING_TYPE_OPTIONS: DropdownOption<BrandPackagingType>[] = [
  { label: 'Boxes', value: 'Boxes' },
  { label: 'Bags', value: 'Bags' },
  { label: 'Pouches', value: 'Pouches' },
  { label: 'Cartons', value: 'Cartons' },
  { label: 'Containers', value: 'Containers' },
  { label: 'Other', value: 'Other' },
];

const QUANTITY_RANGE_OPTIONS: DropdownOption[] = [
  { label: '100-500', value: '100-500' },
  { label: '500-1000', value: '500-1000' },
  { label: '1000-5000', value: '1000-5000' },
  { label: '5000-10000', value: '5000-10000' },
  { label: '10000-50000', value: '10000-50000' },
  { label: '50000+', value: '50000+' },
];

const TIMELINE_OPTIONS: DropdownOption<BrandTimeline>[] = [
  { label: '1-2 Days', value: '1-2 Days' },
  { label: '3-5 Days', value: '3-5 Days' },
  { label: '1 Week', value: '1 Week' },
  { label: '2 Weeks', value: '2 Weeks' },
  { label: '1 Month', value: '1 Month' },
  { label: 'Flexible', value: 'Flexible' },
];

const URGENCY_OPTIONS: DropdownOption<BrandUrgency>[] = [
  { label: 'Normal', value: 'normal' },
  { label: 'Urgent', value: 'urgent' },
];

const PostBrandRequirementScreen = () => {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const { mutate: postRequirement, isPending: isSubmitting } = usePostBrandRequirement();

  const { control, handleSubmit, setValue, watch } = useForm<PostBrandRequirementFormData>({
    defaultValues: {
      requirement_type: 'Packaging',
      packaging_type: 'Boxes',
      quantity_range: '',
      timeline: '3-5 Days',
      special_needs: '',
      design_attachments: [],
      title: '',
      description: '',
      urgency: 'normal',
      location: '',
      city: '',
      latitude: undefined,
      longitude: undefined,
    },
    mode: 'onBlur',
  });

  // Picker states
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showRequirementTypePicker, setShowRequirementTypePicker] = useState(false);
  const [showPackagingTypePicker, setShowPackagingTypePicker] = useState(false);
  const [showQuantityRangePicker, setShowQuantityRangePicker] = useState(false);
  const [showTimelinePicker, setShowTimelinePicker] = useState(false);
  const [showUrgencyPicker, setShowUrgencyPicker] = useState(false);

  // Watch values
  const requirementType = watch('requirement_type');
  const locationValue = watch('location');
  const latitudeValue = watch('latitude');
  const longitudeValue = watch('longitude');

  const handleLocationSelect = useCallback(
    (location: Location) => {
      const address = location.address?.formattedAddress || 
                      location.address?.streetAddress || 
                      location.name || '';
      const city = location.address?.city || 
                   location.address?.subLocality || 
                   location.name || '';
      
      setValue('location', address, { shouldValidate: true });
      setValue('city', city, { shouldValidate: true });
      setValue('latitude', location.latitude, { shouldValidate: true });
      setValue('longitude', location.longitude, { shouldValidate: true });
      setShowLocationPicker(false);

      dispatch(
        showToast({
          message: 'Location selected successfully!',
          type: 'success',
        })
      );
    },
    [setValue, dispatch]
  );

  const onSubmit = useCallback(
    (data: PostBrandRequirementFormData) => {
      // Validate required fields
      if (!data.title.trim()) {
        Alert.alert('Validation Error', 'Please enter a title');
        return;
      }

      if (!data.description.trim()) {
        Alert.alert('Validation Error', 'Please enter a description');
        return;
      }

      if (!data.quantity_range) {
        Alert.alert('Validation Error', 'Please select a quantity range');
        return;
      }

      if (!data.latitude || !data.longitude) {
        Alert.alert('Validation Error', 'Please select a location on map');
        return;
      }

      // Prepare API request
      const apiData = {
        requirement_type: data.requirement_type,
        packaging_type: data.requirement_type === 'Packaging' ? data.packaging_type : undefined,
        quantity_range: data.quantity_range,
        timeline: data.timeline,
        special_needs: data.special_needs?.trim() || undefined,
        design_attachments: data.design_attachments.length > 0 ? data.design_attachments : undefined,
        title: data.title.trim(),
        description: data.description.trim(),
        urgency: data.urgency,
        location: data.location.trim(),
        city: data.city.trim(),
        latitude: data.latitude,
        longitude: data.longitude,
      };

      console.log('Brand Requirement API Data:', JSON.stringify(apiData, null, 2));

      postRequirement(apiData as any, {
        onSuccess: (response) => {
          dispatch(
            showToast({
              message: response.message || 'Requirement posted successfully!',
              type: 'success',
            })
          );
          // Navigate to dashboard
          navigation.navigate(SCREENS.MAIN.TABS, {
            screen: SCREENS.MAIN.HOME,
          });
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'Failed to post requirement. Please try again.';
          Alert.alert('Error', errorMessage);
        },
      });
    },
    [postRequirement, dispatch, navigation]
  );

  const buttonHeight = 60;
  const bottomPadding = buttonHeight + theme.spacing[4] * 2 + insets.bottom;

  // Render dropdown picker modal
  const renderPickerModal = (
    visible: boolean,
    onClose: () => void,
    title: string,
    options: DropdownOption<any>[],
    onSelect: (value: any) => void,
    currentValue?: any
  ) => (
    visible && (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text variant="h4" fontWeight="semibold">
              {title}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <AppIcon.Close width={24} height={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.modalOption,
                  currentValue === option.value && styles.modalOptionSelected,
                ]}
                onPress={() => {
                  onSelect(option.value);
                  onClose();
                }}
              >
                <Text variant="bodyMedium">{option.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    )
  );

  return (
    <>
      <ScreenWrapper
        backgroundColor={theme.colors.background.secondary}
        scrollable={true}
        safeAreaEdges={[]}
      >
        <View style={[styles.container, { paddingBottom: bottomPadding }]}>
          <Text variant="h3" fontWeight="bold" style={styles.title}>
            Post Requirement
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            Tell us what you need and we'll match you with the right suppliers
          </Text>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Fill in the details below to post your packaging or product requirement. 
              Our system will match you with verified converters and suppliers.
            </Text>
          </View>

          <View style={styles.formContainer}>
            {/* Requirement Type */}
            <View style={styles.formGroup}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Requirement Type *
              </Text>
              <Controller
                control={control}
                name="requirement_type"
                rules={validationRules.required('Please select requirement type') as any}
                render={({ field: { value }, fieldState: { error } }) => (
                  <>
                    <DropdownButton
                      value={REQUIREMENT_TYPE_OPTIONS.find((opt) => opt.value === value)?.label}
                      placeholder="Select Requirement Type"
                      onPress={() => setShowRequirementTypePicker(true)}
                    />
                    {error && <Text style={styles.errorText}>{error.message}</Text>}
                  </>
                )}
              />
            </View>

            {/* Packaging Type (only show if requirement type is Packaging) */}
            {requirementType === 'Packaging' && (
              <View style={styles.formGroup}>
                <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                  Packaging Type *
                </Text>
                <Controller
                  control={control}
                  name="packaging_type"
                  render={({ field: { value } }) => (
                    <DropdownButton
                      value={PACKAGING_TYPE_OPTIONS.find((opt) => opt.value === value)?.label}
                      placeholder="Select Packaging Type"
                      onPress={() => setShowPackagingTypePicker(true)}
                    />
                  )}
                />
              </View>
            )}

            {/* Title */}
            <FormInput
              name="title"
              control={control}
              label="Title *"
              placeholder="e.g., Need custom packaging boxes"
              rules={validationRules.required('Please enter title') as any}
              containerStyle={styles.formGroup}
            />

            {/* Description */}
            <FormInput
              name="description"
              control={control}
              label="Description *"
              placeholder="e.g., Looking for custom printed boxes for product launch"
              rules={validationRules.required('Please enter description') as any}
              multiline
              numberOfLines={4}
              containerStyle={styles.formGroup}
            />

            {/* Quantity Range */}
            <View style={styles.formGroup}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Quantity Range *
              </Text>
              <Controller
                control={control}
                name="quantity_range"
                rules={validationRules.required('Please select quantity range') as any}
                render={({ field: { value }, fieldState: { error } }) => (
                  <>
                    <DropdownButton
                      value={QUANTITY_RANGE_OPTIONS.find((opt) => opt.value === value)?.label}
                      placeholder="Select Quantity Range"
                      onPress={() => setShowQuantityRangePicker(true)}
                    />
                    {error && <Text style={styles.errorText}>{error.message}</Text>}
                  </>
                )}
              />
            </View>

            {/* Timeline */}
            <View style={styles.formGroup}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Timeline *
              </Text>
              <Controller
                control={control}
                name="timeline"
                rules={validationRules.required('Please select timeline') as any}
                render={({ field: { value }, fieldState: { error } }) => (
                  <>
                    <DropdownButton
                      value={TIMELINE_OPTIONS.find((opt) => opt.value === value)?.label}
                      placeholder="Select Timeline"
                      onPress={() => setShowTimelinePicker(true)}
                    />
                    {error && <Text style={styles.errorText}>{error.message}</Text>}
                  </>
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
                render={({ field: { value } }) => (
                  <DropdownButton
                    value={URGENCY_OPTIONS.find((opt) => opt.value === value)?.label}
                    placeholder="Select Urgency"
                    onPress={() => setShowUrgencyPicker(true)}
                  />
                )}
              />
            </View>

            {/* Special Needs */}
            <FormInput
              name="special_needs"
              control={control}
              label="Special Requirements (Optional)"
              placeholder="e.g., Need eco-friendly packaging with custom printing"
              multiline
              numberOfLines={3}
              containerStyle={styles.formGroup}
            />

            {/* Location */}
            <View style={styles.formGroup}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Location *
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
                        style={
                          !value
                            ? { color: theme.colors.text.tertiary }
                            : { color: theme.colors.text.primary }
                        }
                        numberOfLines={1}
                      >
                        {value || 'Select location on map'}
                      </Text>
                      <AppIcon.Location
                        width={20}
                        height={20}
                        color={theme.colors.text.tertiary}
                      />
                    </TouchableOpacity>
                    {error && <Text style={styles.errorText}>{error.message}</Text>}
                    {!value && (
                      <TouchableOpacity
                        onPress={() => setShowLocationPicker(true)}
                        style={styles.mapButton}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.mapButtonText}>
                          Select Location on Map
                        </Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
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

      {/* Picker Modals */}
      {renderPickerModal(
        showRequirementTypePicker,
        () => setShowRequirementTypePicker(false),
        'Select Requirement Type',
        REQUIREMENT_TYPE_OPTIONS,
        (value) => setValue('requirement_type', value, { shouldValidate: true }),
        watch('requirement_type')
      )}

      {renderPickerModal(
        showPackagingTypePicker,
        () => setShowPackagingTypePicker(false),
        'Select Packaging Type',
        PACKAGING_TYPE_OPTIONS,
        (value) => setValue('packaging_type', value, { shouldValidate: true }),
        watch('packaging_type')
      )}

      {renderPickerModal(
        showQuantityRangePicker,
        () => setShowQuantityRangePicker(false),
        'Select Quantity Range',
        QUANTITY_RANGE_OPTIONS,
        (value) => setValue('quantity_range', value, { shouldValidate: true }),
        watch('quantity_range')
      )}

      {renderPickerModal(
        showTimelinePicker,
        () => setShowTimelinePicker(false),
        'Select Timeline',
        TIMELINE_OPTIONS,
        (value) => setValue('timeline', value, { shouldValidate: true }),
        watch('timeline')
      )}

      {renderPickerModal(
        showUrgencyPicker,
        () => setShowUrgencyPicker(false),
        'Select Urgency',
        URGENCY_OPTIONS,
        (value) => setValue('urgency', value, { shouldValidate: true }),
        watch('urgency')
      )}

      {/* Submit Button */}
      <FloatingBottomContainer>
        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
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

export default PostBrandRequirementScreen;
