import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { FloatingBottomContainer } from '@shared/components/FloatingBottomContainer';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { SelectThicknessScreenNavigationProp, ThicknessUnit } from './@types';
import { createStyles } from './styles';
import { SCREENS } from '@navigation/constants';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGetMaterialThicknessTypes, MaterialThicknessType } from '@services/api';

const SelectThicknessScreen = () => {
  const navigation = useNavigation<SelectThicknessScreenNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'SelectThickness'>>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();

  // Get params from route
  const { onThicknessSelected, materialId, materialKey, onSpecsSelected, onBrandDetailsSelected } = route.params || {};

  // Fetch available thickness units for this material
  const { data: thicknessTypes = [] } = useGetMaterialThicknessTypes({
    material_id: materialId,
  });

  // Available units list from API (fallback to a default set)
  const availableUnits: ThicknessUnit[] = useMemo(() => {
    if (thicknessTypes && (thicknessTypes as MaterialThicknessType[]).length > 0) {
      return (thicknessTypes as MaterialThicknessType[]).map(
        (t: MaterialThicknessType) => t.unit as ThicknessUnit
      );
    }
    // Fallback units if API returns nothing
    return ['GSM', 'MM', 'MICRON'];
  }, [thicknessTypes]);

  const primaryUnitFromApi: ThicknessUnit | undefined = useMemo(() => {
    const typed = thicknessTypes as MaterialThicknessType[];
    if (!typed || typed.length === 0) return undefined;
    // Prefer GSM if available, otherwise first unit
    const gsm = typed.find(t => t.unit === 'GSM');
    return (gsm?.unit ?? typed[0].unit) as ThicknessUnit;
  }, [thicknessTypes]);

  const [unit, setUnit] = useState<ThicknessUnit>(primaryUnitFromApi || 'GSM');
  const [minValue, setMinValue] = useState<number | string>(150);
  const [maxValue, setMaxValue] = useState<number | string>(300);
  const [selectedRanges, setSelectedRanges] = useState<Array<{ unit: ThicknessUnit; min: number; max: number; id: string }>>([]);

  useEffect(() => {
    if (primaryUnitFromApi) {
      setUnit(primaryUnitFromApi);
    }
  }, [primaryUnitFromApi]);

  const handleMinValueChange = (value: string) => {
    // Allow empty string for clearing
    if (value === '') {
      setMinValue('');
      return;
    }
    
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      // Allow any positive number, validation happens on add
      setMinValue(numValue);
    }
  };

  const handleMaxValueChange = (value: string) => {
    // Allow empty string for clearing
    if (value === '') {
      setMaxValue('');
      return;
    }
    
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      // Allow any positive number, validation happens on add
      setMaxValue(numValue);
    }
  };

  const handleAddThickness = () => {
    // Validate values
    const minNum = typeof minValue === 'number' ? minValue : parseInt(String(minValue), 10);
    const maxNum = typeof maxValue === 'number' ? maxValue : parseInt(String(maxValue), 10);

    if (isNaN(minNum) || isNaN(maxNum)) {
      return; // Don't add if values are invalid
    }

    if (minNum <= 0 || maxNum <= 0) {
      return; // Don't add if values are not positive
    }

    if (minNum >= maxNum) {
      return; // Don't add if min is greater than or equal to max
    }

    // Check if this range already exists
    const isDuplicate = selectedRanges.some(
      range => range.unit === unit && range.min === minNum && range.max === maxNum
    );

    if (isDuplicate) {
      return; // Don't add duplicates
    }

    const newRange = {
      unit,
      min: minNum,
      max: maxNum,
      id: `${unit}-${minNum}-${maxNum}-${Date.now()}`,
    };

    setSelectedRanges(prev => [...prev, newRange]);
    
    // Reset to default values for next entry
    setMinValue(150);
    setMaxValue(300);
  };

  const handleRemoveRange = (id: string) => {
    setSelectedRanges(prev => prev.filter(range => range.id !== id));
  };

  const handleContinue = () => {
    // Validation: Must have at least one thickness range
    if (selectedRanges.length === 0) {
      return; // Don't proceed if no ranges are selected
    }

    proceedWithThickness();
  };

  const proceedWithThickness = () => {
    const thicknessRanges = selectedRanges.map(({ id, ...range }) => range);

    if (onThicknessSelected) {
      // If onSpecsSelected is provided, navigate to MaterialSpecsScreen after applying thickness
      if (onSpecsSelected) {
        // First, call the thickness callback to store thickness ranges
        onThicknessSelected(thicknessRanges);
        
        // Then navigate to MaterialSpecsScreen for finish selection
        navigation.navigate(SCREENS.AUTH.MATERIAL_SPECS, {
          onSpecsSelected,
          onBrandDetailsSelected,
          materialKey,
        });
        return;
      }
      
      // Called from Materials screen via callback (without specs selection)
      onThicknessSelected(thicknessRanges);
      navigation.goBack();
      return;
    }
    navigation.goBack();
  };

  // Calculate bottom padding for scrollable content
  const buttonHeight = 60;
  const bottomPadding = buttonHeight + theme.spacing[4] * 2 + insets.bottom;

  return (
    <>
      <ScreenWrapper
        scrollable
        backgroundColor={theme.colors.background.secondary}
        safeAreaEdges={[]}
        contentContainerStyle={{
          ...styles.scrollContent,
          paddingBottom: bottomPadding,
        }}
      >
        <View style={styles.container}>
          {/* Unit Segmented Control */}
          <View style={styles.segmentedControl}>
          {availableUnits.map(option => {
            const isSelected = unit === option;
            return (
              <TouchableOpacity
                key={option}
                style={[styles.segmentedOption, isSelected && styles.segmentedOptionSelected]}
                onPress={() => setUnit(option)}
                activeOpacity={0.7}
              >
                <Text
                  variant="bodyMedium"
                  fontWeight={isSelected ? 'semibold' : 'regular'}
                  style={[
                    styles.segmentedOptionText,
                    isSelected && styles.segmentedOptionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
          </View>

          {/* Selected Ranges List */}
          {selectedRanges.length > 0 && (
            <View style={styles.selectedRangesContainer}>
              <Text variant="bodyMedium" fontWeight="semibold" style={styles.selectedRangesTitle}>
                Added Thickness Ranges ({selectedRanges.length})
              </Text>
              {selectedRanges.map((range) => (
                <Card key={range.id} style={styles.rangeChip}>
                  <View style={styles.rangeChipContent}>
                    <View style={styles.rangeChipInfo}>
                      <Text variant="bodyMedium" fontWeight="semibold" style={styles.rangeChipValue}>
                        {range.min} - {range.max}
                      </Text>
                      <Text variant="bodySmall" style={styles.rangeChipUnit}>
                        {range.unit}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleRemoveRange(range.id)}
                      style={styles.removeButton}
                      activeOpacity={0.7}
                    >
                      <AppIcon.Delete
                        width={18}
                        height={18}
                        color={theme.colors.error.DEFAULT}
                      />
                    </TouchableOpacity>
                  </View>
                </Card>
              ))}
            </View>
          )}

          {/* Current Range Card */}
          <Card style={styles.selectedRangeCard}>
            <Text variant="captionMedium" fontWeight="semibold" style={styles.selectedRangeLabel}>
              CURRENT RANGE
            </Text>
            <Text variant="h2" fontWeight="bold" style={styles.selectedRangeValue}>
              {minValue || '--'} - {maxValue || '--'}{' '}
              <Text style={styles.selectedRangeUnit}>{unit}</Text>
            </Text>
          </Card>

          {/* Min/Max Input Fields */}
          <View style={styles.inputsRow}>
          <View style={styles.inputContainer}>
            <Text variant="captionMedium" fontWeight="semibold" style={styles.inputLabel}>
              MIN THICKNESS
            </Text>
            <View style={styles.inputField}>
              <TextInput
                value={minValue.toString()}
                onChangeText={handleMinValueChange}
                keyboardType="numeric"
                placeholder="Enter min value"
                placeholderTextColor={theme.colors.text.tertiary}
                style={styles.inputValue}
              />
              <Text variant="bodySmall" style={styles.inputUnit}>
                {unit}
              </Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text variant="captionMedium" fontWeight="semibold" style={styles.inputLabel}>
              MAX THICKNESS
            </Text>
            <View style={styles.inputField}>
              <TextInput
                value={maxValue.toString()}
                onChangeText={handleMaxValueChange}
                keyboardType="numeric"
                placeholder="Enter max value"
                placeholderTextColor={theme.colors.text.tertiary}
                style={styles.inputValue}
              />
              <Text variant="bodySmall" style={styles.inputUnit}>
                {unit}
              </Text>
            </View>
          </View>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
          <View style={styles.infoIcon}>
            <Text style={styles.infoIconText}>i</Text>
          </View>
            <Text variant="captionSmall" style={styles.infoText}>
              Standard industry tolerance is +/- 5%. Switching units will automatically convert your
              values.
            </Text>
          </View>
        </View>
      </ScreenWrapper>

      {/* Floating Bottom Buttons */}
      <FloatingBottomContainer>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddThickness}
            activeOpacity={0.8}
          >
            <Text variant="buttonMedium" style={styles.addButtonText}>
              Add Thickness
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.continueButton, selectedRanges.length === 0 && styles.continueButtonDisabled]}
            onPress={handleContinue}
            activeOpacity={0.8}
            disabled={selectedRanges.length === 0}
          >
            <Text variant="buttonMedium" style={styles.continueButtonText}>
              Continue
            </Text>
            <AppIcon.ArrowRight width={20} height={20} color={theme.colors.text.inverse} />
          </TouchableOpacity>
        </View>
      </FloatingBottomContainer>
    </>
  );
};

export default SelectThicknessScreen;
