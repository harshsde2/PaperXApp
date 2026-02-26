import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { View, TouchableOpacity, TextInput, ActivityIndicator, Alert, Modal } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Controller } from 'react-hook-form';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { useForm, FormInput, validationRules } from '@shared/forms';
import type {
  CompleteMachineDealerProfileRequest,
  Machine,
  UpdateProfileResponse,
} from '@services/api';
import { useCompleteMachineDealerProfile, useGetMachines } from '@services/api';
import { useAppDispatch } from '@store/hooks';
import { showToast } from '@store/slices/uiSlice';
import { getFirstRegistrationScreen } from '@navigation/helpers';
import { ROLES } from '@utils/constants';
import { DropdownButton } from '@shared/components/DropdownButton';
import MultiSelectBottomSheetContent from '@shared/components/MultiSelectBottomSheetContent';
import type {
  MachineCategoryOption,
  MachineCategoryType,
} from '@features/posting/constants/machineConstants';
import {
  MACHINE_CATEGORY_OPTIONS,
  MACHINE_BRAND_NAMES,
} from '@features/posting/constants/machineConstants';
import {
  MachineDealerRegistrationScreenNavigationProp,
  MachineDealerRegistrationFormData,
} from './@types';
import { createStyles } from './styles';
import { SCREENS } from '@navigation/constants';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';
import { LocationPicker } from '@shared/location';
import type { Location } from '@shared/location/types';

