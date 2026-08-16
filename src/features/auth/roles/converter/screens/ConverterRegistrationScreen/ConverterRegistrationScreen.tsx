import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { View, TouchableOpacity, ActivityIndicator, InteractionManager, ScrollView, Modal, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Controller } from 'react-hook-form';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { GorhomBottomSheetModal } from '@shared/components/GorhomBottomSheetModal';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { DropdownButton } from '@shared/components/DropdownButton';
import { StructuredAddressFormModal } from '@shared/components/StructuredAddressFormModal';
import type { WarehouseFormMapData } from '@shared/components/WarehouseAddressForm/@types';
import MultiSelectBottomSheetContent from '@shared/components/MultiSelectBottomSheetContent';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { useForm, FormInput, validationRules } from '@shared/forms';
import {
  useGetConverterReferenceData,
  useCompleteConverterProfile,
  useCreateFinishedProduct,
  useCreateMachine,
  useCreateScrapType,
} from '@services/api/converterApi/converterApi';
import { useGetMaterials, useCreateMaterial } from '@services/api/referenceApi/referenceApi';
import type { UpdateProfileResponse } from '@services/api';
import { SCREENS } from '@navigation/constants';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';
import { getFirstRegistrationScreen } from '@navigation/helpers';
import { ROLES } from '@utils/constants';
import { LOCATION_FALLBACK_COORDINATES } from '@shared/constants/config';
import { ConverterRegistrationFormData } from './@types';
import { createStyles } from './styles';
import { Toast } from 'toastify-react-native';
import { CustomButton } from '@shared/components/CustomButton';
import { FloatingBottomContainer } from '@shared/components/FloatingBottomContainer';
import { useKeyboard, useFloatingBottomPadding } from '@shared/hooks';

type MultiSelectConfig = {
  fieldName: keyof ConverterRegistrationFormData;
  title: string;
  items: Array<{ id: number; name: string }>;
  selectedIds: number[];
  searchKey: string;
};

type CustomField = 'raw_material_ids' | 'finished_product_ids' | 'machine_ids' | 'scrap_type_ids';

const ConverterRegistrationScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<AuthStackParamList, 'ConverterRegistration'>>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const multiSelectSheetRef = useRef<BottomSheetModal>(null);
  const capacityUnitSheetRef = useRef<BottomSheetModal>(null);
  const [multiSelectConfig, setMultiSelectConfig] = useState<MultiSelectConfig | null>(null);
  const [capacitySheetOpen, setCapacitySheetOpen] = useState(false);
  const { data: referenceData, isLoading: isLoadingReference } = useGetConverterReferenceData();
  const { data: materials, isLoading: isLoadingMaterials } = useGetMaterials();
  const { mutate: completeProfile, isPending: isSubmitting } = useCompleteConverterProfile();
  const { mutateAsync: createMaterial, isPending: isCreatingMaterial } = useCreateMaterial();
  const { mutateAsync: createFinishedProduct, isPending: isCreatingFP } = useCreateFinishedProduct();
  const { mutateAsync: createMachine, isPending: isCreatingMachine } = useCreateMachine();
  const { mutateAsync: createScrapType, isPending: isCreatingScrap } = useCreateScrapType();

  const [customEntry, setCustomEntry] = useState<{
    field: CustomField;
    title: string;
    itemLabel: string;
  } | null>(null);
  const [customEntryName, setCustomEntryName] = useState('');
  const [customEntrySecondary, setCustomEntrySecondary] = useState<string>('');
  const [customEntrySecondaryOther, setCustomEntrySecondaryOther] = useState<string>('');
  const [customEntryDescription, setCustomEntryDescription] = useState<string>('');
  const isCreatingCustom = isCreatingMaterial || isCreatingFP || isCreatingMachine || isCreatingScrap;

  const openCustomEntry = useCallback(
    (entry: { field: CustomField; title: string; itemLabel: string }) => {
      setCustomEntryName('');
      setCustomEntrySecondary('');
      setCustomEntrySecondaryOther('');
      setCustomEntryDescription('');
      setCustomEntry(entry);
    },
    []
  );

  const closeCustomEntry = useCallback(() => {
    setCustomEntry(null);
    setCustomEntryName('');
    setCustomEntrySecondary('');
    setCustomEntrySecondaryOther('');
    setCustomEntryDescription('');
  }, []);

  const customEntryConfig = useMemo(() => {
    if (!customEntry) return null;

    const dedupe = (values: Array<string | null | undefined>): string[] => {
      const seen = new Set<string>();
      const out: string[] = [];
      for (const value of values) {
        const trimmed = (value || '').toString().trim();
        if (!trimmed) continue;
        const key = trimmed.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(trimmed);
      }
      return out.sort((a, b) => a.localeCompare(b));
    };

    switch (customEntry.field) {
      case 'machine_ids':
        return {
          secondaryKind: 'type' as const,
          secondaryLabel: 'Type',
          existingOptions: dedupe((referenceData?.machines || []).map((m: any) => m?.type)),
          showDescription: true,
        };
      case 'finished_product_ids':
        return {
          secondaryKind: 'category' as const,
          secondaryLabel: 'Category',
          existingOptions: dedupe((referenceData?.finished_products || []).map((p: any) => p?.category)),
          showDescription: true,
        };
      case 'scrap_type_ids':
        return {
          secondaryKind: 'category' as const,
          secondaryLabel: 'Category',
          existingOptions: dedupe((referenceData?.scrap_types || []).map((s: any) => s?.category)),
          showDescription: true,
        };
      case 'raw_material_ids':
        return {
          secondaryKind: 'category' as const,
          secondaryLabel: 'Category',
          existingOptions: dedupe((materials || []).map((m: any) => m?.category)),
          showDescription: false,
        };
      default:
        return null;
    }
  }, [customEntry, referenceData, materials]);

  console.log('materials', JSON.stringify(materials, null, 2));

  // Get profileData from route params
  const { profileData } = route.params || {};

  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});
  const searchQueriesRef = useRef<Record<string, string>>({});
  
  const [showFactoryAddressModal, setShowFactoryAddressModal] = useState(false);
  const [factoryAddressMapSeed, setFactoryAddressMapSeed] =
    useState<WarehouseFormMapData | null>(null);

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
      capacity_unit: undefined,
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
  const factoryAddressValue = watch('factory_address');
  const factoryLocationValue = watch('factory_location');

  const hasPrefilledCompanyDetails = !!profileData?.company_name;

  // Prefill factory state/city from profileData (from CompanyDetailsScreen)
  useEffect(() => {
    if (!profileData) return;
    if (profileData.state) {
      setValue('factory_state', profileData.state, { shouldValidate: false });
    }
    if (profileData.city) {
      setValue('factory_city', profileData.city, { shouldValidate: false });
    }
  }, [profileData, setValue]);

  const openFactoryAddressModal = useCallback(() => {
    const v = getValues();
    setFactoryAddressMapSeed({
      address: v.factory_address || '',
      city: v.factory_city || '',
      state: v.factory_state || '',
      pincode: '',
      latitude: LOCATION_FALLBACK_COORDINATES.latitude,
      longitude: LOCATION_FALLBACK_COORDINATES.longitude,
    });
    setShowFactoryAddressModal(true);
  }, [getValues]);

  const closeFactoryAddressModal = useCallback(() => {
    setShowFactoryAddressModal(false);
    setFactoryAddressMapSeed(null);
  }, []);

  const handleFactoryStructuredAddressSubmit = useCallback(
    (data: {
      name: string;
      location1: string;
      location2: string;
      state: string;
      city: string;
      pincode: string;
      latitude: number;
      longitude: number;
    }) => {
      const streetBlock = [data.location1, data.location2]
        .filter(Boolean)
        .join(', ');
      setValue('factory_address', streetBlock, { shouldValidate: true });
      setValue('factory_state', data.state, { shouldValidate: true });
      setValue('factory_city', data.city, { shouldValidate: true });
      const fullLoc = [streetBlock, data.city, data.state, data.pincode]
        .filter(Boolean)
        .join(', ');
      setValue('factory_location', fullLoc, { shouldValidate: true });
      setValue('factory_latitude', data.latitude, { shouldValidate: true });
      setValue('factory_longitude', data.longitude, { shouldValidate: true });
      closeFactoryAddressModal();
    },
    [setValue, closeFactoryAddressModal],
  );

  const getDisplayText = useCallback((ids: number[], items: Array<{ id: number; name: string }>): string => {
    if (ids.length === 0) return '';
    if (ids.length === 1) {
      const item = items.find((i) => i.id === ids[0]);
      return item?.name || '';
    }
    return `${ids.length} selected`;
  }, []);

  const openMultiSelect = useCallback(
    (
      fieldName: keyof ConverterRegistrationFormData,
      title: string,
      items: Array<{ id: number; name: string }>,
      selectedIds: number[]
    ) => {
      if (!items || items.length === 0) {
        Toast.show({ type: 'error', text1: 'No Data', text2: 'No items available to select', position: 'top' });
        return;
      }
      const searchKey = fieldName as string;
      const currentSearchQuery = searchQueriesRef.current[searchKey] || '';
      setMultiSelectConfig({
        fieldName,
        title,
        items,
        selectedIds,
        searchKey,
      });
      setSearchQueries((prev) => ({ ...prev, [searchKey]: currentSearchQuery }));
      InteractionManager.runAfterInteractions(() => {
        multiSelectSheetRef.current?.present();
      });
    },
    [setValue, getValues]
  );

  const handleAddCustom = useCallback(async () => {
    if (!customEntry) return;

    const name = customEntryName.trim();
    if (!name) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: `Please enter a ${customEntry.itemLabel} name`,
        position: 'top',
      });
      return;
    }

    const secondary =
      customEntrySecondary === '__other__'
        ? customEntrySecondaryOther.trim()
        : customEntrySecondary.trim();
    const description = customEntryDescription.trim();

    try {
      const created =
        customEntry.field === 'raw_material_ids'
          ? await createMaterial({ name, category: secondary || undefined })
          : customEntry.field === 'finished_product_ids'
          ? await createFinishedProduct({
              name,
              category: secondary || null,
              description: description || null,
            })
          : customEntry.field === 'machine_ids'
          ? await createMachine({
              name,
              type: secondary || null,
              description: description || null,
            })
          : await createScrapType({
              name,
              category: secondary || null,
              description: description || null,
            });

      if (created?.id) {
        const currentIds = (getValues(customEntry.field) as number[]) || [];
        if (!currentIds.includes(created.id)) {
          setValue(customEntry.field, [...currentIds, created.id], { shouldValidate: true });
        }
        closeCustomEntry();
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `${customEntry.itemLabel} added successfully`,
          position: 'top',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: `Failed to add ${customEntry.itemLabel}`,
          position: 'top',
        });
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || `Failed to add ${customEntry.itemLabel}`;
      Toast.show({ type: 'error', text1: 'Error', text2: msg, position: 'top' });
    }
  }, [
    customEntry,
    customEntryName,
    customEntrySecondary,
    customEntrySecondaryOther,
    customEntryDescription,
    createMaterial,
    createFinishedProduct,
    createMachine,
    createScrapType,
    getValues,
    setValue,
    closeCustomEntry,
  ]);

  const { isKeyboardVisible } = useKeyboard();
  const floatingContainerPadding = useFloatingBottomPadding({
    buttonHeight: 60,
  });

  const onInvalid = useCallback(
    (errors: Record<string, { message?: string }>) => {
      const firstError = Object.values(errors)[0];
      const message = firstError?.message || 'Please check the form and try again.';
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: message,
        position: 'top',
      });
    },
    []
  );

  const onSubmit = (data: ConverterRegistrationFormData) => {
    // Validate required fields
    if (data.converter_type_ids.length === 0 && !data.converter_type_custom?.trim()) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Please select at least one converter type or enter a custom type', position: 'top' });
      return;
    }

    if (data.finished_product_ids.length === 0) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Please select at least one finished product', position: 'top' });
      return;
    }

    if (data.machine_ids.length === 0) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Please select at least one machine', position: 'top' });
      return;
    }

    if (data.raw_material_ids.length === 0) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Please select at least one raw material', position: 'top' });
      return;
    }

    if (!data.factory_address?.trim()) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Please enter factory address', position: 'top' });
      return;
    }

    if (!data.factory_city?.trim() || !data.factory_state?.trim()) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Please select factory city and state', position: 'top' });
      return;
    }

    if (data.factory_latitude === 0 || data.factory_longitude === 0) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter factory address using the address form',
        position: 'top',
      });
      return;
    }

    const payload = {
      converter_type_ids: data.converter_type_ids,
      converter_type_custom: data.converter_type_custom?.trim() || undefined,
      finished_product_ids: data.finished_product_ids,
      machine_ids: data.machine_ids,
      scrap_type_ids: (data.scrap_type_ids && data.scrap_type_ids.length > 0) ? data.scrap_type_ids : undefined,
      raw_material_ids: data.raw_material_ids,
      capacity_daily: data.capacity_daily ?? undefined,
      capacity_monthly: data.capacity_monthly ?? undefined,
      capacity_unit: data.capacity_unit?.trim() || undefined,
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
        Toast.show({ type: 'error', text1: 'Error', text2: error?.message || 'Failed to complete profile. Please try again.', position: 'top' });
      },
    });
  };

  if (isLoadingReference || isLoadingMaterials) {
    return null;
  }

  const capacityUnitValue = watch('capacity_unit');

  return (
    <BottomSheetModalProvider>
      <View style={{ flex: 1 }}>
    <ScreenWrapper
      scrollable
      keyboardDoneBar
      backgroundColor={theme.colors.background.secondary}
      safeAreaEdges={[]}
      contentContainerStyle={{ ...styles.scrollContent, paddingBottom: floatingContainerPadding }}
    >
      <Animated.View style={styles.container} entering={FadeIn.duration(300)}>
        {hasPrefilledCompanyDetails && (profileData?.company_name || profileData?.gst_in || profileData?.state || profileData?.city) && (
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
                <View style={[styles.input, { backgroundColor: theme.colors.background.secondary }]}>
                  <Text variant="bodyMedium" style={{ color: theme.colors.text.secondary }}>
                    {profileData.company_name}
                  </Text>
                </View>
              </View>
            )}
            {profileData?.gst_in && (
              <View style={styles.formGroup}>
                <View style={styles.labelRow}>
                  <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                    GSTIN
                  </Text>
                </View>
                <View style={[styles.input, { backgroundColor: theme.colors.background.secondary }]}>
                  <Text variant="bodyMedium" style={{ color: theme.colors.text.secondary }}>
                    {profileData.gst_in}
                  </Text>
                </View>
              </View>
            )}
            {profileData?.state && (
              <View style={styles.formGroup}>
                <View style={styles.labelRow}>
                  <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                    State
                  </Text>
                </View>
                <View style={[styles.input, { backgroundColor: theme.colors.background.secondary }]}>
                  <Text variant="bodyMedium" style={{ color: theme.colors.text.secondary }}>
                    {profileData.state}
                  </Text>
                </View>
              </View>
            )}
            {profileData?.city && (
              <View style={styles.formGroup}>
                <View style={styles.labelRow}>
                  <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                    City
                  </Text>
                </View>
                <View style={[styles.input, { backgroundColor: theme.colors.background.secondary }]}>
                  <Text variant="bodyMedium" style={{ color: theme.colors.text.secondary }}>
                    {profileData.city}
                  </Text>
                </View>
              </View>
            )}
          </Card>
        )}

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
              <Text variant="captionSmall" style={styles.multiSelectLabel}>
                Multi-select
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
              showError={false}
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
                    <Text variant="captionSmall" style={styles.multiSelectLabel}>
                      Multi-select
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
                  <TouchableOpacity
                    onPress={() => openCustomEntry({
                      field: 'finished_product_ids',
                      title: 'Add Custom Finished Product',
                      itemLabel: 'finished product',
                    })}
                    activeOpacity={0.7}
                    style={styles.addCustomLinkRow}
                  >
                    <AppIcon.PlusCircle width={16} height={16} color={theme.colors.primary.DEFAULT} />
                    <Text variant="captionSmall" style={styles.addCustomLinkText}>
                      Can't find your finished product? Tap to add a custom one
                    </Text>
                  </TouchableOpacity>
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
                    <Text variant="captionSmall" style={styles.multiSelectLabel}>
                      Multi-select
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
                  <TouchableOpacity
                    onPress={() => openCustomEntry({
                      field: 'machine_ids',
                      title: 'Add Custom Machine',
                      itemLabel: 'machine',
                    })}
                    activeOpacity={0.7}
                    style={styles.addCustomLinkRow}
                  >
                    <AppIcon.PlusCircle width={16} height={16} color={theme.colors.primary.DEFAULT} />
                    <Text variant="captionSmall" style={styles.addCustomLinkText}>
                      Can't find your machine? Tap to add a custom one
                    </Text>
                  </TouchableOpacity>
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
              <View style={styles.labelBadgesRow}>
                <Text variant="captionSmall" style={styles.multiSelectLabel}>
                  Multi-select
                </Text>
                <Text variant="captionSmall" style={styles.optionalLabel}>
                  (Optional)
                </Text>
              </View>
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
            <TouchableOpacity
              onPress={() => openCustomEntry({
                field: 'scrap_type_ids',
                title: 'Add Custom Scrap Type',
                itemLabel: 'scrap type',
              })}
              activeOpacity={0.7}
              style={styles.addCustomLinkRow}
            >
              <AppIcon.PlusCircle width={16} height={16} color={theme.colors.primary.DEFAULT} />
              <Text variant="captionSmall" style={styles.addCustomLinkText}>
                Can't find your scrap type? Tap to add a custom one
              </Text>
            </TouchableOpacity>
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
            <Text variant="captionSmall" style={styles.optionalLabel}>
              Optional
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
                showError={false}
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
                showError={false}
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
              render={({ field: { value } }) => (
                <DropdownButton
                  value={value ? value.charAt(0).toUpperCase() + value.slice(1) : ''}
                  placeholder="Select unit"
                  onPress={() => capacityUnitSheetRef.current?.present()}
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
                    <Text variant="captionSmall" style={styles.multiSelectLabel}>
                      Multi-select
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
                  <TouchableOpacity
                    onPress={() => openCustomEntry({
                      field: 'raw_material_ids',
                      title: 'Add Custom Material',
                      itemLabel: 'material',
                    })}
                    activeOpacity={0.7}
                    style={styles.addCustomLinkRow}
                  >
                    <AppIcon.PlusCircle width={16} height={16} color={theme.colors.primary.DEFAULT} />
                    <Text variant="captionSmall" style={styles.addCustomLinkText}>
                      Can't find your material? Tap to add a custom one
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            />
          </View>
        </Card>

        {/* Factory Address — same structured form as other roles (no map) */}
        <Card style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <AppIcon.Location width={20} height={20} color={theme.colors.primary.DEFAULT} />
            </View>
            <Text variant="h4" fontWeight="semibold" style={styles.sectionTitle}>
              Factory address
            </Text>
          </View>
          <Text variant="bodySmall" style={{ color: theme.colors.text.secondary, marginBottom: theme.spacing[3] }}>
            Enter your full address in the form. This is the same format used for warehouses and other registrations.
          </Text>
          {factoryStateValue || factoryCityValue || factoryAddressValue ? (
            <Text variant="bodyMedium" style={{ marginBottom: theme.spacing[3] }}>
              {[factoryAddressValue, factoryCityValue, factoryStateValue].filter(Boolean).join(', ')}
              {factoryLocationValue ? `\n${factoryLocationValue}` : ''}
            </Text>
          ) : (
            <Text variant="bodyMedium" style={{ color: theme.colors.text.tertiary, marginBottom: theme.spacing[3] }}>
              No address entered yet
            </Text>
          )}
          <CustomButton
            title={factoryAddressValue ? 'Edit factory address' : 'Enter factory address'}
            onPress={openFactoryAddressModal}
            variant="primary"
            size="md"
          />
        </Card>

        {/* Add Custom Entry Modal */}
        <Modal
          visible={!!customEntry}
          transparent
          animationType="fade"
          onRequestClose={closeCustomEntry}
        >
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
              <View style={styles.modalCard}>
              <Text variant="h4" fontWeight="semibold" style={styles.modalTitle}>
                {customEntry?.title ?? ''}
              </Text>

              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                style={styles.customEntryScroll}
              >
                <Text variant="captionSmall" style={styles.customEntryFieldLabel}>
                  Name
                </Text>
                <TextInput
                  style={styles.customMaterialInput}
                  placeholder={`Enter ${customEntry?.itemLabel ?? ''} name`}
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={customEntryName}
                  onChangeText={setCustomEntryName}
                  editable={!isCreatingCustom}
                  autoFocus
                />

                {customEntryConfig && (
                  <>
                    <Text variant="captionSmall" style={styles.customEntryFieldLabel}>
                      {customEntryConfig.secondaryLabel}
                      <Text variant="captionSmall" style={styles.customEntryOptionalHint}>
                        {'  (optional)'}
                      </Text>
                    </Text>
                    <View style={styles.customEntryChipsRow}>
                      {customEntryConfig.existingOptions.map((option) => {
                        const selected = customEntrySecondary === option;
                        return (
                          <TouchableOpacity
                            key={option}
                            disabled={isCreatingCustom}
                            onPress={() => {
                              setCustomEntrySecondary(selected ? '' : option);
                              setCustomEntrySecondaryOther('');
                            }}
                            activeOpacity={0.7}
                            style={[
                              styles.customEntryChip,
                              selected && styles.customEntryChipSelected,
                            ]}
                          >
                            <Text
                              variant="captionSmall"
                              style={[
                                styles.customEntryChipText,
                                selected && styles.customEntryChipTextSelected,
                              ]}
                            >
                              {option}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                      <TouchableOpacity
                        disabled={isCreatingCustom}
                        onPress={() => {
                          setCustomEntrySecondary(
                            customEntrySecondary === '__other__' ? '' : '__other__'
                          );
                        }}
                        activeOpacity={0.7}
                        style={[
                          styles.customEntryChip,
                          customEntrySecondary === '__other__' && styles.customEntryChipSelected,
                        ]}
                      >
                        <Text
                          variant="captionSmall"
                          style={[
                            styles.customEntryChipText,
                            customEntrySecondary === '__other__' && styles.customEntryChipTextSelected,
                          ]}
                        >
                          Other
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {customEntrySecondary === '__other__' && (
                      <TextInput
                        style={styles.customMaterialInput}
                        placeholder={`Enter custom ${customEntryConfig.secondaryLabel.toLowerCase()}`}
                        placeholderTextColor={theme.colors.text.tertiary}
                        value={customEntrySecondaryOther}
                        onChangeText={setCustomEntrySecondaryOther}
                        editable={!isCreatingCustom}
                      />
                    )}

                    {customEntryConfig.showDescription && (
                      <>
                        <Text variant="captionSmall" style={styles.customEntryFieldLabel}>
                          Description
                          <Text variant="captionSmall" style={styles.customEntryOptionalHint}>
                            {'  (optional)'}
                          </Text>
                        </Text>
                        <TextInput
                          style={[styles.customMaterialInput, styles.customEntryDescriptionInput]}
                          placeholder="Add a short description"
                          placeholderTextColor={theme.colors.text.tertiary}
                          value={customEntryDescription}
                          onChangeText={setCustomEntryDescription}
                          editable={!isCreatingCustom}
                          multiline
                          numberOfLines={3}
                        />
                      </>
                    )}
                  </>
                )}
              </ScrollView>

              <View style={styles.modalActions}>
                <CustomButton
                  title="Cancel"
                  onPress={closeCustomEntry}
                  variant="outline"
                  size="md"
                  style={styles.modalCancelButton}
                />
                <CustomButton
                  title="Add"
                  onPress={handleAddCustom}
                  variant="gradient"
                  size="md"
                  loading={isCreatingCustom}
                  disabled={
                    isCreatingCustom ||
                    !customEntryName.trim() ||
                    (customEntrySecondary === '__other__' && !customEntrySecondaryOther.trim())
                  }
                  gradientColors={[
                    theme.colors.primary[400],
                    theme.colors.primary.DEFAULT,
                  ]}
                  gradientStart={{ x: 0, y: 0 }}
                  gradientEnd={{ x: 1, y: 1 }}
                  style={styles.addMaterialButton}
                />
              </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>

      </Animated.View>
    </ScreenWrapper>

        {!isKeyboardVisible && !multiSelectConfig && !capacitySheetOpen && !showFactoryAddressModal && (
          <FloatingBottomContainer
            backgroundColor={theme.colors.background.primary}
            paddingHorizontal={theme.spacing[4]}
            paddingVertical={theme.spacing[4]}
            shadow
          >
            <CustomButton
              title="Complete Registration"
              onPress={() => handleSubmit(onSubmit, onInvalid)()}
              variant="gradient"
              size="md"
              loading={isSubmitting}
              disabled={isSubmitting}
              gradientColors={[
                theme.colors.primary[400],
                theme.colors.primary[600],
                theme.colors.primary.DEFAULT,
              ]}
              gradientStart={{ x: 0, y: 0 }}
              gradientEnd={{ x: 1, y: 1 }}
              rightIcon={
                <AppIcon.ArrowRight
                  width={20}
                  height={20}
                  color={theme.colors.text.inverse}
                />
              }
            />
          </FloatingBottomContainer>
        )}

        {factoryAddressMapSeed && (
          <StructuredAddressFormModal
            visible={showFactoryAddressModal}
            title="Factory address"
            onDismiss={closeFactoryAddressModal}
            mapData={factoryAddressMapSeed}
            existingLocation={null}
            coordinatesOverride={LOCATION_FALLBACK_COORDINATES}
            showNameField={false}
            onSubmit={handleFactoryStructuredAddressSubmit}
            submitLabel="Save address"
          />
        )}

        {multiSelectConfig && (
          <GorhomBottomSheetModal
            ref={multiSelectSheetRef}
            doneFooter
            snapPoints={['70%', '95%']}
            enablePanDownToClose
            onDismiss={() => {
              setSearchQueries((prev) => {
                const updated = { ...prev };
                if (multiSelectConfig?.searchKey) delete updated[multiSelectConfig.searchKey];
                return updated;
              });
              setMultiSelectConfig(null);
            }}
          >
            <MultiSelectBottomSheetContent
              title={multiSelectConfig.title}
              searchQuery={searchQueries[multiSelectConfig.searchKey] ?? ''}
              onSearchChange={(query: string) => {
                setSearchQueries((prev) => ({ ...prev, [multiSelectConfig.searchKey]: query }));
              }}
              items={multiSelectConfig.items}
              selectedIds={(getValues(multiSelectConfig.fieldName) as number[]) || []}
              onSelect={(id: number) => {
                const currentIds = (getValues(multiSelectConfig.fieldName) as number[]) || [];
                if (!currentIds.includes(id)) {
                  setValue(multiSelectConfig.fieldName, [...currentIds, id] as any, { shouldValidate: false });
                }
              }}
              onDeselect={(id: number) => {
                const currentIds = (getValues(multiSelectConfig.fieldName) as number[]) || [];
                setValue(multiSelectConfig.fieldName, currentIds.filter((i) => i !== id) as any, { shouldValidate: false });
              }}
              theme={theme}
              ListComponent={BottomSheetFlatList}
            />
          </GorhomBottomSheetModal>
        )}

        <GorhomBottomSheetModal
          ref={capacityUnitSheetRef}
          snapPoints={['65%', '80%']}
          enablePanDownToClose
          doneFooter
          onChange={(index: number) => setCapacitySheetOpen(index >= 0)}
        >
          <View style={{ paddingHorizontal: theme.spacing[4], paddingTop: theme.spacing[4], flex: 1 }}>
            <Text
              variant="h4"
              fontWeight="semibold"
              style={{ color: theme.colors.text.primary, marginBottom: theme.spacing[4] }}
            >
              Select Unit
            </Text>
            <BottomSheetFlatList
              data={['pieces', 'kg', 'tonnes']}
              keyExtractor={(unit: string) => unit}
              contentContainerStyle={{ paddingBottom: theme.spacing[6] }}
              renderItem={({ item }: { item: string }) => (
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: theme.spacing[3],
                    paddingHorizontal: theme.spacing[4],
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.border.primary,
                    backgroundColor: capacityUnitValue === item ? theme.colors.primary[50] : 'transparent',
                  }}
                  onPress={() => {
                    setValue('capacity_unit', item, { shouldValidate: true });
                    capacityUnitSheetRef.current?.dismiss();
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    variant="bodyMedium"
                    style={{
                      color: capacityUnitValue === item ? theme.colors.primary.DEFAULT : theme.colors.text.primary,
                      fontWeight: capacityUnitValue === item ? '600' : 'normal',
                    }}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Text>
                  {capacityUnitValue === item && (
                    <AppIcon.TickCheckedBox width={20} height={20} color={theme.colors.primary.DEFAULT} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </GorhomBottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};

export default ConverterRegistrationScreen;
