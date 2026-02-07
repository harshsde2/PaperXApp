import React, { useState, useLayoutEffect, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import {
  ManageWarehousesScreenNavigationProp,
  WarehouseLocation,
} from './@types';
import { createStyles } from './styles';
import { SCREENS } from '@navigation/constants';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';
import { useCompleteDealerProfile } from '@services/api';
import type {
  CompleteDealerProfileRequest,
  AgentType,
  Location as APILocation,
} from '@services/api';
import { useAppDispatch } from '@store/hooks';
import { showToast } from '@store/slices/uiSlice';
import type { UpdateProfileResponse } from '@services/api';
import { getFirstRegistrationScreen } from '@navigation/helpers';
import { ROLES } from '@utils/constants';

// Location module imports
import {
  LocationPicker,
  Location,
  MarkerData,
  ZOOM_LEVELS,
} from '@shared/location';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ManageWarehousesScreen = () => {
  const navigation = useNavigation<ManageWarehousesScreenNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'ManageWarehouses'>>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const dispatch = useAppDispatch();

  const { dealerRegistrationData } = route.params || {};

  const [noWarehouse, setNoWarehouse] = useState(false);
  const [locations, setLocations] = useState<WarehouseLocation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [editingLocation, setEditingLocation] =
    useState<WarehouseLocation | null>(null);
  const [expandedLocationIds, setExpandedLocationIds] = useState<string[]>([]);

  const activeLocationsCount = locations.length;

  const { mutate: completeProfileMutation, isPending } =
    useCompleteDealerProfile();

  console.log(
    '[ManageWarehouses] dealerRegistrationData data:',
    JSON.stringify(dealerRegistrationData, null, 2),
  );

  // Generate unique ID for new locations
  const generateId = () =>
    `loc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const transformDataForAPI = (): CompleteDealerProfileRequest | null => {
    if (!dealerRegistrationData) {
      setError('Registration data is missing. Please go back and try again.');
      return null;
    }

    try {
      // Materials are already in the correct format from MaterialsScreen
      const materials = (dealerRegistrationData.materials || []).map((material: any) => {
        return {
          material_id: Number(material.material_id),
          brand_id: material.brand_id !== null && material.brand_id !== undefined ? Number(material.brand_id) : null,
          agent_type: material.agent_type as AgentType | null,
          finish_ids: (material.finish_ids || []).map((id: any) => Number(id)),
          thickness_ranges: (material.thickness_ranges || []).map((range: any) => ({
            unit: range.unit as 'GSM' | 'MM' | 'MICRON',
            min: Number(range.min),
            max: Number(range.max),
          })),
        };
      });

      const apiLocations: APILocation[] = noWarehouse
        ? []
        : locations.map(loc => ({
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
      const errorMsg =
        'Please add at least one warehouse location or select "No warehouse" option.';
      setError(errorMsg);
      dispatch(
        showToast({
          message: errorMsg,
          type: 'error',
        }),
      );
      return;
    }

    const requestData = transformDataForAPI();

    if (!requestData) {
      return;
    }

    if (!requestData.materials || requestData.materials.length === 0) {
      setError(
        'Materials information is missing. Please go back and select materials.',
      );
      dispatch(
        showToast({
          message:
            'Materials information is missing. Please go back and select materials.',
          type: 'error',
        }),
      );
      return;
    }

    if (
      !noWarehouse &&
      (!requestData.locations || requestData.locations.length === 0)
    ) {
      const errorMsg =
        'At least one warehouse location is required when warehouse is enabled.';
      setError(errorMsg);
      dispatch(
        showToast({
          message: errorMsg,
          type: 'error',
        }),
      );
      return;
    }

    const finalData = {
      ...requestData,
      'machines_available.0': [1, 2, 3],
      capacity_daily: 1000.5,
      capacity_monthly: 30000.0,
      capacity_unit: 'kg',
    };

    console.log(
      '[ManageWarehouses] Request data:',
      JSON.stringify(finalData, null, 2),
    );
    
    completeProfileMutation(finalData, {
      onSuccess: response => {
        dispatch(
          showToast({
            message: response.message || 'Registration completed successfully!',
            type: 'success',
          }),
        );

        // For navigation, we still need profileData if it exists, otherwise use response
        const profileData = dealerRegistrationData?.profileData;
        const updatedProfileData: UpdateProfileResponse = {
          ...(profileData || {}),
          ...response, // Merge API response to get latest profile data
        };

        const isSecondaryRoleCompletion =
          dealerRegistrationData?.profileData?.secondary_role === ROLES.DEALER;

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
      onError: (err: any) => {
        
        console.error('[ManageWarehouses] API error:', err.response);

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
          }),
        );
      },
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Manage Warehouses',
    });
  }, [navigation]);

  // Handle location selection from LocationPicker
  const handleLocationSelect = useCallback(
    (location: Location) => {
      const warehouseLocation: WarehouseLocation = {
        id: editingLocation?.id || generateId(),
        name: location.name || `Warehouse ${locations.length + 1}`,
        address:
          location.address?.streetAddress ||
          location.address?.formattedAddress ||
          '',
        city: location.address?.city || '',
        state: location.address?.state || '',
        zipCode: location.address?.pincode || '',
        isPrimary: editingLocation?.isPrimary || locations.length === 0,
        latitude: location.latitude,
        longitude: location.longitude,
      };

      setLocations(prev => {
        const exists = prev.find(loc => loc.id === warehouseLocation.id);

        if (exists) {
          // Update existing location
          return prev.map(loc =>
            loc.id === warehouseLocation.id ? warehouseLocation : loc,
          );
        }

        // Add new location
        return [...prev, warehouseLocation];
      });

      // Ensure the newly added/updated location is expanded
      setExpandedLocationIds(prev => {
        if (prev.includes(warehouseLocation.id)) {
          return prev;
        }
        return [...prev, warehouseLocation.id];
      });

      setShowLocationPicker(false);
      setEditingLocation(null);

      dispatch(
        showToast({
          message: editingLocation
            ? 'Location updated successfully!'
            : 'Location added successfully!',
          type: 'success',
        }),
      );
    },
    [editingLocation, locations.length, dispatch],
  );

  const handleEdit = useCallback((location: WarehouseLocation) => {
    setEditingLocation(location);
    setShowLocationPicker(true);
  }, []);

  const handleRemove = useCallback(
    (locationId: string) => {
      Alert.alert(
        'Remove Location',
        'Are you sure you want to remove this warehouse location?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => {
              setLocations(prev => prev.filter(loc => loc.id !== locationId));
              setExpandedLocationIds(prev =>
                prev.filter(id => id !== locationId),
              );
              dispatch(
                showToast({
                  message: 'Location removed',
                  type: 'success',
                }),
              );
            },
          },
        ],
      );
    },
    [dispatch],
  );

  const handleAddLocation = useCallback(() => {
    setEditingLocation(null);
    setShowLocationPicker(true);
  }, []);

  const handleSearchAddress = useCallback(() => {
    setEditingLocation(null);
    setShowLocationPicker(true);
  }, []);

  const handleSetPrimary = useCallback((locationId: string) => {
    setLocations(prev =>
      prev.map(loc => ({
        ...loc,
        isPrimary: loc.id === locationId,
      })),
    );
  }, []);

  const toggleLocationExpanded = useCallback((locationId: string) => {
    setExpandedLocationIds(prev =>
      prev.includes(locationId)
        ? prev.filter(id => id !== locationId)
        : [...prev, locationId],
    );
  }, []);

  // Convert locations to markers for overview map
  const getMarkersFromLocations = (): MarkerData[] => {
    return locations.map(loc => ({
      id: loc.id,
      latitude: loc.latitude,
      longitude: loc.longitude,
      title: loc.name,
      description: `${loc.address}, ${loc.city}`,
      isPrimary: loc.isPrimary,
    }));
  };

  return (
    <>
      <ScreenWrapper
        scrollable
        backgroundColor={theme.colors.background.secondary}
        safeAreaEdges={[]}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>
          {/* No Warehouse Option */}
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
                <Text
                  variant="h6"
                  fontWeight="bold"
                  style={styles.noWarehouseTitle}
                >
                  No warehouse (bulk orders only)
                </Text>
                <Text
                  variant="captionMedium"
                  style={styles.noWarehouseDescription}
                >
                  Enable this if you ship directly from manufacturers or don't
                  hold inventory.
                </Text>
              </View>
            </TouchableOpacity>
          </Card>

          {/* Locations Header */}
          <View style={styles.locationsHeader}>
            <View style={styles.locationsHeaderLeft}>
              <Text
                variant="h5"
                fontWeight="bold"
                style={styles.locationsTitle}
              >
                Your Warehouses
              </Text>
              <Text variant="captionMedium" style={styles.locationsSubtitle}>
                Add, edit and set your primary dispatch locations
              </Text>
            </View>
            <View style={styles.locationsBadge}>
              <Text
                variant="captionSmall"
                fontWeight="semibold"
                style={styles.locationsBadgeText}
              >
                {activeLocationsCount} Active
              </Text>
            </View>
          </View>

          {/* Location Cards with Maps */}
          {locations.map(location => {
            const isExpanded = expandedLocationIds.includes(location.id);

            return (
              <Card
                key={location.id}
                style={[
                  styles.locationCard,
                  location.isPrimary && styles.locationCardPrimary,
                ]}
              >
                {/* Header Row */}
                <TouchableOpacity
                  style={styles.locationHeaderRow}
                  activeOpacity={0.8}
                  onPress={() => toggleLocationExpanded(location.id)}
                >
                  <View style={styles.locationHeaderText}>
                    <View style={styles.locationTitleRow}>
                      <Text
                        variant="h6"
                        fontWeight="semibold"
                        style={styles.locationName}
                        numberOfLines={1}
                      >
                        {location.name}
                      </Text>
                      {location.isPrimary && (
                        <View style={styles.primaryBadge}>
                          <Text
                            variant="captionSmall"
                            fontWeight="semibold"
                            style={styles.primaryBadgeText}
                          >
                            PRIMARY
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text
                      variant="bodySmall"
                      style={styles.locationSummary}
                      numberOfLines={1}
                    >
                      {location.city}, {location.state} {location.zipCode}
                    </Text>
                  </View>
                  <AppIcon.ChevronDown
                    width={18}
                    height={18}
                    color={theme.colors.text.secondary}
                    style={[
                      styles.chevronIcon,
                      isExpanded && styles.chevronIconExpanded,
                    ]}
                  />
                </TouchableOpacity>

                {/* Expanded Content */}
                {isExpanded && (
                  <>
                    <Text variant="bodySmall" style={styles.locationAddress}>
                      {location.address}
                    </Text>

                    {/* Action Buttons */}
                    <View style={styles.locationActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleEdit(location)}
                        activeOpacity={0.7}
                      >
                        <AppIcon.Edit
                          width={18}
                          height={18}
                          color={theme.colors.primary.DEFAULT}
                        />
                        <Text
                          variant="bodySmall"
                          style={[
                            styles.actionButtonText,
                            { color: theme.colors.primary.DEFAULT },
                          ]}
                        >
                          Edit
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleRemove(location.id)}
                        activeOpacity={0.7}
                      >
                        <AppIcon.Delete
                          width={18}
                          height={18}
                          color={theme.colors.error.DEFAULT}
                        />
                        <Text
                          variant="bodySmall"
                          style={[
                            styles.actionButtonText,
                            { color: theme.colors.error.DEFAULT },
                          ]}
                        >
                          Remove
                        </Text>
                      </TouchableOpacity>
                      {!location.isPrimary && (
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleSetPrimary(location.id)}
                          activeOpacity={0.7}
                        >
                          <AppIcon.Location
                            width={18}
                            height={18}
                            color={theme.colors.text.secondary}
                          />
                          <Text
                            variant="bodySmall"
                            style={styles.actionButtonText}
                          >
                            Set Primary
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* Larger Map View */}
                    <View style={styles.mapContainer}>
                      <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.miniMap}
                        initialRegion={{
                          latitude: location.latitude,
                          longitude: location.longitude,
                          ...ZOOM_LEVELS.STREET,
                        }}
                        scrollEnabled={false}
                        zoomEnabled={false}
                        rotateEnabled={false}
                        pitchEnabled={false}
                      >
                        <Marker
                          coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                          }}
                          pinColor={
                            location.isPrimary
                              ? theme.colors.primary.DEFAULT
                              : theme.colors.error.DEFAULT
                          }
                        />
                      </MapView>
                    </View>
                  </>
                )}
              </Card>
            );
          })}

          {/* Empty State */}
          {locations.length === 0 && !noWarehouse && (
            <Card style={styles.emptyStateCard}>
              <AppIcon.Location
                width={56}
                height={56}
                color={theme.colors.text.tertiary}
              />
              <Text
                variant="h6"
                fontWeight="bold"
                style={styles.emptyStateTitle}
              >
                Add your first warehouse
              </Text>
              <Text variant="bodyMedium" style={styles.emptyStateDescription}>
                Save the locations you dispatch from most often so buyers see
                accurate delivery options.
              </Text>
            </Card>
          )}

          {/* Add Location Card */}
          {!noWarehouse && (
            <TouchableOpacity
              style={styles.addLocationCard}
              onPress={handleAddLocation}
              activeOpacity={0.7}
            >
              <View style={styles.addLocationContent}>
                <View style={styles.addLocationIcon}>
                  <Text style={styles.addLocationIconText}>+</Text>
                </View>
                <Text
                  variant="bodyMedium"
                  fontWeight="semibold"
                  style={styles.addLocationTitle}
                >
                  Add New Location
                </Text>
                <Text
                  variant="captionMedium"
                  style={styles.addLocationDescription}
                >
                  Search address or drop a pin on the map
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScreenWrapper>
      {/* Footer */}
      <View style={styles.footer}>
        {!noWarehouse && (
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleSearchAddress}
            activeOpacity={0.8}
          >
            <AppIcon.Search
              width={20}
              height={20}
              color={theme.colors.primary.DEFAULT}
            />
            <Text variant="buttonMedium" style={styles.secondaryButtonText}>
              SEARCH ADDRESS
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.primaryButton,
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
              <Text variant="buttonMedium" style={styles.primaryButtonText}>
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

      {/* Location Picker Modal */}
      <Modal
        visible={showLocationPicker}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => {
          setShowLocationPicker(false);
          setEditingLocation(null);
        }}
      >
        <LocationPicker
          initialLocation={
            editingLocation
              ? {
                  latitude: editingLocation.latitude,
                  longitude: editingLocation.longitude,
                  name: editingLocation.name,
                  address: {
                    formattedAddress: `${editingLocation.address}, ${editingLocation.city}, ${editingLocation.state} ${editingLocation.zipCode}`,
                    streetAddress: editingLocation.address,
                    city: editingLocation.city,
                    state: editingLocation.state,
                    pincode: editingLocation.zipCode,
                  },
                }
              : undefined
          }
          existingMarkers={getMarkersFromLocations()}
          onLocationSelect={handleLocationSelect}
          onCancel={() => {
            setShowLocationPicker(false);
            setEditingLocation(null);
          }}
          showExistingMarkers={true}
          allowMapTap={true}
          confirmButtonText={
            editingLocation ? 'Update Location' : 'Add Location'
          }
          title={
            editingLocation
              ? 'Edit Warehouse Location'
              : 'Add Warehouse Location'
          }
        />
      </Modal>
    </>
  );
};

export default ManageWarehousesScreen;
