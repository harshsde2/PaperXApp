import React, { useState, useLayoutEffect } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { ManageWarehousesScreenNavigationProp, WarehouseLocation } from './@types';
import { createStyles } from './styles';
import { SCREENS } from '@navigation/constants';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';
import { useCompleteDealerProfile } from '@services/api';
import type { CompleteDealerProfileRequest, AgentType, Location } from '@services/api';
import { useAppDispatch } from '@store/hooks';
import { showToast } from '@store/slices/uiSlice';
import type { UpdateProfileResponse } from '@services/api';

const MOCK_LOCATIONS: WarehouseLocation[] = [
  {
    id: '1',
    name: 'Chicago Hub',
    address: '123 Industrial Pkwy',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60614',
    isPrimary: true,
    latitude: 41.8781,
    longitude: -87.6298,
  },
  {
    id: '2',
    name: 'West Coast Depot',
    address: '456 Logistics Lane',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    isPrimary: false,
    latitude: 34.0522,
    longitude: -118.2437,
  },
];

const ManageWarehousesScreen = () => {
  const navigation = useNavigation<ManageWarehousesScreenNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'ManageWarehouses'>>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const dispatch = useAppDispatch();
  
  const { profileData } = route.params || {};
  
  const [noWarehouse, setNoWarehouse] = useState(false);
  const [locations, setLocations] = useState<WarehouseLocation[]>(MOCK_LOCATIONS);
  const [error, setError] = useState<string | null>(null);

  const activeLocationsCount = locations.length;

  const { mutate: completeProfileMutation, isPending } = useCompleteDealerProfile();



  const transformDataForAPI = (): CompleteDealerProfileRequest | null => {
    if (!profileData) {
      setError('Profile data is missing. Please go back and try again.');
      return null;
    }

    try {
      const materials = (profileData.materials || []).map((material: any) => {
        const relationship = profileData.mill_brand_details?.relationship || 'independent-dealer';
        const agentType: AgentType =
          relationship === 'authorized-agent' ? 'AUTHORIZED_AGENT' : 'INDEPENDENT_DEALER';

        const brandId = profileData.mill_brand_details?.mill_brand_id || 1;
        const finishIds = profileData.material_specs?.finish_ids || [];

        const thicknessRanges = profileData.thickness
          ? [
              {
                unit: profileData.thickness.unit as 'GSM' | 'MM' | 'MICRON',
                min: profileData.thickness.min,
                max: profileData.thickness.max,
              },
            ]
          : [];

        return {
          material_id: Number(material.material_id),
          brand_id: Number(brandId),
          agent_type: agentType,
          finish_ids: finishIds.map((id: any) => Number(id)),
          thickness_ranges: thicknessRanges,
        };
      });

      const apiLocations: Location[] = noWarehouse
        ? []
        : locations.map((loc) => ({
            type: 'warehouse' as const,
            address: loc.address,
            latitude: loc.latitude,
            longitude: loc.longitude,
            city: loc.city,
            state: loc.state,
            pincode: loc.zipCode,
          }));

      const requestData: CompleteDealerProfileRequest = {
        materials,
        has_warehouse: !noWarehouse,
        locations: apiLocations,
      };

      return requestData;
    } catch (err) {
      console.error('[ManageWarehouses] Error transforming data:', err);
      setError('Failed to prepare registration data. Please try again.');
      return null;
    }
  };

  const handleSave = () => {
    setError(null);

    if (!noWarehouse && locations.length === 0) {
      const errorMsg = 'Please add at least one warehouse location or select "No warehouse" option.';
      setError(errorMsg);
      dispatch(
        showToast({
          message: errorMsg,
          type: 'error',
        })
      );
      return;
    }

    const requestData = transformDataForAPI();
    if (!requestData) {
      return;
    }

    if (!requestData.materials || requestData.materials.length === 0) {
      setError('Materials information is missing. Please go back and select materials.');
      dispatch(
        showToast({
          message: 'Materials information is missing. Please go back and select materials.',
          type: 'error',
        })
      );
      return;
    }

    if (!noWarehouse && (!requestData.locations || requestData.locations.length === 0)) {
      const errorMsg = 'At least one warehouse location is required when warehouse is enabled.';
      setError(errorMsg);
      dispatch(
        showToast({
          message: errorMsg,
          type: 'error',
        })
      );
      return;
    }

    console.log('[ManageWarehouses] Request data:', JSON.stringify(requestData, null, 2));
    completeProfileMutation(requestData, {
      onSuccess: (response) => {
        // console.log('[ManageWarehouses] Profile completion success:', response);

        dispatch(
          showToast({
            message: response.message || 'Registration completed successfully!',
            type: 'success',
          })
        );

        const updatedProfileData: UpdateProfileResponse = {
          ...profileData,
        };

        navigation.navigate(SCREENS.AUTH.VERIFICATION_STATUS, {
          profileData: updatedProfileData,
        });
      },
      onError: (err: any) => {

        navigation.navigate(SCREENS.AUTH.VERIFICATION_STATUS, {
          profileData: profileData,
        });
        console.error('[ManageWarehouses] API error:', (err.response));

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

        setError(errorMessage);

        dispatch(
          showToast({
            message: errorMessage,
            type: 'error',
          })
        );
      },
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Manage Warehouses',
    });
  }, [navigation]);

  const handleEdit = (locationId: string) => {
    // TODO: Navigate to edit location screen
    console.log('Edit location:', locationId);
  };

  const handleRemove = (locationId: string) => {
    // TODO: Show confirmation and remove location
    setLocations(locations.filter(loc => loc.id !== locationId));
  };

  const handleAddLocation = () => {
    // TODO: Navigate to add location screen
    console.log('Add new location');
  };

  const handleSearchAddress = () => {
    // TODO: Navigate to address search screen
    console.log('Search address');
  };

  return (
    <ScreenWrapper
      scrollable
      backgroundColor={theme.colors.background.secondary}
      safeAreaEdges={[]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        <Card style={styles.noWarehouseCard}>
          <TouchableOpacity
            style={styles.noWarehouseContent}
            onPress={() => setNoWarehouse(!noWarehouse)}
            activeOpacity={0.7}
          >
            <View style={styles.checkboxContainer}>
              {noWarehouse ? (
                <AppIcon.TickCheckedBox
                  width={24}
                  height={24}
                  color={theme.colors.primary.DEFAULT}
                />
              ) : (
                <AppIcon.UntickCheckedBox
                  width={24}
                  height={24}
                  color={theme.colors.border.primary}
                />
              )}
            </View>
            <View style={styles.noWarehouseTextContainer}>
              <Text variant="h6" fontWeight="bold" style={styles.noWarehouseTitle}>
                No warehouse (bulk orders only)
              </Text>
              <Text variant="captionMedium" style={styles.noWarehouseDescription}>
                Enable this if you ship directly from manufacturers or don't hold inventory.
              </Text>
            </View>
          </TouchableOpacity>
        </Card>

        <View style={styles.locationsHeader}>
          <Text variant="h5" fontWeight="bold" style={styles.locationsTitle}>
            Your Locations
          </Text>
          <Text variant="captionMedium"   style={styles.locationsCount}>
            {activeLocationsCount} Active
          </Text>
        </View>

        {locations.map((location) => (
          <Card key={location.id} style={styles.locationCard}>
            {location.isPrimary && (
              <View style={styles.primaryBadge}>
                <Text variant="captionSmall" fontWeight="semibold" style={styles.primaryBadgeText}>
                  PRIMARY
                </Text>
              </View>
            )}
            <Text variant="h6" fontWeight="semibold" style={styles.locationName}>
              {location.name}
            </Text>
            <Text variant="bodySmall" style={styles.locationAddress}>
              {location.address}
            </Text>
            <Text variant="bodySmall" style={styles.locationCity}>
              {location.city}, {location.state} {location.zipCode}
            </Text>

            <View style={styles.locationActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEdit(location.id)}
                activeOpacity={0.7}
              >
                <AppIcon.Edit
                  width={15}
                  height={15}
                  color={theme.colors.text.inverse}
                />
                <Text variant="bodySmall" style={styles.actionButtonText}>
                  Edit
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleRemove(location.id)}
                activeOpacity={0.7}
              >
                <AppIcon.Delete
                  width={17}
                  height={17}
                  color={theme.colors.text.inverse}
                />
                <Text variant="bodySmall" style={styles.actionButtonText}>
                  Remove
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.mapContainer}>
              <View style={styles.mapPlaceholder}>
                <AppIcon.Location
                  width={24}
                  height={24}
                  color={location.isPrimary ? theme.colors.primary.DEFAULT : theme.colors.error.DEFAULT}
                />
                <Text variant="captionSmall" style={styles.mapPlaceholderText}>
                  Map view
                </Text>
              </View>
            </View>
          </Card>
        ))}

        <TouchableOpacity
          style={styles.addLocationCard}
          onPress={handleAddLocation}
          activeOpacity={0.7}
        >
          <View style={styles.addLocationContent}>
            <View style={styles.addLocationIcon}>
              <Text style={styles.addLocationIconText}>+</Text>
            </View>
            <Text variant="bodyMedium" fontWeight="semibold" style={styles.addLocationTitle}>
              Add New Location
            </Text>
            <Text variant="captionMedium" style={styles.addLocationDescription}>
              Search address or drop a pin
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearchAddress}
          activeOpacity={0.8}
        >
          <AppIcon.Search
            width={20}
            height={20}
            color={theme.colors.text.inverse}
          />
          <Text variant="buttonMedium" style={styles.searchButtonText}>
            SEARCH ADDRESS
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.searchButton,
            {
              marginTop: 12,
              backgroundColor: isPending
                ? theme.colors.primary.light
                : theme.colors.primary.DEFAULT,
            },
          ]}
          onPress={handleSave}
          activeOpacity={0.8}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator size="small" color={theme.colors.text.inverse} />
          ) : (
            <>
              <Text variant="buttonMedium" style={styles.searchButtonText}>
                Complete Registration
              </Text>
              <AppIcon.ArrowRight
                width={20}
                height={20}
                color={theme.colors.text.inverse}
              />
            </>
          )}
        </TouchableOpacity>

        {error && (
          <View style={styles.errorContainer}>
            <Text variant="bodySmall" style={styles.errorText}>
              {error}
            </Text>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default ManageWarehousesScreen;