const MachineDealerRegistrationScreen = () => {
  const navigation = useNavigation<MachineDealerRegistrationScreenNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'MachineDealerRegistration'>>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const dispatch = useAppDispatch();
  const machineCategorySheetRef = useRef<BottomSheetModal>(null);
  const machineTypeSheetRef = useRef<BottomSheetModal>(null);
  const preferredBrandsSheetRef = useRef<BottomSheetModal>(null);

  const { profileData } = route.params || {};

  const { mutate: completeMachineDealerProfile, isPending: isSubmitting } =
    useCompleteMachineDealerProfile();

  const { control, handleSubmit, setValue, watch } = useForm<MachineDealerRegistrationFormData>({
    defaultValues: {
      contactPersonName: '',
      email: '',
      mobile: profileData?.mobile ?? '',
      gstin: profileData?.gst_in ?? profileData?.gst ?? '',
      city: profileData?.city ?? '',
      location: '',
      latitude: undefined,
      longitude: undefined,
      businessDescription: '',
      machine_category: undefined,
      machine_id: undefined,
      preferred_brand_ids: [],
    },
    mode: 'onBlur',
  });

  const hasPrefilledCompanyDetails = !!profileData?.company_name;

  useEffect(() => {
    if (!profileData) return;
    if (profileData.gst_in || profileData.gst) {
      setValue('gstin', profileData.gst_in ?? profileData.gst ?? '', { shouldValidate: false });
    }
    if (profileData.city) {
      setValue('city', profileData.city, { shouldValidate: false });
    }
  }, [profileData, setValue]);

  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [brandSearchQuery, setBrandSearchQuery] = useState('');

  const cityValue = watch('city');
  const locationValue = watch('location');
  const latitudeValue = watch('latitude');
  const longitudeValue = watch('longitude');
  const machineCategoryValue = watch('machine_category');
  const machineIdValue = watch('machine_id');
  const preferredBrandIdsValue = watch('preferred_brand_ids');

  const brandItems = useMemo(
    () => MACHINE_BRAND_NAMES.map((name, index) => ({ id: index, name })),
    [],
  );

  const { data: machines = [], isLoading: isLoadingMachines } = useGetMachines(
    machineCategoryValue ? { type: machineCategoryValue } : undefined,
    { enabled: !!machineCategoryValue }
  );

  const selectedMachine = useMemo(
    () => machines.find((m) => m.id === machineIdValue),
    [machines, machineIdValue],
  );

  const preferredBrandDisplay = useMemo(() => {
    if (!preferredBrandIdsValue || preferredBrandIdsValue.length === 0) return '';
    const names = preferredBrandIdsValue
      .map((id: number) => MACHINE_BRAND_NAMES[id])
      .filter(Boolean);
    if (names.length <= 3) return names.join(', ');
    const firstThree = names.slice(0, 3).join(', ');
    return `${firstThree} +${names.length - 3} more`;
  }, [preferredBrandIdsValue]);

  const handleLocationSelect = useCallback(
    (location: Location) => {
      setValue('location', location.address?.streetAddress || location.address?.formattedAddress || location.name || '', {
        shouldValidate: true,
      });
      // Always update city from the selected location (map selection overrides prefilled values)
      if (location.address?.city) {
        setValue('city', location.address.city, {
          shouldValidate: true,
        });
      }
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

  const openMachineCategorySheet = useCallback(() => {
    machineCategorySheetRef.current?.present();
  }, []);

  const openMachineTypeSheet = useCallback(() => {
    if (!machineCategoryValue) {
      Alert.alert('Select Category', 'Please select machine category first');
      return;
    }
    machineTypeSheetRef.current?.present();
  }, [machineCategoryValue]);

  const openPreferredBrandsSheet = useCallback(() => {
    preferredBrandsSheetRef.current?.present();
  }, []);

  const handleMachineCategorySelect = useCallback(
    (value: MachineCategoryType) => {
      setValue('machine_category', value, { shouldValidate: true });
      setValue('machine_id', undefined, { shouldValidate: true });
      machineCategorySheetRef.current?.dismiss();
    },
    [setValue]
  );

  const handleMachineTypeSelect = useCallback(
    (id: number) => {
      setValue('machine_id', id, { shouldValidate: true });
      machineTypeSheetRef.current?.dismiss();
    },
    [setValue]
  );

  const renderMachineCategoryItem = useCallback(
    ({ item }: { item: MachineCategoryOption }) => (
      <TouchableOpacity
        style={{
          paddingVertical: theme.spacing[3],
          paddingHorizontal: theme.spacing[4],
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border.primary,
        }}
        onPress={() => handleMachineCategorySelect(item.value)}
        activeOpacity={0.7}
      >
        <Text variant="bodyMedium">{item.label}</Text>
      </TouchableOpacity>
    ),
    [theme, handleMachineCategorySelect]
  );

  const renderMachineTypeItem = useCallback(
    ({ item }: { item: Machine }) => (
      <TouchableOpacity
        style={{
          paddingVertical: theme.spacing[3],
          paddingHorizontal: theme.spacing[4],
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border.primary,
        }}
        onPress={() => handleMachineTypeSelect(item.id)}
        activeOpacity={0.7}
      >
        <Text variant="bodyMedium">{item.name}</Text>
      </TouchableOpacity>
    ),
    [theme, handleMachineTypeSelect]
  );

  const onSubmit = (data: MachineDealerRegistrationFormData) => {
    if (!profileData) {
      Alert.alert('Error', 'Profile data is missing. Please go back and try again.');
      return;
    }

    if (!data.location.trim() || data.latitude == null || data.longitude == null) {
      Alert.alert('Error', 'Please select a business location on the map.');
      return;
    }

    const selectedPreferredBrandNames =
      data.preferred_brand_ids && data.preferred_brand_ids.length > 0
        ? data.preferred_brand_ids
            .map((id) => MACHINE_BRAND_NAMES[id])
            .filter((name): name is string => Boolean(name))
        : null;

    const machineDealerRegistrationData: CompleteMachineDealerProfileRequest = {
      company_name: profileData.company_name || '',
      gst: data.gstin.trim() || undefined,
      contact_person_name: data.contactPersonName.trim(),
      mobile: data.mobile.trim() || undefined,
      email: data.email.trim() || undefined,
      city: data.city.trim() || profileData.city || '',
      location: data.location.trim(),
      latitude: data.latitude,
      longitude: data.longitude,
      primary_machine_category: data.machine_category ?? null,
      primary_machine_id: data.machine_id ?? null,
      preferred_brand_names: selectedPreferredBrandNames,
    };

    completeMachineDealerProfile(machineDealerRegistrationData, {
      onSuccess: (response) => {
        dispatch(
          showToast({
            message: response.message || 'Registration completed successfully!',
            type: 'success',
          }),
        );

        const updatedProfileData: UpdateProfileResponse = {
          ...(profileData || {}),
          ...(response.machine_dealer && {
            profile_complete: response.machine_dealer.profile_complete,
          }),
        };

        const isSecondaryRoleCompletion =
          profileData?.secondary_role === ROLES.MACHINE_DEALER;

        if (isSecondaryRoleCompletion) {
          navigation.navigate(SCREENS.AUTH.VERIFICATION_STATUS, {
            profileData: updatedProfileData,
          });
        } else if (
          updatedProfileData.has_secondary_role === 1 &&
          updatedProfileData.secondary_role
        ) {
          const secondaryRole =
            updatedProfileData.secondary_role as (typeof ROLES)[keyof typeof ROLES];
          const firstSecondaryScreen =
            getFirstRegistrationScreen(secondaryRole);

          if (
            firstSecondaryScreen &&
            firstSecondaryScreen !== SCREENS.AUTH.VERIFICATION_STATUS
          ) {
            (navigation.navigate as any)(firstSecondaryScreen, {
              profileData: updatedProfileData,
            });
          } else {
            navigation.navigate(SCREENS.AUTH.VERIFICATION_STATUS, {
              profileData: updatedProfileData,
            });
          }
        } else {
          navigation.navigate(SCREENS.AUTH.VERIFICATION_STATUS, {
            profileData: updatedProfileData,
          });
        }
      },
      onError: (error: any) => {
        Alert.alert(
          'Error',
          error?.message || 'Failed to complete registration. Please try again.',
        );
      },
    });
  };

  return (
    <BottomSheetModalProvider>
      <View style={{ flex: 1 }}>
      <ScreenWrapper
        scrollable
        backgroundColor={theme.colors.background.secondary}
        safeAreaEdges={[]}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>
          {hasPrefilledCompanyDetails && (profileData?.company_name || profileData?.gst_in) && (
            <Card style={styles.card}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <AppIcon.Organization width={20} height={20} color={theme.colors.primary.DEFAULT} />
                </View>
                <Text variant="h4" fontWeight="semibold" style={styles.sectionTitle}>
                  Company Details
                </Text>
              </View>
              {profileData?.company_name && (
                <View style={styles.formGroup}>
                  <View style={styles.labelRow}>
                    <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                      Company Name
                    </Text>
                  </View>
                  <View style={[styles.input, styles.addressPreview]}>
                    <Text variant="bodyMedium" style={styles.addressPreviewText}>
                      {profileData.company_name}
                    </Text>
                  </View>
                </View>
              )}
            </Card>
          )}

          <Card style={styles.card}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <AppIcon.Person width={20} height={20} color={theme.colors.primary.DEFAULT} />
              </View>
              <Text variant="h4" fontWeight="semibold" style={styles.sectionTitle}>
                Contact Information
              </Text>
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                  Contact Person Name
                </Text>
              </View>
              <FormInput
                name="contactPersonName"
                control={control}
                placeholder="e.g. John Doe"
                rules={validationRules.required('Please enter contact person name') as any}
                inputStyle={styles.input}
                containerStyle={{ marginBottom: 0 }}
                showLabel={false}
              />
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                  Mobile Number
                </Text>
                <Text variant="captionMedium" style={styles.optionalLabel}>
                  (Optional)
                </Text>
              </View>
              <FormInput
                name="mobile"
                control={control}
                placeholder="e.g. 9876543210"
                keyboardType="phone-pad"
                maxLength={15}
                inputStyle={styles.input}
                containerStyle={{ marginBottom: 0 }}
                showLabel={false}
              />
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                  GST
                </Text>
                <Text variant="captionMedium" style={styles.optionalLabel}>
                  (Optional)
                </Text>
              </View>
              <FormInput
                name="gstin"
                control={control}
                placeholder="15-digit GST number"
                maxLength={15}
                inputStyle={styles.input}
                containerStyle={{ marginBottom: 0 }}
                showLabel={false}
                editable={!hasPrefilledCompanyDetails}
              />
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                  Email Address
                </Text>
              </View>
              <FormInput
                name="email"
                control={control}
                placeholder="e.g. contact@company.com"
                keyboardType="email-address"
                autoCapitalize="none"
                rules={validationRules.combine(
                  validationRules.required('Please enter email address'),
                  validationRules.email()
                ) as any}
                inputStyle={styles.input}
                containerStyle={{ marginBottom: 0 }}
                showLabel={false}
              />
            </View>
          </Card>

          <Card style={styles.card}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <AppIcon.Organization width={20} height={20} color={theme.colors.primary.DEFAULT} />
              </View>
              <Text variant="h4" fontWeight="semibold" style={styles.sectionTitle}>
                Machine Preferences
              </Text>
            </View>

            {/* Machine Category */}
            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                  Primary Machine Category
                </Text>
              </View>
              <Controller
                control={control}
                name="machine_category"
                render={({ field: { value } }) => (
                  <>
                    <DropdownButton
                      value={MACHINE_CATEGORY_OPTIONS.find((o) => o.value === value)?.label}
                      placeholder="Select category"
                      onPress={openMachineCategorySheet}
                    />
                  </>
                )}
              />
            </View>

            {/* Machine Type */}
            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                  Primary Machine Type
                </Text>
              </View>
              <Controller
                control={control}
                name="machine_id"
                render={({ fieldState: { error } }) => (
                  <>
                    <DropdownButton
                      value={selectedMachine?.name}
                      placeholder={
                        machineCategoryValue
                          ? isLoadingMachines
                            ? 'Loading...'
                            : 'Select machine type'
                          : 'Select category first'
                      }
                      onPress={openMachineTypeSheet}
                      disabled={!machineCategoryValue || isLoadingMachines}
                    />
                    {error && (
                      <Text
                        variant="captionSmall"
                        style={{
                          color: (theme.colors.error as any)?.DEFAULT || '#FF3B30',
                          marginTop: 4,
                        }}
                      >
                        {error.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

            {/* Preferred Brands (optional, multi-select) */}
            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                  Preferred Brands
                </Text>
                <Text variant="captionMedium" style={styles.optionalLabel}>
                  (Optional)
                </Text>
              </View>
              <Controller
                control={control}
                name="preferred_brand_ids"
                render={() => (
                  <DropdownButton
                    value={preferredBrandDisplay || ''}
                    placeholder="Select preferred brands (multi-select)"
                    onPress={openPreferredBrandsSheet}
                  />
                )}
              />
            </View>
          </Card>

          <Card style={styles.card}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <AppIcon.Location width={20} height={20} color={theme.colors.primary.DEFAULT} />
              </View>
              <Text variant="h4" fontWeight="semibold" style={styles.sectionTitle}>
                Business Location
              </Text>
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                  City
                </Text>
              </View>
              <FormInput
                name="city"
                control={control}
                placeholder="e.g. Mumbai"
                rules={validationRules.required('Please enter city') as any}
                inputStyle={styles.input}
                containerStyle={{ marginBottom: 0 }}
                showLabel={false}
                editable={!hasPrefilledCompanyDetails}
              />
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                  Location
                </Text>
              </View>
              <Controller
                control={control}
                name="location"
                rules={validationRules.required('Please select or enter location') as any}
                render={({ field: { value }, fieldState: { error } }) => (
                  <>
                    <TouchableOpacity
                      style={[styles.input, styles.locationInput]}
                      onPress={() => setShowLocationPicker(true)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.inputIconLeft}>
                        <AppIcon.Location
                          width={20}
                          height={20}
                          color={theme.colors.text.tertiary}
                        />
                      </View>
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
                    </TouchableOpacity>
                    {error && (
                      <Text
                        variant="captionSmall"
                        style={{
                          color: (theme.colors.error as any)?.DEFAULT || '#FF3B30',
                          marginTop: theme.spacing[1],
                        }}
                      >
                        {error.message}
                      </Text>
                    )}
                    {value && (
                      <TouchableOpacity
                        onPress={() => setShowLocationPicker(true)}
                        style={{
                          marginTop: theme.spacing[2],
                          padding: theme.spacing[2],
                          backgroundColor: theme.colors.primary.DEFAULT,
                          borderRadius: 8,
                          alignItems: 'center',
                        }}
                        activeOpacity={0.8}
                      >
                        <Text
                          variant="bodyMedium"
                          style={{ color: theme.colors.text.inverse }}
                        >
                          Change Location on Map
                        </Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              />
            </View>
          </Card>

          <Card style={styles.card}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <AppIcon.Organization width={20} height={20} color={theme.colors.primary.DEFAULT} />
              </View>
              <Text variant="h4" fontWeight="semibold" style={styles.sectionTitle}>
                Additional Information
              </Text>
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                  Business Description
                </Text>
                <Text variant="captionMedium" style={styles.optionalLabel}>
                  (Optional)
                </Text>
              </View>
              <Controller
                control={control}
                name="businessDescription"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.textArea}
                    placeholder="Tell us about your business (e.g., types of machines you deal in, years of experience, etc.)"
                    placeholderTextColor={theme.colors.text.tertiary}
                    value={value}
                    onChangeText={onChange}
                    multiline
                    numberOfLines={4}
                    maxLength={500}
                  />
                )}
              />
              <Text variant="captionSmall" style={{ color: theme.colors.text.tertiary, marginTop: theme.spacing[1] }}>
                {watch('businessDescription')?.length || 0}/500 characters
              </Text>
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.infoIcon}>ℹ️</Text>
              <Text variant="captionSmall" style={styles.infoText}>
                Providing additional information helps us better match you with relevant opportunities.
              </Text>
            </View>
          </Card>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.8}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={theme.colors.text.inverse} />
            ) : (
              <>
                <Text variant="buttonMedium" style={styles.buttonText}>
                  Continue
                </Text>
                <AppIcon.ArrowRight width={20} height={20} color={theme.colors.text.inverse} />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.securityFooter}>
            <Text style={styles.lockIcon}>🔒</Text>
            <Text variant="captionSmall" style={styles.securityText}>
              YOUR DATA IS ENCRYPTED & SECURE
            </Text>
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
                  address: {
                    formattedAddress: locationValue || '',
                    streetAddress: locationValue || '',
                  },
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

      <BottomSheetModal
        ref={machineCategorySheetRef}
        snapPoints={['70%', '95%']}
        enablePanDownToClose
      >
        <View style={{ paddingHorizontal: theme.spacing[4], paddingTop: theme.spacing[4], flex: 1 }}>
          <Text variant="h4" fontWeight="semibold" style={{ marginBottom: theme.spacing[3] }}>
            Select Machine Category
          </Text>
          <BottomSheetFlatList
            data={MACHINE_CATEGORY_OPTIONS}
            keyExtractor={(item: MachineCategoryOption) => item.value}
            renderItem={renderMachineCategoryItem}
            contentContainerStyle={{ paddingBottom: theme.spacing[6] }}
          />
        </View>
      </BottomSheetModal>

      <BottomSheetModal
        ref={machineTypeSheetRef}
        snapPoints={['70%', '95%']}
        enablePanDownToClose
      >
        <View style={{ paddingHorizontal: theme.spacing[4], paddingTop: theme.spacing[4], flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing[3] }}>
            <Text variant="h4" fontWeight="semibold" style={{ flex: 1 }}>
              Select Machine Type
            </Text>
            {isLoadingMachines && (
              <ActivityIndicator size="small" color={theme.colors.primary.DEFAULT} />
            )}
          </View>
          <BottomSheetFlatList
            data={machines}
            keyExtractor={(item: Machine) => item.id.toString()}
            renderItem={renderMachineTypeItem}
            contentContainerStyle={{ paddingBottom: theme.spacing[6] }}
            ListEmptyComponent={
              !isLoadingMachines ? (
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.text.tertiary, marginTop: theme.spacing[2] }}
                >
                  No machines found for this category.
                </Text>
              ) : null
            }
          />
        </View>
      </BottomSheetModal>

      <BottomSheetModal
        ref={preferredBrandsSheetRef}
        snapPoints={['70%', '95%']}
        enablePanDownToClose
        onDismiss={() => setBrandSearchQuery('')}
      >
        <MultiSelectBottomSheetContent
          title="Select Preferred Brands"
          searchQuery={brandSearchQuery}
          onSearchChange={setBrandSearchQuery}
          items={brandItems}
          selectedIds={preferredBrandIdsValue || []}
          onSelect={(id: number) => {
            const current = preferredBrandIdsValue || [];
            if (!current.includes(id)) {
              setValue('preferred_brand_ids', [...current, id], { shouldValidate: true });
            }
          }}
          onDeselect={(id: number) => {
            const current = preferredBrandIdsValue || [];
            setValue(
              'preferred_brand_ids',
              current.filter((x) => x !== id),
              { shouldValidate: true },
            );
          }}
          theme={theme}
          placeholder="Search brands"
          ListComponent={BottomSheetFlatList}
        />
      </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};

export default MachineDealerRegistrationScreen;
