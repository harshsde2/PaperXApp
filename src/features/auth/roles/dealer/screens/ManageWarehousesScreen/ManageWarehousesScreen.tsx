import React, { useState, useLayoutEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
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

// Mock data - in a real app, this would come from state/API
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
  
  // Get profileData from route params
  const { profileData } = route.params || {};
  
  const [noWarehouse, setNoWarehouse] = useState(false);
  const [locations, setLocations] = useState<WarehouseLocation[]>(MOCK_LOCATIONS);

  const activeLocationsCount = locations.length;

  const handleSave = () => {
    // TODO: Save warehouse settings to API/state
    // This is the last screen in dealer registration flow
    // Navigate to VerificationStatus with profileData
    navigation.navigate(SCREENS.AUTH.VERIFICATION_STATUS, { profileData });
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
        {/* No Warehouse Section */}
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

        {/* Your Locations Section */}
        <View style={styles.locationsHeader}>
          <Text variant="h5" fontWeight="bold" style={styles.locationsTitle}>
            Your Locations
          </Text>
          <Text variant="captionMedium"   style={styles.locationsCount}>
            {activeLocationsCount} Active
          </Text>
        </View>

        {/* Location Cards */}
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

            {/* Map Placeholder */}
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

        {/* Add New Location Card */}
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

      {/* Footer Buttons */}
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
          style={[styles.searchButton, { marginTop: 12, backgroundColor: theme.colors.primary.DEFAULT }]}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text variant="buttonMedium" style={styles.searchButtonText}>
            Complete Registration
          </Text>
          <AppIcon.ArrowRight
            width={20}
            height={20}
            color={theme.colors.text.inverse}
          />
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default ManageWarehousesScreen;

