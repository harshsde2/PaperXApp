import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Alert, ActivityIndicator, InteractionManager, ScrollView, Modal, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Controller } from 'react-hook-form';
import { State, City, ICity } from 'country-state-city';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { DropdownButton } from '@shared/components/DropdownButton';
import { useBottomSheet } from '@shared/components/BottomSheet';
import { StateSelectionContent } from '@shared/components/StateSelectionContent';
import { CitySelectionContent } from '@shared/components/CitySelectionContent';
import MultiSelectBottomSheetContent from '@shared/components/MultiSelectBottomSheetContent';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { useForm, FormInput, validationRules } from '@shared/forms';
import { useGetConverterReferenceData, useCompleteConverterProfile } from '@services/api/converterApi/converterApi';
import { useGetMaterials } from '@services/api/referenceApi/referenceApi';
import type { UpdateProfileResponse } from '@services/api';
import { SCREENS } from '@navigation/constants';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';
import { getFirstRegistrationScreen } from '@navigation/helpers';
import { ROLES } from '@utils/constants';
import { LocationPicker } from '@shared/location';
import type { Location } from '@shared/location/types';
import { ConverterRegistrationFormData } from './@types';
import { createStyles } from './styles';

const INDIA_COUNTRY_CODE = 'IN';
const INDIAN_STATES = State.getStatesOfCountry(INDIA_COUNTRY_CODE);

const STATE_NAME_TO_ISO: Record<string, string> = {};
INDIAN_STATES.forEach((s) => {
  STATE_NAME_TO_ISO[s.name] = s.isoCode;
});

const CITIES_CACHE: Record<string, ICity[]> = {};

const getCitiesForState = (stateIsoCode: string): ICity[] => {
  if (!stateIsoCode) return [];
  if (!CITIES_CACHE[stateIsoCode]) {
    CITIES_CACHE[stateIsoCode] = City.getCitiesOfState(INDIA_COUNTRY_CODE, stateIsoCode);
  }
  return CITIES_CACHE[stateIsoCode];
};

const ConverterRegistrationScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<AuthStackParamList, 'ConverterRegistration'>>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const bottomSheet = useBottomSheet();
  const { data: referenceData, isLoading: isLoadingReference } = useGetConverterReferenceData();
  const { data: materials, isLoading: isLoadingMaterials } = useGetMaterials();
  const { mutate: completeProfile, isPending: isSubmitting } = useCompleteConverterProfile();

  // Get profileData from route params
  const { profileData } = route.params || {};

  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});
  const searchQueriesRef = useRef<Record<string, string>>({});
  
  // State/City selection state
  const [stateSearchQuery, setStateSearchQuery] = useState('');
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showManualLocationEntry, setShowManualLocationEntry] = useState(false);
  
  // Keep ref in sync with state
  React.useEffect(() => {
    searchQueriesRef.current = searchQueries;
  }, [searchQueries]);

  const { control, handleSubmit, setValue, watch, getValues } = useForm<ConverterRegistrationFormData>({
    defaultValues: {
      converter_type_ids: [],
      converter_type_custom: '',
      finished_product_ids: [],
      machine_ids: [],
      scrap_type_ids: [],
      raw_material_ids: [],
      capacity_daily: undefined,
      capacity_monthly: undefined,
      capacity_unit: 'pieces',
      factory_address: '',
      factory_city: '',
      factory_state: '',
      factory_location: '',
      factory_latitude: 0,
      factory_longitude: 0,
    },
    mode: 'onBlur',
  });

  const watchedValues = watch();
  const factoryStateValue = watch('factory_state');
  const factoryCityValue = watch('factory_city');
  const factoryLocationValue = watch('factory_location');
  const factoryLatitudeValue = watch('factory_latitude');
  const factoryLongitudeValue = watch('factory_longitude');

  // Prefill form with sample data for testing
  useEffect(() => {
    if (referenceData && materials && !isLoadingReference && !isLoadingMaterials) {
      // Prefill converter types (select first one if available)
      if (referenceData.converter_types && referenceData.converter_types.length > 0) {
        setValue('converter_type_ids', [referenceData.converter_types[0].id], { shouldValidate: false });
      }
      
      // Prefill finished products (select first 2 if available)
      if (referenceData.finished_products && referenceData.finished_products.length > 0) {
        const productIds = referenceData.finished_products.slice(0, 2).map(p => p.id);
        setValue('finished_product_ids', productIds, { shouldValidate: false });
      }
      
      // Prefill machines (select first one if available)
      if (referenceData.machines && referenceData.machines.length > 0) {
        setValue('machine_ids', [referenceData.machines[0].id], { shouldValidate: false });
      }
      
      // Prefill raw materials (select first 2 if available)
      if (materials && materials.length > 0) {
        const materialIds = materials.slice(0, 2).map(m => m.id);
        setValue('raw_material_ids', materialIds, { shouldValidate: false });
      }
      
      // Prefill capacity
      setValue('capacity_daily', 1000, { shouldValidate: false });
      setValue('capacity_monthly', 30000, { shouldValidate: false });
      setValue('capacity_unit', 'pieces', { shouldValidate: false });
      
      // Prefill factory address
      setValue('factory_state', 'Maharashtra', { shouldValidate: false });
      setValue('factory_city', 'Mumbai', { shouldValidate: false });
      setValue('factory_address', '123 Industrial Area, Andheri East', { shouldValidate: false });
      setValue('factory_location', '123 Industrial Area, Andheri East, Mumbai, Maharashtra, India', { shouldValidate: false });
      setValue('factory_latitude', 19.1136, { shouldValidate: false });
      setValue('factory_longitude', 72.8697, { shouldValidate: false });
    }
  }, [referenceData, materials, isLoadingReference, isLoadingMaterials, setValue]);

  const selectedStateIso = STATE_NAME_TO_ISO[factoryStateValue] || '';

  // Handle state selection
  const handleStateSelect = useCallback((stateName: string) => {
    bottomSheet.close();
    InteractionManager.runAfterInteractions(() => {
      setValue('factory_state', stateName);
      setValue('factory_city', '');
      setStateSearchQuery('');
    });
  }, [bottomSheet, setValue]);

  // Handle city selection
  const handleCitySelect = useCallback((cityName: string) => {
    bottomSheet.close();
    InteractionManager.runAfterInteractions(() => {
      setValue('factory_city', cityName);
      setCitySearchQuery('');
    });
  }, [bottomSheet, setValue]);

  // Open state selector
  const openStateSelector = useCallback(() => {
    setStateSearchQuery('');
    bottomSheet.open(
      <StateSelectionContent
        searchQuery={stateSearchQuery}
        onSearchChange={setStateSearchQuery}
        selectedState={factoryStateValue}
        onSelect={handleStateSelect}
        theme={theme}
      />,
      {
        snapPoints: ['70%', '95%'],
        initialSnapIndex: 0,
        onClose: () => setStateSearchQuery(''),
      }
    );
  }, [bottomSheet, stateSearchQuery, factoryStateValue, handleStateSelect, theme]);

  // Open city selector
  const openCitySelector = useCallback(() => {
    if (!factoryStateValue) {
      Alert.alert('Select State', 'Please select a state first');
      return;
    }
    setCitySearchQuery('');
    const citiesForState = getCitiesForState(selectedStateIso);
    bottomSheet.open(
      <CitySelectionContent
        searchQuery={citySearchQuery}
        onSearchChange={setCitySearchQuery}
        selectedCity={factoryCityValue}
        selectedStateName={factoryStateValue}
        cities={citiesForState}
        onSelect={handleCitySelect}
        theme={theme}
      />,
      {
        snapPoints: ['70%', '95%'],
        initialSnapIndex: 0,
        onClose: () => setCitySearchQuery(''),
      }
    );
  }, [bottomSheet, factoryStateValue, selectedStateIso, citySearchQuery, factoryCityValue, handleCitySelect, theme]);

  // Handle location selection from LocationPicker
  const handleLocationSelect = useCallback(
    (location: Location) => {
      // Auto-fill state and city from location address
      if (location.address?.state) {
        setValue('factory_state', location.address.state, { shouldValidate: true });
      }
      if (location.address?.city) {
        setValue('factory_city', location.address.city, { shouldValidate: true });
      }
      // Set address field with street address or locality details
      const addressText = location.address?.streetAddress || 
                         location.address?.formattedAddress?.split(',')[0] || 
                         '';
      if (addressText) {
        setValue('factory_address', addressText, { shouldValidate: true });
      }
      // Set location field with full formatted address
      setValue('factory_location', location.address?.formattedAddress || location.address?.streetAddress || location.name || '', {
        shouldValidate: true,
      });
      setValue('factory_latitude', location.latitude, {
        shouldValidate: true,
      });
      setValue('factory_longitude', location.longitude, {
        shouldValidate: true,
      });
      setShowLocationPicker(false);
    },
    [setValue],
  );

  const getDisplayText = useCallback((ids: number[], items: Array<{ id: number; name: string }>): string => {
    if (ids.length === 0) return '';
    if (ids.length === 1) {
      const item = items.find((i) => i.id === ids[0]);
      return item?.name || '';
    }
    return `${ids.length} selected`;
  }, []);

  const openMultiSelect = useCallback((
    fieldName: keyof ConverterRegistrationFormData,
    title: string,
    items: Array<{ id: number; name: string }>,
    selectedIds: number[]
  ) => {
    if (!items || items.length === 0) {
      Alert.alert('No Data', 'No items available to select');
      return;
    }

    const searchKey = fieldName as string;
    const currentSearchQuery = searchQueriesRef.current[searchKey] || '';
    
    // Use InteractionManager to defer the bottom sheet opening
    InteractionManager.runAfterInteractions(() => {
      bottomSheet.open(
        <MultiSelectBottomSheetContent
          title={title}
          searchQuery={currentSearchQuery}
          onSearchChange={(query: string) => {
            setSearchQueries((prev) => ({ ...prev, [searchKey]: query }));
          }}
          items={items}
          selectedIds={selectedIds}
          onSelect={(id: number) => {
            const currentIds = (getValues(fieldName) as number[]) || [];
            if (!currentIds.includes(id)) {
              setValue(fieldName, [...currentIds, id] as any, { shouldValidate: false });
            }
          }}
          onDeselect={(id: number) => {
            const currentIds = (getValues(fieldName) as number[]) || [];
            setValue(fieldName, currentIds.filter((i) => i !== id) as any, { shouldValidate: false });
          }}
          theme={theme}
        />,
        {
          snapPoints: ['70%', '95%'],
          initialSnapIndex: 0,
          onClose: () => {
            setSearchQueries((prev) => {
              const updated = { ...prev };
              delete updated[searchKey];
              return updated;
            });
          },
        }
      );
    });
  }, [bottomSheet, setValue, getValues, theme]);

  const onSubmit = (data: ConverterRegistrationFormData) => {
    // Validate required fields
    if (data.converter_type_ids.length === 0 && !data.converter_type_custom?.trim()) {
      Alert.alert('Validation Error', 'Please select at least one converter type or enter a custom type');
      return;
    }

    if (data.finished_product_ids.length === 0) {
      Alert.alert('Validation Error', 'Please select at least one finished product');
      return;
    }

    if (data.machine_ids.length === 0) {
      Alert.alert('Validation Error', 'Please select at least one machine');
      return;
    }

    if (data.raw_material_ids.length === 0) {
      Alert.alert('Validation Error', 'Please select at least one raw material');
      return;
    }

    if (!data.factory_address?.trim()) {
      Alert.alert('Validation Error', 'Please enter factory address');
      return;
    }

    if (!data.factory_city?.trim() || !data.factory_state?.trim()) {
      Alert.alert('Validation Error', 'Please select factory city and state');
      return;
    }

    // Coordinates are required if location was selected from map, optional if manually entered
    if (!showManualLocationEntry && (data.factory_latitude === 0 || data.factory_longitude === 0)) {
      Alert.alert('Validation Error', 'Please select factory location');
      return;
    }

    const payload = {
      converter_type_ids: data.converter_type_ids,
      converter_type_custom: data.converter_type_custom?.trim() || undefined,
      finished_product_ids: data.finished_product_ids,
      machine_ids: data.machine_ids,
      scrap_type_ids: (data.scrap_type_ids && data.scrap_type_ids.length > 0) ? data.scrap_type_ids : undefined,
      raw_material_ids: data.raw_material_ids,
      capacity_daily: data.capacity_daily,
      capacity_monthly: data.capacity_monthly,
      capacity_unit: data.capacity_unit,
      factory_address: data.factory_address.trim(),
      factory_city: data.factory_city.trim(),
      factory_state: data.factory_state.trim(),
      factory_location: data.factory_location?.trim() || undefined,
      factory_latitude: data.factory_latitude,
      factory_longitude: data.factory_longitude,
    };

    completeProfile(payload, {
      onSuccess: (response) => {
        console.log('response', JSON.stringify(response, null, 2));
        
        // For navigation, we still need profileData if it exists, otherwise use response
        const updatedProfileData: UpdateProfileResponse = {
          ...(profileData || {}),
          ...response, // Merge API response to get latest profile data
        };

        const isSecondaryRoleCompletion =
          profileData?.secondary_role === ROLES.CONVERTER;

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
        Alert.alert('Error', error?.message || 'Failed to complete profile. Please try again.');
      },
    });
  };

  if (isLoadingReference || isLoadingMaterials) {
    return (
      <ScreenWrapper backgroundColor={theme.colors.background.secondary}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.DEFAULT} />
          <Text variant="bodyMedium" style={styles.loadingText}>
            Loading form data...
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      scrollable
      backgroundColor={theme.colors.background.secondary}
      safeAreaEdges={[]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        {/* Converter Type Card */}
        <Card style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <AppIcon.Organization width={20} height={20} color={theme.colors.primary.DEFAULT} />
            </View>
            <Text variant="h4" fontWeight="semibold" style={styles.sectionTitle}>
              Converter Type
            </Text>
          </View>

          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Select Converter Types
              </Text>
            </View>
            <DropdownButton
              value={getDisplayText(watchedValues.converter_type_ids || [], referenceData?.converter_types || [])}
              placeholder="Select converter types"
              onPress={() => openMultiSelect(
                'converter_type_ids',
                'Select Converter Types',
                referenceData?.converter_types || [],
                watchedValues.converter_type_ids || []
              )}
            />
            <Text variant="captionSmall" style={styles.helperText}>
              Select all that apply. You can also enter a custom type below.
            </Text>
          </View>

          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Custom Converter Type
              </Text>
              <Text variant="captionSmall" style={styles.optionalLabel}>
                (Optional)
              </Text>
            </View>
            <FormInput
              name="converter_type_custom"
              control={control}
              placeholder="Enter custom converter type if not in list"
              inputStyle={styles.input}
              containerStyle={{ marginBottom: 0 }}
              showLabel={false}
            />
          </View>
        </Card>

        {/* Finished Products Card */}
        <Card style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <AppIcon.Location width={20} height={20} color={theme.colors.primary.DEFAULT} />
            </View>
            <Text variant="h4" fontWeight="semibold" style={styles.sectionTitle}>
              Finished Products Made
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Controller
              control={control}
              name="finished_product_ids"
              rules={validationRules.required('Please select at least one finished product') as any}
              render={({ fieldState: { error } }) => (
                <>
                  <View style={styles.labelRow}>
                    <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                      Select Products
                    </Text>
                  </View>
                  <DropdownButton
                    value={getDisplayText(watchedValues.finished_product_ids || [], referenceData?.finished_products || [])}
                    placeholder="Select finished products"
                    onPress={() => openMultiSelect(
                      'finished_product_ids',
                      'Select Finished Products',
                      referenceData?.finished_products || [],
                      watchedValues.finished_product_ids || []
                    )}
                  />
                  {error && (
                    <Text variant="captionSmall" style={styles.errorText}>
                      {error.message}
                    </Text>
                  )}
                </>
              )}
            />
          </View>
        </Card>

        {/* Machines Available Card */}
        <Card style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <AppIcon.Location width={20} height={20} color={theme.colors.primary.DEFAULT} />
            </View>
            <Text variant="h4" fontWeight="semibold" style={styles.sectionTitle}>
              Machines Available
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Controller
              control={control}
              name="machine_ids"
              rules={validationRules.required('Please select at least one machine') as any}
              render={({ fieldState: { error } }) => (
                <>
                  <View style={styles.labelRow}>
                    <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                      Select Machines
                    </Text>
                  </View>
                  <DropdownButton
                    value={getDisplayText(watchedValues.machine_ids || [], referenceData?.machines || [])}
                    placeholder="Select machines"
                    onPress={() => openMultiSelect(
                      'machine_ids',
                      'Select Machines',
                      referenceData?.machines || [],
                      watchedValues.machine_ids || []
                    )}
                  />
                  {error && (
                    <Text variant="captionSmall" style={styles.errorText}>
                      {error.message}
                    </Text>
                  )}
                </>
              )}
            />
          </View>
        </Card>

        {/* Scrap Generated Card */}
        <Card style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <AppIcon.Location width={20} height={20} color={theme.colors.primary.DEFAULT} />
            </View>
            <Text variant="h4" fontWeight="semibold" style={styles.sectionTitle}>
              Scrap Generated
            </Text>
          </View>

          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Scrap Types
              </Text>
              <Text variant="captionSmall" style={styles.optionalLabel}>
                (Optional)
              </Text>
            </View>
            <DropdownButton
              value={getDisplayText(watchedValues.scrap_type_ids || [], referenceData?.scrap_types || [])}
              placeholder="Select scrap types if applicable"
              onPress={() => openMultiSelect(
                'scrap_type_ids',
                'Select Scrap Types',
                referenceData?.scrap_types || [],
                watchedValues.scrap_type_ids || []
              )}
            />
            <Text variant="captionSmall" style={styles.helperText}>
              Select types of scrap you generate during production
            </Text>
          </View>
        </Card>

        {/* Capacity Card */}
        <Card style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <AppIcon.Location width={20} height={20} color={theme.colors.primary.DEFAULT} />
            </View>
            <Text variant="h4" fontWeight="semibold" style={styles.sectionTitle}>
              Production Capacity
            </Text>
          </View>

          <View style={styles.capacityRow}>
            <View style={styles.capacityInput}>
              <View style={styles.labelRow}>
                <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                  Daily Capacity
                </Text>
              </View>
              <FormInput
                name="capacity_daily"
                control={control}
                placeholder="e.g. 1000"
                keyboardType="numeric"
                inputStyle={styles.input}
                containerStyle={{ marginBottom: 0 }}
                showLabel={false}
              />
            </View>
            <View style={styles.capacityInput}>
              <View style={styles.labelRow}>
                <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                  Monthly Capacity
                </Text>
              </View>
              <FormInput
                name="capacity_monthly"
                control={control}
                placeholder="e.g. 30000"
                keyboardType="numeric"
                inputStyle={styles.input}
                containerStyle={{ marginBottom: 0 }}
                showLabel={false}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Unit
              </Text>
            </View>
            <Controller
              control={control}
              name="capacity_unit"
              render={({ field: { value, onChange } }) => (
                <DropdownButton
                  value={value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Pieces'}
                  placeholder="Select unit"
                  onPress={() => {
                    const units = ['pieces', 'kg', 'tonnes'];
                    bottomSheet.open(
                      <View>
                        <Text 
                          variant="h4" 
                          fontWeight="semibold" 
                          style={{ 
                            color: theme.colors.text.primary, 
                            marginBottom: theme.spacing[4] 
                          }}
                        >
                          Select Unit
                        </Text>
                        {units.map((unit, index) => (
                          <TouchableOpacity
                            key={unit}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              paddingVertical: theme.spacing[3],
                              paddingHorizontal: theme.spacing[4],
                              borderBottomWidth: index < units.length - 1 ? 1 : 0,
                              borderBottomColor: theme.colors.border.primary,
                              backgroundColor: value === unit ? theme.colors.primary[50] : 'transparent',
                            }}
                            onPress={() => {
                              onChange(unit);
                              bottomSheet.close();
                            }}
                            activeOpacity={0.7}
                          >
                            <Text
                              variant="bodyMedium"
                              style={{
                                color: value === unit ? theme.colors.primary.DEFAULT : theme.colors.text.primary,
                                fontWeight: value === unit ? '600' : 'normal',
                              }}
                            >
                              {unit.charAt(0).toUpperCase() + unit.slice(1)}
                            </Text>
                            {value === unit && (
                              <AppIcon.TickCheckedBox width={20} height={20} color={theme.colors.primary.DEFAULT} />
                            )}
                          </TouchableOpacity>
                        ))}
                      </View>,
                      {
                        snapPoints: ['65%', '80%'],
                        initialSnapIndex: 0,
                      }
                    );
                  }}
                />
              )}
            />
            <Text variant="captionSmall" style={styles.helperText}>
              Example: 1000 pieces per day or 8000 kg per month
            </Text>
          </View>
        </Card>

        {/* Raw Materials Card */}
        <Card style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <AppIcon.Location width={20} height={20} color={theme.colors.primary.DEFAULT} />
            </View>
            <Text variant="h4" fontWeight="semibold" style={styles.sectionTitle}>
              Raw Materials Used
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Controller
              control={control}
              name="raw_material_ids"
              rules={validationRules.required('Please select at least one raw material') as any}
              render={({ fieldState: { error } }) => (
                <>
                  <View style={styles.labelRow}>
                    <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                      Select Materials
                    </Text>
                  </View>
                  <DropdownButton
                    value={getDisplayText(
                      watchedValues.raw_material_ids || [],
                      materials?.map((m) => ({ id: m.id, name: m.name })) || []
                    )}
                    placeholder="Select raw materials"
                    onPress={() => openMultiSelect(
                      'raw_material_ids',
                      'Select Raw Materials',
                      materials?.map((m) => ({ id: m.id, name: m.name })) || [],
                      watchedValues.raw_material_ids || []
                    )}
                  />
                  {error && (
                    <Text variant="captionSmall" style={styles.errorText}>
                      {error.message}
                    </Text>
                  )}
                </>
              )}
            />
          </View>
        </Card>

        {/* Factory Address Card */}
        <Card style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <AppIcon.Location width={20} height={20} color={theme.colors.primary.DEFAULT} />
            </View>
            <Text variant="h4" fontWeight="semibold" style={styles.sectionTitle}>
              Factory Address
            </Text>
          </View>

          {/* State */}
          <View style={styles.formGroup}>
            <Controller
              control={control}
              name="factory_state"
              rules={validationRules.required('Please select a state') as any}
              render={({ field: { value }, fieldState: { error } }) => (
                <>
                  <View style={styles.labelRow}>
                    <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                      State
                    </Text>
                  </View>
                  <DropdownButton
                    value={value}
                    placeholder="Select State"
                    onPress={openStateSelector}
                  />
                  {error && (
                    <Text variant="captionSmall" style={styles.errorText}>
                      {error.message}
                    </Text>
                  )}
                </>
              )}
            />
          </View>

          {/* City */}
          <View style={styles.formGroup}>
            <Controller
              control={control}
              name="factory_city"
              rules={validationRules.required('Please select a city') as any}
              render={({ field: { value }, fieldState: { error } }) => (
                <>
                  <View style={styles.labelRow}>
                    <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                      City
                    </Text>
                  </View>
                  <DropdownButton
                    value={value}
                    placeholder={factoryStateValue ? 'Select City' : 'Select State first'}
                    onPress={openCitySelector}
                    disabled={!factoryStateValue}
                  />
                  {error && (
                    <Text variant="captionSmall" style={styles.errorText}>
                      {error.message}
                    </Text>
                  )}
                </>
              )}
            />
          </View>

          {/* Address */}
          <View style={styles.formGroup}>
            <Controller
              control={control}
              name="factory_address"
              rules={validationRules.required('Please enter factory address') as any}
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <>
                  <View style={styles.labelRow}>
                    <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                      Address
                    </Text>
                  </View>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIconLeft}>
                      <AppIcon.Location
                        width={20}
                        height={20}
                        color={theme.colors.text.tertiary}
                      />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter address or locality"
                      placeholderTextColor={theme.colors.text.tertiary}
                      value={value}
                      onChangeText={onChange}
                      multiline
                      numberOfLines={2}
                    />
                  </View>
                  {error && (
                    <Text variant="captionSmall" style={styles.errorText}>
                      {error.message}
                    </Text>
                  )}
                </>
              )}
            />
          </View>

          {/* Location */}
          <View style={styles.formGroup}>
            <Controller
              control={control}
              name="factory_location"
              rules={validationRules.required('Please select or enter location') as any}
              render={({ field: { value }, fieldState: { error } }) => (
                <>
                  <View style={styles.labelRow}>
                    <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                      Location
                    </Text>
                  </View>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIconLeft}>
                      <AppIcon.Location
                        width={20}
                        height={20}
                        color={theme.colors.text.tertiary}
                      />
                    </View>
                    {showManualLocationEntry ? (
                      <TextInput
                        style={styles.input}
                        placeholder="Enter location manually"
                        placeholderTextColor={theme.colors.text.tertiary}
                        value={value}
                        onChangeText={(text) => {
                          setValue('factory_location', text, { shouldValidate: true });
                        }}
                      />
                    ) : (
                      <TouchableOpacity
                        style={{ flex: 1, justifyContent: 'center' }}
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
                      </TouchableOpacity>
                    )}
                    <View style={styles.inputIconRight}>
                      <TouchableOpacity
                        onPress={() => {
                          setShowManualLocationEntry(!showManualLocationEntry);
                          if (!showManualLocationEntry) {
                            setValue('factory_location', '', { shouldValidate: true });
                            setValue('factory_latitude', 0, { shouldValidate: true });
                            setValue('factory_longitude', 0, { shouldValidate: true });
                          }
                        }}
                        activeOpacity={0.7}
                      >
                        <AppIcon.Search
                          width={20}
                          height={20}
                          color={theme.colors.text.tertiary}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  {error && (
                    <Text variant="captionSmall" style={styles.errorText}>
                      {error.message}
                    </Text>
                  )}
                  {!showManualLocationEntry && (
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
                        {value ? 'Change Location on Map' : 'Select Location on Map'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            />
          </View>
        </Card>

        {/* Location Picker Modal */}
        <Modal
          visible={showLocationPicker}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={() => setShowLocationPicker(false)}
        >
          <LocationPicker
            initialLocation={
              factoryLatitudeValue && factoryLongitudeValue
                ? {
                    latitude: factoryLatitudeValue,
                    longitude: factoryLongitudeValue,
                    address: {
                      formattedAddress: factoryLocationValue || '',
                      streetAddress: factoryLocationValue || '',
                    },
                  }
                : undefined
            }
            onLocationSelect={handleLocationSelect}
            onCancel={() => setShowLocationPicker(false)}
            allowMapTap={true}
            confirmButtonText="Confirm Location"
            title="Select Factory Location"
          />
        </Modal>

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
                Complete Registration
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
  );
};

export default ConverterRegistrationScreen;
