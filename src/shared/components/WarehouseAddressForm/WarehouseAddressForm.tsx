import React, { useCallback, useRef, useState, useEffect } from 'react';
import { View, Alert, InteractionManager, ScrollView, Platform } from 'react-native';
import { Controller } from 'react-hook-form';
import { State, City, ICity } from 'country-state-city';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { GorhomBottomSheetModal } from '@shared/components/GorhomBottomSheetModal';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { FormInput } from '@shared/forms';
import { DropdownButton } from '@shared/components/DropdownButton';
import { StateSelectionContent } from '@shared/components/StateSelectionContent';
import { CitySelectionContent } from '@shared/components/CitySelectionContent';
import { CustomButton } from '@shared/components/CustomButton';
import { useTheme } from '@theme/index';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import { validatePincode } from '@shared/location';
import { useKeyboard } from '@shared/hooks';
import type { WarehouseFormData, WarehouseAddressFormProps } from './@types';
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
    CITIES_CACHE[stateIsoCode] = City.getCitiesOfState(
      INDIA_COUNTRY_CODE,
      stateIsoCode
    );
  }
  return CITIES_CACHE[stateIsoCode];
};

export const WarehouseAddressForm: React.FC<WarehouseAddressFormProps> = ({
  mapData,
  existingLocation,
  coordinatesOverride,
  showNameField = true,
  onSubmit,
  onCancel,
  submitLabel = 'Add Location',
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { keyboardHeight } = useKeyboard();
  const styles = createStyles(theme);
  const stateSheetRef = useRef<BottomSheetModal>(null);
  const citySheetRef = useRef<BottomSheetModal>(null);
  const [stateSearchQuery, setStateSearchQuery] = useState('');

  const defaultValues: WarehouseFormData = {
    name: existingLocation?.name || '',
    flatHouseNo: '',
    streetLandmark: mapData.address || '',
    locality: '',
    state: mapData.state || '',
    city: mapData.city || '',
    pincode: mapData.pincode || '',
  };

  const { control, handleSubmit, setValue, watch } = useForm<WarehouseFormData>({
    defaultValues,
    mode: 'onBlur',
  });

  const selectedState = watch('state');
  const selectedCity = watch('city');
  const selectedStateIso = STATE_NAME_TO_ISO[selectedState] || '';

  useEffect(() => {
    setValue('streetLandmark', mapData.address || '');
    setValue('state', mapData.state || '');
    setValue('city', mapData.city || '');
    setValue('pincode', mapData.pincode || '');
  }, [mapData, setValue]);

  const handleStateSelect = useCallback(
    (stateName: string) => {
      stateSheetRef.current?.dismiss();
      InteractionManager.runAfterInteractions(() => {
        setValue('state', stateName);
        setValue('city', '');
        setStateSearchQuery('');
      });
    },
    [setValue]
  );

  const handleCitySelect = useCallback(
    (cityName: string) => {
      citySheetRef.current?.dismiss();
      InteractionManager.runAfterInteractions(() => {
        setValue('city', cityName);
      });
    },
    [setValue]
  );

  const openStateSelector = useCallback(() => {
    setStateSearchQuery('');
    stateSheetRef.current?.present();
  }, []);

  const openCitySelector = useCallback(() => {
    if (!selectedState) {
      Alert.alert('Select State', 'Please select a state first');
      return;
    }
    citySheetRef.current?.present();
  }, [selectedState]);

  const citiesForState = getCitiesForState(selectedStateIso);

  const onFormSubmit = useCallback(
    (data: WarehouseFormData) => {
      if (!data.pincode || !validatePincode(data.pincode)) {
        Alert.alert(
          'Invalid Pincode',
          'Please enter a valid 6-digit Indian pincode.'
        );
        return;
      }

      const coords = coordinatesOverride ?? {
        latitude: mapData.latitude,
        longitude: mapData.longitude,
      };
      onSubmit({
        ...data,
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    },
    [mapData, coordinatesOverride, onSubmit]
  );

  const scrollBottomPadding =
    theme.spacing[10] + insets.bottom + keyboardHeight;

  return (
    <BottomSheetModalProvider>
      <View style={styles.flexFill}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: scrollBottomPadding },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={
          Platform.OS === 'ios' ? 'automatic' : 'never'
        }
      >
        {showNameField && (
          <FormInput
            name="name"
            control={control}
            label="Location name"
            helperText="Optional — e.g. Main warehouse, North hub"
            placeholder="e.g. Main warehouse"
            containerStyle={styles.formGroup}
          />
        )}

        <FormInput
          name="flatHouseNo"
          control={control}
          label="Flat / House No, Building"
          placeholder="e.g. B-12, Tower A"
          containerStyle={styles.formGroup}
        />

        <FormInput
          name="streetLandmark"
          control={control}
          label="Street, Landmark"
          placeholder="Street name or nearby landmark"
          containerStyle={styles.formGroup}
        />

        <FormInput
          name="locality"
          control={control}
          label="Locality / Area"
          placeholder="e.g. Indiranagar, Sector 18"
          containerStyle={styles.formGroup}
        />

        <View style={styles.formGroup}>
          <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
            State
          </Text>
          <Controller
            control={control}
            name="state"
            rules={{ required: 'Please select state' }}
            render={({ field: { value }, fieldState: { error } }) => (
              <>
                <DropdownButton
                  value={value}
                  placeholder="Select State"
                  onPress={openStateSelector}
                />
                {error && (
                  <Text
                    variant="captionSmall"
                    style={{ color: theme.colors.error.DEFAULT, marginTop: 4 }}
                  >
                    {error.message}
                  </Text>
                )}
              </>
            )}
          />
        </View>

        <View style={styles.formGroup}>
          <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
            City
          </Text>
          <Controller
            control={control}
            name="city"
            rules={{ required: 'Please select city' }}
            render={({ field: { value }, fieldState: { error } }) => (
              <>
                <DropdownButton
                  value={value}
                  placeholder={
                    selectedState ? 'Select City' : 'Select State first'
                  }
                  onPress={openCitySelector}
                  disabled={!selectedState}
                />
                {error && (
                  <Text
                    variant="captionSmall"
                    style={{ color: theme.colors.error.DEFAULT, marginTop: 4 }}
                  >
                    {error.message}
                  </Text>
                )}
              </>
            )}
          />
        </View>

        <FormInput
          name="pincode"
          control={control}
          label="Pincode"
          placeholder="6-digit pincode"
          keyboardType="numeric"
          maxLength={6}
          rules={{
            required: 'Pincode is required',
            validate: (v) =>
              validatePincode(v || '') || 'Enter a valid 6-digit pincode',
          }}
          containerStyle={styles.formGroup}
        />

        <View style={styles.buttonRow}>
          <CustomButton
            title="Cancel"
            variant="outline"
            onPress={onCancel}
            style={styles.cancelButton}
          />
          <CustomButton
            title={submitLabel}
            variant="gradient"
            onPress={handleSubmit(onFormSubmit)}
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
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
      </View>

      <GorhomBottomSheetModal
        ref={stateSheetRef}
        snapPoints={['70%', '95%']}
        enablePanDownToClose
        onDismiss={() => setStateSearchQuery('')}
      >
        <StateSelectionContent
          searchQuery={stateSearchQuery}
          onSearchChange={setStateSearchQuery}
          selectedState={selectedState}
          onSelect={handleStateSelect}
          theme={theme}
          ListComponent={BottomSheetFlatList}
        />
      </GorhomBottomSheetModal>

      <GorhomBottomSheetModal
        ref={citySheetRef}
        snapPoints={['70%', '95%']}
        enablePanDownToClose
      >
        <CitySelectionContent
          selectedCity={selectedCity}
          selectedStateName={selectedState}
          cities={citiesForState}
          onSelect={handleCitySelect}
          theme={theme}
          ListComponent={BottomSheetFlatList}
        />
      </GorhomBottomSheetModal>
    </BottomSheetModalProvider>
  );
};
