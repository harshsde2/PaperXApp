import React, { useState, useCallback, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTAINER_PADDING = 16;
const SLIDER_PADDING = 16;
const SLIDER_WIDTH = SCREEN_WIDTH - CONTAINER_PADDING * 2 - SLIDER_PADDING * 2;
const MIN_VALUE = 100;
const MAX_VALUE = 500;
const STEP = 1;

const SelectThicknessScreen = () => {
  const navigation = useNavigation<SelectThicknessScreenNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'SelectThickness'>>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();

  // Get profileData from route params
  const { profileData } = route.params || {};

  const [unit, setUnit] = useState<ThicknessUnit>('GSM');
  const [minValue, setMinValue] = useState(150);
  const [maxValue, setMaxValue] = useState(300);

  // Animated values for slider handles (in pixels, 0 to SLIDER_WIDTH)
  const minPosition = useSharedValue(0);
  const maxPosition = useSharedValue(0);
  const minContext = useSharedValue(0);
  const maxContext = useSharedValue(0);
  const isMinDragging = useSharedValue(false);
  const isMaxDragging = useSharedValue(false);

  // Convert value to position (0 to SLIDER_WIDTH)
  const valueToPosition = useCallback((value: number) => {
    'worklet';
    return ((value - MIN_VALUE) / (MAX_VALUE - MIN_VALUE)) * SLIDER_WIDTH;
  }, []);

  // Convert position to value
  const positionToValue = useCallback((position: number) => {
    'worklet';
    const ratio = Math.max(0, Math.min(1, position / SLIDER_WIDTH));
    return Math.round(MIN_VALUE + ratio * (MAX_VALUE - MIN_VALUE));
  }, []);

  // Initialize positions
  useEffect(() => {
    minPosition.value = valueToPosition(minValue);
    maxPosition.value = valueToPosition(maxValue);
  }, []);

  // Update min value from position
  const updateMinValue = useCallback(
    (value: number) => {
      const clampedValue = Math.max(MIN_VALUE, Math.min(value, maxValue - STEP));
      setMinValue(clampedValue);
    },
    [maxValue]
  );

  // Update max value from position
  const updateMaxValue = useCallback(
    (value: number) => {
      const clampedValue = Math.max(minValue + STEP, Math.min(value, MAX_VALUE));
      setMaxValue(clampedValue);
    },
    [minValue]
  );

  // Min handle gesture
  const minGesture = Gesture.Pan()
    .onStart(() => {
      'worklet';
      minContext.value = minPosition.value;
      isMinDragging.value = true;
    })
    .onUpdate(event => {
      'worklet';
      const newPosition = Math.max(0, Math.min(minContext.value + event.translationX, maxPosition.value - 20));
      minPosition.value = newPosition;
      const newValue = positionToValue(newPosition);
      runOnJS(updateMinValue)(newValue);
    })
    .onEnd(() => {
      'worklet';
      isMinDragging.value = false;
      const finalValue = positionToValue(minPosition.value);
      minPosition.value = withSpring(valueToPosition(finalValue), {
        damping: 15,
        stiffness: 150,
      });
    });

  // Max handle gesture
  const maxGesture = Gesture.Pan()
    .onStart(() => {
      'worklet';
      maxContext.value = maxPosition.value;
      isMaxDragging.value = true;
    })
    .onUpdate(event => {
      'worklet';
      const newPosition = Math.max(minPosition.value + 20, Math.min(maxContext.value + event.translationX, SLIDER_WIDTH));
      maxPosition.value = newPosition;
      const newValue = positionToValue(newPosition);
      runOnJS(updateMaxValue)(newValue);
    })
    .onEnd(() => {
      'worklet';
      isMaxDragging.value = false;
      const finalValue = positionToValue(maxPosition.value);
      maxPosition.value = withSpring(valueToPosition(finalValue), {
        damping: 15,
        stiffness: 150,
      });
    });

  // Animated styles
  const minHandleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: minPosition.value - 12 }],
      scale: withSpring(isMinDragging.value ? 1.15 : 1, {
        damping: 15,
        stiffness: 300,
      }),
    };
  });

  const maxHandleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: maxPosition.value - 12 }],
      scale: withSpring(isMaxDragging.value ? 1.15 : 1, {
        damping: 15,
        stiffness: 300,
      }),
    };
  });

  const activeTrackStyle = useAnimatedStyle(() => {
    const left = minPosition.value;
    const width = Math.max(0, maxPosition.value - minPosition.value);
    return {
      left,
      width,
    };
  });

  const minLabelStyle = useAnimatedStyle(() => {
    // Label is already positioned relative to the handle container (which moves)
    // Only animate opacity when dragging
    return {
      opacity: withSpring(isMinDragging.value ? 1 : 0.8, {
        damping: 15,
        stiffness: 300,
      }),
      transform: [
        { scale: withSpring(isMinDragging.value ? 1.1 : 1, { damping: 15, stiffness: 300 }) },
      ],
    };
  });

  const maxLabelStyle = useAnimatedStyle(() => {
    // Label is already positioned relative to the handle container (which moves)
    // Only animate opacity when dragging
    return {
      opacity: withSpring(isMaxDragging.value ? 1 : 0.8, {
        damping: 15,
        stiffness: 300,
      }),
      transform: [
        { scale: withSpring(isMaxDragging.value ? 1.1 : 1, { damping: 15, stiffness: 300 }) },
      ],
    };
  });

  const handleMinValueChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= MIN_VALUE && numValue <= maxValue) {
      setMinValue(numValue);
      minPosition.value = withSpring(valueToPosition(numValue), {
        damping: 15,
        stiffness: 150,
      });
    }
  };

  const handleMaxValueChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= minValue && numValue <= MAX_VALUE) {
      setMaxValue(numValue);
      maxPosition.value = withSpring(valueToPosition(numValue), {
        damping: 15,
        stiffness: 150,
      });
    }
  };

  const handleApply = () => {
    const thicknessData = {
      unit: unit,
      min: minValue,
      max: maxValue,
    };

    navigation.navigate(SCREENS.AUTH.MANAGE_WAREHOUSES, {
      profileData: {
        ...profileData,
        thickness: thicknessData,
      },
    });
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
      contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
    >
      <View style={styles.container}>
        {/* Unit Segmented Control */}
        <View style={styles.segmentedControl}>
          {(['GSM', 'MM', 'MICRON'] as ThicknessUnit[]).map(option => {
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

        {/* Selected Range Card */}
        <Card style={styles.selectedRangeCard}>
          <Text variant="captionMedium" fontWeight="semibold" style={styles.selectedRangeLabel}>
            SELECTED RANGE
          </Text>
          <Text variant="h2" fontWeight="bold" style={styles.selectedRangeValue}>
            {minValue} - {maxValue}{' '}
            <Text style={styles.selectedRangeUnit}>{unit}</Text>
          </Text>
        </Card>

        {/* Range Slider */}
        <View style={styles.sliderContainer}>
          <View style={styles.sliderLabels}>
            <Text variant="captionSmall" style={styles.sliderLabel}>
              {MIN_VALUE}
            </Text>
            <Text variant="captionSmall" style={styles.sliderLabel}>
              {MAX_VALUE}
            </Text>
          </View>

          <View style={styles.sliderTrackContainer}>
            <View style={styles.sliderTrack}>
              <Animated.View style={[styles.sliderActiveTrack, activeTrackStyle]} />
            </View>

            {/* Min Handle */}
            <GestureDetector gesture={minGesture}>
              <Animated.View style={[styles.sliderHandleContainer, minHandleStyle]}>
                <Animated.View style={[styles.sliderHandleLabel, minLabelStyle]}>
                  <Text variant="captionSmall" fontWeight="semibold" style={styles.sliderHandleLabelText}>
                    {minValue}
                  </Text>
                </Animated.View>
                <View style={styles.sliderHandle} />
              </Animated.View>
            </GestureDetector>

            {/* Max Handle */}
            <GestureDetector gesture={maxGesture}>
              <Animated.View style={[styles.sliderHandleContainer, maxHandleStyle]}>
                <Animated.View style={[styles.sliderHandleLabel, maxLabelStyle]}>
                  <Text variant="captionSmall" fontWeight="semibold" style={styles.sliderHandleLabelText}>
                    {maxValue}
                  </Text>
                </Animated.View>
                <View style={styles.sliderHandle} />
              </Animated.View>
            </GestureDetector>
          </View>

          <Text variant="captionSmall" style={styles.sliderHint}>
            Drag handles to adjust range
          </Text>
        </View>

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

      {/* Floating Bottom Button */}
      <FloatingBottomContainer>
        <TouchableOpacity style={styles.button} onPress={handleApply} activeOpacity={0.8}>
          <Text variant="buttonMedium" style={styles.buttonText}>
            Apply Thickness
          </Text>
          <AppIcon.ArrowRight width={20} height={20} color={theme.colors.text.inverse} />
        </TouchableOpacity>
      </FloatingBottomContainer>
    </>
  );
};

export default SelectThicknessScreen;
