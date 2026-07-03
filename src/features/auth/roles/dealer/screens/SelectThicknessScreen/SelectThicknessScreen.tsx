import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { CustomButton } from '@shared/components/CustomButton';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { FloatingBottomContainer } from '@shared/components/FloatingBottomContainer';
import { DropdownButton } from '@shared/components/DropdownButton';
import { KeyboardDoneBar } from '@shared/components/KeyboardDoneBar';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { useKeyboard } from '@shared/hooks';
import { SelectThicknessScreenNavigationProp, ThicknessUnit } from './@types';
import { createStyles } from './styles';
import { SCREENS } from '@navigation/constants';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGetMaterialThicknessTypes, MaterialThicknessType } from '@services/api';

const ALL_THICKNESS_UNITS: ThicknessUnit[] = ['GSM', 'MM', 'OUNCE', 'BF', 'MICRON'];

const SelectThicknessScreen = () => {
  const navigation = useNavigation<SelectThicknessScreenNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'SelectThickness'>>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const { isKeyboardVisible } = useKeyboard();
  const [isUnitModalVisible, setIsUnitModalVisible] = useState(false);

  // Get params from route
  const { onThicknessSelected, materialId, materialKey, onSpecsSelected, onBrandDetailsSelected } = route.params || {};

  // All thickness units - show for every material regardless of API
  const availableUnits = ALL_THICKNESS_UNITS;

  // Fetch thickness types for this material (used for smart default unit only)
  const { data: thicknessTypes = [] } = useGetMaterialThicknessTypes({
    material_id: materialId,
  });

  const primaryUnitFromApi: ThicknessUnit | undefined = useMemo(() => {
    const typed = thicknessTypes as MaterialThicknessType[];
    if (!typed?.length) return undefined;
    const gsm = typed.find(t => t.unit === 'GSM');
    const preferred = (gsm?.unit ?? typed[0]?.unit) as string;
    // Only use if it's in our allowed list
    return ALL_THICKNESS_UNITS.includes(preferred as ThicknessUnit)
      ? (preferred as ThicknessUnit)
      : undefined;
  }, [thicknessTypes]);

  const [unit, setUnit] = useState<ThicknessUnit>(primaryUnitFromApi || 'GSM');
  const [minValue, setMinValue] = useState<number | string>(150);
  const [maxValue, setMaxValue] = useState<number | string>(300);

  useEffect(() => {
    if (primaryUnitFromApi) {
      setUnit(primaryUnitFromApi);
    }
  }, [primaryUnitFromApi]);

  const handleUnitSelect = useCallback((selectedUnit: ThicknessUnit) => {
    setUnit(selectedUnit);
    setIsUnitModalVisible(false);
  }, []);

  const openUnitSelector = useCallback(() => {
    setIsUnitModalVisible(true);
  }, []);

  const handleMinValueChange = (value: string) => {
    if (value === '') {
      setMinValue('');
      return;
    }
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      setMinValue(numValue);
    }
  };

  const handleMaxValueChange = (value: string) => {
    if (value === '') {
      setMaxValue('');
      return;
    }
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      setMaxValue(numValue);
    }
  };

  // Single thickness range validity
  const minNum = typeof minValue === 'number' ? minValue : parseInt(String(minValue), 10);
  const maxNum = typeof maxValue === 'number' ? maxValue : parseInt(String(maxValue), 10);
  const isValid =
    !isNaN(minNum) &&
    !isNaN(maxNum) &&
    minNum > 0 &&
    maxNum > 0 &&
    minNum < maxNum;

  const handleContinue = () => {
    if (!isValid) {
      return;
    }
    proceedWithThickness();
  };

  const proceedWithThickness = () => {
    // Downstream expects an array of ranges; we now capture exactly one.
    const thicknessRanges = [{ unit, min: minNum, max: maxNum }];

    if (onThicknessSelected) {
      // If onSpecsSelected is provided, navigate to MaterialSpecsScreen after applying thickness
      if (onSpecsSelected) {
        onThicknessSelected(thicknessRanges);
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
        scrollViewProps={{ keyboardShouldPersistTaps: 'handled' }}
      >
        <View style={styles.container}>
          {/* Unit Dropdown */}
          <View style={styles.unitDropdownContainer}>
            <Text variant="bodyMedium" fontWeight="medium" style={styles.unitDropdownLabel}>
              Select Unit
            </Text>
            <DropdownButton
              value={unit}
              placeholder="Select Unit"
              onPress={openUnitSelector}
            />
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
                  placeholder="Enter min value"
                  placeholderTextColor={theme.colors.text.tertiary}
                  style={styles.inputValue}
                  autoCorrect={false}
                  autoComplete="off"
                  textContentType="none"
                  importantForAutofill="no"
                  spellCheck={false}
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
                  autoCorrect={false}
                  autoComplete="off"
                  textContentType="none"
                  importantForAutofill="no"
                  spellCheck={false}
                />
                <Text variant="bodySmall" style={styles.inputUnit}>
                  {unit}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScreenWrapper>

      {/* Keyboard "Done" bar — numeric keypad has no return/Done key */}
      <KeyboardDoneBar />

      {/* Floating Continue Button (hidden while typing) */}
      {!isKeyboardVisible && (
        <FloatingBottomContainer>
          <CustomButton
            title="Continue"
            onPress={handleContinue}
            variant="gradient"
            size="md"
            disabled={!isValid}
            gradientColors={[
              theme.colors.primary[400],
              theme.colors.primary[600],
              theme.colors.primary.DEFAULT,
            ]}
            gradientStart={{ x: 0, y: 0 }}
            gradientEnd={{ x: 1, y: 1 }}
            rightIcon={<AppIcon.ArrowRight width={20} height={20} color={theme.colors.text.inverse} />}
          />
        </FloatingBottomContainer>
      )}

      {/* Unit Selection Modal */}
      <Modal
        visible={isUnitModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsUnitModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsUnitModalVisible(false)}
        >
          <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text variant="h4" fontWeight="semibold" style={styles.modalTitle}>
                Select Unit
              </Text>
              <TouchableOpacity
                onPress={() => setIsUnitModalVisible(false)}
                style={styles.modalCloseButton}
                activeOpacity={0.7}
              >
                <AppIcon.Close width={24} height={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>
            {availableUnits.map((unitOption) => {
              const isSelected = unit === unitOption;
              return (
                <TouchableOpacity
                  key={unitOption}
                  style={[
                    styles.unitOption,
                    isSelected && styles.unitOptionSelected,
                  ]}
                  onPress={() => handleUnitSelect(unitOption)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.radioButton,
                      isSelected && styles.radioButtonSelected,
                    ]}
                  >
                    {isSelected && <View style={styles.radioButtonInner} />}
                  </View>
                  <Text
                    variant="bodyMedium"
                    fontWeight={isSelected ? 'semibold' : 'regular'}
                    style={isSelected ? styles.unitOptionTextSelected : styles.unitOptionText}
                  >
                    {unitOption}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

export default SelectThicknessScreen;
