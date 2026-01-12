import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Controller } from 'react-hook-form';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { AddressSearchBar } from '@shared/location/components';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { useForm, FormInput, validationRules } from '@shared/forms';
import { PlaceDetails } from '@shared/location/types';
import { useCompleteMachineDealerProfile } from '@services/api';
import type { CompleteMachineDealerProfileRequest } from '@services/api';
import type { UpdateProfileResponse } from '@services/api';
import { useAppDispatch } from '@store/hooks';
import { showToast } from '@store/slices/uiSlice';
import { getFirstRegistrationScreen } from '@navigation/helpers';
import { ROLES } from '@utils/constants';
import {
  MachineDealerRegistrationScreenNavigationProp,
  MachineDealerRegistrationFormData,
  SelectedLocation,
} from './@types';
import { createStyles } from './styles';
import { SCREENS } from '@navigation/constants';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';

const MachineDealerRegistrationScreen = () => {
  const navigation = useNavigation<MachineDealerRegistrationScreenNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'MachineDealerRegistration'>>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const dispatch = useAppDispatch();

  const { profileData } = route.params || {};
  const { mutate: completeProfileMutation, isPending } = useCompleteMachineDealerProfile();

  const { control, handleSubmit, setValue, watch } = useForm<MachineDealerRegistrationFormData>({
    defaultValues: {
      contactPersonName: '',
      email: '',
      businessAddress: '',
      businessDescription: '',
    },
    mode: 'onBlur',
  });

  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);

  const handlePlaceSelect = useCallback(
    (placeDetails: PlaceDetails) => {
      const addressString = placeDetails.address?.formattedAddress || placeDetails.name || '';
      setSelectedLocation({
        placeDetails,
        addressString,
      });
      setValue('businessAddress', addressString);
    },
    [setValue]
  );

  const handleCurrentLocationPress = useCallback(() => {
    // TODO: Implement current location functionality
  }, []);

  const onSubmit = (data: MachineDealerRegistrationFormData) => {
    if (!profileData) {
      Alert.alert('Error', 'Profile data is missing. Please go back and try again.');
      return;
    }

    // if (!selectedLocation?.placeDetails) {
    //   Alert.alert('Error', 'Please select a business location.');
    //   return;
    // }

    const requestData: CompleteMachineDealerProfileRequest = {
      company_name: profileData.company_name || '',
      gst: profileData.gst_in || undefined,
      contact_person_name: data.contactPersonName.trim(),
      mobile: profileData.mobile || '',
      email: data.email.trim() || undefined,
      city: profileData.city || '',
      location: data.businessAddress.trim() || selectedLocation?.addressString || '',
      latitude: selectedLocation?.placeDetails?.latitude || 0,
      longitude: selectedLocation?.placeDetails?.longitude || 0,
    };

    completeProfileMutation(requestData, {
      onSuccess: response => {
        dispatch(
          showToast({
            message: response.message || 'Registration completed successfully!',
            type: 'success',
          }),
        );

        const updatedProfileData: UpdateProfileResponse = {
          ...profileData,
          ...response,
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
          const firstSecondaryScreen = getFirstRegistrationScreen(secondaryRole);

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
      onError: (err: any) => {
        const isSecondaryRoleCompletion =
          profileData?.secondary_role === ROLES.MACHINE_DEALER;

        if (isSecondaryRoleCompletion) {
          navigation.navigate(SCREENS.AUTH.VERIFICATION_STATUS, {
            profileData: profileData,
          });
        } else if (
          profileData.has_secondary_role === 1 &&
          profileData.secondary_role
        ) {
          const secondaryRole =
            profileData.secondary_role as (typeof ROLES)[keyof typeof ROLES];
          const firstSecondaryScreen = getFirstRegistrationScreen(secondaryRole);

          if (
            firstSecondaryScreen &&
            firstSecondaryScreen !== SCREENS.AUTH.VERIFICATION_STATUS
          ) {
            (navigation.navigate as any)(firstSecondaryScreen, {
              profileData: profileData,
            });
          } else {
            navigation.navigate(SCREENS.AUTH.VERIFICATION_STATUS, {
              profileData: profileData,
            });
          }
        } else {
          navigation.navigate(SCREENS.AUTH.VERIFICATION_STATUS, {
            profileData: profileData,
          });
        }

        console.error('[MachineDealerRegistration] API error:', err);

        let errorMessage = 'Failed to complete registration. Please try again.';

        if (err?.message) {
          errorMessage = err.message;
        } else if (typeof err === 'string') {
          errorMessage = err;
        } else if (err?.response?.data?.error?.message) {
          errorMessage = err.response.data.error.message;
        } else if (err?.response?.data?.message) {
          errorMessage = err.response.data.message;
        }

        dispatch(
          showToast({
            message: errorMessage,
            type: 'error',
          }),
        );
      },
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScreenWrapper
        scrollable
        backgroundColor={theme.colors.background.secondary}
        safeAreaEdges={[]}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>
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
                <AppIcon.Location width={20} height={20} color={theme.colors.primary.DEFAULT} />
              </View>
              <Text variant="h4" fontWeight="semibold" style={styles.sectionTitle}>
                Business Location
              </Text>
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                  Business Address
                </Text>
              </View>
              <Controller
                control={control}
                name="businessAddress"
                render={({ field: { value }, fieldState: { error } }) => (
                  <>
                    <View style={styles.addressContainer}>
                      <AddressSearchBar
                        placeholder="Search address or pincode"
                        onPlaceSelect={handlePlaceSelect}
                        onCurrentLocationPress={handleCurrentLocationPress}
                        showCurrentLocationButton={true}
                      />
                    </View>
                    {selectedLocation && (
                      <View style={styles.addressPreview}>
                        <Text variant="bodySmall" style={styles.addressPreviewText}>
                          {selectedLocation.addressString}
                        </Text>
                      </View>
                    )}
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
            style={[styles.button, isPending && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.8}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator size="small" color={theme.colors.text.inverse} />
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
    </View>
  );
};

export default MachineDealerRegistrationScreen;
