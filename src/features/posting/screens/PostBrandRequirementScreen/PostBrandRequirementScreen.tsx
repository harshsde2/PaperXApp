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
  BrandRequirementType,
  BrandPackagingType,
  BrandTimeline,
} from '@services/api';
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
  { label: 'Urgent 1-2 Days', value: 'Urgent 1-2 Days' },
  { label: 'Normal 3-5 Days', value: 'Normal 3-5 Days' },
];

const PostBrandRequirementScreen = () => {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();

  const { control, handleSubmit, setValue, watch } = useForm<PostBrandRequirementFormData>({
    defaultValues: {
      requirement_type: 'Packaging',
      packaging_type: 'Boxes',
      quantity_range: '',
      timeline: 'Normal 3-5 Days',
      description: '',
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
                   location.address?.city || 
                   location.name || '';
      
      setValue('location', address, { shouldValidate: true });
      setValue('city', city, { shouldValidate: true });
      setValue('latitude', location.latitude, { shouldValidate: true });
      setValue('longitude', location.longitude, { shouldValidate: true });
      setShowLocationPicker(false);
    },
    [setValue]
  );

  const onSubmit = useCallback(
    (data: PostBrandRequirementFormData) => {
      // Validate required fields
      if (!data.requirement_type) {
        Alert.alert('Validation Error', 'Please select a requirement type');
        return;
      }

      if (data.requirement_type === 'Packaging' && !data.packaging_type) {
        Alert.alert('Validation Error', 'Please select a packaging type');
        return;
      }

      if (!data.quantity_range) {
        Alert.alert('Validation Error', 'Please select a quantity range');
        return;
      }

      if (!data.timeline) {
        Alert.alert('Validation Error', 'Please select a timeline');
        return;
      }

      if (!data.description.trim()) {
        Alert.alert('Validation Error', 'Please enter a description');
        return;
      }

      if (!data.latitude || !data.longitude) {
        Alert.alert('Validation Error', 'Please select a location on map');
        return;
      }

      if (!data.location.trim()) {
        Alert.alert('Validation Error', 'Please select a valid location');
        return;
      }

      // Prepare API request
      const apiData: any = {
        requirement_type: data.requirement_type,
        quantity_range: data.quantity_range,
        timeline: data.timeline,
        description: data.description.trim(),
        location: data.location.trim(),
        city: data.city.trim(),
        latitude: data.latitude!,
        longitude: data.longitude!,
      };

      // Only include packaging_type if requirement_type is Packaging
      if (data.requirement_type === 'Packaging' && data.packaging_type) {
        apiData.packaging_type = data.packaging_type;
      }

      console.log('Brand Requirement API Data:', JSON.stringify(apiData, null, 2));

      // Generate reference number
      const refNumber = `#${Math.floor(Math.random() * 9000) + 1000}`;
      
      // Determine urgency label for display
      const isUrgent = data.timeline === 'Urgent 1-2 Days';
      const urgencyLabel = isUrgent ? 'Urgent 1-2 Days' : 'Normal 3-5 Days';

      // Get requirement type display name
      const requirementTypeName = REQUIREMENT_TYPE_OPTIONS.find(
        opt => opt.value === data.requirement_type
      )?.label || data.requirement_type;

      // Get packaging type display name if applicable
      const packagingTypeName = data.requirement_type === 'Packaging' && data.packaging_type
        ? PACKAGING_TYPE_OPTIONS.find(opt => opt.value === data.packaging_type)?.label || data.packaging_type
        : '';

      // Prepare listing details for payment confirmation
      const listingDetails = {
        title: packagingTypeName 
          ? `${requirementTypeName} - ${packagingTypeName}`
          : requirementTypeName,
        referenceNumber: refNumber,
        grade: packagingTypeName || requirementTypeName,
        materialName: packagingTypeName || requirementTypeName,
        quantity: data.quantity_range,
        quantityUnit: 'pieces',
        urgency: urgencyLabel,
        tags: isUrgent 
          ? [requirementTypeName, 'Urgent'] 
          : [requirementTypeName],
      };

      // Navigate to payment confirmation screen
      navigation.navigate(SCREENS.MAIN.PAYMENT_CONFIRMATION, {
        listingDetails,
        formData: apiData,
        requirementType: 'brand', // Add flag to identify brand requirement
      });
    },
    [navigation],
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
                  What Packaging / Printing service are you looking for? 
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

            {/* Description */}
            <FormInput
              name="description"
              control={control}
              label="Description (Special Requirements or Brief Description of the requirement)"
              placeholder="e.g., Looking for custom printed boxes for product launch"
              rules={validationRules.required('Please enter description') as any}
              multiline
              numberOfLines={4}
              containerStyle={styles.formGroup}
            />

            {/* Quantity Range */}
            <View style={styles.formGroup}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Quantity Range (in Pieces) 
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
                Timeline 
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

      {/* Submit Button */}
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
    </>
  );
};

export default PostBrandRequirementScreen;
