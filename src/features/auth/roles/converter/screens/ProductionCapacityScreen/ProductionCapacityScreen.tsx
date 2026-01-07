import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { ProductionCapacityScreenNavigationProp } from './@types';
import { createStyles } from './styles';
import { SCREENS } from '@navigation/constants';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';

const UNIT_OPTIONS = [
  'Sheets',
  'Pieces',
  'Tonnes',
  'Kilograms',
  'Square Meters',
  'Linear Meters',
];

const FREQUENCY_OPTIONS = [
  'Daily',
  'Weekly',
  'Monthly',
  'Yearly',
];

const ProductionCapacityScreen = () => {
  const navigation = useNavigation<ProductionCapacityScreenNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'ProductionCapacity'>>();
  const theme = useTheme();
  const styles = createStyles(theme);
  
  // Get profileData from route params
  const { profileData } = route.params || {};
  
  const [capacityVolume, setCapacityVolume] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [selectedFrequency, setSelectedFrequency] = useState<string | null>(null);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [showFrequencyDropdown, setShowFrequencyDropdown] = useState(false);

  const currentStep = 5;
  const totalSteps = 7;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleContinue = () => {
    // TODO: Save selections to API/state
    // Navigate to next screen in converter registration flow
    navigation.navigate(SCREENS.AUTH.RAW_MATERIALS, { profileData });
  };

  const handleUnitSelect = (unit: string) => {
    setSelectedUnit(unit);
    setShowUnitDropdown(false);
  };

  const handleFrequencySelect = (frequency: string) => {
    setSelectedFrequency(frequency);
    setShowFrequencyDropdown(false);
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
          Production Capacity
        </Text>
        <Text variant="bodyMedium" style={styles.description}>
          Define your total output capabilities. This data helps us match you with buyers looking for your scale.
        </Text>

        <Card style={styles.inputCard}>
          <View style={styles.formGroup}>
            <Text variant="h6" fontWeight="bold" style={styles.label}>
              Capacity Volume
            </Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor={theme.colors.text.tertiary}
              value={capacityVolume}
              onChangeText={setCapacityVolume}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text variant="h6" fontWeight="bold" style={styles.label}>
                Unit
              </Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowUnitDropdown(!showUnitDropdown)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dropdownText,
                    !selectedUnit && styles.dropdownPlaceholder,
                  ]}
                >
                  {selectedUnit || 'Select...'}
                </Text>
                <AppIcon.ChevronDown
                  width={20}
                  height={20}
                  color={theme.colors.text.tertiary}
                />
              </TouchableOpacity>
              {showUnitDropdown && (
                <View style={styles.dropdownOptions}>
                  {UNIT_OPTIONS.map(unit => (
                    <TouchableOpacity
                      key={unit}
                      style={styles.dropdownOption}
                      onPress={() => handleUnitSelect(unit)}
                      activeOpacity={0.7}
                    >
                      <Text variant="bodyMedium" style={styles.dropdownOptionText}>
                        {unit}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text variant="h6" fontWeight="bold" style={styles.label}>
                Frequency
              </Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowFrequencyDropdown(!showFrequencyDropdown)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dropdownText,
                    !selectedFrequency && styles.dropdownPlaceholder,
                  ]}
                >
                  {selectedFrequency || 'Select...'}
                </Text>
                <AppIcon.ChevronDown
                  width={20}
                  height={20}
                  color={theme.colors.text.tertiary}
                />
              </TouchableOpacity>
              {showFrequencyDropdown && (
                <View style={styles.dropdownOptions}>
                  {FREQUENCY_OPTIONS.map(frequency => (
                    <TouchableOpacity
                      key={frequency}
                      style={styles.dropdownOption}
                      onPress={() => handleFrequencySelect(frequency)}
                      activeOpacity={0.7}
                    >
                      <Text variant="bodyMedium" style={styles.dropdownOptionText}>
                        {frequency}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          <View style={styles.exampleBox}>
            <View style={styles.exampleIcon}>
              <Text style={styles.exampleIconText}>i</Text>
            </View>
            <Text variant="bodyMedium" style={styles.exampleText}>
              A typical offset printer might enter{' '}
              <Text variant="bodyMedium" fontWeight="bold">
                50,000 Sheets Daily.
              </Text>
            </Text>
          </View>
        </Card>
      </View>

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
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text variant="buttonMedium" style={styles.continueButtonText}>
            Continue
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

export default ProductionCapacityScreen;

