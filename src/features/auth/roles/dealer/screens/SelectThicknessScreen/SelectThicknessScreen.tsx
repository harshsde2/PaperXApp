import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, PanResponder, Dimensions } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { SelectThicknessScreenNavigationProp, ThicknessUnit } from './@types';
import { createStyles } from './styles';
import { SCREENS } from '@navigation/constants';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDER_PADDING = 16;
const SLIDER_WIDTH = SCREEN_WIDTH - (SLIDER_PADDING * 2) - (16 * 2);
const MIN_VALUE = 100;
const MAX_VALUE = 500;
const STEP = 1;

const SelectThicknessScreen = () => {
  const navigation = useNavigation<SelectThicknessScreenNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'SelectThickness'>>();
  const theme = useTheme();
  const styles = createStyles(theme);
  
  // Get profileData from route params
  const { profileData } = route.params || {};
  
  const [unit, setUnit] = useState<ThicknessUnit>('GSM');
  const [minValue, setMinValue] = useState(150);
  const [maxValue, setMaxValue] = useState(300);

  const handleApply = () => {
    // TODO: Save thickness values to API/state
    // Navigate to next screen in dealer registration flow
    navigation.navigate(SCREENS.AUTH.MANAGE_WAREHOUSES, { profileData });
  };

  const handleMinValueChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= MIN_VALUE && numValue <= maxValue) {
      setMinValue(numValue);
    }
  };

  const handleMaxValueChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= minValue && numValue <= MAX_VALUE) {
      setMaxValue(numValue);
    }
  };

  const valueToPosition = (value: number) => {
    return ((value - MIN_VALUE) / (MAX_VALUE - MIN_VALUE)) * SLIDER_WIDTH;
  };

  const positionToValue = (position: number) => {
    const ratio = Math.max(0, Math.min(1, position / SLIDER_WIDTH));
    return Math.round(MIN_VALUE + ratio * (MAX_VALUE - MIN_VALUE));
  };

  const minPosition = valueToPosition(minValue);
  const maxPosition = valueToPosition(maxValue);
  const activeTrackWidth = maxPosition - minPosition;

  return (
    <ScreenWrapper
      scrollable
      backgroundColor={theme.colors.background.secondary}
      safeAreaEdges={[]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        <View style={styles.segmentedControl}>
          {(['GSM', 'MM', 'MICRON'] as ThicknessUnit[]).map((option) => {
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

        <Card style={styles.selectedRangeCard}>
          <Text variant="captionMedium" fontWeight="semibold" style={styles.selectedRangeLabel}>
            SELECTED RANGE
          </Text>
          <Text variant="h2" fontWeight="bold" style={styles.selectedRangeValue}>
            {minValue} - {maxValue}{' '}
            <Text style={styles.selectedRangeUnit}>{unit}</Text>
          </Text>
        </Card>

        <View style={styles.sliderContainer}>
          <View style={styles.sliderLabels}>
            <Text variant="captionSmall" style={styles.sliderLabel}>
              {MIN_VALUE}
            </Text>
            <Text variant="captionSmall" style={styles.sliderLabel}>
              {MAX_VALUE}
            </Text>
          </View>
          <View style={styles.sliderTrack}>
            <View
              style={[
                styles.sliderActiveTrack,
                {
                  left: minPosition,
                  width: activeTrackWidth,
                },
              ]}
            />
            <View style={styles.sliderHandlesContainer}>
              <View
                style={[
                  styles.sliderHandle,
                  {
                    left: minPosition - 12,
                  },
                ]}
              >
                <View style={styles.sliderHandleLabel}>
                  <Text variant="captionSmall" fontWeight="semibold" style={styles.sliderHandleLabelText}>
                    {minValue}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.sliderHandle,
                  {
                    left: maxPosition - 12,
                  },
                ]}
              >
                <View style={styles.sliderHandleLabel}>
                  <Text variant="captionSmall" fontWeight="semibold" style={styles.sliderHandleLabelText}>
                    {maxValue}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <Text variant="captionSmall" style={styles.sliderHint}>
            Drag handles to adjust range
          </Text>
        </View>

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
                style={styles.inputValue}
              />
              <Text variant="bodySmall" style={styles.inputUnit}>
                {unit}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoBox}>
          <View style={styles.infoIcon}>
            <Text style={styles.infoIconText}>i</Text>
          </View>
          <Text variant="captionSmall" style={styles.infoText}>
            Standard industry tolerance is +/- 5%. Switching units will automatically convert your values.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleApply}
          activeOpacity={0.8}
        >
          <Text variant="buttonMedium" style={styles.buttonText}>
            Apply Thickness
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

export default SelectThicknessScreen;
