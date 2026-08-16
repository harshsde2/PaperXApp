import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { View, TouchableOpacity, TextInput, ActivityIndicator, Modal, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Controller } from 'react-hook-form';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { GorhomBottomSheetModal } from '@shared/components/GorhomBottomSheetModal';
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
import { useCompleteMachineDealerProfile, useGetMachines, useCreateMachine } from '@services/api';
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
import { StructuredAddressFormModal } from '@shared/components/StructuredAddressFormModal';
import type { WarehouseFormMapData } from '@shared/components/WarehouseAddressForm/@types';
import { LOCATION_FALLBACK_COORDINATES } from '@shared/constants/config';
import { CustomButton } from '@shared/components/CustomButton';
import { FloatingBottomContainer } from '@shared/components/FloatingBottomContainer';
import { useKeyboard, useFloatingBottomPadding } from '@shared/hooks';
import { Toast } from 'toastify-react-native';

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

  const { control, handleSubmit, setValue, watch, getValues } = useForm<MachineDealerRegistrationFormData>({
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
      machine_preferences: [],
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

  const [showBusinessAddressModal, setShowBusinessAddressModal] = useState(false);
  const [businessAddressMapSeed, setBusinessAddressMapSeed] =
    useState<WarehouseFormMapData | null>(null);
  const [brandSearchQuery, setBrandSearchQuery] = useState('');

  const [customMachineModalVisible, setCustomMachineModalVisible] = useState(false);
  const [customMachineName, setCustomMachineName] = useState('');
  const [customMachineType, setCustomMachineType] = useState<string>('');
  const [customMachineTypeOther, setCustomMachineTypeOther] = useState<string>('');
  const [customMachineDescription, setCustomMachineDescription] = useState<string>('');

  const { mutateAsync: createMachine, isPending: isCreatingMachine } = useCreateMachine();

  const cityValue = watch('city');
  const locationValue = watch('location');
  const machineCategoryValue = watch('machine_category');
  const machineIdValue = watch('machine_id');
  const machinePreferencesValue = watch('machine_preferences');
  const preferredBrandIdsValue = watch('preferred_brand_ids');

  // First time (empty list) the add-form is shown by default; after adding it collapses
  // and the + icon re-opens it.
  const [showAddPreference, setShowAddPreference] = useState(
    () => (getValues('machine_preferences')?.length ?? 0) === 0,
  );

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

  const handleAddPreference = useCallback(() => {
    const category = getValues('machine_category');
    const machineId = getValues('machine_id');
    if (!category || machineId == null) {
      Toast.show({
        type: 'error',
        text1: 'Select machine',
        text2: 'Choose a category and machine type first.',
        position: 'top',
      });
      return;
    }
    const current = getValues('machine_preferences') ?? [];
    if (current.some((p) => p.machine_id === machineId)) {
      Toast.show({
        type: 'error',
        text1: 'Already added',
        text2: 'This machine is already in your list.',
        position: 'top',
      });
      return;
    }
    const machineName = machines.find((m) => m.id === machineId)?.name ?? `Machine #${machineId}`;
    const brandIds = getValues('preferred_brand_ids') ?? [];
    const brandNames = brandIds
      .map((id) => MACHINE_BRAND_NAMES[id])
      .filter((name): name is string => Boolean(name));
    setValue(
      'machine_preferences',
      [
        ...current,
        {
          machine_category: category,
          machine_id: machineId,
          machine_name: machineName,
          brand_names: brandNames,
        },
      ],
      { shouldValidate: false },
    );
    // Reset the staging selection so the pickers are clear for the next add.
    setValue('machine_category', undefined, { shouldValidate: false });
    setValue('machine_id', undefined, { shouldValidate: false });
    setValue('preferred_brand_ids', [], { shouldValidate: false });
    setShowAddPreference(false);
  }, [getValues, setValue, machines]);

  const handleRemovePreference = useCallback(
    (index: number) => {
      const current = getValues('machine_preferences') ?? [];
      setValue(
        'machine_preferences',
        current.filter((_, i) => i !== index),
        { shouldValidate: false },
      );
    },
    [getValues, setValue],
  );

  const { isKeyboardVisible } = useKeyboard();
  const floatingContainerPadding = useFloatingBottomPadding({ buttonHeight: 60 });

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

  const openBusinessAddressModal = useCallback(() => {
    const v = getValues();
    setBusinessAddressMapSeed({
      address: v.location || '',
      city: v.city || '',
      state: '',
      pincode: '',
      latitude: LOCATION_FALLBACK_COORDINATES.latitude,
      longitude: LOCATION_FALLBACK_COORDINATES.longitude,
    });
    setShowBusinessAddressModal(true);
  }, [getValues]);

  const closeBusinessAddressModal = useCallback(() => {
    setShowBusinessAddressModal(false);
    setBusinessAddressMapSeed(null);
  }, []);

  const handleBusinessStructuredAddressSubmit = useCallback(
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
      const fullLoc = [streetBlock, data.city, data.state, data.pincode]
        .filter(Boolean)
        .join(', ');
      setValue('city', data.city, { shouldValidate: true });
      setValue('location', fullLoc || streetBlock, { shouldValidate: true });
      setValue('latitude', data.latitude, { shouldValidate: true });
      setValue('longitude', data.longitude, { shouldValidate: true });
      closeBusinessAddressModal();
      dispatch(
        showToast({
          message: 'Business address saved',
          type: 'success',
        }),
      );
    },
    [setValue, closeBusinessAddressModal, dispatch],
  );

  const openMachineCategorySheet = useCallback(() => {
    machineCategorySheetRef.current?.present();
  }, []);

  const openMachineTypeSheet = useCallback(() => {
    if (!machineCategoryValue) {
      Toast.show({ type: 'error', text1: 'Select Category', text2: 'Please select machine category first', position: 'top' });
      return;
    }
    machineTypeSheetRef.current?.present();
  }, [machineCategoryValue]);

  const openPreferredBrandsSheet = useCallback(() => {
    preferredBrandsSheetRef.current?.present();
  }, []);

  const openCustomMachineModal = useCallback(() => {
    setCustomMachineName('');
    setCustomMachineType(machineCategoryValue ?? '');
    setCustomMachineTypeOther('');
    setCustomMachineDescription('');
    setCustomMachineModalVisible(true);
  }, [machineCategoryValue]);

  const closeCustomMachineModal = useCallback(() => {
    setCustomMachineModalVisible(false);
    setCustomMachineName('');
    setCustomMachineType('');
    setCustomMachineTypeOther('');
    setCustomMachineDescription('');
  }, []);

  const handleAddCustomMachine = useCallback(async () => {
    const name = customMachineName.trim();
    if (!name) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter a machine name',
        position: 'top',
      });
      return;
    }

    const resolvedType =
      customMachineType === '__other__'
        ? customMachineTypeOther.trim()
        : customMachineType.trim();
    const description = customMachineDescription.trim();

    try {
      const created = await createMachine({
        name,
        type: resolvedType || null,
        description: description || null,
      });

      if (created?.id) {
        if (resolvedType) {
          if (machineCategoryValue !== resolvedType) {
            setValue('machine_category', resolvedType as MachineCategoryType, {
              shouldValidate: true,
            });
          }
        }
        setValue('machine_id', created.id, { shouldValidate: true });
        closeCustomMachineModal();
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Machine added successfully',
          position: 'top',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to add machine',
          position: 'top',
        });
      }
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || error?.message || 'Failed to add machine';
      Toast.show({ type: 'error', text1: 'Error', text2: msg, position: 'top' });
    }
  }, [
    customMachineName,
    customMachineType,
    customMachineTypeOther,
    customMachineDescription,
    createMachine,
    machineCategoryValue,
    setValue,
    closeCustomMachineModal,
  ]);

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
      Toast.show({ type: 'error', text1: 'Error', text2: 'Profile data is missing. Please go back and try again.', position: 'top' });
      return;
    }

    if (
      !data.city?.trim() ||
      !data.location?.trim() ||
      data.latitude == null ||
      data.longitude == null
    ) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your business address using the address form.',
        position: 'top',
      });
      return;
    }

    if (!data.machine_preferences || data.machine_preferences.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Machine required',
        text2: 'Add at least one machine preference.',
        position: 'top',
      });
      return;
    }

    const machinePreferences = data.machine_preferences.map((p) => ({
      machine_category: p.machine_category,
      machine_id: p.machine_id,
      brand_names: p.brand_names && p.brand_names.length > 0 ? p.brand_names : undefined,
    }));

    // Legacy global list = union of every preference's brands (matching engine reads this).
    const unionBrandNames = Array.from(
      new Set(
        data.machine_preferences.reduce<string[]>((acc, p) => {
          if (p.brand_names) acc.push(...p.brand_names);
          return acc;
        }, []),
      ),
    );

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
      // Keep legacy single fields in sync (matching engine reads these)
      primary_machine_category: machinePreferences[0]?.machine_category ?? null,
      primary_machine_id: machinePreferences[0]?.machine_id ?? null,
      preferred_brand_names: unionBrandNames.length > 0 ? unionBrandNames : null,
      machine_preferences: machinePreferences,
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
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error?.message || 'Failed to complete registration. Please try again.',
          position: 'top',
        });
      },
    });
  };

  return (
    <BottomSheetModalProvider>
      <View style={{ flex: 1 }}>
      <ScreenWrapper
        scrollable
        keyboardDoneBar
        keyboardAvoiding
        backgroundColor={theme.colors.background.secondary}
        safeAreaEdges={[]}
        contentContainerStyle={{ ...styles.scrollContent, paddingBottom: floatingContainerPadding }}
      >
        <Animated.View style={styles.container} entering={FadeIn.duration(300)}>
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
              <TouchableOpacity
                onPress={() => setShowAddPreference((prev) => !prev)}
                activeOpacity={0.7}
                style={styles.addPrefIconButton}
                accessibilityLabel="Add machine preference"
              >
                <AppIcon.PlusCircle width={22} height={22} color={theme.colors.primary.DEFAULT} />
              </TouchableOpacity>
            </View>

            {/* List of added machine preferences */}
            <Controller
              control={control}
              name="machine_preferences"
              render={({ field: { value } }) => {
                const items = value ?? [];
                if (items.length === 0) {
                  return (
                    <Text variant="bodySmall" style={styles.prefEmptyText}>
                      No machines added yet — tap + to add one.
                    </Text>
                  );
                }
                return (
                  <View style={styles.prefList}>
                    {items.map((pref, index) => (
                      <View key={`${pref.machine_id}-${index}`} style={styles.prefRow}>
                        <View style={styles.prefRowTextWrap}>
                          <Text variant="bodyMedium" fontWeight="medium" style={styles.prefRowName}>
                            {pref.machine_name}
                          </Text>
                          <Text variant="captionSmall" style={styles.prefRowCategory}>
                            {MACHINE_CATEGORY_OPTIONS.find((o) => o.value === pref.machine_category)?.label ??
                              pref.machine_category}
                          </Text>
                          {pref.brand_names && pref.brand_names.length > 0 && (
                            <Text variant="captionSmall" style={styles.prefRowBrands}>
                              Brands: {pref.brand_names.join(', ')}
                            </Text>
                          )}
                        </View>
                        <TouchableOpacity
                          onPress={() => handleRemovePreference(index)}
                          activeOpacity={0.7}
                          style={styles.prefRemoveButton}
                          accessibilityLabel="Remove machine"
                        >
                          <AppIcon.Close width={16} height={16} color={theme.colors.text.secondary} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                );
              }}
            />

            {/* Add-preference form (revealed by the + icon) */}
            {showAddPreference && (
              <View style={styles.addPrefForm}>
                {/* Machine Category */}
                <View>
                  <View style={styles.labelRow}>
                    <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                      Machine Category
                    </Text>
                  </View>
                  <Controller
                    control={control}
                    name="machine_category"
                    render={({ field: { value } }) => (
                      <DropdownButton
                        value={MACHINE_CATEGORY_OPTIONS.find((o) => o.value === value)?.label}
                        placeholder="Select category"
                        onPress={openMachineCategorySheet}
                      />
                    )}
                  />
                </View>

                {/* Machine Type */}
                <View>
                  <View style={styles.labelRow}>
                    <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                      Machine Type
                    </Text>
                  </View>
                  <Controller
                    control={control}
                    name="machine_id"
                    render={() => (
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
                    )}
                  />
                  <TouchableOpacity
                    onPress={openCustomMachineModal}
                    activeOpacity={0.7}
                    style={styles.addCustomLinkRow}
                  >
                    <AppIcon.PlusCircle width={16} height={16} color={theme.colors.primary.DEFAULT} />
                    <Text variant="captionSmall" style={styles.addCustomLinkText}>
                      Can't find your machine? Tap to add a custom one
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Preferred Brands for this machine (optional) */}
                <View>
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

                <CustomButton
                  title="Add Machine"
                  onPress={handleAddPreference}
                  variant="primary"
                  size="md"
                  style={styles.addPrefButton}
                  disabled={!machineCategoryValue || machineIdValue == null}
                />
              </View>
            )}
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

            <Text variant="bodySmall" style={{ color: theme.colors.text.secondary, marginBottom: theme.spacing[3] }}>
              Use the same address form as other registrations (state, city, street lines, pincode). Map is not required.
            </Text>
            {locationValue ? (
              <Text variant="bodyMedium" style={{ marginBottom: theme.spacing[3] }}>
                {[cityValue, locationValue].filter(Boolean).join('\n')}
              </Text>
            ) : (
              <Text variant="bodyMedium" style={{ color: theme.colors.text.tertiary, marginBottom: theme.spacing[3] }}>
                No business address entered yet
              </Text>
            )}
            <CustomButton
              title={locationValue ? 'Edit business address' : 'Enter business address'}
              onPress={openBusinessAddressModal}
              variant="primary"
              size="md"
            />
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
                Providing additional information helps us match you with relevant opportunities.
              </Text>
            </View>
          </Card>

        </Animated.View>
      </ScreenWrapper>

        {!isKeyboardVisible && (
          <FloatingBottomContainer
            backgroundColor={theme.colors.background.primary}
            paddingHorizontal={theme.spacing[4]}
            paddingVertical={theme.spacing[4]}
            shadow
          >
            <CustomButton
              title="Continue"
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

      {/* Add Custom Machine Modal */}
      <Modal
        visible={customMachineModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeCustomMachineModal}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.modalCard}>
              <Text variant="h4" fontWeight="semibold" style={styles.modalTitle}>
                Add Custom Machine
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
                  style={styles.customMachineInput}
                  placeholder="Enter machine name"
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={customMachineName}
                  onChangeText={setCustomMachineName}
                  editable={!isCreatingMachine}
                  autoFocus
                />

                <Text variant="captionSmall" style={styles.customEntryFieldLabel}>
                  Type
                  <Text variant="captionSmall" style={styles.customEntryOptionalHint}>
                    {'  (optional)'}
                  </Text>
                </Text>
                <View style={styles.customEntryChipsRow}>
                  {MACHINE_CATEGORY_OPTIONS.map((option) => {
                    const selected = customMachineType === option.value;
                    return (
                      <TouchableOpacity
                        key={option.value}
                        disabled={isCreatingMachine}
                        onPress={() => {
                          setCustomMachineType(selected ? '' : option.value);
                          setCustomMachineTypeOther('');
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
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                  <TouchableOpacity
                    disabled={isCreatingMachine}
                    onPress={() => {
                      setCustomMachineType(
                        customMachineType === '__other__' ? '' : '__other__'
                      );
                    }}
                    activeOpacity={0.7}
                    style={[
                      styles.customEntryChip,
                      customMachineType === '__other__' && styles.customEntryChipSelected,
                    ]}
                  >
                    <Text
                      variant="captionSmall"
                      style={[
                        styles.customEntryChipText,
                        customMachineType === '__other__' && styles.customEntryChipTextSelected,
                      ]}
                    >
                      Other
                    </Text>
                  </TouchableOpacity>
                </View>

                {customMachineType === '__other__' && (
                  <TextInput
                    style={styles.customMachineInput}
                    placeholder="Enter custom type"
                    placeholderTextColor={theme.colors.text.tertiary}
                    value={customMachineTypeOther}
                    onChangeText={setCustomMachineTypeOther}
                    editable={!isCreatingMachine}
                  />
                )}

                <Text variant="captionSmall" style={styles.customEntryFieldLabel}>
                  Description
                  <Text variant="captionSmall" style={styles.customEntryOptionalHint}>
                    {'  (optional)'}
                  </Text>
                </Text>
                <TextInput
                  style={[styles.customMachineInput, styles.customEntryDescriptionInput]}
                  placeholder="Add a short description"
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={customMachineDescription}
                  onChangeText={setCustomMachineDescription}
                  editable={!isCreatingMachine}
                  multiline
                  numberOfLines={3}
                />
              </ScrollView>

              <View style={styles.modalActions}>
                <CustomButton
                  title="Cancel"
                  onPress={closeCustomMachineModal}
                  variant="outline"
                  size="md"
                  style={styles.modalCancelButton}
                />
                <CustomButton
                  title="Add"
                  onPress={handleAddCustomMachine}
                  variant="gradient"
                  size="md"
                  loading={isCreatingMachine}
                  disabled={
                    isCreatingMachine ||
                    !customMachineName.trim() ||
                    (customMachineType === '__other__' && !customMachineTypeOther.trim())
                  }
                  gradientColors={[
                    theme.colors.primary[400],
                    theme.colors.primary.DEFAULT,
                  ]}
                  gradientStart={{ x: 0, y: 0 }}
                  gradientEnd={{ x: 1, y: 1 }}
                  style={styles.addMachineButton}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {businessAddressMapSeed && (
        <StructuredAddressFormModal
          visible={showBusinessAddressModal}
          title="Business address"
          onDismiss={closeBusinessAddressModal}
          mapData={businessAddressMapSeed}
          existingLocation={null}
          coordinatesOverride={LOCATION_FALLBACK_COORDINATES}
          showNameField={false}
          onSubmit={handleBusinessStructuredAddressSubmit}
          submitLabel="Save address"
        />
      )}

      <GorhomBottomSheetModal
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
      </GorhomBottomSheetModal>

      <GorhomBottomSheetModal
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
      </GorhomBottomSheetModal>

      <GorhomBottomSheetModal
        ref={preferredBrandsSheetRef}
        doneFooter
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
      </GorhomBottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};

export default MachineDealerRegistrationScreen;
