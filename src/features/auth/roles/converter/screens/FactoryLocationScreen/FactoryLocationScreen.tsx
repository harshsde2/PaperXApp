import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { FactoryLocationScreenNavigationProp } from './@types';
import { createStyles } from './styles';
import { SCREENS } from '@navigation/constants';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';

const FactoryLocationScreen = () => {
  const navigation = useNavigation<FactoryLocationScreenNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'FactoryLocation'>>();
  const theme = useTheme();
  const styles = createStyles(theme);
  
  // Get profileData from route params
  const { profileData } = route.params || {};
  
  const [searchAddress, setSearchAddress] = useState('');
  const [streetAddress, setStreetAddress] = useState('1200 Manufacturing Blvd.');
  const [city, setCity] = useState('Chicago');
  const [state, setState] = useState('Illinois');
  const [zipCode, setZipCode] = useState('60614');
  const [country, setCountry] = useState('United States');

  const handleUseCurrentLocation = () => {
    // TODO: Implement geolocation to get current location
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleConfirmLocation = () => {
    // TODO: Save location data to API/state
    // Navigate to next screen in converter registration flow
    navigation.navigate(SCREENS.AUTH.CONFIRM_REGISTRATION, { profileData });
  };

  return (
    <ScreenWrapper
      scrollable
      backgroundColor={theme.colors.background.secondary}
      safeAreaEdges={[]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        <Text variant="h3" fontWeight="bold" style={styles.title}>
          Factory Location
        </Text>
        <Text variant="bodyMedium" style={styles.description}>
          Where is your facility located? This helps us find partners near you.
        </Text>

        {/* Search Address Section */}
        <Card style={styles.card}>
          <Text variant="h6" fontWeight="bold" style={styles.label}>
            Search Address
          </Text>
          <View style={styles.searchContainer}>
            <View style={styles.searchIconContainer}>
              <AppIcon.Search
                width={20}
                height={20}
                color={theme.colors.text.tertiary}
              />
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Enter address or zip code"
              placeholderTextColor={theme.colors.text.tertiary}
              value={searchAddress}
              onChangeText={setSearchAddress}
            />
          </View>
          <TouchableOpacity
            style={styles.currentLocationButton}
            onPress={handleUseCurrentLocation}
            activeOpacity={0.7}
          >
            <AppIcon.Location
              width={20}
              height={20}
              color={theme.colors.primary.DEFAULT}
            />
            <Text variant="bodyMedium" style={styles.currentLocationText}>
              Use Current Location
            </Text>
          </TouchableOpacity>
        </Card>

        {/* Map Placeholder */}
        <Card style={styles.mapCard}>
          <View style={styles.mapContainer}>
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapPlaceholderText}>300 300</Text>
            </View>
            <View style={styles.mapPin}>
              <View style={styles.mapPinDot} />
            </View>
            <View style={styles.mapControls}>
              <TouchableOpacity style={styles.zoomButton} activeOpacity={0.7}>
                <Text style={styles.zoomButtonText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.zoomButton} activeOpacity={0.7}>
                <Text style={styles.zoomButtonText}>—</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        {/* Address Input Fields */}
        <Card style={styles.card}>
          <View style={styles.formGroup}>
            <Text variant="h6" fontWeight="bold" style={styles.label}>
              STREET ADDRESS
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter street address"
              placeholderTextColor={theme.colors.text.tertiary}
              value={streetAddress}
              onChangeText={setStreetAddress}
            />
          </View>

          <View style={styles.formGroup}>
            <Text variant="h6" fontWeight="bold" style={styles.label}>
              CITY
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter city"
              placeholderTextColor={theme.colors.text.tertiary}
              value={city}
              onChangeText={setCity}
            />
          </View>

          <View style={styles.formGroup}>
            <Text variant="h6" fontWeight="bold" style={styles.label}>
              STATE
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter state"
              placeholderTextColor={theme.colors.text.tertiary}
              value={state}
              onChangeText={setState}
            />
          </View>

          <View style={styles.formGroup}>
            <Text variant="h6" fontWeight="bold" style={styles.label}>
              ZIP CODE
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter zip code"
              placeholderTextColor={theme.colors.text.tertiary}
              value={zipCode}
              onChangeText={setZipCode}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text variant="h6" fontWeight="bold" style={styles.label}>
              COUNTRY
            </Text>
            <View style={styles.lockedInput}>
              <TextInput
                style={styles.lockedInputText}
                value={country}
                editable={false}
              />
              <Text style={styles.lockIcon}>🔒</Text>
            </View>
          </View>
        </Card>

        {/* Information Banner */}
        <View style={styles.infoBanner}>
          <View style={styles.infoIcon}>
            <Text style={styles.infoIconText}>i</Text>
          </View>
          <Text variant="bodyMedium" style={styles.infoText}>
            Confirming this location will allow suppliers within a{' '}
            <Text variant="bodyMedium" fontWeight="bold">
              50 mile radius
            </Text>{' '}
            to find you easily.
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.8}
        >
          <Text variant="buttonMedium" style={styles.backButtonText}>
            Back
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmLocation}
          activeOpacity={0.8}
        >
          <Text variant="buttonMedium" style={styles.confirmButtonText}>
            Confirm Location
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

export default FactoryLocationScreen;

